# Suivre l'état de la commande : impact package domain

**Contexte**
Le package domain doit modéliser les états d'une commande (Pending, Acknowledged, Ready for Pickup, Cancelled) et exposer la logique de décompte du temps de préparation estimé quand la commande est à l'état Acknowledged.

**Critères d'acceptation**
Feature: Order status domain model

1. Scenario: Identifier l'état Pending d'une commande
    Given une commande à l'état Pending
    When le domain évalue son état
    Then l'état est reconnu comme Pending
    And la commande est éligible à l'annulation

2. Scenario: Calculer le temps restant pour une commande Acknowledged
    Given une commande à l'état Acknowledged avec 8 minutes de préparation estimées
    And 3 minutes se sont écoulées depuis l'acquittement
    When le domain calcule le temps restant
    Then le temps restant est 5 minutes

3. Scenario: Marquer la commande comme prête pour le retrait
    Given une commande passant à l'état Ready for Pickup
    When le domain évalue son état
    Then l'état est reconnu comme Ready for Pickup
    And un indicateur de bannière de succès est activé
