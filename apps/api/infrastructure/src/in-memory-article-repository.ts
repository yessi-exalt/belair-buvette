import type { Article, ArticleRepository } from '@belair-buvette-api/domain';

export class InMemoryArticleRepository implements ArticleRepository {
  private readonly articles = new Map<string, Article>();

  seed(article: Article): void {
    this.articles.set(article.id, structuredClone(article));
  }

  async findByName(name: string): Promise<Article> {
    const article = Array.from(this.articles.values()).find((a) => a.name === name);
    if (!article) throw new Error(`Article not found: ${name}`);
    return structuredClone(article);
  }

  async save(article: Article): Promise<void> {
    this.articles.set(article.id, structuredClone(article));
  }
}
