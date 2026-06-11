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
  const categorizedItems = order.items.map((item) => ({
    item,
    article: catalog.find((article) => article.name === item.articleName),
  }));

  const mealCount = categorizedItems.filter(({ article }) => article?.category === 'MEAL').length;

  if (mealCount > 0) {
    const longestDrinkPreparationTime = categorizedItems.reduce((longestPreparationTime, entry) => {
      if (entry.article?.category === 'PREMIUM_ALCOHOLIC') {
        return Math.max(longestPreparationTime, 3);
      }

      if (entry.article?.category === 'NON_ALCOHOLIC') {
        return Math.max(longestPreparationTime, 1);
      }

      return longestPreparationTime;
    }, 0);

    return currentWorkloadInMinutes + mealCount * 10 + longestDrinkPreparationTime;
  }

  const nonAlcoholicDrinkTypes = categorizedItems.filter(
    ({ article }) => article?.category === 'NON_ALCOHOLIC',
  ).length;

  return currentWorkloadInMinutes + nonAlcoholicDrinkTypes;
};