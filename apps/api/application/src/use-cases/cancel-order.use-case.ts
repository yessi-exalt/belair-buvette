import { OrderNotCancellableError, OrderStatus } from '@belair-buvette-api/domain';

type FestivalGoerWithFoodTokens = {
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

type CancelOrderUseCaseDependencies = {
  festivalGoerRepository: {
    findById(id: string): Promise<FestivalGoerWithFoodTokens>;
    save(festivalGoer: FestivalGoerWithFoodTokens): Promise<void>;
  };
  orderRepository: {
    findById(id: string): Promise<OrderWithTokenCosts>;
    save(order: OrderWithTokenCosts): Promise<void>;
  };
  cancellationNotificationGateway: {
    sendCancellationConfirmation(confirmation: {
      festivalGoerId: string;
    }): Promise<void>;
  };
};

export class CancelOrderUseCase {
  public constructor(
    private readonly dependencies: CancelOrderUseCaseDependencies,
  ) {}

  public async execute(command: {
    orderId: string;
    festivalGoerId: string;
  }): Promise<void> {
    const festivalGoer = await this.dependencies.festivalGoerRepository.findById(
      command.festivalGoerId,
    );
    const order = await this.dependencies.orderRepository.findById(command.orderId);

    if (order.status !== OrderStatus.Pending) {
      throw new OrderNotCancellableError();
    }

    await this.dependencies.festivalGoerRepository.save({
      ...festivalGoer,
      drinkTokenBalance: festivalGoer.drinkTokenBalance + order.drinkTokenCost,
      foodTokenBalance: festivalGoer.foodTokenBalance + order.foodTokenCost,
    });
    await this.dependencies.orderRepository.save({
      ...order,
      status: OrderStatus.Cancelled,
    });
    await this.dependencies.cancellationNotificationGateway.sendCancellationConfirmation(
      {
        festivalGoerId: festivalGoer.id,
      },
    );
  }
}