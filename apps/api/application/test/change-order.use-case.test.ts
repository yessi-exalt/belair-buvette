import { describe, expect, it } from 'vitest';

import { OrderStatus } from '../../domain/src/repositories.js';

type FestivalGoerWithTokenBalances = {
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

type ArticleInCatalog = {
  id: string;
  name: string;
  stock: number;
  tokenCost: number;
  drinkTokenCost: number;
  category: 'ALCOHOLIC';
};
import { ChangeOrderUseCase } from '../src/index.js';

class FakeFestivalGoerRepository {
  public savedFestivalGoer: FestivalGoerWithTokenBalances | undefined;

  async findById(id: string): Promise<FestivalGoerWithTokenBalances> {
    return {
      id,
      drinkTokenBalance: 4,
      foodTokenBalance: 4,
    };
  }

  async save(festivalGoer: FestivalGoerWithTokenBalances): Promise<void> {
    this.savedFestivalGoer = festivalGoer;
  }
}

class FakeArticleRepository {
  async findByName(name: string): Promise<ArticleInCatalog> {
    if (name === 'Mojito') {
      return {
        id: 'article-mojito',
        name: 'Mojito',
        stock: 10,
        tokenCost: 1,
        drinkTokenCost: 1,
        category: 'ALCOHOLIC',
      };
    }

    if (name === 'Premium Drink') {
      return {
        id: 'article-premium-drink',
        name: 'Premium Drink',
        stock: 5,
        tokenCost: 2,
        drinkTokenCost: 2,
        category: 'ALCOHOLIC',
      };
    }

    if (name === 'Meal') {
      return {
        id: 'article-meal',
        name: 'Meal',
        stock: 5,
        tokenCost: 1,
        drinkTokenCost: 0,
        category: 'ALCOHOLIC',
      };
    }

    throw new Error(`Unknown article in test double: ${name}`);
  }
}

class FakeOrderRepository {
  public savedOrder: OrderWithTokenCosts | undefined;
  private orderStatus: OrderStatus;

  constructor(orderStatus: OrderStatus = OrderStatus.Pending) {
    this.orderStatus = orderStatus;
  }

  async findById(id: string): Promise<OrderWithTokenCosts> {
    return {
      id,
      festivalGoerId: 'festival-goer-42',
      items: [{ articleName: 'Mojito', quantity: 1 }],
      status: this.orderStatus,
      drinkTokenCost: 1,
      foodTokenCost: 0,
    };
  }

  async save(order: OrderWithTokenCosts): Promise<void> {
    this.savedOrder = order;
  }
}

class FakeChangeRequestRepository {
  public savedChangeRequest:
    | {
        orderId: string;
        festivalGoerId: string;
        requestedChanges: Array<{ articleName: string; quantity: number }>;
      }
    | undefined;

  async save(changeRequest: {
    orderId: string;
    festivalGoerId: string;
    requestedChanges: Array<{ articleName: string; quantity: number }>;
  }): Promise<void> {
    this.savedChangeRequest = changeRequest;
  }
}

class FakeBartenderNotificationGateway {
  public sentNotification:
    | {
        orderId: string;
        requestedChanges: Array<{ articleName: string; quantity: number }>;
      }
    | undefined;

  async notifyRequestedChanges(notification: {
    orderId: string;
    requestedChanges: Array<{ articleName: string; quantity: number }>;
  }): Promise<void> {
    this.sentNotification = notification;
  }
}

describe('ChangeOrderUseCase', () => {
  it('successfully modifies a Pending order by adding 1 normal drink and updates the festival goer balances', async () => {
    // Arrange
    const festivalGoerRepository = new FakeFestivalGoerRepository();
    const articleRepository = new FakeArticleRepository();
    const orderRepository = new FakeOrderRepository();
    const useCase = new ChangeOrderUseCase({
      festivalGoerRepository,
      articleRepository,
      orderRepository,
    });

    // Act
    await useCase.execute({
      orderId: 'order-123',
      festivalGoerId: 'festival-goer-42',
      itemsToAdd: [
        {
          articleName: 'Mojito',
          quantity: 1,
        },
      ],
    });

    // Assert
    expect(orderRepository.savedOrder).toEqual({
      id: 'order-123',
      festivalGoerId: 'festival-goer-42',
      items: [
        { articleName: 'Mojito', quantity: 1 },
        { articleName: 'Mojito', quantity: 1 },
      ],
      status: OrderStatus.Pending,
      drinkTokenCost: 2,
      foodTokenCost: 0,
    });
    expect(festivalGoerRepository.savedFestivalGoer).toEqual({
      id: 'festival-goer-42',
      drinkTokenBalance: 2,
      foodTokenBalance: 4,
    });
  });

  it('persists a bartender review request and notifies the bartender when the order is acknowledged', async () => {
    // Arrange
    const festivalGoerRepository = new FakeFestivalGoerRepository();
    const articleRepository = new FakeArticleRepository();
    const orderRepository = new FakeOrderRepository(OrderStatus.Acknowledged);
    const changeRequestRepository = new FakeChangeRequestRepository();
    const bartenderNotificationGateway = new FakeBartenderNotificationGateway();
    const useCase = new ChangeOrderUseCase({
      festivalGoerRepository,
      articleRepository,
      orderRepository,
      changeRequestRepository,
      bartenderNotificationGateway,
    });

    // Act
    await useCase.execute({
      orderId: 'order-123',
      festivalGoerId: 'festival-goer-42',
      itemsToAdd: [
        {
          articleName: 'Mojito',
          quantity: 1,
        },
      ],
    });

    // Assert
    expect(changeRequestRepository.savedChangeRequest).toEqual({
      orderId: 'order-123',
      festivalGoerId: 'festival-goer-42',
      requestedChanges: [{ articleName: 'Mojito', quantity: 1 }],
    });
    expect(bartenderNotificationGateway.sentNotification).toEqual({
      orderId: 'order-123',
      requestedChanges: [{ articleName: 'Mojito', quantity: 1 }],
    });
    expect(orderRepository.savedOrder).toBeUndefined();
    expect(festivalGoerRepository.savedFestivalGoer).toBeUndefined();
  });

  it('fails with an InsufficientTokensError when the revised Pending order exceeds the available balance and preserves the original order', async () => {
    // Arrange
    const festivalGoerRepository = new FakeFestivalGoerRepository();
    const articleRepository = new FakeArticleRepository();

    class FakePendingOrderRepository extends FakeOrderRepository {
      async findById(id: string): Promise<OrderWithTokenCosts> {
        return {
          id,
          festivalGoerId: 'festival-goer-42',
          items: [
            { articleName: 'Mojito', quantity: 1 },
            { articleName: 'Meal', quantity: 1 },
          ],
          status: OrderStatus.Pending,
          drinkTokenCost: 1,
          foodTokenCost: 1,
        };
      }
    }

    const orderRepository = new FakePendingOrderRepository();
    const useCase = new ChangeOrderUseCase({
      festivalGoerRepository,
      articleRepository,
      orderRepository,
    });

    // Act
    const act = useCase.execute({
      orderId: 'order-123',
      festivalGoerId: 'festival-goer-42',
      itemsToAdd: [
        { articleName: 'Premium Drink', quantity: 1 },
        { articleName: 'Meal', quantity: 1 },
      ],
    });

    // Assert
    await expect(act).rejects.toMatchObject({
      name: 'InsufficientTokensError',
    });
    expect(orderRepository.savedOrder).toBeUndefined();
    expect(festivalGoerRepository.savedFestivalGoer).toBeUndefined();
  });
});
