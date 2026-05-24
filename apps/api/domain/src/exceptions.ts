export class StockInsuffisantException extends Error {
  readonly type = 'STOCK_INSUFFISANT' as const;

  constructor() {
    super('Stock insuffisant pour la commande');
    this.name = 'StockInsuffisantException';
  }
}

export class ArticleInconnuException extends Error {
  readonly type = 'ARTICLE_INCONNU' as const;

  constructor(articleId?: string) {
    super(articleId ? `Article inconnu : ${articleId}` : 'Article inconnu');
    this.name = 'ArticleInconnuException';
  }
}
