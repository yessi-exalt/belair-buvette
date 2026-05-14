import { describe, expect, it } from 'vitest';

import { OrderController } from '../src/controllers/order-controller.js';

class FakeCreateOrderUseCase {
  public receivedCommand:
    | {
        festivalGoerId: string;
        articles: Array<{ id: string; quantity: number }>;
      }
    | undefined;

  public executeCalls = 0;

  public async execute(command: {
    festivalGoerId: string;
    articles: Array<{ id: string; quantity: number }>;
  }): Promise<{ orderId: string }> {
    this.receivedCommand = command;
    this.executeCalls += 1;

    return { orderId: 'order-123' };
  }
}

describe('OrderController', () => {
  it('creates an order successfully by delegating to the use case', async () => {
    const createOrderUseCase = new FakeCreateOrderUseCase();
    const controller = new OrderController({
      createOrderUseCase,
    });

    const request = new Request('http://belair.test/orders', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        festivalGoerId: 'festival-goer-42',
        articles: [{ id: 'mojito', quantity: 2 }],
      }),
    });

    const response = await controller.createOrder(request);
    const body = (await response.json()) as { orderId: string };

    expect(response.status).toBe(201);
    expect(body.orderId).not.toBe('');
    expect(createOrderUseCase.executeCalls).toBe(1);
    expect(createOrderUseCase.receivedCommand).toEqual({
      festivalGoerId: 'festival-goer-42',
      articles: [{ id: 'mojito', quantity: 2 }],
    });
  });

  it('rejects the request when the festival goer is not authenticated', async () => {
    const createOrderUseCase = new FakeCreateOrderUseCase();
    const controller = new OrderController({
      createOrderUseCase,
    });

    const request = new Request('http://belair.test/orders', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        articles: [{ id: 'mojito', quantity: 2 }],
      }),
    });

    const response = await controller.createOrder(request);

    expect(response.status).toBe(401);
    expect(createOrderUseCase.executeCalls).toBe(0);
  });

  it('rejects the request when the body is invalid', async () => {
    const createOrderUseCase = new FakeCreateOrderUseCase();
    const controller = new OrderController({
      createOrderUseCase,
    });

    const request = new Request('http://belair.test/orders', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        festivalGoerId: 'festival-goer-42',
      }),
    });

    const response = await controller.createOrder(request);

    expect(response.status).toBe(400);
    expect(createOrderUseCase.executeCalls).toBe(0);
  });
});