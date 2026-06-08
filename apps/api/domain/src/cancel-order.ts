import { OrderNotCancellableError } from './exceptions.js';
import { OrderStatus, type Order } from './repositories.js';

export function assertOrderIsCancellable(order: Order): void {
  if (order.status !== OrderStatus.Pending) {
    throw new OrderNotCancellableError();
  }
}