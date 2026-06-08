import { describe, expect, it } from 'vitest';

import { assertOrderIsCancellable, cancelOrder } from '../src/cancel-order.js';
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

  it('refunds the full drink and food token cost upon cancellation', () => {
    // Arrange
    const festivalGoer = {
      id: 'goer-1',
      drinkTokenBalance: 2,
      foodTokenBalance: 1,
    };
    const order = {
      id: 'order-1',
      festivalGoerId: 'goer-1',
      items: [],
      status: OrderStatus.Pending,
      drinkTokenCost: 3,
      foodTokenCost: 2,
    };

    // Act
    const cancellationResult = cancelOrder({ festivalGoer, order });

    // Assert
    expect(cancellationResult.festivalGoer).toEqual({
      id: 'goer-1',
      drinkTokenBalance: 5,
      foodTokenBalance: 3,
    });
  });
});
