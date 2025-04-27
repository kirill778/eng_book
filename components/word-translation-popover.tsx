"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { translateWord, generateId } from "@/lib/utils";
import { useVocabularyContext } from "@/components/vocabulary-context";
import { VocabularyWord } from "@/lib/types";
import { Bookmark, BookmarkCheck, Loader2, Quote, X } from "lucide-react";

interface WordTranslationPopoverProps {
  word: string;
  context: string;
  articleId?: string;
  onClose: () => void;
  open: boolean;
}

export function WordTranslationPopover({
  word,
  context,
  articleId,
  onClose,
  open,
}: WordTranslationPopoverProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [translation, setTranslation] = useState("");
  const [synonyms, setSynonyms] = useState<string[]>([]);
  const [contextMeaning, setContextMeaning] = useState("");
  const [englishExplanation, setEnglishExplanation] = useState("");
  const [englishExample, setEnglishExample] = useState("");
  const { addWord, isInVocabulary } = useVocabularyContext();
  const [isSaved, setIsSaved] = useState(isInVocabulary(word));
  const translatePanelRef = useRef<HTMLDivElement>(null);

  // Fetch translation when word changes or popup opens
  useEffect(() => {
    if (word && open) {
      setIsLoading(true);
      
      translateWord(word, context)
        .then(({ translation, synonyms, contextMeaning, englishExplanation, englishExample }) => {
          setTranslation(translation);
          setSynonyms(synonyms || []);
          setContextMeaning(contextMeaning);
          setEnglishExplanation(englishExplanation);
          setEnglishExample(englishExample || "");
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error translating word:", error);
          setTranslation(`Перевод для "${word}"`);
          setSynonyms([]);
          setContextMeaning(`Ошибка при переводе: ${error.message}`);
          setEnglishExplanation(`Translation error: ${error.message}`);
          setEnglishExample("");
          setIsLoading(false);
        });
    }
  }, [word, context, open]);

  // Adjust position to be visible within viewport
  useEffect(() => {
    if (open && translatePanelRef.current) {
      const adjustPosition = () => {
        const panel = translatePanelRef.current;
        if (!panel) return;
        
        const rect = panel.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Reset any previous transforms
        panel.style.transform = '';
        
        // Check if panel is outside viewport
        if (rect.bottom > viewportHeight) {
          const offset = rect.bottom - viewportHeight + 20; // 20px buffer
          panel.style.transform = `translateY(-${offset}px)`;
        }
      };
      
      adjustPosition();
      window.addEventListener('resize', adjustPosition);
      
      return () => {
        window.removeEventListener('resize', adjustPosition);
      };
    }
  }, [open, isLoading]);

  const handleAddToVocabulary = () => {
    const newWord: VocabularyWord = {
      id: generateId(),
      word,
      translation,
      synonyms,
      contextMeaning,
      englishExplanation,
      englishExample,
      dateAdded: new Date().toISOString(),
      exampleSentence: context,
      articleId,
    };
    
    addWord(newWord);
    setIsSaved(true);
  };

  if (!open) return null;

  return (
    <div 
      className="fixed top-24 right-4 z-50 max-w-[350px] w-full translate-x-0 transition-transform duration-200 ease-in-out"
      ref={translatePanelRef}
    >
      <Card className="border shadow-lg">
        <CardHeader className="pb-2 relative">
          <Button 
            size="icon" 
            variant="ghost" 
            className="absolute top-2 right-2 h-6 w-6" 
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          <CardTitle className="text-xl truncate pr-8">{word}</CardTitle>
          <CardDescription>
            {isLoading ? "Loading translation..." : (
              <div>
                <span className="font-medium">{translation}</span>
                {synonyms.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1 text-xs text-muted-foreground">
                    {synonyms.map((syn, index) => (
                      <span key={index} className="bg-secondary px-1.5 py-0.5 rounded-sm">
                        {syn}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm max-h-[calc(100vh-250px)] overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-semibold mb-1 text-muted-foreground">Значение в контексте:</h4>
                <p className="text-muted-foreground">{contextMeaning}</p>
              </div>
              
              <div>
                <h4 className="text-xs font-semibold mb-1 text-muted-foreground">English explanation:</h4>
                <p className="text-muted-foreground">{englishExplanation}</p>
              </div>

              {englishExample && (
                <div>
                  <h4 className="text-xs font-semibold mb-1 text-muted-foreground flex items-center gap-1">
                    <Quote className="h-3 w-3" />
                    <span>Example usage:</span>
                  </h4>
                  <p className="text-xs italic text-muted-foreground border-l-2 pl-3 py-1">
                    {englishExample}
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-3">
          <Button
            variant={isSaved ? "secondary" : "default"}
            size="sm"
            onClick={handleAddToVocabulary}
            disabled={isLoading || isSaved}
            className="gap-1 w-full"
          >
            {isSaved ? (
              <>
                <BookmarkCheck className="h-4 w-4" />
                <span>Saved</span>
              </>
            ) : (
              <>
                <Bookmark className="h-4 w-4" />
                <span>Save Word</span>
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}