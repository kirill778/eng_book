import { ArticleImporter } from "@/components/article-importer";
import { ArticleList } from "@/components/article-list";
import { DemoDataInitializer } from "@/components/demo-data-initializer";

export default function Home() {
  return (
    <div className="space-y-6">
      <DemoDataInitializer />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Articles</h1>
          <p className="text-muted-foreground">Import and read English articles to expand your vocabulary</p>
        </div>
        <ArticleImporter />
      </div>
      
      <ArticleList />
    </div>
  );
}