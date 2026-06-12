import { describe, it, expect } from 'vitest';
import { InMemoryAcknowledgementNotificationGateway } from '../src/in-memory-acknowledgement-notification-gateway.js';

describe('AcknowledgementNotificationGateway', () => {
  it('sends acknowledgement notification with estimated preparation time to festival goer', async () => {
    // Arrange
    const gateway = new InMemoryAcknowledgementNotificationGateway();
    const notification = {
      festivalGoerId: 'festival-goer-42',
      estimatedPreparationTime: 8,
    };

    // Act
    await gateway.sendAcknowledgementNotification(notification);

    // Assert
    expect(gateway.sentNotifications).toHaveLength(1);
    expect(gateway.sentNotifications[0]).toEqual({
      festivalGoerId: 'festival-goer-42',
      estimatedPreparationTime: 8,
    });
  });
});
