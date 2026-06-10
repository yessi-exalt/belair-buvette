import { describe, expect, it } from 'vitest';

import { CancelOrderUseCase } from '../src/index.js';
import { OrderNotCancellableError } from '../../domain/src/exceptions.js';
import { OrderStatus } from '../../domain/src/repositories.js';

type FestivalGoerWithFoodTokens = {
  id: string;
  drinkTokenBalance: number;
  foodTokenBalance: number;
};

type OrderWithTokenCosts = {
  id: string;
  festivalGoerId: string;
  items: Array<{ articleName: string; quantity: number }>;
  status: OrderStatus;
  drinkTokenCost: number;
  foodTokenCost: number;
};

class OrderNotFoundError extends Error {
  public constructor() {
    super('Order not found');
    this.name = 'OrderNotFoundError';
  }
}

class FakeFestivalGoerRepository {
  public savedFestivalGoer: FestivalGoerWithFoodTokens | undefined;

  async findById(id: string): Promise<FestivalGoerWithFoodTokens> {
    return {
      id,
      drinkTokenBalance: 2,
      foodTokenBalance: 1,
    };
  }

  async save(festivalGoer: FestivalGoerWithFoodTokens): Promise<void> {
    this.savedFestivalGoer = festivalGoer;
  }
}

class FakeOrderRepository {
  public savedOrder: OrderWithTokenCosts | undefined;
  public orderStatus = OrderStatus.Pending;
  public shouldReturnMissingOrder = false;

  async findById(id: string): Promise<OrderWithTokenCosts> {
    if (this.shouldReturnMissingOrder) {
      throw new OrderNotFoundError();
    }

    return {
      id,
      festivalGoerId: 'festival-goer-42',
      items: [],
      status: this.orderStatus,
      drinkTokenCost: 3,
      foodTokenCost: 2,
    };
  }

  async save(order: OrderWithTokenCosts): Promise<void> {
    this.savedOrder = order;
  }
}

class FakeCancellationNotificationGateway {
  public sentConfirmation:
    | {
        festivalGoerId: string;
      }
    | undefined;

  async sendCancellationConfirmation(confirmation: {
    festivalGoerId: string;
  }): Promise<void> {
    this.sentConfirmation = confirmation;
  }
}

describe('CancelOrderUseCase', () => {
  it('cancels a pending order, restores the festival goer balances, persists the cancelled order, and sends a cancellation confirmation', async () => {
    // Arrange
    const festivalGoerRepository = new FakeFestivalGoerRepository();
    const orderRepository = new FakeOrderRepository();
    const cancellationNotificationGateway =
      new FakeCancellationNotificationGateway();
    const useCase = new CancelOrderUseCase({
      festivalGoerRepository,
      orderRepository,
      cancellationNotificationGateway,
    });

    // Act
    await useCase.execute({
      orderId: 'order-123',
      festivalGoerId: 'festival-goer-42',
    });

    // Assert
    expect(festivalGoerRepository.savedFestivalGoer).toEqual({
      id: 'festival-goer-42',
      drinkTokenBalance: 5,
      foodTokenBalance: 3,
    });
    expect(orderRepository.savedOrder).toEqual({
      id: 'order-123',
      festivalGoerId: 'festival-goer-42',
      items: [],
      status: OrderStatus.Cancelled,
      drinkTokenCost: 3,
      foodTokenCost: 2,
    });
    expect(cancellationNotificationGateway.sentConfirmation).toEqual({
      festivalGoerId: 'festival-goer-42',
    });
  });

  it('fails with an OrderNotCancellableError when the order is in Acknowledged state and persists no changes', async () => {
    // Arrange
    const festivalGoerRepository = new FakeFestivalGoerRepository();
    const orderRepository = new FakeOrderRepository();
    const cancellationNotificationGateway =
      new FakeCancellationNotificationGateway();
    const useCase = new CancelOrderUseCase({
      festivalGoerRepository,
      orderRepository,
      cancellationNotificationGateway,
    });

    orderRepository.orderStatus = OrderStatus.Ready;

    // Act
    const act = useCase.execute({
      orderId: 'order-123',
      festivalGoerId: 'festival-goer-42',
    });

    // Assert
    await expect(act).rejects.toThrow(OrderNotCancellableError);
    expect(festivalGoerRepository.savedFestivalGoer).toBeUndefined();
    expect(orderRepository.savedOrder).toBeUndefined();
  });

  it('fails with an OrderNotFoundError when the order is not found', async () => {
    // Arrange
    const festivalGoerRepository = new FakeFestivalGoerRepository();
    const orderRepository = new FakeOrderRepository();
    const cancellationNotificationGateway =
      new FakeCancellationNotificationGateway();
    const useCase = new CancelOrderUseCase({
      festivalGoerRepository,
      orderRepository,
      cancellationNotificationGateway,
    });

    orderRepository.shouldReturnMissingOrder = true;

    // Act
    const act = useCase.execute({
      orderId: 'unknown-order-id',
      festivalGoerId: 'festival-goer-42',
    });

    // Assert
    await expect(act).rejects.toMatchObject({
      name: 'OrderNotFoundError',
    });
  });
});