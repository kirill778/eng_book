import { sampleArticle, additionalArticles } from "@/lib/sample-data";

// Эта функция нужна для статической генерации при экспорте
export function generateStaticParams() {
  // Используем ID статей из примеров для предварительной генерации
  const articleIds = [
    sampleArticle.id,
    ...additionalArticles.map(article => article.id)
  ];
  
  return articleIds.map(id => ({
    id: id
  }));
}

// Экспортируем основной компонент
export { default } from "@/components/article-page-client";