import { describe, expect, it } from 'vitest';

import { InsufficientTokensError, calculateFoodTokenCost, placeFoodOrder } from '../src/place-food-order.js';

describe('placeFoodOrder', () => {
  it('creates an order for 1 snack with total cost 1 and remaining food token balance 2', () => {
    // Arrange
    const festivalGoer = {
      id: 'goer-1',
      drinkTokenBalance: 0,
      foodTokenBalance: 3,
    };

    // Act
    const result = placeFoodOrder({
      festivalGoer,
      items: [{ articleName: 'Snack', quantity: 1, foodTokenCostPerUnit: 1 }],
    });

    // Assert
    expect(result.totalFoodTokenCost).toBe(1);
    expect(result.festivalGoer.foodTokenBalance).toBe(2);
  });

  it('creates an order for 1 meal with total cost 3 and remaining food token balance 3', () => {
    // Arrange
    const festivalGoer = {
      id: 'goer-1',
      drinkTokenBalance: 0,
      foodTokenBalance: 6,
    };

    // Act
    const result = placeFoodOrder({
      festivalGoer,
      items: [{ articleName: 'Meal', quantity: 1, foodTokenCostPerUnit: 3 }],
    });

    // Assert
    expect(result.totalFoodTokenCost).toBe(3);
    expect(result.festivalGoer.foodTokenBalance).toBe(3);
  });

  it('rejects a food order when the balance is insufficient and preserves balance', () => {
    // Arrange
    const festivalGoer = {
      id: 'goer-1',
      drinkTokenBalance: 0,
      foodTokenBalance: 2,
    };

    // Act & Assert
    expect(() =>
      placeFoodOrder({
        festivalGoer,
        items: [{ articleName: 'Meal', quantity: 1, foodTokenCostPerUnit: 3 }],
      }),
    ).toThrow(InsufficientTokensError);
    expect(festivalGoer.foodTokenBalance).toBe(2);
  });
});

describe('calculateFoodTokenCost', () => {
  it('calculates total cost 5 for 2 snacks and 1 meal', () => {
    // Arrange
    const items = [
      { articleName: 'Snack', quantity: 2, foodTokenCostPerUnit: 1 },
      { articleName: 'Meal', quantity: 1, foodTokenCostPerUnit: 3 },
    ];

    // Act
    const total = calculateFoodTokenCost(items);

    // Assert
    expect(total).toBe(5);
  });
});