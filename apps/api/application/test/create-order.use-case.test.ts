import { describe, expect, it } from 'vitest';

type CreateOrderCommand = {
  festivalGoerId: string;
  articles: Array<{
    id: string;
    quantity: number;
  }>;
};

type CreateOrderResult = {
  orderId: string;
};

type CreateOrderUseCaseConstructor = new (dependencies: {
  orderRepository: FakeOrderRepository;
}) => {
  execute(command: CreateOrderCommand): Promise<CreateOrderResult>;
};

class FakeOrderRepository {
  public savedOrder:
    | {
        id: string;
        festivalGoerId: string;
        articles: Array<{ id: string; quantity: number }>;
        status: string;
      }
    | undefined;

  public nextId(): string {
    return 'order-123';
  }

  public async save(order: {
    id: string;
    festivalGoerId: string;
    articles: Array<{ id: string; quantity: number }>;
    status: string;
  }): Promise<void> {
    this.savedOrder = order;
  }
}

describe('CreateOrderUseCase', () => {
  it('creates a pending order and returns its identifier', async () => {
    const applicationModule = await import('../src/index.js');

    const CreateOrderUseCase = (applicationModule as Record<string, unknown>)
      .CreateOrderUseCase as CreateOrderUseCaseConstructor;

    expect(CreateOrderUseCase).toBeTypeOf('function');

    const orderRepository = new FakeOrderRepository();
    const useCase = new CreateOrderUseCase({
      orderRepository,
    });

    const result = await useCase.execute({
      festivalGoerId: 'festival-goer-42',
      articles: [{ id: 'mojito', quantity: 2 }],
    });

    expect(result.orderId).toBe('order-123');
    expect(orderRepository.savedOrder).toEqual({
      id: 'order-123',
      festivalGoerId: 'festival-goer-42',
      articles: [{ id: 'mojito', quantity: 2 }],
      status: 'PENDING',
    });
  });
});