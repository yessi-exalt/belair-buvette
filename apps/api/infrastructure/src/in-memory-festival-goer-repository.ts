import type { FestivalGoer, FestivalGoerRepository } from '@belair-buvette-api/domain';

export class InMemoryFestivalGoerRepository implements FestivalGoerRepository {
  private readonly festivalGoers = new Map<string, FestivalGoer>();

  seed(festivalGoer: FestivalGoer): void {
    this.festivalGoers.set(festivalGoer.id, structuredClone(festivalGoer));
  }

  async findById(id: string): Promise<FestivalGoer> {
    const festivalGoer = this.festivalGoers.get(id);
    if (!festivalGoer) throw new Error(`FestivalGoer not found: ${id}`);
    return structuredClone(festivalGoer);
  }

  async save(festivalGoer: FestivalGoer): Promise<void> {
    this.festivalGoers.set(festivalGoer.id, structuredClone(festivalGoer));
  }
}
