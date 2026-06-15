import type { CartItem } from './cart-item.js';

export type Balance = {
  drinkTokens: number;
  foodTokens: number;
};

export type ConfirmationSummary = {
  items: Array<{
    articleName: string;
    quantity: number;
  }>;
  estimatedPreparationTime: number;
};

/**
 * Represents the summary of an order constructed from the shopping cart.
 * Handles calculation of separated token costs and submission eligibility.
 */
export class OrderSummary {
  private readonly cartItems: CartItem[];

  private constructor(cartItems: CartItem[]) {
    this.cartItems = cartItems;
  }

  /**
   * Creates an OrderSummary from a list of cart items.
   */
  static create(cartItems: CartItem[]): OrderSummary {
    return new OrderSummary(cartItems);
  }

  /**
   * Calculates the total drink token cost for all items in the cart.
   */
  get totalDrinkTokenCost(): number {
    return this.cartItems.reduce(
      (total, item) => total + item.drinkTokenCost * item.quantity,
      0,
    );
  }

  /**
   * Calculates the total food token cost for all items in the cart.
   */
  get totalFoodTokenCost(): number {
    return this.cartItems.reduce(
      (total, item) => total + item.foodTokenCost * item.quantity,
      0,
    );
  }

  /**
   * Determines if the order can be submitted based on cart content and balance.
   * An order can be submitted if:
   * 1. The cart is not empty
   * 2. The festival goer has sufficient drink tokens
   * 3. The festival goer has sufficient food tokens
   */
  canBeSubmitted(balance: Balance): boolean {
    const isEmpty = this.cartItems.length === 0;
    const insufficientDrinkTokens =
      balance.drinkTokens < this.totalDrinkTokenCost;
    const insufficientFoodTokens = balance.foodTokens < this.totalFoodTokenCost;

    return (
      !isEmpty && !insufficientDrinkTokens && !insufficientFoodTokens
    );
  }

  /**
   * Builds a confirmation summary with items and estimated preparation time.
   * The preparation time is the maximum estimated time among all items in the cart.
   */
  buildConfirmationSummary(): ConfirmationSummary {
    const items = this.cartItems.map((item) => ({
      articleName: item.articleName,
      quantity: item.quantity,
    }));

    const estimatedPreparationTime = Math.max(
      ...this.cartItems.map((item) => item.estimatedPreparationTime ?? 0),
      0,
    );

    return {
      items,
      estimatedPreparationTime,
    };
  }
}
