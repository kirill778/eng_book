"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useVocabularyContext } from "@/components/vocabulary-context";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";
import { Eye, Search, Trash2, X } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";

export function VocabularyList() {
  const { vocabulary, removeWord } = useVocabularyContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);
  
  const filteredVocabulary = vocabulary.filter(word => 
    word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
    word.translation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedWord = selectedWordId 
    ? vocabulary.find(word => word.id === selectedWordId) 
    : null;

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search your vocabulary..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-9 w-9"
            onClick={() => setSearchTerm("")}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </div>

      {filteredVocabulary.length === 0 ? (
        <div className="text-center py-12">
          {vocabulary.length === 0 ? (
            <p className="text-muted-foreground">
              Your vocabulary list is empty. <br />
              <span className="text-sm">
                Select words while reading to add them to your vocabulary.
              </span>
            </p>
          ) : (
            <p className="text-muted-foreground">No matching words found.</p>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredVocabulary.map((word) => (
            <Card key={word.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{word.word}</CardTitle>
                  <CardDescription>{word.translation}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {word.contextMeaning}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeWord(word.id)}
                  className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  <span className="sr-only sm:not-sr-only">Remove</span>
                </Button>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedWordId(word.id)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    <span className="sr-only sm:not-sr-only">Details</span>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Word Details Dialog */}
      <Dialog open={!!selectedWordId} onOpenChange={(open) => !open && setSelectedWordId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>{selectedWord?.word}</span>
              <span className="text-base font-normal text-muted-foreground">
                {selectedWord?.translation}
              </span>
            </DialogTitle>
            <DialogDescription>
              Added on {selectedWord && formatDate(selectedWord.dateAdded)}
            </DialogDescription>
          </DialogHeader>
          {selectedWord && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-1">Meaning</h4>
                <p className="text-sm">{selectedWord.contextMeaning}</p>
              </div>
              {selectedWord.exampleSentence && (
                <div>
                  <h4 className="text-sm font-medium mb-1">Example</h4>
                  <p className="text-sm border-l-2 pl-3 py-1 italic text-muted-foreground">
                    "{selectedWord.exampleSentence}"
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}