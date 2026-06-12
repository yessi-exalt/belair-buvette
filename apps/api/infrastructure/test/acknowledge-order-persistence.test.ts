import { describe, it, expect } from 'vitest';

import type { Order } from '@belair-buvette-api/domain';
import { InMemoryOrderRepository } from '../src/in-memory-order-repository.js';

describe('AcknowledgeOrderPersistence', () => {
  it('persists an order with Acknowledged status and estimated preparation time', async () => {
    // Arrange
    const repository = new InMemoryOrderRepository();
    const acknowledgedOrder = {
      id: 'order-1',
      festivalGoerId: 'festival-goer-42',
      status: 'ACKNOWLEDGED',
      items: [{ articleName: 'Mojito', quantity: 1 }],
      drinkTokenCost: 6,
      foodTokenCost: 0,
      estimatedPreparationTime: 8,
    } as unknown as Order;

    // Act
    await repository.save(acknowledgedOrder);
    const found = await repository.findById('order-1');

    // Assert
    expect(found.status).toBe('ACKNOWLEDGED');
    expect((found as any).estimatedPreparationTime).toBe(8);
  });
});

