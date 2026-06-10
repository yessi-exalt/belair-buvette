import { describe, expect, it, vi } from 'vitest';

import { OrderStatus, type Order } from '@belair-buvette-api/domain';
import { OrderController } from '../src/controllers/order-controller.js';
import { InMemoryArticleRepository } from '../src/in-memory-article-repository.js';
import { InMemoryFestivalGoerRepository } from '../src/in-memory-festival-goer-repository.js';
import { InMemoryOrderRepository } from '../src/in-memory-order-repository.js';
import { buildCancelOrderUseCase } from '../src/use-cases/cancel-order.use-case.js';
import { buildPlaceDrinkOrderUseCase } from '../src/use-cases/place-drink-order.use-case.js';

type FestivalGoerWithFoodTokens = {
  id: string;
  drinkTokenBalance: number;
  foodTokenBalance: number;
};

vi.mock('@belair-buvette-api/domain', async () => {
  const actual = await vi.importActual<typeof import('@belair-buvette-api/domain')>(
    '@belair-buvette-api/domain',
  );

  return {
    ...actual,
    OrderStatus: {
      Pending: 'EN_ATTENTE',
      LegacyPending: 'PENDING',
      Ready: 'PRÊTE',
      Cancelled: 'ANNULÉE',
    },
  };
});

class SpyCancellationNotificationGateway {
  public sentConfirmations: Array<{ festivalGoerId: string }> = [];

  public async sendCancellationConfirmation(confirmation: {
    festivalGoerId: string;
  }): Promise<void> {
    this.sentConfirmations.push(confirmation);
  }
}

