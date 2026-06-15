/**
 * Represents an item in the shopping cart.
 * Each item has article information and separated token costs.
 */
export type CartItem = {
  articleName: string;
  quantity: number;
  drinkTokenCost: number;
  foodTokenCost: number;
  estimatedPreparationTime?: number;
};
