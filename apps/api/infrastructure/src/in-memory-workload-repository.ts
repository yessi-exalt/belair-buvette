export class InMemoryWorkloadRepository {
  private currentWorkload: number = 0;

  async setCurrentWorkload(minutes: number): Promise<void> {
    this.currentWorkload = minutes;
  }

  async getCurrentWorkload(): Promise<number> {
    return this.currentWorkload;
  }
}
