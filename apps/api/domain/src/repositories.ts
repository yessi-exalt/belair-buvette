export type Article = {
  id: string;
  name: string;
  stock: number;
  tokenCost: number;
  drinkTokenCost: number;
  category: 'ALCOHOLIC';
};

export type FestivalGoer = {
  id: string;
  drinkTokenBalance: number;
  foodTokenBalance: number;
};

export enum OrderStatus {
  Pending = 'EN_ATTENTE',
  LegacyPending = 'PENDING',
  Ready = 'PRÊTE',
  Cancelled = 'ANNULÉE',
  Acknowledged = 'ACKNOWLEDGED',
}

export type Order = {
  id: string;
  festivalGoerId: string;
  items: Array<{ articleName: string; quantity: number }>;
  status: OrderStatus;
  drinkTokenCost: number;
  foodTokenCost: number;
  estimatedPreparationTime?: number;
};

export interface ArticleRepository {
  findByName(name: string): Promise<Article>;
  save(article: Article): Promise<void>;
}

export interface FestivalGoerRepository {
  findById(id: string): Promise<FestivalGoer>;
  save(festivalGoer: FestivalGoer): Promise<void>;
}

export interface OrderRepository {
  nextId(): string;
  save(order: Order): Promise<void>;
  findById(id: string): Promise<Order>;
  findByFestivalGoerIdAndStatus(festivalGoerId: string, status: Order['status']): Promise<Order[]>;
}
