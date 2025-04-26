import { ollamaConfig } from './config';

interface OllamaResponse {
  model: string;
  created_at: string;
  message: {
    role: string;
    content: string;
  };
  done: boolean;
}

interface TranslationResult {
  translation: string;
  contextMeaning: string;
  englishExplanation: string;
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
  "translation": "перевод слова на русский",
  "contextMeaning": "объяснение значения слова в данном контексте на русском, 1-2 предложения",
  "englishExplanation": "объяснение значения слова на английском, 1-2 предложения"
}
`;

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
    
    // Извлекаем JSON из ответа
    const jsonMatch = data.message.content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format from Ollama');
    }
    
    const result = JSON.parse(jsonMatch[0]) as TranslationResult;
    return result;
  } catch (error) {
    console.error('Error calling Ollama:', error);
    return {
      translation: `Перевод для "${word}"`,
      contextMeaning: `Невозможно получить перевод. Проверьте, запущен ли Ollama.`,
      englishExplanation: `Unable to get translation. Please check if Ollama is running.`
    };
  }
} 