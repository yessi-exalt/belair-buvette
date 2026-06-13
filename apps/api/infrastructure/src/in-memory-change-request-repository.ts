type ChangeRequest = {
  orderId: string;
  festivalGoerId: string;
  requestedChanges: Array<{ articleName: string; quantity: number }>;
};

export class InMemoryChangeRequestRepository {
  public savedRequests: ChangeRequest[] = [];

  async save(changeRequest: ChangeRequest): Promise<void> {
    this.savedRequests.push(structuredClone(changeRequest));
  }
}
