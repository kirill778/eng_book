"use client";

import { useEffect, useState } from "react";
import { VocabularyWord } from "@/lib/types";

export function useVocabulary() {
  const [vocabulary, setVocabulary] = useState<VocabularyWord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load vocabulary from localStorage on initial render
    const storedVocabulary = localStorage.getItem("vocabulary");
    if (storedVocabulary) {
      setVocabulary(JSON.parse(storedVocabulary));
    }
    setIsLoading(false);
  }, []);

  // Save vocabulary to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("vocabulary", JSON.stringify(vocabulary));
    }
  }, [vocabulary, isLoading]);

  const addWord = (word: VocabularyWord) => {
    setVocabulary((prev) => {
      // Check if word already exists
      const exists = prev.some((item) => item.word.toLowerCase() === word.word.toLowerCase());
      if (exists) {
        return prev.map((item) => 
          item.word.toLowerCase() === word.word.toLowerCase() ? word : item
        );
      }
      return [...prev, word];
    });
  };

  const removeWord = (wordId: string) => {
    setVocabulary((prev) => prev.filter((item) => item.id !== wordId));
  };

  const isInVocabulary = (word: string) => {
    return vocabulary.some((item) => item.word.toLowerCase() === word.toLowerCase());
  };

  const getWordById = (wordId: string) => {
    return vocabulary.find((item) => item.id === wordId);
  };

  const getWordByText = (text: string) => {
    return vocabulary.find((item) => item.word.toLowerCase() === text.toLowerCase());
  };

  return {
    vocabulary,
    addWord,
    removeWord,
    isInVocabulary,
    getWordById,
    getWordByText,
    isLoading
  };
}