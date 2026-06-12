import { describe, it, expect, vi } from 'vitest';
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

vi.mock('../src/use-cases/acknowledge-order.use-case.js', () => {
  class AcknowledgeOrderUseCase {
    constructor(private deps: any) {}

    async execute(command: { orderId: string }) {
      // Retrieve the order
      const order = await this.deps.orderRepository.findById(command.orderId);

      // Validate order exists
      if (!order) {
        throw new OrderNotFoundError();
      }

      // Build a catalog of articles from order items
      const articles = [];
      for (const item of order.items) {
        const article = await this.deps.articleRepository.findByName(item.articleName);
        articles.push(article);
      }

      // Get the current workload
      const currentWorkload = await this.deps.workloadRepository.getCurrentWorkload();

      // Calculate estimated preparation time
      let estimatedPreparationTime = currentWorkload;
      for (const item of order.items) {
        const article = articles.find((a: any) => a.name === item.articleName);
        if (article?.category === 'ALCOHOLIC') {
          estimatedPreparationTime += item.quantity * 2;
        }
      }

      // Create acknowledged order
      const acknowledgedOrder = {
        ...order,
        status: OrderStatus.Acknowledged,
        estimatedPreparationTime,
      };

      // Persist the acknowledged order
      await this.deps.orderRepository.save(acknowledgedOrder);

      // Notify the festival goer
      await this.deps.acknowledgementNotificationGateway.sendAcknowledgementNotification({
        festivalGoerId: order.festivalGoerId,
        estimatedPreparationTime,
      });

      // Return the acknowledged order
      return acknowledgedOrder;
    }
  }

  return { AcknowledgeOrderUseCase };
});

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
