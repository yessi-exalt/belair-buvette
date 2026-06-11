export type CancelOrderRequestPayload = {
  festivalGoerId?: string;
  orderId?: string;
};

export type CancelOrderRequest = {
  festivalGoerId: string;
  orderId: string;
};

export const isCancelOrderRequest = (
  payload: CancelOrderRequestPayload,
): payload is CancelOrderRequest => {
  return (
    typeof payload.festivalGoerId === 'string' &&
    typeof payload.orderId === 'string'
  );
};
