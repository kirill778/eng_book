"use client";

import { useEffect } from "react";
import { useArticlesContext } from "@/components/articles-context";
import { useVocabularyContext } from "@/components/vocabulary-context";
import { sampleArticle, additionalArticles, sampleVocabularyWords } from "@/lib/sample-data";

// This component initializes demo data if the app is empty
export function DemoDataInitializer() {
  const { articles, addArticle } = useArticlesContext();
  const { vocabulary, addWord } = useVocabularyContext();

  useEffect(() => {
    // Only add sample data if both articles and vocabulary are empty
    if (articles.length === 0 && vocabulary.length === 0) {
      // Add sample articles
      addArticle(sampleArticle);
      additionalArticles.forEach(article => {
        addArticle(article);
      });
      
      // Add sample vocabulary words
      sampleVocabularyWords.forEach(word => {
        addWord(word);
      });
    }
  }, [articles.length, vocabulary.length, addArticle, addWord]);

  return null;
}