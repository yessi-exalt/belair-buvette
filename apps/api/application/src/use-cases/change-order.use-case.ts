type FestivalGoerWithTokenBalances = {
  id: string;
  drinkTokenBalance: number;
  foodTokenBalance: number;
};

type OrderWithTokenCosts = {
  id: string;
  festivalGoerId: string;
  items: Array<{ articleName: string; quantity: number }>;
  status: string;
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

type ChangeOrderUseCaseDependencies = {
  festivalGoerRepository: {
    findById(id: string): Promise<FestivalGoerWithTokenBalances>;
    save(festivalGoer: FestivalGoerWithTokenBalances): Promise<void>;
  };
  articleRepository: {
    findByName(name: string): Promise<ArticleInCatalog>;
  };
  orderRepository: {
    findById(id: string): Promise<OrderWithTokenCosts>;
    save(order: OrderWithTokenCosts): Promise<void>;
  };
};

export class ChangeOrderUseCase {
  public constructor(
    private readonly dependencies: ChangeOrderUseCaseDependencies,
  ) {}

  public async execute(command: {
    orderId: string;
    festivalGoerId: string;
    itemsToAdd: Array<{ articleName: string; quantity: number }>;
  }): Promise<void> {
    const festivalGoer = await this.dependencies.festivalGoerRepository.findById(
      command.festivalGoerId,
    );
    const order = await this.dependencies.orderRepository.findById(command.orderId);

    // Build updated items and costs
    const updatedItems = [...order.items];
    let newDrinkTokenCost = order.drinkTokenCost;
    let newFoodTokenCost = order.foodTokenCost;

    for (const itemToAdd of command.itemsToAdd) {
      const article = await this.dependencies.articleRepository.findByName(
        itemToAdd.articleName,
      );

      updatedItems.push({ articleName: itemToAdd.articleName, quantity: itemToAdd.quantity });
      newDrinkTokenCost += article.drinkTokenCost * itemToAdd.quantity;
      newFoodTokenCost += (article.tokenCost - article.drinkTokenCost) * itemToAdd.quantity;
    }

    // Persist updated festival goer balances
    await this.dependencies.festivalGoerRepository.save({
      ...festivalGoer,
      drinkTokenBalance: festivalGoer.drinkTokenBalance - newDrinkTokenCost,
      foodTokenBalance: festivalGoer.foodTokenBalance - newFoodTokenCost,
    });

    // Persist updated order
    await this.dependencies.orderRepository.save({
      ...order,
      items: updatedItems,
      drinkTokenCost: newDrinkTokenCost,
      foodTokenCost: newFoodTokenCost,
    });
  }
}
