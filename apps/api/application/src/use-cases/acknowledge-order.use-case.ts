import type { OrderRepository, ArticleRepository } from '@belair-buvette-api/domain';
import { OrderStatus } from '@belair-buvette-api/domain';

type WorkloadRepository = {
  getCurrentWorkload(): Promise<number>;
};

type AcknowledgementNotificationGateway = {
  sendAcknowledgementNotification(notification: {
    festivalGoerId: string;
    estimatedPreparationTime: number;
  }): Promise<void>;
};

type AcknowledgeOrderUseCaseDependencies = {
  orderRepository: OrderRepository;
  articleRepository: ArticleRepository;
  workloadRepository: WorkloadRepository;
  acknowledgementNotificationGateway: AcknowledgementNotificationGateway;
};

type AcknowledgeOrderCommand = {
  orderId: string;
};

export class AcknowledgeOrderUseCase {
  constructor(private deps: AcknowledgeOrderUseCaseDependencies) {}

  async execute(command: AcknowledgeOrderCommand) {
    // Retrieve the order
    const order = await this.deps.orderRepository.findById(command.orderId);

    // Build a catalog of articles from order items
    const articles = [];
    for (const item of order.items) {
      const article = await this.deps.articleRepository.findByName(item.articleName);
      articles.push(article);
    }

    // Get the current workload
    const currentWorkload = await this.deps.workloadRepository.getCurrentWorkload();

    // Calculate estimated preparation time
    let estimatedPreparationTime = currentWorkload;
    for (const item of order.items) {
      const article = articles.find((a) => a.name === item.articleName);
      if (article?.category === 'ALCOHOLIC') {
        estimatedPreparationTime += item.quantity * 2;
      }
    }

    // Create acknowledged order
    const acknowledgedOrder = {
      ...order,
      status: OrderStatus.Acknowledged,
      estimatedPreparationTime,
    };

    // Persist the acknowledged order
    await this.deps.orderRepository.save(acknowledgedOrder);

    // Notify the festival goer
    await this.deps.acknowledgementNotificationGateway.sendAcknowledgementNotification({
      festivalGoerId: order.festivalGoerId,
      estimatedPreparationTime,
    });

    // Return the acknowledged order
    return acknowledgedOrder;
  }
}
