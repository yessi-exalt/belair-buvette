import type { Order, OrderRepository } from '@belair-buvette-api/domain';

export class InMemoryOrderRepository implements OrderRepository {
  private readonly orders = new Map<string, Order>();
  private nextOrderSequence = 1;

  nextId(): string {
    const orderId = `order-${this.nextOrderSequence}`;
    this.nextOrderSequence += 1;
    return orderId;
  }

  async save(order: Order): Promise<void> {
    this.orders.set(order.id, order);
  }

  async findById(orderId: string): Promise<Order> {
    return this.orders.get(orderId) as Order;
  }
}