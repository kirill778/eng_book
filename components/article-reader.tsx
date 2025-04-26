"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { WordTranslationPopover } from "@/components/word-translation-popover";
import { getWordContext } from "@/lib/utils";
import { useVocabularyContext } from "@/components/vocabulary-context";
import { Article } from "@/lib/types";

interface ArticleReaderProps {
  article: Article;
}

export function ArticleReader({ article }: ArticleReaderProps) {
  const [selectedWord, setSelectedWord] = useState("");
  const [wordContext, setWordContext] = useState("");
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [highlightedHtml, setHighlightedHtml] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);
  const { vocabulary } = useVocabularyContext();

  // Update highlighted words whenever article content or vocabulary changes
  useEffect(() => {
    // Get all words in vocabulary
    const vocabWords = vocabulary.map(item => item.word.toLowerCase());
    
    if (!vocabWords.length) {
      setHighlightedHtml(article.content);
      return;
    }
    
    // Create regex pattern for all words
    const pattern = new RegExp(`\\b(${vocabWords.join('|')})\\b`, 'gi');
    
    // Replace words with highlighted version
    const html = article.content.replace(pattern, match => 
      `<span class="highlighted-word">${match}</span>`
    );
    
    setHighlightedHtml(html);
  }, [article.content, vocabulary]);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;
    
    const selectedText = selection.toString().trim();
    
    // Process both single words and multiple words
    if (selectedText) {
      const context = getWordContext(article.content, selectedText);
      setSelectedWord(selectedText);
      setWordContext(context);
      setPopoverOpen(true);
    }
  };

  const handleClosePopover = () => {
    setPopoverOpen(false);
    setSelectedWord("");
    setWordContext("");
  };

  return (
    <div className="relative">
      <Card className="mb-4">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-4">{article.title}</h1>
          <div 
            ref={contentRef}
            className="prose prose-sm sm:prose-base dark:prose-invert max-w-none"
            onMouseUp={handleTextSelection}
            onTouchEnd={handleTextSelection}
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />
        </CardContent>
      </Card>
      
      {selectedWord && (
        <WordTranslationPopover
          word={selectedWord}
          context={wordContext}
          articleId={article.id}
          onClose={handleClosePopover}
          open={popoverOpen}
        />
      )}
    </div>
  );
}