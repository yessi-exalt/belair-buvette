import { describe, expect, it } from 'vitest';

import * as domainModule from '../src/index.js';
import {
  createAvailableStocks,
  createInsufficientStocks,
  createOrderItems,
  type TestArticleStock,
  type TestOrderItem,
} from './stock-availability.fixture.js';

type ReserveStockForOrder = (
  orderItems: readonly TestOrderItem[],
  availableStocks: readonly TestArticleStock[],
) => TestArticleStock[];

type InsufficientStockErrorConstructor = new (articleName: string) => Error;

function requireReserveStockForOrder(): ReserveStockForOrder {
  const candidate = (domainModule as Record<string, unknown>).reserveStockForOrder;

  expect(candidate).toBeTypeOf('function');

  return candidate as ReserveStockForOrder;
}

function requireInsufficientStockError(): InsufficientStockErrorConstructor {
  const candidate = (domainModule as Record<string, unknown>).InsufficientStockError;

  expect(candidate).toBeTypeOf('function');

  return candidate as InsufficientStockErrorConstructor;
}

describe('reserveStockForOrder', () => {
  it('returns the decremented stock when every ordered article is available in sufficient quantity', () => {
    // Arrange
    const orderItems = createOrderItems();
    const availableStocks = createAvailableStocks();
    const reserveStockForOrder = requireReserveStockForOrder();

    // Act
    const updatedStocks = reserveStockForOrder(orderItems, availableStocks);

    // Assert
    expect(updatedStocks).toEqual([
      {
        articleName: 'Mojito',
        availableQuantity: 8,
      },
      {
        articleName: 'Chips',
        availableQuantity: 3,
      },
    ]);
    expect(availableStocks).toEqual([
      {
        articleName: 'Mojito',
        availableQuantity: 10,
      },
      {
        articleName: 'Chips',
        availableQuantity: 4,
      },
    ]);
  });

  it('throws an InsufficientStockError when one ordered article is missing or insufficient', () => {
    // Arrange
    const reserveStockForOrder = requireReserveStockForOrder();
    const InsufficientStockError = requireInsufficientStockError();
    const orderItems = createOrderItems().slice(0, 1);
    const availableStocks = createInsufficientStocks();

    // Act
    const act = (): TestArticleStock[] => reserveStockForOrder(orderItems, availableStocks);

    // Assert
    expect(act).toThrow(InsufficientStockError);
    expect(availableStocks).toEqual([
      {
        articleName: 'Mojito',
        availableQuantity: 1,
      },
    ]);
  });
});