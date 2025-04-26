export interface Article {
  id: string;
  title: string;
  content: string;
  source?: string;
  dateAdded: string;
}

export interface VocabularyWord {
  id: string;
  word: string;
  translation: string;
  contextMeaning: string;
  dateAdded: string;
  exampleSentence?: string;
  articleId?: string;
}