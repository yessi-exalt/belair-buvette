import {
  isCreateOrderRequest,
  type CreateOrderRequest,
  type CreateOrderRequestPayload,
} from '../dtos/create-order-request.js';
import type { CreateOrderResponse } from '../dtos/create-order-response.js';

type CreateOrderUseCase = {
  execute(command: CreateOrderRequest): Promise<CreateOrderResponse>;
};

type OrderControllerDependencies = {
  createOrderUseCase: CreateOrderUseCase;
};

export class OrderController {
  public constructor(
    private readonly dependencies: OrderControllerDependencies,
  ) {}

  public async createOrder(request: Request): Promise<Response> {
    const payload = (await request.json()) as CreateOrderRequestPayload;

    if (typeof payload.festivalGoerId !== 'string') {
      return new Response(null, { status: 401 });
    }

    if (!isCreateOrderRequest(payload)) {
      return new Response(null, { status: 400 });
    }

    const response = await this.dependencies.createOrderUseCase.execute({
      festivalGoerId: payload.festivalGoerId,
      articles: payload.articles,
    });

    return new Response(JSON.stringify(response), {
      status: 201,
      headers: {
        'content-type': 'application/json',
      },
    });
  }
}