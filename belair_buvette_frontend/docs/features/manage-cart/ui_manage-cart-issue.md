# Gérer le panier : impact package ui

**Contexte**
Le composant panier (sidebar ou drawer) affiche les articles sélectionnés, le total courant en drink tokens et en food tokens séparément, et permet de supprimer des articles ou d'ajuster les quantités. Le bouton "Add to cart" est désactivé avec un tooltip explicatif quand l'ajout dépasserait le solde.

**Critères d'acceptation**
Feature: Manage cart UI

1. Scenario: Afficher le panier dans un drawer avec les sous-totaux drink et food
    Given un festivalier ajoute 1 boisson alcoolisée normale et 1 snack au panier
    When le drawer du panier est rendu
    Then le panier affiche les 2 articles sélectionnés
    And le sous-total drink affiché est 1 drink token
    And le sous-total food affiché est 1 food token

2. Scenario: Ajuster la quantité d'un article depuis le panier
    Given un panier contenant 1 snack
    When le festivalier augmente la quantité du snack à 2
    Then la quantité affichée pour le snack est 2
    And le sous-total food affiché est 2 food tokens

3. Scenario: Supprimer un article du panier et mettre à jour les sous-totaux
    Given un panier contenant 1 boisson alcoolisée normale et 1 meal
    When le festivalier supprime le meal du panier
    Then le meal n'est plus visible dans le panier
    And le sous-total food affiché est 0 food token

4. Scenario: Désactiver le bouton Add to cart quand l'ajout dépasserait le solde
    Given un festivalier avec 1 food token
    And un panier contenant déjà 1 snack
    When la page menu est rendue avec un meal visible
    Then le bouton "Add to cart" du meal est désactivé
    And un tooltip expliquant l'insuffisance de solde est accessible
