"use client";

import { createContext, useContext, ReactNode } from "react";
import { useArticles } from "@/hooks/use-articles";
import { Article } from "@/lib/types";

type ArticlesContextType = {
  articles: Article[];
  addArticle: (article: Article) => void;
  removeArticle: (articleId: string) => void;
  getArticleById: (articleId: string) => Article | undefined;
  isLoading: boolean;
};

const ArticlesContext = createContext<ArticlesContextType | undefined>(undefined);

export function ArticlesProvider({ children }: { children: ReactNode }) {
  const articlesHook = useArticles();

  return (
    <ArticlesContext.Provider value={articlesHook}>
      {children}
    </ArticlesContext.Provider>
  );
}

export function useArticlesContext() {
  const context = useContext(ArticlesContext);
  if (context === undefined) {
    throw new Error("useArticlesContext must be used within an ArticlesProvider");
  }
  return context;
}