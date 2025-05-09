"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { FileText } from "lucide-react";
import { useArticlesContext } from "@/components/articles-context";
import { generateId } from "@/lib/utils";
import { Article } from "@/lib/types";
import { useRouter } from "next/navigation";

export function QuickTextInput() {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const { addArticle } = useArticlesContext();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) return;
    
    const articleId = generateId();
    const newArticle: Article = {
      id: articleId,
      title: "text", // Generic title
      content: processContent(content.trim()),
      dateAdded: new Date().toISOString()
    };
    
    addArticle(newArticle);
    setOpen(false);
    resetForm();
    router.push(`/article/${articleId}`);
  };

  // Process content to properly handle paragraphs
  const processContent = (text: string) => {
    // Convert double line breaks to paragraphs
    return text.split(/\n\s*\n/).map(paragraph => `<p>${paragraph.trim()}</p>`).join('');
  };

  const resetForm = () => {
    setContent("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-1">
          <FileText className="h-4 w-4" />
          <span>Quick Text</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Quick Text Input</DialogTitle>
            <DialogDescription>
              Paste text to immediately start reading with vocabulary tools.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your text here"
              className="min-h-[200px]"
              required
            />
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Start Reading</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 