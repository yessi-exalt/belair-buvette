import { describe, expect, it } from 'vitest';

import { PlaceDrinkOrderUseCase } from '../index.js';
import type {
  PlaceDrinkOrderCommand,
  PlaceDrinkOrderResult,
} from '../use-cases/place-drink-order.use-case.js';

class FakePlaceOrderGateway {
  public submittedCommand: PlaceDrinkOrderCommand | undefined = undefined;

  async execute(command: PlaceDrinkOrderCommand): Promise<PlaceDrinkOrderResult> {
    this.submittedCommand = command;

    return {
      orderId: 'order-123',
      status: 'EN_ATTENTE',
    };
  }
}

describe('PlaceDrinkOrderUseCase', () => {
  it('étant donné un festivalier identifié et un article "Mojito" disponible en stock, quand le festivalier passe une commande pour 1 "Mojito", alors la commande est créée avec le statut "EN_ATTENTE" et le festivalier reçoit un identifiant de commande', async () => {
    const placeOrderGateway = new FakePlaceOrderGateway();
    const useCase = new PlaceDrinkOrderUseCase({
      placeOrderGateway,
    });

    const result = await useCase.execute({
      festivalGoerId: 'festivalgoer-123',
      items: [
        {
          articleName: 'Mojito',
          quantity: 1,
        },
      ],
    });

    expect(placeOrderGateway.submittedCommand).toEqual({
      festivalGoerId: 'festivalgoer-123',
      items: [
        {
          articleName: 'Mojito',
          quantity: 1,
        },
      ],
    });
    expect(result.status).toBe('EN_ATTENTE');
    expect(result.orderId).toEqual(expect.any(String));
    expect(result.orderId).not.toHaveLength(0);
  });
});