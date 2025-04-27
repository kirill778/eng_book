"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { WordTranslationPopover } from "@/components/word-translation-popover";
import { getWordContext } from "@/lib/utils";
import { useVocabularyContext } from "@/components/vocabulary-context";
import { Article } from "@/lib/types";
import Image from "next/image";

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
    
    try {
      // Replace words with highlighted version while preserving HTML structure
      const parser = new DOMParser();
      const doc = parser.parseFromString(article.content, 'text/html');
      
      // Process all text nodes to highlight vocabulary words
      const textNodes = [];
      const walker = document.createTreeWalker(
        doc.body,
        NodeFilter.SHOW_TEXT,
        null
      );
      
      let node;
      while (node = walker.nextNode()) {
        textNodes.push(node);
      }
      
      textNodes.forEach(textNode => {
        if (textNode.textContent) {
          const highlightedText = textNode.textContent.replace(pattern, match => 
            `<span class="highlighted-word">${match}</span>`
          );
          
          if (highlightedText !== textNode.textContent) {
            const span = doc.createElement('span');
            span.innerHTML = highlightedText;
            textNode.parentNode?.replaceChild(span, textNode);
          }
        }
      });
      
      setHighlightedHtml(doc.body.innerHTML);
    } catch (error) {
      // Fallback in case DOM parsing fails
      setHighlightedHtml(article.content.replace(pattern, match => 
        `<span class="highlighted-word">${match}</span>`
      ));
    }
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

  // Function to render content with images inserted at their positions
  const renderContentWithImages = () => {
    if (!article.images || article.images.length === 0) {
      return (
        <div 
          ref={contentRef}
          className="prose prose-sm sm:prose-base dark:prose-invert max-w-none article-content"
          onMouseUp={handleTextSelection}
          onTouchEnd={handleTextSelection}
          dangerouslySetInnerHTML={{ __html: highlightedHtml }}
        />
      );
    }

    // Split content at image positions and insert images
    const contentParts = [];
    let lastPosition = 0;
    
    // Sort images by position
    const sortedImages = [...(article.images || [])].sort((a, b) => a.position - b.position);
    
    sortedImages.forEach((image, index) => {
      // Add text before image
      contentParts.push(
        <div 
          key={`text-${index}`}
          className="prose prose-sm sm:prose-base dark:prose-invert max-w-none article-content"
          onMouseUp={handleTextSelection}
          onTouchEnd={handleTextSelection}
          dangerouslySetInnerHTML={{ 
            __html: highlightedHtml.substring(lastPosition, image.position) 
          }}
        />
      );
      
      // Add image
      contentParts.push(
        <div key={`image-${index}`} className="my-6">
          <Image 
            src={image.src}
            alt={image.alt || "Article image"}
            width={700}
            height={400}
            className="rounded-md"
            style={{objectFit: "contain"}}
          />
        </div>
      );
      
      lastPosition = image.position;
    });
    
    // Add remaining text after last image
    contentParts.push(
      <div 
        key="text-final"
        className="prose prose-sm sm:prose-base dark:prose-invert max-w-none article-content"
        onMouseUp={handleTextSelection}
        onTouchEnd={handleTextSelection}
        dangerouslySetInnerHTML={{ 
          __html: highlightedHtml.substring(lastPosition) 
        }}
      />
    );
    
    return contentParts;
  };

  return (
    <div className="relative">
      <Card className="mb-4">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-6">{article.title}</h1>
          <div ref={contentRef} className="article-container">
            <style jsx global>{`
              .article-content p {
                margin-bottom: 1.5rem;
                line-height: 1.8;
                font-size: 1.05rem;
                padding-top: 0.25rem;
                padding-bottom: 0.25rem;
              }
              .article-content h1, .article-content h2, .article-content h3, 
              .article-content h4, .article-content h5, .article-content h6 {
                margin-top: 2rem;
                margin-bottom: 1.25rem;
                font-weight: 700;
                line-height: 1.3;
                border-bottom: 1px solid rgba(128, 128, 128, 0.2);
                padding-bottom: 0.5rem;
              }
              .article-content h1 {
                font-size: 1.75rem;
              }
              .article-content h2 {
                font-size: 1.5rem;
              }
              .article-content h3 {
                font-size: 1.25rem;
              }
              .article-content ul, .article-content ol {
                margin-bottom: 1.5rem;
                padding-left: 2rem;
              }
              .article-content ul li, .article-content ol li {
                margin-bottom: 0.75rem;
              }
              .article-content blockquote {
                border-left: 4px solid #cbd5e0;
                padding: 0.75rem 1.5rem;
                margin: 1.5rem 0;
                font-style: italic;
                color: #4a5568;
                background-color: rgba(237, 242, 247, 0.3);
              }
              .article-container {
                width: 100%;
              }
              .highlighted-word {
                background-color: rgba(255, 247, 120, 0.5);
                padding: 0 2px;
                border-radius: 2px;
                cursor: pointer;
              }
              /* Fix for rendering blank paragraphs */
              .article-content p:empty {
                display: none;
              }
              .article-content p + p {
                margin-top: 0;
              }
              .article-content p::after {
                content: "";
                display: block;
                margin-bottom: 1rem;
              }
              /* Ensure consistent margins between elements */
              .article-content > *:first-child {
                margin-top: 0;
              }
              .article-content > * {
                margin-bottom: 1.5rem;
              }
              /* Force paragraph styling for text that might not be in p tags */
              .article-content div:not(.article-content div div) {
                margin-bottom: 1rem;
                line-height: 1.8;
              }
            `}</style>
            {renderContentWithImages()}
          </div>
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