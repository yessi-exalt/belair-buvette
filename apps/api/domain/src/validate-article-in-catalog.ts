import { ArticleInconnuException } from './exceptions.js';

export function validateArticleInCatalog(
  articleId: string,
  catalog: ReadonlyArray<{ id: string }>,
): void {
  const articleExists = catalog.some((article) => article.id === articleId);

  if (!articleExists) {
    throw new ArticleInconnuException(articleId);
  }
}