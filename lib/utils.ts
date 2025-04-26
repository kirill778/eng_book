import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { getTranslationFromOllama } from './ollama-service';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Функция перевода с использованием Ollama
export async function translateWord(word: string, context: string): Promise<{ 
  translation: string; 
  contextMeaning: string;
  englishExplanation: string; 
}> {
  try {
    // Пытаемся получить перевод через Ollama
    const ollamaResult = await getTranslationFromOllama(word, context);
    return ollamaResult;
  } catch (error) {
    console.error("Error with Ollama translation, falling back to mock data:", error);
    
    // Запасной вариант: используем моковые данные
    const mockTranslations: Record<string, { 
      translation: string; 
      contextMeaning: string;
      englishExplanation: string;
    }> = {
      "eloquent": {
        translation: "красноречивый",
        contextMeaning: "Выразительный, убедительный и впечатляющий в своём проявлении.",
        englishExplanation: "Fluent or persuasive in speaking or writing, especially in a way that is moving or effective."
      },
      "innovation": {
        translation: "инновация",
        contextMeaning: "Новая идея, метод или устройство, внедрение чего-то нового.",
        englishExplanation: "The action or process of innovating, introducing new ideas, methods, or products."
      },
      "remarkable": {
        translation: "замечательный",
        contextMeaning: "Заслуживающий внимания из-за необычности или исключительности.",
        englishExplanation: "Worthy of attention because unusual or exceptional, notably or conspicuously unusual."
      },
      "ubiquitous": {
        translation: "вездесущий",
        contextMeaning: "Присутствующий или встречающийся повсюду одновременно.",
        englishExplanation: "Present, appearing, or found everywhere; omnipresent."
      },
      "ambiguous": {
        translation: "двусмысленный",
        contextMeaning: "Открытый для нескольких интерпретаций; имеющий двойной смысл; неясный.",
        englishExplanation: "Open to more than one interpretation; having a double meaning; unclear or inexact."
      },
      "fundamental": {
        translation: "фундаментальный",
        contextMeaning: "Составляющий основу или ядро; имеющий центральное значение.",
        englishExplanation: "Forming a necessary base or core; of central importance."
      },
      "data": {
        translation: "данные",
        contextMeaning: "Факты и статистика, собранные для анализа или справки.",
        englishExplanation: "Facts and statistics collected together for reference or analysis."
      }
    };
  
    // Возвращаем моковый перевод или генерируем стандартный ответ
    return mockTranslations[word.toLowerCase()] || {
      translation: `Перевод для "${word}"`,
      contextMeaning: `Это слово означает что-то релевантное контексту: "${context.substring(0, 50)}..."`,
      englishExplanation: `This word means something relevant to the context: "${context.substring(0, 50)}..."`
    };
  }
}

// Function to extract surrounding context
export function getWordContext(text: string, word: string, range: number = 100): string {
  const lowerText = text.toLowerCase();
  const lowerWord = word.toLowerCase();
  const wordIndex = lowerText.indexOf(lowerWord);
  
  if (wordIndex === -1) return "";
  
  const start = Math.max(0, wordIndex - range);
  const end = Math.min(text.length, wordIndex + word.length + range);
  
  return text.substring(start, end);
}

// Function to highlight words in text
export function highlightWords(text: string, words: string[]): string {
  if (!words.length) return text;
  
  // Convert to lowercase for case-insensitive matching
  const lowerWords = words.map(word => word.toLowerCase());
  
  // Split text into words and punctuation
  const tokens = text.split(/(\s+|[.,!?;:"])/);
  
  // Process each token
  const highlighted = tokens.map(token => {
    const lowerToken = token.trim().toLowerCase();
    if (lowerToken && lowerWords.includes(lowerToken)) {
      return `<span class="highlighted-word">${token}</span>`;
    }
    return token;
  });
  
  return highlighted.join('');
}