import { OrderNotCancellableError } from './exceptions.js';
import { OrderStatus, type Order } from './repositories.js';

type FestivalGoerWithFoodTokens = {
  id: string;
  drinkTokenBalance: number;
  foodTokenBalance: number;
};

type OrderTokenCost = {
  drinkTokenCost: number;
  foodTokenCost: number;
};

type CancellationConfirmation = {
  festivalGoerId: string;
};

export function assertOrderIsCancellable(order: Order): void {
  if (order.status !== OrderStatus.Pending) {
    throw new OrderNotCancellableError();
  }
}

export function cancelOrder({
  festivalGoer,
  order,
}: {
  festivalGoer: FestivalGoerWithFoodTokens;
  order: OrderTokenCost;
}): {
  festivalGoer: FestivalGoerWithFoodTokens;
  cancellationConfirmation: CancellationConfirmation;
} {
  return {
    festivalGoer: {
      ...festivalGoer,
      drinkTokenBalance: festivalGoer.drinkTokenBalance + order.drinkTokenCost,
      foodTokenBalance: festivalGoer.foodTokenBalance + order.foodTokenCost,
    },
    cancellationConfirmation: {
      festivalGoerId: festivalGoer.id,
    },
  };
}