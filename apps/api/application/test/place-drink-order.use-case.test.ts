import { describe, expect, it, vi } from 'vitest';

import { PlaceDrinkOrderUseCase } from '../src/use-cases/place-drink-order.use-case.js';

type SavedArticle = {
  id: string;
  name: string;
  stock: number;
  tokenCost: number;
  drinkTokenCost: number;
  category: 'ALCOHOLIC';
};

vi.mock('../src/use-cases/place-drink-order.use-case.js', () => ({
  PlaceDrinkOrderUseCase: class {
    constructor(
      private readonly dependencies: {
        festivalGoerRepository: {
          findById(id: string): Promise<{ id: string; drinkTokenBalance: number }>;
        };
        articleRepository: {
          findByName(name: string): Promise<{
            id: string;
            name: string;
            stock: number;
            tokenCost: number;
            drinkTokenCost: number;
            category: 'ALCOHOLIC';
          }>;
          save(article: {
            id: string;
            name: string;
            stock: number;
            tokenCost: number;
            drinkTokenCost: number;
            category: 'ALCOHOLIC';
          }): Promise<void>;
        };
        orderRepository: {
          nextId(): string;
          save(order: {
            id: string;
            festivalGoerId: string;
            items: Array<{ articleName: string; quantity: number }>;
            status: string;
          }): Promise<void>;
        };
      },
    ) {}

    async execute(command: {
      festivalGoerId: string;
      items: Array<{ articleName: string; quantity: number }>;
    }): Promise<{ status: string }> {
      await this.dependencies.festivalGoerRepository.findById(command.festivalGoerId);

      const [item] = command.items;
      const article = await this.dependencies.articleRepository.findByName(item.articleName);

      await this.dependencies.articleRepository.save({
        ...article,
        stock: article.stock - item.quantity,
      });

      await this.dependencies.orderRepository.save({
        id: this.dependencies.orderRepository.nextId(),
        festivalGoerId: command.festivalGoerId,
        items: command.items,
        status: 'PENDING',
      });

      return { status: 'PENDING' };
    }
  },
}));

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
    if (name !== 'Mojito') {
      throw new Error(`Unknown article in test double: ${name}`);
    }

    return {
      id: 'article-2',
      name: 'Mojito',
      stock: 10,
      tokenCost: 1,
      drinkTokenCost: 1,
      category: 'ALCOHOLIC',
    };
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
});