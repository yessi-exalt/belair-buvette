import { describe, expect, it } from 'vitest';

import { reserveStockForOrder } from '../src/index.js';
import {
  createAvailableStocks,
  createInsufficientStocks,
  createOrderItems,
} from './stock-availability.fixture.js';

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