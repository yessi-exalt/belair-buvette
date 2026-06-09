import { cancelOrder } from '../../../domain/src/cancel-order.js';
import type {
  FestivalGoerRepository,
  OrderRepository,
} from '@belair-buvette-api/domain';

type CancelOrderCommand = {
  orderId: string;
  festivalGoerId: string;
};

type FestivalGoerWithFoodTokens = {
  id: string;
  drinkTokenBalance: number;
  foodTokenBalance: number;
};

type CancelledOrderWithTokenCosts = {
  drinkTokenCost: number;
  foodTokenCost: number;
};

type CancellationNotificationGateway = {
  sendCancellationConfirmation(confirmation: {
    festivalGoerId: string;
  }): Promise<void>;
};

type CancelOrderUseCase = {
  execute(command: CancelOrderCommand): Promise<void>;
};

export function buildCancelOrderUseCase(
  festivalGoerRepository: FestivalGoerRepository,
  orderRepository: OrderRepository,
  cancellationNotificationGateway: CancellationNotificationGateway,
): CancelOrderUseCase {
  return {
    async execute(command: CancelOrderCommand): Promise<void> {
      const festivalGoer =
        (await festivalGoerRepository.findById(command.festivalGoerId)) as FestivalGoerWithFoodTokens;
      const order = (await orderRepository.findById(
        command.orderId,
      )) as CancelledOrderWithTokenCosts;

      const cancellationResult = cancelOrder({
        festivalGoer,
        order,
      });

      await festivalGoerRepository.save(cancellationResult.festivalGoer);
      await cancellationNotificationGateway.sendCancellationConfirmation(
        cancellationResult.cancellationConfirmation,
      );
    },
  };
}