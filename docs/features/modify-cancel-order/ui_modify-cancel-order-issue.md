# Modifier ou annuler une commande : impact package ui

**Contexte**
La page Order Status affiche un bouton "Edit Order" et un bouton "Cancel Order" uniquement pour les commandes Pending. "Edit Order" ouvre le panier pré-rempli. "Cancel Order" affiche une boîte de dialogue de confirmation. Après annulation, une bannière de succès apparaît et le solde est mis à jour.

**Critères d'acceptation**
Feature: Modify or cancel order UI

1. Scenario: Afficher les boutons Edit et Cancel pour une commande Pending
    Given une commande à l'état Pending
    When la page Order Status est rendue
    Then le bouton "Edit Order" est visible
    And le bouton "Cancel Order" est visible

2. Scenario: Ouvrir le panier pré-rempli en cliquant sur Edit Order
    Given une commande Pending contenant 1 boisson alcoolisée normale
    When le festivalier clique sur "Edit Order"
    Then le panier s'ouvre avec la boisson alcoolisée normale déjà ajoutée

3. Scenario: Afficher la boîte de dialogue de confirmation avant annulation
    Given une commande Pending visible sur la page Order Status
    When le festivalier clique sur "Cancel Order"
    Then une boîte de dialogue de confirmation s'affiche avant l'annulation effective

4. Scenario: Afficher une bannière de succès après annulation confirmée
    Given le festivalier confirme l'annulation d'une commande Pending
    When l'annulation est traitée avec succès
    Then une bannière de succès s'affiche
    And le solde de tokens est mis à jour sur la page
