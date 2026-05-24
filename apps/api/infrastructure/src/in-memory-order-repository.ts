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
    this.orders.set(order.id, structuredClone(order));
  }

  async findById(orderId: string): Promise<Order> {
    return structuredClone(this.orders.get(orderId) as Order);
  }

  async findByFestivalGoerIdAndStatus(
    festivalGoerId: string,
    status: Order['status'],
  ): Promise<Order[]> {
    return Array.from(this.orders.values())
      .filter(
        (order) =>
          order.festivalGoerId === festivalGoerId && order.status === status,
      )
      .map((order) => structuredClone(order));
  }
}