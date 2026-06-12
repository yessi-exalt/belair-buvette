import { describe, it, expect } from 'vitest';
import { AcknowledgeOrderUseCase } from '../src/use-cases/acknowledge-order.use-case.js';
import { OrderNotFoundError, OrderStatus } from '@belair-buvette-api/domain';

type CatalogArticle = {
  name: string;
  category: string;
};

type OrderForTest = {
  id: string;
  festivalGoerId: string;
  items: Array<{ articleName: string; quantity: number }>;
  status: OrderStatus;
  drinkTokenCost: number;
  foodTokenCost: number;
  estimatedPreparationTime?: number;
};

class FakeOrderRepository {
  async findById(id: string): Promise<OrderForTest> {
    return undefined as any;
  }

  async save(order: OrderForTest): Promise<void> {
    // Not called in this scenario
  }
}

class FakeArticleRepository {
  async findByName(name: string): Promise<CatalogArticle> {
    return { name, category: 'ALCOHOLIC' };
  }
}

class FakeWorkloadRepository {
  async getCurrentWorkload(): Promise<number> {
    return 4;
  }
}

class FakeAcknowledgementNotificationGateway {
  async sendAcknowledgementNotification(notification: {
    festivalGoerId: string;
    estimatedPreparationTime: number;
  }): Promise<void> {
    // Not called in this scenario
  }
}

describe('AcknowledgeOrderUseCase', () => {
  it('fails when the order is not found', async () => {
    // Arrange
    const orderRepository = new FakeOrderRepository();
    const articleRepository = new FakeArticleRepository();
    const workloadRepository = new FakeWorkloadRepository();
    const acknowledgementNotificationGateway =
      new FakeAcknowledgementNotificationGateway();
    const useCase = new AcknowledgeOrderUseCase({
      orderRepository,
      articleRepository,
      workloadRepository,
      acknowledgementNotificationGateway,
    });

    // Act & Assert
    await expect(
      useCase.execute({
        orderId: 'unknown-order-id',
      }),
    ).rejects.toThrow(OrderNotFoundError);
  });
});
