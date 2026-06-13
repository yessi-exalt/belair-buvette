type BartenderChangeNotification = {
  orderId: string;
  requestedChanges: Array<{ articleName: string; quantity: number }>;
};

export class InMemoryBartenderNotificationGateway {
  public sentNotifications: BartenderChangeNotification[] = [];

  async notifyRequestedChanges(notification: BartenderChangeNotification): Promise<void> {
    this.sentNotifications.push(structuredClone(notification));
  }
}
