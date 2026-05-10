# Suivre l'état de la commande : impact package infrastructure

**Contexte**
Le package infrastructure doit fournir un adapter HTTP capable de récupérer l'état d'une commande depuis l'API et de mapper la réponse en modèle domain.

**Critères d'acceptation**
Feature: Order status infrastructure adapter

1. Scenario: Récupérer l'état d'une commande en cours
    Given l'API retourne un statut "acknowledged" avec un orderId et un temps de préparation estimé
    When l'adapter HTTP appelle le endpoint d'état de commande
    Then il retourne un modèle avec le statut Acknowledged et le temps de préparation

2. Scenario: Mapper l'état "ready" en Ready for Pickup
    Given l'API retourne un statut "ready"
    When l'adapter HTTP mappe la réponse
    Then il retourne un modèle avec le statut Ready for Pickup

3. Scenario: Retourner une erreur de transport en cas d'échec réseau
    Given la requête vers le endpoint d'état de commande échoue
    When l'adapter HTTP tente de récupérer l'état
    Then il retourne un résultat de type transport failure
    And aucun modèle d'état n'est produit
