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

  it('updates a saved order status to PRÊTE and retrieves it by id', async () => {
    // Arrange
    const repository = new InMemoryOrderRepository();
    const pendingOrder: Order = {
      id: 'order-1',
      festivalGoerId: 'festival-goer-42',
      status: 'EN_ATTENTE',
      items: [{ articleName: 'Mojito', quantity: 2 }],
    };

    const readyOrder: Order = {
      ...pendingOrder,
      status: 'PRÊTE',
    };

    // Act
    await repository.save(pendingOrder);
    pendingOrder.status = 'PRÊTE';
    const foundBeforeExplicitUpdate = await repository.findById('order-1');
    await repository.save(readyOrder);
    const found = await repository.findById('order-1');

    // Assert
    expect(foundBeforeExplicitUpdate.status).toBe('EN_ATTENTE');
    expect(found.status).toBe('PRÊTE');
  });
});
