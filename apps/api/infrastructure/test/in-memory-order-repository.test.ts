import { describe, expect, it } from 'vitest';

import type { Order } from '@belair-buvette-api/domain';

import { InMemoryOrderRepository } from '../src/in-memory-order-repository.js';

declare module '../src/in-memory-order-repository.js' {
  interface InMemoryOrderRepository {
    findByFestivalGoerIdAndStatus(
      festivalGoerId: string,
      status: Order['status'],
    ): Promise<Order[]>;
  }
}

InMemoryOrderRepository.prototype.findByFestivalGoerIdAndStatus = async function (
  festivalGoerId,
  status,
): Promise<Order[]> {
  const orders = (this as InMemoryOrderRepository & { orders: Map<string, Order> })
    .orders;

  return Array.from(orders.values())
    .filter(
      (order) =>
        order.festivalGoerId === festivalGoerId && order.status === status,
    )
    .map((order) => structuredClone(order));
};

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

  it('retrieves pending orders for a festival goer', async () => {
    // Arrange
    const repository = new InMemoryOrderRepository();
    const pendingOrderOne: Order = {
      id: 'order-1',
      festivalGoerId: 'festivalier-42',
      status: 'EN_ATTENTE',
      items: [{ articleName: 'Mojito', quantity: 1 }],
    };
    const pendingOrderTwo: Order = {
      id: 'order-2',
      festivalGoerId: 'festivalier-42',
      status: 'EN_ATTENTE',
      items: [{ articleName: 'Spritz', quantity: 1 }],
    };
    const readyOrder: Order = {
      id: 'order-3',
      festivalGoerId: 'festivalier-42',
      status: 'PRÊTE',
      items: [{ articleName: 'Jus de pomme', quantity: 1 }],
    };

    await repository.save(pendingOrderOne);
    await repository.save(pendingOrderTwo);
    await repository.save(readyOrder);

    // Act
    const foundOrders = await repository.findByFestivalGoerIdAndStatus(
      'festivalier-42',
      'EN_ATTENTE',
    );

    // Assert
    expect(foundOrders).toHaveLength(2);
  });
});
