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
  englishExample: string;
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
      englishExample: string;
    }> = {
      "eloquent": {
        translation: "красноречивый",
        contextMeaning: "Выразительный, убедительный и впечатляющий в своём проявлении.",
        englishExplanation: "Fluent or persuasive in speaking or writing, especially in a way that is moving or effective.",
        englishExample: "His eloquent speech moved the audience to tears. (Martin Luther King's 'I Have a Dream')"
      },
      "innovation": {
        translation: "инновация",
        contextMeaning: "Новая идея, метод или устройство, внедрение чего-то нового.",
        englishExplanation: "The action or process of innovating, introducing new ideas, methods, or products.",
        englishExample: "The iPhone was a radical innovation that changed the way we communicate. (Steve Jobs, 2007)"
      },
      "remarkable": {
        translation: "замечательный",
        contextMeaning: "Заслуживающий внимания из-за необычности или исключительности.",
        englishExplanation: "Worthy of attention because unusual or exceptional, notably or conspicuously unusual.",
        englishExample: "It is remarkable how quickly children can learn a new language. (Noam Chomsky, 'Language and Mind')"
      },
      "ubiquitous": {
        translation: "вездесущий",
        contextMeaning: "Присутствующий или встречающийся повсюду одновременно.",
        englishExplanation: "Present, appearing, or found everywhere; omnipresent.",
        englishExample: "Smartphones have become ubiquitous in modern society. (The New York Times)"
      },
      "ambiguous": {
        translation: "двусмысленный",
        contextMeaning: "Открытый для нескольких интерпретаций; имеющий двойной смысл; неясный.",
        englishExplanation: "Open to more than one interpretation; having a double meaning; unclear or inexact.",
        englishExample: "The ending of the movie 'Inception' was deliberately ambiguous, leaving viewers to decide for themselves. (Christopher Nolan)"
      },
      "fundamental": {
        translation: "фундаментальный",
        contextMeaning: "Составляющий основу или ядро; имеющий центральное значение.",
        englishExplanation: "Forming a necessary base or core; of central importance.",
        englishExample: "The right to free speech is fundamental to democracy. (U.S. Constitution, First Amendment)"
      },
      "data": {
        translation: "данные",
        contextMeaning: "Факты и статистика, собранные для анализа или справки.",
        englishExplanation: "Facts and statistics collected together for reference or analysis.",
        englishExample: "The scientist carefully analyzed the data from her experiment. (Carl Sagan, 'Cosmos')"
      },
      "artificial": {
        translation: "искусственный",
        contextMeaning: "Созданный человеком, а не возникший естественным путем.",
        englishExplanation: "Made or produced by human beings rather than occurring naturally.",
        englishExample: "Arthur C. Clarke wrote: 'Any sufficiently advanced technology is indistinguishable from magic.' He was referring to artificial systems that seem magical in their capabilities. (Arthur C. Clarke, 'Profiles of the Future')"
      }
    };
  
    // Возвращаем моковый перевод или генерируем стандартный ответ
    return mockTranslations[word.toLowerCase()] || {
      translation: `Перевод для "${word}"`,
      contextMeaning: `Это слово означает что-то релевантное контексту: "${context.substring(0, 50)}..."`,
      englishExplanation: `This word means something relevant to the context: "${context.substring(0, 50)}..."`,
      englishExample: `Example usage: "${word} is an interesting term that appears in various contexts."`
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