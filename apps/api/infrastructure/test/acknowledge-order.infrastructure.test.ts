import { describe, expect, it } from 'vitest';

import type { Order } from '@belair-buvette-api/domain';
import { OrderStatus } from '../../domain/src/repositories.js';

import { InMemoryOrderRepository } from '../src/in-memory-order-repository.js';
import { InMemoryWorkloadRepository } from '../src/in-memory-workload-repository.js';

describe('Acknowledge Order Infrastructure', () => {
  it('retrieves the pending order and current workload before acknowledgement', async () => {
    // Arrange
    const orderRepository = new InMemoryOrderRepository();
    const workloadRepository = new InMemoryWorkloadRepository();

    const pendingOrder: Order = {
      id: 'order-1',
      festivalGoerId: 'festival-goer-42',
      status: OrderStatus.Pending,
      items: [
        { articleName: 'Mojito', quantity: 2 },
        { articleName: 'Frites', quantity: 1 },
      ],
      drinkTokenCost: 0,
      foodTokenCost: 0,
    };

    await orderRepository.save(pendingOrder);
    await workloadRepository.setCurrentWorkload(15);

    // Act
    const retrievedOrder = await orderRepository.findById('order-1');
    const currentWorkload = await workloadRepository.getCurrentWorkload();

    // Assert
    expect(retrievedOrder).toBeDefined();
    expect(retrievedOrder.id).toBe('order-1');
    expect(retrievedOrder.items).toEqual([
      { articleName: 'Mojito', quantity: 2 },
      { articleName: 'Frites', quantity: 1 },
    ]);
    expect(currentWorkload).toBe(15);
  });
});
