# Gérer le panier : impact package ui

**Contexte**
Le composant panier (sidebar ou drawer) affiche les articles sélectionnés, le total courant en drink tokens et en food tokens séparément, et permet de supprimer des articles ou d'ajuster les quantités. Le bouton "Add to cart" est désactivé avec un tooltip explicatif quand l'ajout dépasserait le solde.

**Critères d'acceptation**
Feature: Manage cart UI

1. Scenario: Ajouter plusieurs boissons et afficher le total courant
    Given un festivalier avec 4 drink tokens sur la page menu
    When il ajoute 1 boisson non alcoolisée, 1 boisson normale et 1 boisson premium au panier
    Then le panier affiche 3 articles sélectionnés
    And le total en drink tokens affiché est 3

2. Scenario: Désactiver le bouton "Add to cart" quand le solde est insuffisant
    Given un festivalier avec 1 drink token
    And un panier contenant 1 boisson alcoolisée normale
    When la page menu est rendue avec la boisson premium visible
    Then le bouton "Add to cart" de la boisson premium est désactivé
    And un tooltip expliquant l'insuffisance de solde est accessible

3. Scenario: Supprimer un article du panier et mettre à jour le total
    Given un panier contenant 1 boisson normale et 1 boisson premium
    When le festivalier supprime la boisson premium du panier
    Then la boisson premium n'est plus dans le panier
    And le total en drink tokens affiché est 1
