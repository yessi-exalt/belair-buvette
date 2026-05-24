import { describe, expect, it } from 'vitest';

import type { Order } from '@belair-buvette-api/domain';

import { InMemoryOrderRepository } from '../src/in-memory-order-repository.js';

describe('InMemoryOrderRepository', () => {
  it('saves a new order and retrieves it by id', async () => {
    // Arrange
    const repository = new InMemoryOrderRepository();
    const order: Order = {
      id: 'order-1',
      festivalGoerId: 'festival-goer-42',
      status: 'EN_ATTENTE',
      items: [
        { articleName: 'Mojito', quantity: 2 },
        { articleName: 'Eau plate', quantity: 1 },
      ],
    };

    // Act
    await repository.save(order);
    const found = await repository.findById('order-1');

    // Assert
    expect(found).toBeDefined();
    expect(found).toMatchObject({
      id: 'order-1',
      status: 'EN_ATTENTE',
      items: [
        { articleName: 'Mojito', quantity: 2 },
        { articleName: 'Eau plate', quantity: 1 },
      ],
    });
  });
});