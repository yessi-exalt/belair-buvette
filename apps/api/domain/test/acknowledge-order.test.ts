import { describe, expect, it } from 'vitest';

import { calculateEstimatedPreparationTime } from '../src/acknowledge-order.js';

describe('calculateEstimatedPreparationTime', () => {
  it('returns 2 minutes for 2 distinct non-alcoholic drinks with no workload', () => {
    // Arrange
    const order = {
      id: 'order-1',
      festivalGoerId: 'goer-1',
      items: [
        { articleName: 'Lemonade', quantity: 1 },
        { articleName: 'Iced Tea', quantity: 1 },
      ],
      status: 'EN_ATTENTE',
      drinkTokenCost: 2,
      foodTokenCost: 0,
    };
    const catalog = [
      {
        id: 'article-1',
        name: 'Lemonade',
        stock: 10,
        tokenCost: 1,
        drinkTokenCost: 1,
        category: 'NON_ALCOHOLIC',
      },
      {
        id: 'article-2',
        name: 'Iced Tea',
        stock: 10,
        tokenCost: 1,
        drinkTokenCost: 1,
        category: 'NON_ALCOHOLIC',
      },
    ];
    const currentWorkloadInMinutes = 0;

    // Act
    const estimatedPreparationTime = calculateEstimatedPreparationTime({
      order,
      catalog,
      currentWorkloadInMinutes,
    });

    // Assert
    expect(estimatedPreparationTime).toBe(2);
  });
});