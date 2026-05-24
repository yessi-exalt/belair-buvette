export type TestOrderItem = {
  articleName: string;
  quantity: number;
};

export type TestArticleStock = {
  articleName: string;
  availableQuantity: number;
};

export function createOrderItems(): TestOrderItem[] {
  return [
    {
      articleName: 'Mojito',
      quantity: 2,
    },
    {
      articleName: 'Chips',
      quantity: 1,
    },
  ];
}

export function createAvailableStocks(): TestArticleStock[] {
  return [
    {
      articleName: 'Mojito',
      availableQuantity: 10,
    },
    {
      articleName: 'Chips',
      availableQuantity: 4,
    },
  ];
}

export function createInsufficientStocks(): TestArticleStock[] {
  return [
    {
      articleName: 'Mojito',
      availableQuantity: 1,
    },
  ];
}