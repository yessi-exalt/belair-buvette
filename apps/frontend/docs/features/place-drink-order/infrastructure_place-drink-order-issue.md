# Passer la commande depuis le panier : impact package infrastructure

**Contexte**
Le package infrastructure doit fournir l'adapter réseau chargé de traduire la commande confirmée du panier en requête HTTP vers l'API, puis de convertir la réponse ou l'erreur en données exploitables par l'application pour la redirection, la mise à jour des soldes et l'affichage d'erreur.

**Critères d'acceptation**
Feature: Place an order from the cart through frontend infrastructure

1. Scenario: Envoyer tous les articles du panier au backend
    Given une commande confirmée contenant 1 boisson alcoolisée normale et 1 snack
    When l'adapter HTTP envoie la requête
    Then il appelle le endpoint de place-order une seule fois
    And le corps de la requête contient les 2 articles du panier

2. Scenario: Mapper une réponse de succès avec les soldes mis à jour
    Given le backend répond avec orderId "order-1", status "pending", remainingDrinkTokens 2, remainingFoodTokens 3, and estimatedPreparationTime 6
    When l'adapter HTTP parse la réponse
    Then il retourne un résultat frontend avec l'identifiant "order-1"
    And il retourne les soldes restants en drink tokens et food tokens
    And il retourne le temps de préparation estimé

3. Scenario: Mapper une erreur d'insuffisance de tokens
    Given le backend répond avec le statut 422 et un payload d'erreur "InsufficientTokens"
    When l'adapter HTTP parse la réponse d'erreur
    Then il retourne un résultat d'échec typé pour l'application frontend

4. Scenario: Remonter une erreur réseau lors de la soumission
    Given la requête réseau ne peut pas joindre le backend
    When l'adapter HTTP envoie la commande confirmée
    Then il retourne un résultat de type transport failure
    And aucun payload de succès n'est produit