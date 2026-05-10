# Passer la commande depuis le panier : impact package domain

**Contexte**
Le package domain du frontend doit modéliser le résumé de commande construit à partir du panier, avec les coûts séparés en drink tokens et food tokens, l'indicateur de soumission possible et le temps de préparation estimé affiché dans la confirmation.

**Critères d'acceptation**
Feature: Place an order from the cart on the frontend domain model

1. Scenario: Calculer les coûts séparés d'un panier mixte
    Given un panier contenant 1 boisson alcoolisée normale et 1 meal
    When le frontend domain calcule le résumé de commande
    Then le coût total en drink tokens est 1
    And le coût total en food tokens est 3

2. Scenario: Marquer une commande comme soumettable quand le panier n'est pas vide et que les soldes sont suffisants
    Given un panier contenant 1 boisson alcoolisée normale et 1 snack
    And un solde de 3 drink tokens et 4 food tokens
    When le frontend domain évalue si la commande peut être passée
    Then la commande est marquée comme soumettable

3. Scenario: Refuser la soumission d'une commande vide
    Given un panier vide
    When le frontend domain évalue si la commande peut être passée
    Then la commande est marquée comme non soumettable

4. Scenario: Construire un résumé de confirmation avec le temps de préparation estimé
    Given un panier contenant 1 boisson alcoolisée normale et 1 snack
    When le frontend domain construit le résumé de confirmation
    Then le résumé liste les 2 articles sélectionnés
    And le résumé contient un temps de préparation estimé