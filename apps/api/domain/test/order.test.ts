import { describe, expect, it } from 'vitest';
import { canCancelOrder } from '../src/cancel-order.js';
import { OrderStatus, type Order } from '../src/repositories.js';

describe('canCancelOrder', () => {
  it('allows cancellation when the order is in Pending state', () => {
    // Arrange
    const order: Order = {
      id: 'order-1',
      festivalGoerId: 'goer-1',
      items: [],
      status: OrderStatus.Pending,
    };

    // Act
    const result = canCancelOrder(order);

    // Assert
    expect(result).toBe(true);
  });
});
