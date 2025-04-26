import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

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

// Mock AI translation service - in a real app, this would call an API
export async function translateWord(word: string, context: string): Promise<{ translation: string; contextMeaning: string }> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  // In a real application, this would call an AI translation API
  // For demo purposes, we'll return mock translations
  const mockTranslations: Record<string, { translation: string; contextMeaning: string }> = {
    "eloquent": {
      translation: "красноречивый",
      contextMeaning: "Fluent or persuasive in speaking or writing, especially in a way that is moving or effective."
    },
    "innovation": {
      translation: "инновация",
      contextMeaning: "The action or process of innovating, introducing new ideas, methods, or products."
    },
    "remarkable": {
      translation: "замечательный",
      contextMeaning: "Worthy of attention because unusual or exceptional, notably or conspicuously unusual."
    },
    "ubiquitous": {
      translation: "вездесущий",
      contextMeaning: "Present, appearing, or found everywhere; omnipresent."
    },
    "ambiguous": {
      translation: "двусмысленный",
      contextMeaning: "Open to more than one interpretation; having a double meaning; unclear or inexact."
    }
  };

  // Return mock translation or generate a default response
  return mockTranslations[word.toLowerCase()] || {
    translation: `[Translation for "${word}"]`,
    contextMeaning: `This word means something relevant to the context: "${context.substring(0, 50)}..."`
  };
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