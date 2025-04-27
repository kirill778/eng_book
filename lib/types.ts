export interface Article {
  id: string;
  title: string;
  content: string;
  source?: string;
  dateAdded: string;
  images?: Array<{src: string, alt: string, position: number}>;
}

export interface VocabularyWord {
  id: string;
  word: string;
  translation: string;
  synonyms?: string[];
  contextMeaning: string;
  englishExplanation?: string;
  englishExample?: string;
  dateAdded: string;
  exampleSentence?: string;
  articleId?: string;
}