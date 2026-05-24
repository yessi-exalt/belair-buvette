import { PlaceDrinkOrderUseCase } from '@belair-buvette-api/application';
import type { InMemoryArticleRepository } from '../in-memory-article-repository.js';
import type { InMemoryFestivalGoerRepository } from '../in-memory-festival-goer-repository.js';
import type { InMemoryOrderRepository } from '../in-memory-order-repository.js';

export function buildPlaceDrinkOrderUseCase(
  festivalGoerRepository: InMemoryFestivalGoerRepository,
  articleRepository: InMemoryArticleRepository,
  orderRepository: InMemoryOrderRepository,
): PlaceDrinkOrderUseCase {
  return new PlaceDrinkOrderUseCase({
    festivalGoerRepository,
    articleRepository,
    orderRepository,
  });
}
