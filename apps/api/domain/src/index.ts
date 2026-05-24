// Export your domain types, classes and interfaces here

export type ArticleStock = {
  articleName: string;
  availableQuantity: number;
};

export type ReserveStockResult = {
  status: string;
  remainingStocks: ArticleStock[];
};

export function reserveStockForOrder(
  _orderItems: Array<{ articleName: string; quantity: number }>,
  _availableStocks: ArticleStock[],
): ReserveStockResult {
  return { status: 'NOT_IMPLEMENTED', remainingStocks: [] };
}

export function validateArticleInCatalog(
  _articleId: string,
  _catalog: ReadonlyArray<{ id: string }>,
): void {
  // Not implemented
}
