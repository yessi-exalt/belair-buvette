# Passer la commande depuis le panier : impact package application

**Contexte**
Le package application doit orchestrer la confirmation de la commande depuis le panier frontend : vérifier que le panier n'est pas vide, calculer le résumé complet avec le temps de préparation estimé, soumettre la commande confirmée, mettre à jour les soldes et préserver le panier en cas d'échec.

**Critères d'acceptation**
Feature: Place an order from the cart in the frontend application layer

1. Scenario: Construire le résumé complet avant la soumission finale
    Given un panier contenant 1 boisson alcoolisée normale et 1 snack
    And un solde de 3 drink tokens et 4 food tokens
    When le frontend application prépare la confirmation de commande
    Then il retourne le détail complet des articles du panier
    And il retourne les coûts séparés en drink tokens et food tokens
    And il retourne un temps de préparation estimé

2. Scenario: Soumettre une commande confirmée et préparer la redirection
    Given un panier confirmé contenant 1 boisson alcoolisée normale et 1 snack
    And un solde de 3 drink tokens et 4 food tokens
    When le frontend application soumet la commande
    Then il envoie une requête de place-order avec tous les articles du panier
    And il retourne un résultat contenant l'identifiant de commande et l'état pending
    And il retourne les soldes mis à jour pour préparer l'affichage immédiat

3. Scenario: Bloquer la soumission quand le panier est vide
    Given un panier vide
    When le frontend application évalue si la commande peut être soumise
    Then la commande est marquée comme non soumettable
    And aucune requête n'est envoyée

4. Scenario: Préserver le panier et exposer un état de toast en cas d'erreur réseau
    Given un panier confirmé contenant 1 boisson alcoolisée normale
    And la requête place-order échoue à cause d'une erreur réseau
    When le frontend application traite l'échec de soumission
    Then le panier est préservé
    And le résultat expose un état d'erreur destiné à un toast