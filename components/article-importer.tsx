"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
import { PlusCircle } from "lucide-react";
import { useArticlesContext } from "@/components/articles-context";
import { generateId } from "@/lib/utils";
import { Article } from "@/lib/types";

export function ArticleImporter() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [source, setSource] = useState("");
  const { addArticle } = useArticlesContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) return;
    
    const newArticle: Article = {
      id: generateId(),
      title: title.trim(),
      content: processContent(content.trim()),
      source: source.trim() || undefined,
      dateAdded: new Date().toISOString()
    };
    
    addArticle(newArticle);
    setOpen(false);
    resetForm();
  };

  // Process content to properly handle paragraphs
  const processContent = (text: string) => {
    // Convert double line breaks to paragraphs
    return text.split(/\n\s*\n/).map(paragraph => `<p>${paragraph.trim()}</p>`).join('');
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setSource("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-1">
          <PlusCircle className="h-4 w-4" />
          <span>Import Article</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Import New Article</DialogTitle>
            <DialogDescription>
              Paste an English article to add it to your reading list.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Article Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter article title"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="content">Article Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste article content here"
                className="min-h-[200px] resize-none"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="source">Source (Optional)</Label>
              <Input
                id="source"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="Enter article source"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Import Article</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}