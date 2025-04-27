"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { LinkIcon, Loader2 } from "lucide-react";
import { useArticlesContext } from "@/components/articles-context";
import { generateId } from "@/lib/utils";
import { Article } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";

export function UrlArticleImporter() {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { addArticle } = useArticlesContext();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError("Please enter a valid URL");
      return;
    }
    
    try {
      setIsLoading(true);
      setError("");
      
      // Проверяем корректность URL
      let articleUrl = url.trim();
      if (!articleUrl.startsWith('http://') && !articleUrl.startsWith('https://')) {
        articleUrl = 'https://' + articleUrl;
      }
      
      // Отправляем запрос на API
      const response = await fetch('/api/fetch-article', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: articleUrl })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to import article');
      }
      
      const articleData = await response.json();
      
      // Создаем новую статью
      const newArticle: Article = {
        id: generateId(),
        title: articleData.title || 'Untitled Article',
        content: articleData.content,
        images: articleData.images || [],
        source: articleData.source || articleUrl,
        dateAdded: new Date().toISOString()
      };
      
      // Добавляем статью
      addArticle(newArticle);
      
      // Закрываем диалог и сбрасываем форму
      setOpen(false);
      setUrl("");
      
      // Показываем уведомление об успешном импорте
      toast({
        title: "Article imported",
        description: `Successfully imported "${newArticle.title}"`,
      });
      
    } catch (error) {
      console.error('Import error:', error);
      setError(error instanceof Error ? error.message : 'Failed to import article');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-1">
          <LinkIcon className="h-4 w-4" />
          <span>Import from URL</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Import Article from URL</DialogTitle>
            <DialogDescription>
              Enter a URL to import content from a webpage.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="url">Article URL</Label>
              <Input
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/article"
                disabled={isLoading}
                required
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Importing...
                </>
              ) : (
                'Import Article'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 