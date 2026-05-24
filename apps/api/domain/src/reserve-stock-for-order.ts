export type ArticleStock = {
  articleName: string;
  availableQuantity: number;
};

export type ReserveStockResult = {
  status: string;
  remainingStocks: ArticleStock[];
};

import { StockInsuffisantException } from './exceptions.js';

export function reserveStockForOrder(
  orderItems: Array<{ articleName: string; quantity: number }>,
  availableStocks: ArticleStock[],
): ReserveStockResult {
  const remainingStocks = availableStocks.map((stock) => ({ ...stock }));

  for (const orderItem of orderItems) {
    const matchingStock = remainingStocks.find(
      (stock) => stock.articleName === orderItem.articleName,
    );

    if (!matchingStock || matchingStock.availableQuantity < orderItem.quantity) {
      throw new StockInsuffisantException();
    }

    matchingStock.availableQuantity -= orderItem.quantity;
  }

  return { status: 'EN_ATTENTE', remainingStocks };
}