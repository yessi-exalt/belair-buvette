export type PlaceDrinkOrderCommand = {
  festivalGoerId: string;
  items: Array<{
    articleName: string;
    quantity: number;
  }>;
};

export type PlaceDrinkOrderResult = {
  orderId: string;
  status: string;
};

type PlaceDrinkOrderDependencies = {
  placeOrderGateway: {
    execute(command: PlaceDrinkOrderCommand): Promise<PlaceDrinkOrderResult>;
  };
};

export class PlaceDrinkOrderUseCase {
  public constructor(
    private readonly dependencies: PlaceDrinkOrderDependencies,
  ) {}

  public async execute(
    command: PlaceDrinkOrderCommand,
  ): Promise<PlaceDrinkOrderResult> {
    return this.dependencies.placeOrderGateway.execute(command);
  }
}