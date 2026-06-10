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

export class OrderNotFoundError extends Error {
  readonly type = 'ORDER_NOT_FOUND' as const;

  constructor(orderId?: string) {
    super(orderId ? `Commande introuvable : ${orderId}` : 'Commande introuvable');
    this.name = 'OrderNotFoundError';
  }
}

export class OrderNotCancellableError extends Error {
  readonly type = 'ORDER_NOT_CANCELLABLE' as const;

  constructor() {
    super('La commande ne peut pas etre annulee');
    this.name = 'OrderNotCancellableError';
  }
}
