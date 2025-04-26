"use client";

import { useEffect, useState } from "react";
import { Article } from "@/lib/types";

export function useArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load articles from localStorage on initial render
    const storedArticles = localStorage.getItem("articles");
    if (storedArticles) {
      setArticles(JSON.parse(storedArticles));
    }
    setIsLoading(false);
  }, []);

  // Save articles to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("articles", JSON.stringify(articles));
    }
  }, [articles, isLoading]);

  const addArticle = (article: Article) => {
    setArticles((prev) => [...prev, article]);
  };

  const removeArticle = (articleId: string) => {
    setArticles((prev) => prev.filter((article) => article.id !== articleId));
  };

  const getArticleById = (articleId: string) => {
    return articles.find((article) => article.id === articleId);
  };

  return {
    articles,
    addArticle,
    removeArticle,
    getArticleById,
    isLoading
  };
}