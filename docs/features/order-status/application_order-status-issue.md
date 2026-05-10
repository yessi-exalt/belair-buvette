# Suivre l'état de la commande : impact package application

**Contexte**
Le package application doit orchestrer la récupération périodique de l'état de la commande (toutes les 30 secondes) et exposer l'état courant ainsi que le temps de préparation restant calculé par le domain.

**Critères d'acceptation**
Feature: Order status application use case

1. Scenario: Charger l'état initial d'une commande
    Given une commande identifiée par son id
    When l'application charge l'état de la commande
    Then elle retourne l'état courant, le statut et le temps de préparation estimé

2. Scenario: Déclencher un rafraîchissement automatique toutes les 30 secondes
    Given une commande à l'état Acknowledged
    When l'application active le rafraîchissement automatique
    Then elle déclenche une nouvelle récupération après 30 secondes
    And l'état retourné reflète la dernière réponse de l'API

3. Scenario: Retourner une erreur lorsque la commande est introuvable
    Given un id de commande inconnu
    When l'application tente de charger l'état de la commande
    Then elle retourne une erreur de commande introuvable
