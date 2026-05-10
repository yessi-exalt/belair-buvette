# Gérer le panier : impact package domain

**Contexte**
Le package domain doit modéliser le panier en séparant le coût total en drink tokens et en food tokens. Il doit exposer une règle permettant de déterminer si un article peut être ajouté compte tenu du solde courant.

**Critères d'acceptation**
Feature: Manage cart domain model

1. Scenario: Calculer séparément les sous-totaux drink et food d'un panier mixte
    Given un panier contenant 1 boisson alcoolisée normale et 1 meal
    When le domain calcule les sous-totaux du panier
    Then le sous-total drink est 1 drink token
    And le sous-total food est 3 food tokens

2. Scenario: Recalculer les sous-totaux quand la quantité d'un article change
    Given un panier contenant 1 snack
    When le domain augmente la quantité du snack à 2
    Then le sous-total food est 2 food tokens

3. Scenario: Mettre à jour les sous-totaux après la suppression d'un article
    Given un panier contenant 1 boisson alcoolisée normale et 1 meal
    When le domain supprime le meal
    Then le sous-total drink reste 1 drink token
    And le sous-total food devient 0 food token

4. Scenario: Empêcher l'ajout d'un article qui dépasserait le solde disponible
    Given un festivalier avec 2 food tokens
    And un panier contenant déjà 1 snack
    When le domain évalue si un meal peut être ajouté
    Then l'ajout est refusé car le total dépasserait le solde food disponible
