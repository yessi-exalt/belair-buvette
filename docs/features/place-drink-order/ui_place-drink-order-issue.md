# Passer la commande depuis le panier : impact package ui

**Contexte**
Le package ui doit fournir les composants permettant de confirmer une commande depuis le panier : activer le bouton seulement quand le panier est non vide et finançable, afficher une modale de confirmation avec le résumé complet et le temps de préparation estimé, rediriger vers Order Status en cas de succès et afficher un toast en cas d'erreur.

**Critères d'acceptation**
Feature: Place an order from the cart through the frontend UI

1. Scenario: Activer le bouton Place Order seulement quand le panier est valide
    Given un festivalier avec 3 drink tokens et 4 food tokens
    And un panier contenant 1 boisson alcoolisée normale et 1 snack
    When le résumé du panier est rendu
    Then le bouton "Place Order" est activé

2. Scenario: Afficher une modale de confirmation avec le résumé complet et le temps estimé
    Given un panier valide contenant 1 boisson alcoolisée normale et 1 snack
    When le festivalier clique sur "Place Order"
    Then une modale de confirmation affiche tous les articles du panier
    And la modale affiche les coûts séparés en drink tokens et food tokens
    And la modale affiche le temps de préparation estimé

3. Scenario: Rediriger vers Order Status et mettre à jour le solde après confirmation
    Given le festivalier confirme une commande valide depuis la modale
    When la soumission réussit
    Then l'interface redirige vers la page Order Status
    And l'affichage du solde de tokens est mis à jour immédiatement

4. Scenario: Préserver le panier et afficher un toast en cas d'erreur réseau
    Given le festivalier confirme une commande valide depuis la modale
    And la soumission échoue à cause d'une erreur réseau
    When l'interface reçoit le résultat d'échec
    Then le panier reste affiché avec ses articles
    And un toast d'erreur est affiché