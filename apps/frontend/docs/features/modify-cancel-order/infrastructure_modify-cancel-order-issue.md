# Modifier ou annuler une commande : impact package infrastructure

**Contexte**
Le package infrastructure doit fournir les adapters HTTP pour soumettre une commande modifiée et pour envoyer une demande d'annulation à l'API, puis mapper les réponses ou erreurs en résultats exploitables par l'application.

**Critères d'acceptation**
Feature: Modify or cancel order infrastructure adapters

1. Scenario: Envoyer la commande modifiée au backend
    Given une commande modifiée contenant 1 boisson premium
    When l'adapter HTTP envoie la requête de modification
    Then il appelle le endpoint de modification avec les nouveaux articles
    And il retourne l'état mis à jour de la commande

2. Scenario: Envoyer la demande d'annulation au backend
    Given une commande Pending avec un orderId valide
    When l'adapter HTTP envoie la requête d'annulation
    Then il appelle le endpoint d'annulation avec l'orderId
    And il retourne un résultat de succès d'annulation

3. Scenario: Gérer une erreur d'annulation sur commande non annulable
    Given l'API répond avec une erreur "OrderNotCancellable"
    When l'adapter HTTP mappe l'erreur de la réponse
    Then il retourne un résultat de type OrderNotCancellable failure
