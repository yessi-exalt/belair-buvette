# Modifier ou annuler une commande : impact package domain

**Contexte**
Le package domain doit modéliser les règles de modification et d'annulation d'une commande : seule une commande à l'état Pending peut être modifiée ou annulée. Les mêmes règles de coût et de solde s'appliquent à la commande modifiée.

**Critères d'acceptation**
Feature: Modify or cancel order domain rules

1. Scenario: Autoriser la modification d'une commande Pending
    Given une commande à l'état Pending
    When le domain évalue si la commande peut être modifiée
    Then la modification est autorisée

2. Scenario: Refuser la modification d'une commande Acknowledged
    Given une commande à l'état Acknowledged
    When le domain évalue si la commande peut être modifiée
    Then la modification est refusée

3. Scenario: Valider que la commande modifiée respecte le solde disponible
    Given un festivalier avec 2 drink tokens
    And une commande Pending contenant 1 boisson alcoolisée normale
    When le domain évalue une modification ajoutant 1 boisson premium
    Then la modification est refusée car le total dépasserait le solde
