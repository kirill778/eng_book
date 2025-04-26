"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useArticlesContext } from "@/components/articles-context";
import { formatDate } from "@/lib/utils";
import { BookOpen, Trash2 } from "lucide-react";

export function ArticleList() {
  const { articles, removeArticle } = useArticlesContext();

  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No articles imported yet.</p>
        <p className="text-sm text-muted-foreground mt-1">
          Import your first article to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <Card key={article.id} className="overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="line-clamp-2 text-xl h-14">
              {article.title}
            </CardTitle>
            <CardDescription className="flex justify-between text-xs">
              <span>Added: {formatDate(article.dateAdded)}</span>
              {article.source && <span>Source: {article.source}</span>}
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <p className="text-sm text-muted-foreground line-clamp-3">
              {article.content.substring(0, 150)}...
            </p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeArticle(article.id)}
              className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              <span>Remove</span>
            </Button>
            <Button asChild size="sm">
              <Link href={`/article/${article.id}`}>
                <BookOpen className="h-4 w-4 mr-1" />
                <span>Read</span>
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}