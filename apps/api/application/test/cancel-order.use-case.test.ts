import { describe, expect, it } from 'vitest';

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

type CancelOrderUseCaseDependencies = {
  festivalGoerRepository: {
    findById(id: string): Promise<FestivalGoerWithFoodTokens>;
    save(festivalGoer: FestivalGoerWithFoodTokens): Promise<void>;
  };
  orderRepository: {
    findById(id: string): Promise<OrderWithTokenCosts>;
    save(order: OrderWithTokenCosts): Promise<void>;
  };
  cancellationNotificationGateway: {
    sendCancellationConfirmation(confirmation: {
      festivalGoerId: string;
    }): Promise<void>;
  };
};

class CancelOrderUseCase {
  public constructor(
    private readonly dependencies: CancelOrderUseCaseDependencies,
  ) {}

  async execute(command: {
    orderId: string;
    festivalGoerId: string;
  }): Promise<void> {
    const festivalGoer = await this.dependencies.festivalGoerRepository.findById(
      command.festivalGoerId,
    );
    const order = await this.dependencies.orderRepository.findById(command.orderId);

    await this.dependencies.festivalGoerRepository.save({
      ...festivalGoer,
      drinkTokenBalance: festivalGoer.drinkTokenBalance + order.drinkTokenCost,
      foodTokenBalance: festivalGoer.foodTokenBalance + order.foodTokenCost,
    });
    await this.dependencies.orderRepository.save({
      ...order,
      status: OrderStatus.Cancelled,
    });
    await this.dependencies.cancellationNotificationGateway.sendCancellationConfirmation(
      {
        festivalGoerId: festivalGoer.id,
      },
    );
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

  async findById(id: string): Promise<OrderWithTokenCosts> {
    return {
      id,
      festivalGoerId: 'festival-goer-42',
      items: [],
      status: OrderStatus.Pending,
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
});