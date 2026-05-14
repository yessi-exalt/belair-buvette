export type CreateOrderArticleRequest = {
  id: string;
  quantity: number;
};

export type CreateOrderRequestPayload = {
  festivalGoerId?: string;
  articles?: unknown;
};

export type CreateOrderRequest = {
  festivalGoerId: string;
  articles: CreateOrderArticleRequest[];
};

export const isCreateOrderArticleRequest = (
  value: unknown,
): value is CreateOrderArticleRequest => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.id === 'string' && typeof candidate.quantity === 'number'
  );
};

export const isCreateOrderRequest = (
  payload: CreateOrderRequestPayload,
): payload is CreateOrderRequest => {
  return (
    typeof payload.festivalGoerId === 'string' &&
    Array.isArray(payload.articles) &&
    payload.articles.every(isCreateOrderArticleRequest)
  );
};