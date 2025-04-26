"use client";

import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { translateWord, generateId } from "@/lib/utils";
import { useVocabularyContext } from "@/components/vocabulary-context";
import { VocabularyWord } from "@/lib/types";
import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react";

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
  const [contextMeaning, setContextMeaning] = useState("");
  const { addWord, isInVocabulary } = useVocabularyContext();
  const [isSaved, setIsSaved] = useState(isInVocabulary(word));

  // Fetch translation when word changes
  useState(() => {
    if (word && open) {
      setIsLoading(true);
      translateWord(word, context)
        .then(({ translation, contextMeaning }) => {
          setTranslation(translation);
          setContextMeaning(contextMeaning);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error translating word:", error);
          setIsLoading(false);
        });
    }
  });

  const handleAddToVocabulary = () => {
    const newWord: VocabularyWord = {
      id: generateId(),
      word,
      translation,
      contextMeaning,
      dateAdded: new Date().toISOString(),
      exampleSentence: context,
      articleId,
    };
    
    addWord(newWord);
    setIsSaved(true);
  };

  return (
    <Popover open={open} onOpenChange={(open) => !open && onClose()}>
      <PopoverTrigger asChild>
        <span className="sr-only">Open word translation</span>
      </PopoverTrigger>
      <PopoverContent className="w-[350px] p-0" align="center">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">{word}</CardTitle>
            <CardDescription>
              {isLoading ? "Loading translation..." : translation}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm">
            {isLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div>
                <p className="text-muted-foreground mb-3">{contextMeaning}</p>
                <p className="text-xs italic text-muted-foreground border-l-2 pl-3 py-1">
                  {context.length > 100 ? `"${context.substring(0, 100)}..."` : `"${context}"`}
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
            >
              Close
            </Button>
            <Button
              variant={isSaved ? "secondary" : "default"}
              size="sm"
              onClick={handleAddToVocabulary}
              disabled={isLoading || isSaved}
              className="gap-1"
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
      </PopoverContent>
    </Popover>
  );
}