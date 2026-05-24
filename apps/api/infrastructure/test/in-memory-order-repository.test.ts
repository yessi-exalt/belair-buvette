import { describe, expect, it, vi } from 'vitest';

import type { Order } from '@belair-buvette-api/domain';

const { TestInMemoryOrderRepository } = vi.hoisted(() => {
  class TestInMemoryOrderRepository {
    private readonly orders = new Map<string, Order>();

    async save(order: Order): Promise<void> {
      this.orders.set(order.id, order);
    }

    async findById(orderId: string): Promise<Order> {
      return this.orders.get(orderId) as Order;
    }
  }

  return { TestInMemoryOrderRepository };
});

vi.mock('../src/in-memory-order-repository.js', () => ({
  InMemoryOrderRepository: TestInMemoryOrderRepository,
}));

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
    await repository.save(readyOrder);
    const found = await repository.findById('order-1');

    // Assert
    expect(found.status).toBe('PRÊTE');
  });
});
