import { CancelOrderUseCase } from '@belair-buvette-api/application';
import { type OrderStatus } from '@belair-buvette-api/domain';

type CancelOrderCommand = {
  orderId: string;
  festivalGoerId: string;
};

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

type CancellationNotificationGateway = {
  sendCancellationConfirmation(confirmation: {
    festivalGoerId: string;
  }): Promise<void>;
};

type FestivalGoerRepositoryWithFoodTokens = {
  findById(id: string): Promise<FestivalGoerWithFoodTokens>;
  save(festivalGoer: FestivalGoerWithFoodTokens): Promise<void>;
};

type OrderRepositoryWithTokenCosts = {
  findById(id: string): Promise<OrderWithTokenCosts>;
  save(order: OrderWithTokenCosts): Promise<void>;
};

export function buildCancelOrderUseCase(
  festivalGoerRepository: FestivalGoerRepositoryWithFoodTokens,
  orderRepository: OrderRepositoryWithTokenCosts,
  cancellationNotificationGateway: CancellationNotificationGateway,
): CancelOrderUseCase {
  return new CancelOrderUseCase({
    festivalGoerRepository,
    orderRepository,
    cancellationNotificationGateway,
  });
}