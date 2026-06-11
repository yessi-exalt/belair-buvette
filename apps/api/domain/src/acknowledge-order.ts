import type { Order } from './repositories.js';

type CatalogArticle = {
  name: string;
  category: string;
};

type CalculateEstimatedPreparationTimeParams = {
  order: Pick<Order, 'items'>;
  catalog: ReadonlyArray<CatalogArticle>;
  currentWorkloadInMinutes: number;
};

export const calculateEstimatedPreparationTime = ({
  order,
  catalog,
  currentWorkloadInMinutes,
}: CalculateEstimatedPreparationTimeParams): number => {
  const nonAlcoholicDrinkTypes = order.items.filter((item) =>
    catalog.some(
      (article) => article.name === item.articleName && article.category === 'NON_ALCOHOLIC',
    ),
  ).length;

  return currentWorkloadInMinutes + nonAlcoholicDrinkTypes;
};