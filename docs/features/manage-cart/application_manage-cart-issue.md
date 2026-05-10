# Gérer le panier : impact package application

**Contexte**
Le package application gère l'état du panier : ajout d'articles, suppression, ajustement des quantités et mise à jour du total en temps réel. Il vérifie que chaque ajout reste compatible avec le solde courant avant de modifier l'état.

**Critères d'acceptation**
Feature: Manage cart application use case

1. Scenario: Ajouter un article au panier quand le solde est suffisant
    Given un festivalier avec 4 drink tokens
    And un panier vide
    When l'application ajoute 1 boisson alcoolisée normale
    Then le panier contient 1 article
    And le total affiché est 1 drink token

2. Scenario: Refuser l'ajout d'un article quand le solde est insuffisant
    Given un festivalier avec 1 drink token
    And un panier contenant déjà 1 boisson alcoolisée normale
    When l'application tente d'ajouter 1 boisson premium
    Then l'ajout est refusé
    And le panier reste inchangé

3. Scenario: Supprimer un article du panier et mettre à jour le total
    Given un panier contenant 1 boisson alcoolisée normale et 1 boisson premium
    When l'application supprime la boisson premium
    Then le panier contient uniquement la boisson alcoolisée normale
    And le total affiché est 1 drink token
