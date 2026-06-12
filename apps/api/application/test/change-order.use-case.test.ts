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
    if (name !== 'Mojito') {
      throw new Error(`Unknown article in test double: ${name}`);
    }

    return {
      id: 'article-mojito',
      name: 'Mojito',
      stock: 10,
      tokenCost: 1,
      drinkTokenCost: 1,
      category: 'ALCOHOLIC',
    };
  }
}

class FakeOrderRepository {
  public savedOrder: OrderWithTokenCosts | undefined;

  async findById(id: string): Promise<OrderWithTokenCosts> {
    return {
      id,
      festivalGoerId: 'festival-goer-42',
      items: [{ articleName: 'Mojito', quantity: 1 }],
      status: OrderStatus.Pending,
      drinkTokenCost: 1,
      foodTokenCost: 0,
    };
  }

  async save(order: OrderWithTokenCosts): Promise<void> {
    this.savedOrder = order;
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
});
