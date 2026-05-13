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

type PlaceDrinkOrderDependencies = {
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
};

export class PlaceDrinkOrderUseCase {
  public constructor(private readonly dependencies: PlaceDrinkOrderDependencies) {}

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