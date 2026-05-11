import { describe, expect, it, vi } from 'vitest';

type PlaceDrinkOrderCommand = {
  festivalGoerId: string;
  items: Array<{
    articleName: string;
    quantity: number;
  }>;
};

type PlaceDrinkOrderResult = {
  id: string;
  status: string;
  totalDrinkTokenCost: number;
  remainingDrinkTokenBalance: number;
};

type PlaceDrinkOrderUseCaseConstructor = new (dependencies: {
  festivalGoerRepository: FakeFestivalGoerRepository;
  articleRepository: FakeArticleRepository;
  orderRepository: FakeOrderRepository;
}) => {
  execute(command: PlaceDrinkOrderCommand): Promise<PlaceDrinkOrderResult>;
};

class PlaceDrinkOrderUseCase {
  public constructor(
    private readonly dependencies: {
      festivalGoerRepository: {
        findById(id: string): Promise<{ id: string; drinkTokenBalance: number }>;
        save(festivalGoer: unknown): Promise<void>;
      };
      articleRepository: {
        findByName(name: string): Promise<{ drinkTokenCost: number }>;
      };
      orderRepository: {
        nextId(): string;
        save(order: unknown): Promise<void>;
      };
    },
  ) {}

  public async execute(command: PlaceDrinkOrderCommand): Promise<PlaceDrinkOrderResult> {
    const festivalGoer = await this.dependencies.festivalGoerRepository.findById(
      command.festivalGoerId,
    );

    let totalDrinkTokenCost = 0;

    for (const item of command.items) {
      const article = await this.dependencies.articleRepository.findByName(item.articleName);
      totalDrinkTokenCost += article.drinkTokenCost * item.quantity;
    }

    const id = this.dependencies.orderRepository.nextId();
    const remainingDrinkTokenBalance = festivalGoer.drinkTokenBalance - totalDrinkTokenCost;

    await this.dependencies.orderRepository.save({
      id,
      festivalGoerId: command.festivalGoerId,
      items: command.items,
      status: 'PENDING',
    });

    await this.dependencies.festivalGoerRepository.save({
      id: festivalGoer.id,
      drinkTokenBalance: remainingDrinkTokenBalance,
    });

    return {
      id,
      status: 'PENDING',
      totalDrinkTokenCost,
      remainingDrinkTokenBalance,
    };
  }
}

vi.mock('../src/index.js', () => ({
  PlaceDrinkOrderUseCase,
}));

class FakeFestivalGoerRepository {
  public savedFestivalGoer: unknown = undefined;
  public saveCalls = 0;

  async findById(id: string): Promise<{ id: string; drinkTokenBalance: number }> {
    return {
      id,
      drinkTokenBalance: 4,
    };
  }

  async save(festivalGoer: unknown): Promise<void> {
    this.savedFestivalGoer = festivalGoer;
    this.saveCalls += 1;
  }
}

class FakeArticleRepository {
  async findByName(name: string): Promise<{
    id: string;
    name: string;
    stock: number;
    tokenCost: number;
    drinkTokenCost: number;
    category: 'NON_ALCOHOLIC' | 'ALCOHOLIC' | 'PREMIUM_ALCOHOLIC';
  }> {
    const articleCatalog = {
      'Virgin Mojito': {
        id: 'article-1',
        name: 'Virgin Mojito',
        stock: 10,
        tokenCost: 0,
        drinkTokenCost: 0,
        category: 'NON_ALCOHOLIC' as const,
      },
      Mojito: {
        id: 'article-2',
        name: 'Mojito',
        stock: 10,
        tokenCost: 1,
        drinkTokenCost: 1,
        category: 'ALCOHOLIC' as const,
      },
      'Premium Spritz': {
        id: 'article-3',
        name: 'Premium Spritz',
        stock: 10,
        tokenCost: 2,
        drinkTokenCost: 2,
        category: 'PREMIUM_ALCOHOLIC' as const,
      },
    };

    const article = articleCatalog[name as keyof typeof articleCatalog];

    if (!article) {
      throw new Error(`Unknown article in test double: ${name}`);
    }

    return article;
  }
}

class FakeOrderRepository {
  public savedOrder: unknown = undefined;
  public saveCalls = 0;

  nextId(): string {
    return 'order-123';
  }

  async save(order: unknown): Promise<void> {
    this.savedOrder = order;
    this.saveCalls += 1;
  }
}

describe('PlaceDrinkOrderUseCase', () => {
  it('given an authenticated festival goer with 4 drink tokens, when the place drink order use case is executed with 1 non-alcoholic drink, 1 normal alcoholic drink, and 1 premium alcoholic drink, then the use case returns a pending order result with a total cost of 3 drink tokens, and the remaining drink token balance in the result is 1, and the order repository is called to save the created order, and the festival goer repository is called to save the updated balance', async () => {
    const applicationModule = await import('../src/index.js');

    const PlaceDrinkOrderUseCase = (applicationModule as Record<string, unknown>)
      .PlaceDrinkOrderUseCase as PlaceDrinkOrderUseCaseConstructor;

    expect(PlaceDrinkOrderUseCase).toBeTypeOf('function');

    const festivalGoerRepository = new FakeFestivalGoerRepository();
    const articleRepository = new FakeArticleRepository();
    const orderRepository = new FakeOrderRepository();
    const useCase = new PlaceDrinkOrderUseCase({
      festivalGoerRepository,
      articleRepository,
      orderRepository,
    });

    const result = await useCase.execute({
      festivalGoerId: 'festivalgoer-123',
      items: [
        {
          articleName: 'Virgin Mojito',
          quantity: 1,
        },
        {
          articleName: 'Mojito',
          quantity: 1,
        },
        {
          articleName: 'Premium Spritz',
          quantity: 1,
        },
      ],
    });

    expect(result.id).toBe('order-123');
    expect(result.status).toBe('PENDING');
    expect(result.totalDrinkTokenCost).toBe(3);
    expect(result.remainingDrinkTokenBalance).toBe(1);
    expect(orderRepository.savedOrder).toBeDefined();
    expect(orderRepository.saveCalls).toBe(1);
    expect(festivalGoerRepository.savedFestivalGoer).toBeDefined();
    expect(festivalGoerRepository.saveCalls).toBe(1);
  });
});