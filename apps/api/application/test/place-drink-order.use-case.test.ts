import { describe, expect, it } from 'vitest';

import { PlaceDrinkOrderUseCase } from '../src/use-cases/place-drink-order.use-case.js';

type SavedArticle = {
  id: string;
  name: string;
  stock: number;
  tokenCost: number;
  drinkTokenCost: number;
  category: 'ALCOHOLIC';
};

class FakeFestivalGoerRepository {
  async findById(id: string): Promise<{ id: string; drinkTokenBalance: number }> {
    return {
      id,
      drinkTokenBalance: 10,
    };
  }

  async save(): Promise<void> {}
}

class FakeArticleRepository {
  public savedArticle: SavedArticle | undefined;

  async findByName(name: string): Promise<SavedArticle> {
    if (name === 'Mojito') {
      return {
        id: 'article-2',
        name: 'Mojito',
        stock: 10,
        tokenCost: 1,
        drinkTokenCost: 1,
        category: 'ALCOHOLIC',
      };
    }

    if (name === 'Bière Pale Ale') {
      return {
        id: 'article-3',
        name: 'Bière Pale Ale',
        stock: 10,
        tokenCost: 1,
        drinkTokenCost: 1,
        category: 'ALCOHOLIC',
      };
    }

    throw new Error(`Unknown article in test double: ${name}`);
  }

  async save(article: SavedArticle): Promise<void> {
    this.savedArticle = article;
  }
}

class FakeOrderRepository {
  public savedOrder:
    | {
        id: string;
        festivalGoerId: string;
        items: Array<{ articleName: string; quantity: number }>;
        status: string;
      }
    | undefined;

  nextId(): string {
    return 'order-123';
  }

  async save(order: {
    id: string;
    festivalGoerId: string;
    items: Array<{ articleName: string; quantity: number }>;
    status: string;
  }): Promise<void> {
    this.savedOrder = order;
  }
}

describe('PlaceDrinkOrderUseCase', () => {
  it('creates a pending order and decrements the Mojito stock by 2 when 10 Mojito are available', async () => {
    // Arrange
    const festivalGoerRepository = new FakeFestivalGoerRepository();
    const articleRepository = new FakeArticleRepository();
    const orderRepository = new FakeOrderRepository();
    const useCase = new PlaceDrinkOrderUseCase({
      festivalGoerRepository,
      articleRepository,
      orderRepository,
    });

    // Act
    const result = await useCase.execute({
      festivalGoerId: 'festival-goer-1',
      items: [
        {
          articleName: 'Mojito',
          quantity: 2,
        },
      ],
    });

    // Assert
    expect(result.status).toBe('PENDING');
    expect(orderRepository.savedOrder).toEqual({
      id: 'order-123',
      festivalGoerId: 'festival-goer-1',
      items: [{ articleName: 'Mojito', quantity: 2 }],
      status: 'PENDING',
    });
    expect(articleRepository.savedArticle).toEqual({
      id: 'article-2',
      name: 'Mojito',
      stock: 8,
      tokenCost: 1,
      drinkTokenCost: 1,
      category: 'ALCOHOLIC',
    });
  });

  it('creates a pending order and decrements the Bière Pale Ale stock by 2 when 10 units are available', async () => {
    // Arrange
    const festivalGoerRepository = new FakeFestivalGoerRepository();
    const articleRepository = new FakeArticleRepository();
    const orderRepository = new FakeOrderRepository();
    const useCase = new PlaceDrinkOrderUseCase({
      festivalGoerRepository,
      articleRepository,
      orderRepository,
    });

    // Act
    const result = await useCase.execute({
      festivalGoerId: 'festival-goer-1',
      items: [
        {
          articleName: 'Bière Pale Ale',
          quantity: 2,
        },
      ],
    });

    // Assert
    expect(result.status).toBe('PENDING');
    expect(orderRepository.savedOrder).toEqual({
      id: 'order-123',
      festivalGoerId: 'festival-goer-1',
      items: [{ articleName: 'Bière Pale Ale', quantity: 2 }],
      status: 'PENDING',
    });
    expect(articleRepository.savedArticle).toEqual({
      id: 'article-3',
      name: 'Bière Pale Ale',
      stock: 8,
      tokenCost: 1,
      drinkTokenCost: 1,
      category: 'ALCOHOLIC',
    });
  });
});