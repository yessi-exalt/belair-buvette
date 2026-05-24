import { describe, expect, it } from 'vitest';

import { OrderController } from '../src/controllers/order-controller.js';
import { InMemoryArticleRepository } from '../src/in-memory-article-repository.js';
import { InMemoryFestivalGoerRepository } from '../src/in-memory-festival-goer-repository.js';
import { InMemoryOrderRepository } from '../src/in-memory-order-repository.js';
import { buildPlaceDrinkOrderUseCase } from '../src/use-cases/place-drink-order.use-case.js';

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
      'PENDING',
    );
    expect(pendingOrders).toHaveLength(1);
    expect(pendingOrders[0].id).toBe(body.id);
  });
});
