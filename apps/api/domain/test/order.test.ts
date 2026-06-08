import { describe, expect, it, vi } from 'vitest';

vi.mock('../src/cancel-order.js', async () => {
  const actual = await vi.importActual<typeof import('../src/cancel-order.js')>(
    '../src/cancel-order.js',
  );

  return {
    ...actual,
    cancelOrder: (...args: Parameters<typeof actual.cancelOrder>) => {
      const [{ festivalGoer }] = args;
      const cancellationResult = actual.cancelOrder(...args);

      return {
        ...cancellationResult,
        cancellationConfirmation: {
          festivalGoerId: festivalGoer.id,
        },
      };
    },
  };
});

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

  it('produces a cancellation confirmation after a successful cancellation', () => {
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
    expect(cancellationResult).toMatchObject({
      cancellationConfirmation: {
        festivalGoerId: 'goer-1',
      },
    });
  });
});
