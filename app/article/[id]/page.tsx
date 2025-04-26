"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArticleReader } from "@/components/article-reader";
import { useArticlesContext } from "@/components/articles-context";
import { ArrowLeft } from "lucide-react";
import { Article } from "@/lib/types";

export default function ArticlePage() {
  const params = useParams();
  const router = useRouter();
  const { getArticleById } = useArticlesContext();
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      const foundArticle = getArticleById(params.id as string);
      setArticle(foundArticle || null);
      setIsLoading(false);
    }
  }, [params.id, getArticleById]);

  if (isLoading) {
    return <div className="text-center py-12">Loading article...</div>;
  }

  if (!article) {
    return (
      <div className="text-center py-12">
        <p className="text-lg">Article not found</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => router.push("/")}
        >
          Back to Articles
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => router.push("/")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Articles
      </Button>
      
      <ArticleReader article={article} />
    </div>
  );
}