import { OrderStatus, type Order } from './repositories.js';

export function canCancelOrder(order: Order): boolean {
  return order.status === OrderStatus.Pending;
}