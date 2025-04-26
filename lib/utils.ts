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
  synonyms: string[];
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
      synonyms: string[];
      contextMeaning: string;
      englishExplanation: string;
      englishExample: string;
    }> = {
      "eloquent": {
        translation: "красноречивый",
        synonyms: ["articulate", "expressive", "fluent"],
        contextMeaning: "Выразительный, убедительный и впечатляющий в своём проявлении.",
        englishExplanation: "As an adjective, 'eloquent' describes speech or writing that is fluent, persuasive, and expressive in a powerful way. From Latin 'eloquens' (speaking out), it's often associated with formal oratory. Synonyms include articulate, expressive, and silver-tongued; antonyms are inarticulate and tongue-tied.",
        englishExample: "His eloquent speech moved the audience to tears. (Martin Luther King's 'I Have a Dream')"
      },
      "innovation": {
        translation: "инновация",
        synonyms: ["novelty", "advancement", "breakthrough"],
        contextMeaning: "Новая идея, метод или устройство, внедрение чего-то нового.",
        englishExplanation: "A noun referring to a new method, idea, or product that represents a significant change or advancement. From Latin 'innovare' (to renew), it differs from 'invention' as innovation usually modifies existing ideas rather than creating entirely new ones. Related terms include innovative (adj), innovate (verb), and innovator (person).",
        englishExample: "The iPhone was a radical innovation that changed the way we communicate. (Steve Jobs, 2007)"
      },
      "remarkable": {
        translation: "замечательный",
        synonyms: ["extraordinary", "exceptional", "notable"],
        contextMeaning: "Заслуживающий внимания из-за необычности или исключительности.",
        englishExplanation: "An adjective denoting something worthy of notice because it is unusual, exceptional, or striking. From 'remark' + '-able', literally 'able to be remarked upon'. Stronger than 'notable' but less intense than 'extraordinary'. Often collocates with 'achievement', 'recovery', or 'resemblance'.",
        englishExample: "It is remarkable how quickly children can learn a new language. (Noam Chomsky, 'Language and Mind')"
      },
      "ubiquitous": {
        translation: "вездесущий",
        synonyms: ["omnipresent", "pervasive", "universal"],
        contextMeaning: "Присутствующий или встречающийся повсюду одновременно.",
        englishExplanation: "An adjective describing something that appears to be present everywhere simultaneously. Derived from Latin 'ubique' meaning 'everywhere'. Often used in technical or academic contexts. Similar words include omnipresent and pervasive. The related noun form is 'ubiquity'. Frequently used to describe technology that has become commonplace.",
        englishExample: "Smartphones have become ubiquitous in modern society. (The New York Times)"
      },
      "ambiguous": {
        translation: "двусмысленный",
        synonyms: ["unclear", "vague", "equivocal"],
        contextMeaning: "Открытый для нескольких интерпретаций; имеющий двойной смысл; неясный.",
        englishExplanation: "An adjective describing something open to multiple interpretations or lacking clarity. From Latin 'ambiguus' (doubtful, shifting). Types include lexical ambiguity (words with multiple meanings) and syntactic ambiguity (sentence structure creating multiple readings). The noun form is 'ambiguity'. Often purposely used in literature but avoided in technical writing.",
        englishExample: "The ending of the movie 'Inception' was deliberately ambiguous, leaving viewers to decide for themselves. (Christopher Nolan)"
      },
      "fundamental": {
        translation: "фундаментальный",
        synonyms: ["essential", "basic", "core"],
        contextMeaning: "Составляющий основу или ядро; имеющий центральное значение.",
        englishExplanation: "An adjective describing something that serves as a foundation or essential component without which something would not exist. From Latin 'fundamentum' (foundation). Can function as both adjective and noun (fundamentals). In science, refers to basic principles; in investing, refers to the economic factors affecting a security's value. Stronger than 'basic' or 'important'.",
        englishExample: "The right to free speech is fundamental to democracy. (U.S. Constitution, First Amendment)"
      },
      "data": {
        translation: "данные",
        synonyms: ["information", "facts", "statistics"],
        contextMeaning: "Факты и статистика, собранные для анализа или справки.",
        englishExplanation: "A plural noun (singular: datum, rarely used) referring to facts or information, especially when examined and used to find patterns or make decisions. In computing, specifically refers to information in digital form. Originally from Latin 'datum' meaning 'something given'. In modern usage, often treated as a mass noun taking a singular verb despite its plural etymology.",
        englishExample: "The scientist carefully analyzed the data from her experiment. (Carl Sagan, 'Cosmos')"
      },
      "artificial": {
        translation: "искусственный",
        synonyms: ["synthetic", "man-made", "fabricated"],
        contextMeaning: "Созданный человеком, а не возникший естественным путем.",
        englishExplanation: "An adjective describing something made, produced, or caused by humans rather than occurring naturally. From Latin 'artificialis'. Often contrasted with 'natural' or 'organic'. Can carry both positive connotations (skill, ingenuity) and negative ones (fake, insincere). Used across domains from AI to food additives, with varying contextual nuances. Related forms include artificially (adv) and artifice (n).",
        englishExample: "Arthur C. Clarke wrote: 'Any sufficiently advanced technology is indistinguishable from magic.' He was referring to artificial systems that seem magical in their capabilities. (Arthur C. Clarke, 'Profiles of the Future')"
      }
    };
  
    // Возвращаем моковый перевод или генерируем стандартный ответ
    return mockTranslations[word.toLowerCase()] || {
      translation: `Перевод для "${word}"`,
      synonyms: [],
      contextMeaning: `Значение ${word.includes(" ") ? "фразы" : "слова"} "${word}" в этом контексте (но не перевод контекста)`,
      englishExplanation: `The ${word.includes(" ") ? "phrase" : "term"} "${word}" requires linguistic analysis. Without detailed information, it's difficult to provide full etymological and usage patterns. A professional linguistic analysis would examine its semantic range, common collocations, and contextual usage.`,
      englishExample: `Example usage: "${word} is often used in contexts similar to this one."`
    };
  }
}

// Function to extract surrounding context
export function getWordContext(text: string, word: string, range: number = 100): string {
  const lowerText = text.toLowerCase();
  const lowerWord = word.toLowerCase();
  
  // Find the word or phrase in the text
  const wordIndex = lowerText.indexOf(lowerWord);
  
  if (wordIndex === -1) return "";
  
  // Get broader context for the text selection
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