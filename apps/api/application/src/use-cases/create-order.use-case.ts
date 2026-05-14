export type CreateOrderCommand = {
  festivalGoerId: string;
  articles: Array<{
    id: string;
    quantity: number;
  }>;
};

export type CreateOrderResult = {
  orderId: string;
};

type SavedOrder = {
  id: string;
  festivalGoerId: string;
  articles: CreateOrderCommand['articles'];
  status: string;
};

type CreateOrderUseCaseDependencies = {
  orderRepository: {
    nextId(): string;
    save(order: SavedOrder): Promise<void>;
  };
};

export class CreateOrderUseCase {
  public constructor(
    private readonly dependencies: CreateOrderUseCaseDependencies,
  ) {}

  public async execute(command: CreateOrderCommand): Promise<CreateOrderResult> {
    const orderId = this.dependencies.orderRepository.nextId();

    await this.dependencies.orderRepository.save({
      id: orderId,
      festivalGoerId: command.festivalGoerId,
      articles: command.articles,
      status: 'PENDING',
    });

    return { orderId };
  }
}