# Gérer le panier : impact package application

**Contexte**
Le package application gère l'état du panier : ajout d'articles, suppression, ajustement des quantités et mise à jour du total en temps réel. Il vérifie que chaque ajout reste compatible avec le solde courant avant de modifier l'état.

**Critères d'acceptation**
Feature: Manage cart application use case

1. Scenario: Ajouter un article au panier et mettre à jour les sous-totaux en temps réel
    Given un festivalier avec 4 drink tokens et 4 food tokens
    And un panier vide
    When l'application ajoute 1 boisson alcoolisée normale et 1 snack
    Then le panier contient 2 articles
    And le sous-total drink affiché est 1 drink token
    And le sous-total food affiché est 1 food token

2. Scenario: Ajuster la quantité d'un article et recalculer les sous-totaux
    Given un panier contenant 1 snack
    When l'application augmente la quantité du snack à 2
    Then le sous-total food affiché est 2 food tokens

3. Scenario: Supprimer un article du panier et mettre à jour les sous-totaux
    Given un panier contenant 1 boisson alcoolisée normale et 1 meal
    When l'application supprime le meal
    Then le panier contient uniquement la boisson alcoolisée normale
    And le sous-total food affiché est 0 food token

4. Scenario: Refuser l'ajout d'un article quand le solde est insuffisant
    Given un festivalier avec 1 food token
    And un panier contenant déjà 1 snack
    When l'application tente d'ajouter 1 meal
    Then l'ajout est refusé
    And l'état retourné explique qu'un tooltip doit être affiché
