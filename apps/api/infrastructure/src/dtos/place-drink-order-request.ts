export type PlaceDrinkOrderItem = {
  articleName: string;
  quantity: number;
};

export type PlaceDrinkOrderRequestPayload = {
  festivalGoerId?: string;
  items?: unknown;
};

export type PlaceDrinkOrderRequest = {
  festivalGoerId: string;
  items: PlaceDrinkOrderItem[];
};

export const isPlaceDrinkOrderItem = (
  value: unknown,
): value is PlaceDrinkOrderItem => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.articleName === 'string' &&
    typeof candidate.quantity === 'number'
  );
};

export const isPlaceDrinkOrderRequest = (
  value: PlaceDrinkOrderRequestPayload,
): value is PlaceDrinkOrderRequest => {
  return (
    typeof value.festivalGoerId === 'string' &&
    Array.isArray(value.items) &&
    value.items.every(isPlaceDrinkOrderItem)
  );
};
