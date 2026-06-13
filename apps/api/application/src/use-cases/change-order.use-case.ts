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

export class InsufficientTokensError extends Error {
  constructor() {
    super('Insufficient tokens for the requested order change');
    this.name = 'InsufficientTokensError';
  }
}

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
  changeRequestRepository?: {
    save(changeRequest: {
      orderId: string;
      festivalGoerId: string;
      requestedChanges: Array<{ articleName: string; quantity: number }>;
    }): Promise<void>;
  };
  bartenderNotificationGateway?: {
    notifyRequestedChanges(notification: {
      orderId: string;
      requestedChanges: Array<{ articleName: string; quantity: number }>;
    }): Promise<void>;
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

    if (order.status === 'ACKNOWLEDGED') {
      const changeRequest = {
        orderId: command.orderId,
        festivalGoerId: command.festivalGoerId,
        requestedChanges: [...command.itemsToAdd],
      };

      await this.dependencies.changeRequestRepository?.save(changeRequest);
      await this.dependencies.bartenderNotificationGateway?.notifyRequestedChanges({
        orderId: command.orderId,
        requestedChanges: [...command.itemsToAdd],
      });

      return;
    }

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

    const remainingDrinkTokenBalance = festivalGoer.drinkTokenBalance - newDrinkTokenCost;
    const remainingFoodTokenBalance = festivalGoer.foodTokenBalance - newFoodTokenCost;

    if (remainingDrinkTokenBalance < 0 || remainingFoodTokenBalance < 0) {
      throw new InsufficientTokensError();
    }

    // Persist updated festival goer balances
    await this.dependencies.festivalGoerRepository.save({
      ...festivalGoer,
      drinkTokenBalance: remainingDrinkTokenBalance,
      foodTokenBalance: remainingFoodTokenBalance,
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
