import { describe, expect, it } from 'vitest';

import { reserveStockForOrder } from '../src/index.js';
import {
  createInsufficientStocks,
  createOrderItems,
  type TestArticleStock,
} from './stock-availability.fixture.js';

describe('reserveStockForOrder', () => {
  it('refuse la commande, lève une erreur de type "STOCK_INSUFFISANT" et laisse le stock de Mojito inchangé quand 1 Mojito est disponible et que 2 sont commandés', () => {
    // Arrange
    const orderItems = createOrderItems().slice(0, 1); // [{ articleName: 'Mojito', quantity: 2 }]
    const availableStocks = createInsufficientStocks();  // [{ articleName: 'Mojito', availableQuantity: 1 }]

    // Act
    const act = (): TestArticleStock[] => reserveStockForOrder(orderItems, availableStocks);

    // Assert
    expect(act).toThrowError(
      expect.objectContaining({ type: 'STOCK_INSUFFISANT' }),
    );
    expect(availableStocks).toEqual([
      {
        articleName: 'Mojito',
        availableQuantity: 1,
      },
    ]);
  });
});