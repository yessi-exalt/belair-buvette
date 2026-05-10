# Modifier ou annuler une commande : impact package application

**Contexte**
Le package application doit orchestrer l'ouverture du panier pré-rempli avec les articles de la commande existante pour modification, et la demande d'annulation avec confirmation. Après annulation réussie, le solde de tokens est mis à jour.

**Critères d'acceptation**
Feature: Modify or cancel order application use case

1. Scenario: Pré-remplir le panier avec les articles de la commande existante
    Given une commande Pending contenant 1 boisson alcoolisée normale et 1 boisson non alcoolisée
    When l'application ouvre le panier en mode modification
    Then le panier est pré-rempli avec les 2 articles de la commande

2. Scenario: Soumettre la commande modifiée en respectant le solde
    Given un panier en modification contenant 1 boisson premium
    And un festivalier avec 3 drink tokens
    When l'application soumet la modification
    Then la commande modifiée est soumise avec le nouvel article
    And le solde restant est 1 drink token

3. Scenario: Annuler une commande Pending et rembourser le solde
    Given une commande Pending dont le coût était de 2 drink tokens
    When l'application annule la commande après confirmation
    Then la commande est annulée
    And le solde de drink tokens est restauré de 2 drink tokens
