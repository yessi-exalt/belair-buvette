import { describe, expect, it } from 'vitest';

import { assertOrderIsCancellable } from '../src/cancel-order.js';
import { OrderNotCancellableError } from '../src/exceptions.js';
import { OrderStatus, type Order } from '../src/repositories.js';

describe('assertOrderIsCancellable', () => {
  it('does not throw when the order is in Pending state', () => {
    // Arrange
    const order: Order = {
      id: 'order-1',
      festivalGoerId: 'goer-1',
      items: [],
      status: OrderStatus.Pending,
    };

    // Act & Assert
    expect(() => assertOrderIsCancellable(order)).not.toThrow();
  });

  it('rejects cancellation of an Acknowledged order with OrderNotCancellableError', () => {
    // Arrange
    const order: Order = {
      id: 'order-1',
      festivalGoerId: 'goer-1',
      items: [],
      status: OrderStatus.Ready,
    };

    // Act & Assert
    expect(() => assertOrderIsCancellable(order)).toThrow(OrderNotCancellableError);
  });
});
