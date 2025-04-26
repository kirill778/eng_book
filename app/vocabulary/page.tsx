import { VocabularyList } from "@/components/vocabulary-list";

export default function VocabularyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Vocabulary</h1>
        <p className="text-muted-foreground">
          Words you've saved while reading
        </p>
      </div>
      
      <VocabularyList />
    </div>
  );
}