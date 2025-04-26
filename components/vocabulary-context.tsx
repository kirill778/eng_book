"use client";

import { createContext, useContext, ReactNode } from "react";
import { useVocabulary } from "@/hooks/use-vocabulary";
import { VocabularyWord } from "@/lib/types";

type VocabularyContextType = {
  vocabulary: VocabularyWord[];
  addWord: (word: VocabularyWord) => void;
  removeWord: (wordId: string) => void;
  isInVocabulary: (word: string) => boolean;
  getWordById: (wordId: string) => VocabularyWord | undefined;
  getWordByText: (text: string) => VocabularyWord | undefined;
  isLoading: boolean;
};

const VocabularyContext = createContext<VocabularyContextType | undefined>(undefined);

export function VocabularyProvider({ children }: { children: ReactNode }) {
  const vocabularyHook = useVocabulary();

  return (
    <VocabularyContext.Provider value={vocabularyHook}>
      {children}
    </VocabularyContext.Provider>
  );
}

export function useVocabularyContext() {
  const context = useContext(VocabularyContext);
  if (context === undefined) {
    throw new Error("useVocabularyContext must be used within a VocabularyProvider");
  }
  return context;
}