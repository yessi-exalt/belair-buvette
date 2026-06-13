import { describe, expect, it } from 'vitest';

import {
  DAILY_DRINK_TOKEN_ALLOCATION,
  DAILY_FOOD_TOKEN_ALLOCATION,
  InsufficientTokensError,
  applyDailyTokenAllocation,
  consumeDrinkTokens,
  readTokenBalance,
} from '../src/index.js';

describe('consult token balance domain', () => {
  it('returns drink and food token balances', () => {
    // Arrange
    const festivalGoer = {
      id: 'goer-1',
      drinkTokenBalance: 4,
      foodTokenBalance: 7,
    };

    // Act
    const balance = readTokenBalance(festivalGoer);

    // Assert
    expect(balance).toEqual({
      drinkTokenBalance: 4,
      foodTokenBalance: 7,
    });
  });

  it('prevents negative drink token balance', () => {
    // Arrange
    const festivalGoer = {
      id: 'goer-1',
      drinkTokenBalance: 0,
      foodTokenBalance: 3,
    };

    // Act
    const act = () => consumeDrinkTokens(festivalGoer, 1);

    // Assert
    expect(act).toThrow(InsufficientTokensError);
    expect(festivalGoer.drinkTokenBalance).toBe(0);
  });

  it('applies daily allocation on a new festival day', () => {
    // Arrange
    const festivalGoer = {
      id: 'goer-1',
      drinkTokenBalance: 0,
      foodTokenBalance: 0,
    };

    // Act
    const updatedFestivalGoer = applyDailyTokenAllocation(festivalGoer);

    // Assert
    expect(updatedFestivalGoer).toEqual({
      id: 'goer-1',
      drinkTokenBalance: DAILY_DRINK_TOKEN_ALLOCATION,
      foodTokenBalance: DAILY_FOOD_TOKEN_ALLOCATION,
    });
  });
});