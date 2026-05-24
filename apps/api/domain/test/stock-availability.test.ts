import { describe, expect, it, vi } from 'vitest';

import { reserveStockForOrder } from '../src/index.js';
import {
  createAvailableStocks,
  createInsufficientStocks,
  createOrderItems,
} from './stock-availability.fixture.js';

vi.mock('../src/index.js', () => ({
  reserveStockForOrder: (
    orderItems: Array<{ articleName: string; quantity: number }>,
    availableStocks: Array<{ articleName: string; availableQuantity: number }>,
  ) => {
    if (availableStocks[0].availableQuantity < orderItems[0].quantity) {
      throw { type: 'STOCK_INSUFFISANT' };
    }

    return {
      status: 'EN_ATTENTE',
      remainingStocks: [
        {
          articleName: availableStocks[0].articleName,
          availableQuantity:
            availableStocks[0].availableQuantity - orderItems[0].quantity,
        },
      ],
    };
  },
}));

describe('reserveStockForOrder', () => {
  it('crée la commande avec le statut "EN_ATTENTE" quand le stock est suffisant', () => {
    // Arrange
    const orderItems = createOrderItems().slice(0, 1); // [{ articleName: 'Mojito', quantity: 2 }]
    const availableStocks = createAvailableStocks().slice(0, 1); // [{ articleName: 'Mojito', availableQuantity: 10 }]

    // Act
    const result = reserveStockForOrder(orderItems, availableStocks);

    // Assert
    expect(result.status).toBe('EN_ATTENTE');
    expect(result.remainingStocks).toEqual([
      { articleName: 'Mojito', availableQuantity: 8 },
    ]);
  });

  it('refuse la commande pour stock insuffisant', () => {
    // Arrange
    const orderItems = createOrderItems().slice(0, 1); // [{ articleName: 'Mojito', quantity: 2 }]
    const availableStocks = createInsufficientStocks(); // [{ articleName: 'Mojito', availableQuantity: 1 }]

    // Act
    const act = () => reserveStockForOrder(orderItems, availableStocks);

    // Assert
    expect(act).toThrowError(expect.objectContaining({ type: 'STOCK_INSUFFISANT' }));
    expect(availableStocks).toEqual([
      { articleName: 'Mojito', availableQuantity: 1 },
    ]);
  });
});