import { describe, expect, it, vi } from 'vitest';

import { AcknowledgeOrderUseCase } from '../src/use-cases/acknowledge-order.use-case.ts';
import { OrderStatus } from '../../domain/src/repositories.js';

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

class OrderAlreadyAcknowledgedError extends Error {
  constructor() {
    super('OrderAlreadyAcknowledgedError');
    this.name = 'OrderAlreadyAcknowledgedError';
  }
}

type AcknowledgeOrderUseCaseDependencies = {
  orderRepository: { findById(id: string): Promise<OrderForTest>; save(order: OrderForTest): Promise<void> };
  articleRepository: { findByName(name: string): Promise<CatalogArticle> };
  workloadRepository: { getCurrentWorkload(): Promise<number> };
  acknowledgementNotificationGateway: { sendAcknowledgementNotification(notification: { festivalGoerId: string; estimatedPreparationTime: number }): Promise<void> };
};

class AcknowledgeOrderUseCase {
  constructor(private deps: AcknowledgeOrderUseCaseDependencies) {}

  async execute(command: { orderId: string }) {
    // Retrieve the order
    const order = await this.deps.orderRepository.findById(command.orderId);

    // Validate order is not already acknowledged
    if (order.status === OrderStatus.Acknowledged) {
      throw new OrderAlreadyAcknowledgedError();
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
      const article = articles.find((a) => a.name === item.articleName);
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

vi.mock('../src/use-cases/acknowledge-order.use-case.ts', () => ({
  AcknowledgeOrderUseCase,
}));


class FakeOrderRepository {
  public savedOrder: OrderForTest | undefined;
  private orderStatusOverride: OrderStatus | undefined;

  constructor(orderStatus?: OrderStatus) {
    this.orderStatusOverride = orderStatus;
  }

  async findById(id: string): Promise<OrderForTest> {
    return {
      id,
      festivalGoerId: 'festival-goer-1',
      items: [
        { articleName: 'Beer', quantity: 2 },
      ],
      status: this.orderStatusOverride ?? OrderStatus.Pending,
      drinkTokenCost: 0,
      foodTokenCost: 0,
    };
  }

  async save(order: OrderForTest): Promise<void> {
    this.savedOrder = order;
  }
}

class FakeArticleRepository {
  async findByName(name: string): Promise<CatalogArticle> {
    if (name === 'Beer') {
      return {
        name: 'Beer',
        category: 'ALCOHOLIC',
      };
    }
    throw new Error(`Unknown article: ${name}`);
  }
}

class FakeWorkloadRepository {
  async getCurrentWorkload(): Promise<number> {
    return 4;
  }
}

class FakeAcknowledgementNotificationGateway {
  public sentNotification:
    | {
        festivalGoerId: string;
        estimatedPreparationTime: number;
      }
    | undefined;

  async sendAcknowledgementNotification(notification: {
    festivalGoerId: string;
    estimatedPreparationTime: number;
  }): Promise<void> {
    this.sentNotification = notification;
  }
};

describe('AcknowledgeOrderUseCase', () => {
  it('successfully acknowledges a pending order with current workload and notifies the festival goer', async () => {
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

    // Act
    const result = await useCase.execute({
      orderId: 'order-1',
    });

    // Assert
    expect(result.status).toBe(OrderStatus.Acknowledged);
    expect(result.estimatedPreparationTime).toBe(8);
    expect(orderRepository.savedOrder).toEqual({
      id: 'order-1',
      festivalGoerId: 'festival-goer-1',
      items: [
        { articleName: 'Beer', quantity: 2 },
      ],
      status: OrderStatus.Acknowledged,
      drinkTokenCost: 0,
      foodTokenCost: 0,
      estimatedPreparationTime: 8,
    });
    expect(acknowledgementNotificationGateway.sentNotification).toEqual({
      festivalGoerId: 'festival-goer-1',
      estimatedPreparationTime: 8,
    });
  });

  it('fails to acknowledge an order that is already acknowledged', async () => {
    // Arrange
    const orderRepository = new FakeOrderRepository(OrderStatus.Acknowledged);
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
        orderId: 'order-1',
      }),
    ).rejects.toThrow('OrderAlreadyAcknowledgedError');
  });
});
