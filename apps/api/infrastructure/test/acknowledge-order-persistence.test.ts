import { describe, it, expect } from 'vitest';

import type { Order } from '@belair-buvette-api/domain';
import { OrderStatus } from '@belair-buvette-api/domain';
import { InMemoryOrderRepository } from '../src/in-memory-order-repository.js';

describe('AcknowledgeOrderPersistence', () => {
  it('persists an order with Acknowledged status and estimated preparation time', async () => {
    // Arrange
    const repository = new InMemoryOrderRepository();
    const acknowledgedOrder: Order = {
      id: 'order-1',
      festivalGoerId: 'festival-goer-42',
      status: OrderStatus.Acknowledged,
      items: [{ articleName: 'Mojito', quantity: 1 }],
      drinkTokenCost: 6,
      foodTokenCost: 0,
      estimatedPreparationTime: 8,
    };

    // Act
    await repository.save(acknowledgedOrder);
    const found = await repository.findById('order-1');

    // Assert
    expect(found.status).toBe('ACKNOWLEDGED');
    expect(found.estimatedPreparationTime).toBe(8);
  });
});

