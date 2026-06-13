import { InsufficientTokensError } from './exceptions.js';
import { OrderStatus } from './repositories.js';

type OrderItem = { articleName: string; quantity: number };

export type EvaluateOrderChangeInput = {
  orderStatus: OrderStatus;
  currentDrinkTokenCost: number;
  currentFoodTokenCost: number;
  additionalDrinkTokenCost: number;
  additionalFoodTokenCost: number;
  availableDrinkTokenBalance: number;
  availableFoodTokenBalance: number;
  requestedItems: OrderItem[];
};

type BaseOrderChangeEvaluation = {
  requestedItems: OrderItem[];
  revisedDrinkTokenCost: number;
  revisedFoodTokenCost: number;
};

export type OrderChangeEvaluation =
  | (BaseOrderChangeEvaluation & { kind: 'DIRECT_MODIFICATION' })
  | (BaseOrderChangeEvaluation & { kind: 'BARTENDER_REVIEW_REQUIRED' });

export function evaluateOrderChange(
  input: EvaluateOrderChangeInput,
): OrderChangeEvaluation {
  const revisedDrinkTokenCost =
    input.currentDrinkTokenCost + input.additionalDrinkTokenCost;
  const revisedFoodTokenCost =
    input.currentFoodTokenCost + input.additionalFoodTokenCost;

  if (
    revisedDrinkTokenCost > input.availableDrinkTokenBalance ||
    revisedFoodTokenCost > input.availableFoodTokenBalance
  ) {
    throw new InsufficientTokensError();
  }

  const baseResult = {
    requestedItems: [...input.requestedItems],
    revisedDrinkTokenCost,
    revisedFoodTokenCost,
  };

  if (input.orderStatus === OrderStatus.Acknowledged) {
    return {
      kind: 'BARTENDER_REVIEW_REQUIRED',
      ...baseResult,
    };
  }

  return {
    kind: 'DIRECT_MODIFICATION',
    ...baseResult,
  };
}
