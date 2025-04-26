import { ollamaConfig } from './config';

interface OllamaResponse {
  model: string;
  created_at: string;
  response?: string;    // Для нового API
  message?: {           // Для старого API
    role: string;
    content: string;
  };
  done: boolean;
}

interface TranslationResult {
  translation: string;
  contextMeaning: string;
  englishExplanation: string;
  englishExample: string;
}

/**
 * Вызывает Ollama API для перевода слова и получения контекстного объяснения
 */
export async function getTranslationFromOllama(
  word: string,
  context: string
): Promise<TranslationResult> {
  // Если Ollama отключена в конфигурации, выбрасываем ошибку
  if (!ollamaConfig.enabled) {
    throw new Error('Ollama is disabled in configuration');
  }
  
  try {
    const promptTemplate = `
Переведи английское слово "${word}" на русский язык. Слово встречается в следующем контексте:
"${context}"

Дай ответ в следующем формате JSON:
{
  "translation": "краткий перевод слова на русский (1-3 слова)",
  "contextMeaning": "объяснение значения слова в данном контексте на русском, 1-2 предложения",
  "englishExplanation": "подробное лингвистическое объяснение слова на английском (не перевод с русского). Включи информацию о происхождении слова, синонимы, антонимы, различия в оттенках значения, особенности употребления, части речи и т.д. 2-3 предложения.",
  "englishExample": "пример использования слова в предложении из книги, фильма или другого реального контекста. Укажи источник в скобках, если известен."
}

Важно: для поля englishExplanation не делай простой перевод с русского. Это должен быть совершенно иной текст с лингвистическим анализом слова, его особенностями и нюансами. 

Для поля englishExample постарайся привести интересный и показательный пример из известных книг, фильмов, речей знаменитостей, статей или других источников. Если не можешь вспомнить реальный пример, создай правдоподобный в стиле известного автора или жанра.
`;

    console.log('Отправка запроса в Ollama...');
    
    const response = await fetch(ollamaConfig.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: ollamaConfig.model,
        prompt: promptTemplate,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to connect to Ollama: ${response.statusText}`);
    }

    const data = await response.json() as OllamaResponse;
    console.log('Получен ответ от Ollama:', data);
    
    // Получаем содержимое из ответа (поддержка разных форматов API)
    const content = data.response || (data.message ? data.message.content : '');
    
    if (!content) {
      throw new Error('Empty response from Ollama');
    }
    
    // Извлекаем JSON из ответа
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format from Ollama: ' + content);
    }
    
    try {
      const result = JSON.parse(jsonMatch[0]) as TranslationResult;
      
      // Если поле englishExample отсутствует, добавим его с пустым значением
      if (!result.englishExample) {
        result.englishExample = "No example available.";
      }
      
      return result;
    } catch (parseError) {
      console.error('JSON parse error:', parseError, 'Raw content:', content);
      throw new Error('Failed to parse JSON from Ollama response');
    }
  } catch (error: any) { // Используем any для обработки ошибок различных типов
    console.error('Error calling Ollama:', error);
    return {
      translation: `Перевод для "${word}"`,
      contextMeaning: `Невозможно получить перевод. Проверьте, запущен ли Ollama. Ошибка: ${error.message || 'Неизвестная ошибка'}`,
      englishExplanation: `Unable to get translation. Please check if Ollama is running. Error: ${error.message || 'Unknown error'}`,
      englishExample: "No example available."
    };
  }
} 