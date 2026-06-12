type AcknowledgementNotification = {
  festivalGoerId: string;
  estimatedPreparationTime: number;
};

export class InMemoryAcknowledgementNotificationGateway {
  public sentNotifications: AcknowledgementNotification[] = [];

  async sendAcknowledgementNotification(notification: AcknowledgementNotification): Promise<void> {
    this.sentNotifications.push(notification);
  }
}
