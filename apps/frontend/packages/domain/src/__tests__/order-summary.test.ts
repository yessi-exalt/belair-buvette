import { describe, expect, it } from 'vitest';

import { OrderSummary } from '../order-summary.js';
import type { CartItem } from '../cart-item.js';

describe('OrderSummary', () => {
  describe('Scenario 1: Calculate separated costs from a mixed cart', () => {
    it('calculer les coûts séparés d\'un panier mixte', () => {
      // Arrange
      const cartItems: CartItem[] = [
        {
          articleName: 'Mojito',
          quantity: 1,
          drinkTokenCost: 1,
          foodTokenCost: 0,
        },
        {
          articleName: 'Meal',
          quantity: 1,
          drinkTokenCost: 0,
          foodTokenCost: 3,
        },
      ];

      // Act
      const summary = OrderSummary.create(cartItems);

      // Assert
      expect(summary.totalDrinkTokenCost).toBe(1);
      expect(summary.totalFoodTokenCost).toBe(3);
    });
  });

  describe('Scenario 2: Mark order as submittable when cart is not empty and balance is sufficient', () => {
    it('marquer une commande comme soumettable quand le panier n\'est pas vide et que les soldes sont suffisants', () => {
      // Arrange
      const cartItems: CartItem[] = [
        {
          articleName: 'Mojito',
          quantity: 1,
          drinkTokenCost: 1,
          foodTokenCost: 0,
        },
        {
          articleName: 'Snack',
          quantity: 1,
          drinkTokenCost: 0,
          foodTokenCost: 2,
        },
      ];
      const balance = { drinkTokens: 3, foodTokens: 4 };

      // Act
      const summary = OrderSummary.create(cartItems);
      const isSubmittable = summary.canBeSubmitted(balance);

      // Assert
      expect(isSubmittable).toBe(true);
    });
  });

  describe('Scenario 3: Refuse submission of empty cart', () => {
    it('refuser la soumission d\'une commande vide', () => {
      // Arrange
      const cartItems: CartItem[] = [];
      const balance = { drinkTokens: 3, foodTokens: 4 };

      // Act
      const summary = OrderSummary.create(cartItems);
      const isSubmittable = summary.canBeSubmitted(balance);

      // Assert
      expect(isSubmittable).toBe(false);
    });
  });

  describe('Scenario 4: Build confirmation summary with estimated prep time', () => {
    it('construire un résumé de confirmation avec le temps de préparation estimé', () => {
      // Arrange
      const cartItems: CartItem[] = [
        {
          articleName: 'Mojito',
          quantity: 1,
          drinkTokenCost: 1,
          foodTokenCost: 0,
          estimatedPreparationTime: 2,
        },
        {
          articleName: 'Snack',
          quantity: 1,
          drinkTokenCost: 0,
          foodTokenCost: 2,
          estimatedPreparationTime: 3,
        },
      ];

      // Act
      const summary = OrderSummary.create(cartItems);
      const confirmationSummary = summary.buildConfirmationSummary();

      // Assert
      expect(confirmationSummary.items).toHaveLength(2);
      expect(confirmationSummary.items).toEqual([
        {
          articleName: 'Mojito',
          quantity: 1,
        },
        {
          articleName: 'Snack',
          quantity: 1,
        },
      ]);
      expect(confirmationSummary.estimatedPreparationTime).toBe(3);
    });
  });
});
