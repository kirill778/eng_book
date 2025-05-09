import { ArticleImporter } from "@/components/article-importer";
import { UrlArticleImporter } from "@/components/url-article-importer";
import { ArticleList } from "@/components/article-list";
import { DemoDataInitializer } from "@/components/demo-data-initializer";
import { QuickTextInput } from "@/components/quick-text-input";

export default function Home() {
  return (
    <div className="space-y-6">
      <DemoDataInitializer />
      
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold">My Articles</h1>
          <p className="text-muted-foreground">Import and read English articles to expand your vocabulary</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <QuickTextInput />
          <UrlArticleImporter />
          <ArticleImporter />
        </div>
      </div>
      
      <ArticleList />
    </div>
  );
}