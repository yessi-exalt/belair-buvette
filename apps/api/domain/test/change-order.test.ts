import { describe, expect, it } from 'vitest';

import {
  evaluateOrderChange,
  InsufficientTokensError,
  OrderStatus,
} from '../src/index.js';

describe('evaluateOrderChange', () => {
  it('allows direct modification of a Pending order', () => {
    // Arrange
    const input = {
      orderStatus: OrderStatus.Pending,
      currentDrinkTokenCost: 1,
      currentFoodTokenCost: 1,
      additionalDrinkTokenCost: 1,
      additionalFoodTokenCost: 0,
      availableDrinkTokenBalance: 3,
      availableFoodTokenBalance: 2,
      requestedItems: [{ articleName: 'Mojito', quantity: 1 }],
    };

    // Act
    const evaluation = evaluateOrderChange(input);

    // Assert
    expect(evaluation).toEqual({
      kind: 'DIRECT_MODIFICATION',
      requestedItems: [{ articleName: 'Mojito', quantity: 1 }],
      revisedDrinkTokenCost: 2,
      revisedFoodTokenCost: 1,
    });
  });

  it('requires bartender review for an Acknowledged order', () => {
    // Arrange
    const input = {
      orderStatus: OrderStatus.Acknowledged,
      currentDrinkTokenCost: 1,
      currentFoodTokenCost: 1,
      additionalDrinkTokenCost: 1,
      additionalFoodTokenCost: 0,
      availableDrinkTokenBalance: 3,
      availableFoodTokenBalance: 2,
      requestedItems: [{ articleName: 'Mojito', quantity: 1 }],
    };

    // Act
    const evaluation = evaluateOrderChange(input);

    // Assert
    expect(evaluation).toEqual({
      kind: 'BARTENDER_REVIEW_REQUIRED',
      requestedItems: [{ articleName: 'Mojito', quantity: 1 }],
      revisedDrinkTokenCost: 2,
      revisedFoodTokenCost: 1,
    });
  });

  it('rejects requested change when revised order exceeds available balances', () => {
    // Arrange
    const input = {
      orderStatus: OrderStatus.Pending,
      currentDrinkTokenCost: 1,
      currentFoodTokenCost: 1,
      additionalDrinkTokenCost: 1,
      additionalFoodTokenCost: 1,
      availableDrinkTokenBalance: 2,
      availableFoodTokenBalance: 1,
      requestedItems: [
        { articleName: 'Premium Drink', quantity: 1 },
        { articleName: 'Meal', quantity: 1 },
      ],
    };

    // Act & Assert
    expect(() => evaluateOrderChange(input)).toThrow(InsufficientTokensError);
  });
});
