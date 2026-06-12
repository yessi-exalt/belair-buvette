import { describe, expect, it } from 'vitest';

import { acknowledgeOrder, calculateEstimatedPreparationTime } from '../src/acknowledge-order.js';
import { OrderStatus } from '../src/repositories.js';

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

  it('returns 18 minutes for 1 meal and 1 premium alcoholic drink with 5 minutes of workload', () => {
    // Arrange
    const order = {
      id: 'order-2',
      festivalGoerId: 'goer-2',
      items: [
        { articleName: 'Burger', quantity: 1 },
        { articleName: 'Champagne', quantity: 1 },
      ],
      status: 'EN_ATTENTE',
      drinkTokenCost: 3,
      foodTokenCost: 10,
    };
    const catalog = [
      {
        id: 'article-3',
        name: 'Burger',
        stock: 10,
        tokenCost: 10,
        drinkTokenCost: 0,
        category: 'MEAL',
      },
      {
        id: 'article-4',
        name: 'Champagne',
        stock: 10,
        tokenCost: 3,
        drinkTokenCost: 3,
        category: 'PREMIUM_ALCOHOLIC',
      },
    ];
    const currentWorkloadInMinutes = 5;

    // Act
    const estimatedPreparationTime = calculateEstimatedPreparationTime({
      order,
      catalog,
      currentWorkloadInMinutes,
    });

    // Assert
    expect(estimatedPreparationTime).toBe(18);
  });

  it('returns 8 minutes for 2 normal alcoholic drinks with 4 minutes of workload', () => {
    // Arrange
    const order = {
      id: 'order-3',
      festivalGoerId: 'goer-3',
      items: [{ articleName: 'Beer', quantity: 2 }],
      status: 'EN_ATTENTE',
      drinkTokenCost: 2,
      foodTokenCost: 0,
    };
    const catalog = [
      {
        id: 'article-5',
        name: 'Beer',
        stock: 10,
        tokenCost: 1,
        drinkTokenCost: 1,
        category: 'ALCOHOLIC',
      },
    ];
    const currentWorkloadInMinutes = 4;

    // Act
    const estimatedPreparationTime = calculateEstimatedPreparationTime({
      order,
      catalog,
      currentWorkloadInMinutes,
    });

    // Assert
    expect(estimatedPreparationTime).toBe(8);
  });
});

describe('acknowledgeOrder', () => {
  it('transitions a Pending order to Acknowledged state and records the computed estimated preparation time', () => {
    // Arrange
    const order = {
      id: 'order-4',
      festivalGoerId: 'goer-4',
      items: [],
      status: OrderStatus.Pending,
      drinkTokenCost: 0,
      foodTokenCost: 0,
    };
    const catalog = [];
    const currentWorkloadInMinutes = 4;
    const expectedEstimatedPreparationTime = calculateEstimatedPreparationTime({
      order,
      catalog,
      currentWorkloadInMinutes,
    });

    // Act
    const acknowledgedOrder = acknowledgeOrder({
      order,
      catalog,
      currentWorkloadInMinutes,
    });

    // Assert
    expect(acknowledgedOrder.status).toBe('ACKNOWLEDGED');
    expect(acknowledgedOrder.estimatedPreparationTime).toBe(expectedEstimatedPreparationTime);
  });
});