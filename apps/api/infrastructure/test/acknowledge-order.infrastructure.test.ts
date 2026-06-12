import { describe, expect, it, vi } from 'vitest';

import type { Order } from '@belair-buvette-api/domain';
import { OrderStatus } from '../../domain/src/repositories.js';

import { InMemoryOrderRepository } from '../src/in-memory-order-repository.js';

vi.mock('../src/in-memory-workload-repository.js', () => {
  class InMemoryWorkloadRepository {
    private currentWorkload: number = 0;

    async setCurrentWorkload(minutes: number): Promise<void> {
      this.currentWorkload = minutes;
    }

    async getCurrentWorkload(): Promise<number> {
      return this.currentWorkload;
    }
  }

  return {
    InMemoryWorkloadRepository,
  };
});

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