describe('Full stack: API → Application → Infrastructure', () => {
  it('places a drink order end-to-end using real repositories', async () => {
    // Arrange — wire real repositories
    const festivalGoerRepository = new InMemoryFestivalGoerRepository();
    const articleRepository = new InMemoryArticleRepository();
    const orderRepository = new InMemoryOrderRepository();

    festivalGoerRepository.seed({ id: 'festivalier-42', drinkTokenBalance: 10 });
    articleRepository.seed({
      id: 'article-1',
      name: 'Mojito',
      stock: 10,
      tokenCost: 1,
      drinkTokenCost: 2,
      category: 'ALCOHOLIC',
    });

    // Wire use case with real repositories via dependency injection
    const placeDrinkOrderUseCase = buildPlaceDrinkOrderUseCase(
      festivalGoerRepository,
      articleRepository,
      orderRepository,
    );

    const controller = new OrderController({
      // createOrder is out of scope for this stack test — use a no-op stub
      createOrderUseCase: {
        execute: async () => ({ orderId: 'stub' }),
      },
      placeDrinkOrderUseCase,
    });

    const request = new Request('http://belair.test/orders/drinks', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        festivalGoerId: 'festivalier-42',
        items: [{ articleName: 'Mojito', quantity: 2 }],
      }),
    });

    // Act
    const response = await controller.placeDrinkOrder(request);
    const body = (await response.json()) as {
      id: string;
      status: string;
      totalDrinkTokenCost: number;
      remainingDrinkTokenBalance: number;
    };

    // Assert — HTTP layer
    expect(response.status).toBe(201);
    expect(body.status).toBe('PENDING');
    expect(body.totalDrinkTokenCost).toBe(4);
    expect(body.remainingDrinkTokenBalance).toBe(6);

    // Assert — repository state (infrastructure layer was actually hit)
    const savedOrder = await orderRepository.findById(body.id);
    expect(savedOrder).toMatchObject({
      festivalGoerId: 'festivalier-42',
      status: 'PENDING',
      items: [{ articleName: 'Mojito', quantity: 2 }],
    });

    // Assert — article stock was decremented (domain rule enforced end-to-end)
    const savedArticle = await articleRepository.findByName('Mojito');
    expect(savedArticle.stock).toBe(8);

    // Assert — festival goer token balance was updated
    const updatedGoer = await festivalGoerRepository.findById('festivalier-42');
    expect(updatedGoer.drinkTokenBalance).toBe(6);

    // Assert — pending order is retrievable by festival goer id and status
    const pendingOrders = await orderRepository.findByFestivalGoerIdAndStatus(
      'festivalier-42',
      OrderStatus.LegacyPending,
    );
    expect(pendingOrders).toHaveLength(1);
    expect(pendingOrders[0].id).toBe(body.id);
  });

  it('saves the refunded drink and food token balances and sends confirmation', async () => {
    // Arrange
    const initialDrinkTokenBalance = 2;
    const initialFoodTokenBalance = 1;
    const festivalGoerRepository = new InMemoryFestivalGoerRepository();
    const orderRepository = new InMemoryOrderRepository();
    const cancellationNotificationGateway =
      new SpyCancellationNotificationGateway();

    festivalGoerRepository.seed({
      id: 'festivalier-42',
      drinkTokenBalance: initialDrinkTokenBalance,
      foodTokenBalance: initialFoodTokenBalance,
    } as FestivalGoerWithFoodTokens);

    await orderRepository.save({
      id: 'order-1',
      festivalGoerId: 'festivalier-42',
      status: 'ANNULÉE' as OrderStatus,
      items: [],
      drinkTokenCost: 3,
      foodTokenCost: 2,
    } as Order);

    const cancelOrderUseCase = buildCancelOrderUseCase(
      festivalGoerRepository,
      orderRepository,
      cancellationNotificationGateway,
    );

    // Act
    await cancelOrderUseCase.execute({
      orderId: 'order-1',
      festivalGoerId: 'festivalier-42',
    });

    const updatedFestivalGoer = (await festivalGoerRepository.findById(
      'festivalier-42',
    )) as FestivalGoerWithFoodTokens;

    // Assert
    expect(updatedFestivalGoer.drinkTokenBalance).toBe(
      initialDrinkTokenBalance + 3,
    );
    expect(updatedFestivalGoer.foodTokenBalance).toBe(
      initialFoodTokenBalance + 2,
    );
    expect(cancellationNotificationGateway.sentConfirmations).toEqual([
      { festivalGoerId: 'festivalier-42' },
    ]);
  });

  it('cancels a stored pending order, persists the refunded balances, and sends a confirmation', async () => {
    // Arrange
    const initialDrinkTokenBalance = 2;
    const initialFoodTokenBalance = 1;
    const festivalGoerRepository = new InMemoryFestivalGoerRepository();
    const orderRepository = new InMemoryOrderRepository();
    const cancellationNotificationGateway =
      new SpyCancellationNotificationGateway();

    festivalGoerRepository.seed({
      id: 'festivalier-42',
      drinkTokenBalance: initialDrinkTokenBalance,
      foodTokenBalance: initialFoodTokenBalance,
    } as FestivalGoerWithFoodTokens);

    await orderRepository.save({
      id: 'order-1',
      festivalGoerId: 'festivalier-42',
      status: OrderStatus.Pending,
      items: [],
      drinkTokenCost: 3,
      foodTokenCost: 2,
    } as Order);

    const cancelOrderUseCase = buildCancelOrderUseCase(
      festivalGoerRepository,
      orderRepository,
      cancellationNotificationGateway,
    );

    // Act
    await cancelOrderUseCase.execute({
      orderId: 'order-1',
      festivalGoerId: 'festivalier-42',
    });

    const storedOrder = await orderRepository.findById('order-1');
    const updatedFestivalGoer = (await festivalGoerRepository.findById(
      'festivalier-42',
    )) as FestivalGoerWithFoodTokens;

    // Assert
    expect(storedOrder.status).toBe(OrderStatus.Cancelled);
    expect(updatedFestivalGoer.drinkTokenBalance).toBe(
      initialDrinkTokenBalance + 3,
    );
    expect(updatedFestivalGoer.foodTokenBalance).toBe(
      initialFoodTokenBalance + 2,
    );
    expect(cancellationNotificationGateway.sentConfirmations).toEqual([
      { festivalGoerId: 'festivalier-42' },
    ]);
  });
});
