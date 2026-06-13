import { describe, expect, it } from 'vitest';

import { OrderStatus, type Order } from '@belair-buvette-api/domain';

import { InMemoryOrderRepository } from '../src/in-memory-order-repository.js';
import { InMemoryChangeRequestRepository } from '../src/in-memory-change-request-repository.js';
import { InMemoryBartenderNotificationGateway } from '../src/in-memory-bartender-notification-gateway.js';

describe('Change order persistence', () => {
  it('retrieves the existing order before processing a change', async () => {
    // Arrange
    const orderRepository = new InMemoryOrderRepository();
    const storedOrder: Order = {
      id: 'order-1',
      festivalGoerId: 'festival-goer-42',
      status: OrderStatus.Pending,
      items: [{ articleName: 'Mojito', quantity: 1 }],
      drinkTokenCost: 1,
      foodTokenCost: 0,
    };
    await orderRepository.save(storedOrder);

    // Act
    const foundOrder = await orderRepository.findById('order-1');

    // Assert
    expect(foundOrder).toEqual(storedOrder);
  });

  it('persists a directly modified Pending order', async () => {
    // Arrange
    const orderRepository = new InMemoryOrderRepository();

    const modifiedOrder: Order = {
      id: 'order-1',
      festivalGoerId: 'festival-goer-42',
      status: OrderStatus.Pending,
      items: [
        { articleName: 'Normal alcoholic drink', quantity: 2 },
        { articleName: 'Snack', quantity: 1 },
      ],
      drinkTokenCost: 2,
      foodTokenCost: 1,
    };

    // Act
    await orderRepository.save(modifiedOrder);
    const storedOrder = await orderRepository.findById('order-1');

    // Assert
    expect(storedOrder.items).toEqual([
      { articleName: 'Normal alcoholic drink', quantity: 2 },
      { articleName: 'Snack', quantity: 1 },
    ]);
    expect(storedOrder.drinkTokenCost).toBe(2);
    expect(storedOrder.foodTokenCost).toBe(1);
  });

  it('persists a bartender review request for an Acknowledged order and emits the notification', async () => {
    // Arrange
    const changeRequestRepository = new InMemoryChangeRequestRepository();
    const bartenderNotificationGateway = new InMemoryBartenderNotificationGateway();

    const requestedChanges = [
      { articleName: 'Mojito', quantity: 2 },
      { articleName: 'Snack', quantity: 1 },
    ];

    // Act
    await changeRequestRepository.save({
      orderId: 'order-1',
      festivalGoerId: 'festival-goer-42',
      requestedChanges,
    });
    await bartenderNotificationGateway.notifyRequestedChanges({
      orderId: 'order-1',
      requestedChanges,
    });

    // Assert
    expect(changeRequestRepository.savedRequests).toEqual([
      {
        orderId: 'order-1',
        festivalGoerId: 'festival-goer-42',
        requestedChanges,
      },
    ]);
    expect(bartenderNotificationGateway.sentNotifications).toEqual([
      {
        orderId: 'order-1',
        requestedChanges,
      },
    ]);
  });
});
