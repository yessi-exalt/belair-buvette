# Rappels d'hydratation : impact package domain

**Contexte**
Le package domain doit modéliser les règles de déclenchement des rappels d'hydratation : toutes les heures entre 11h et 19h, ou toutes les 30 minutes si le festivalier a passé plus de 3 commandes de boissons alcoolisées dans la dernière heure.

**Critères d'acceptation**
Feature: Hydration reminder domain rules

1. Scenario: Déclencher un rappel avec la fréquence horaire normale
    Given il est 14h00 et le festivalier a passé 2 commandes alcoolisées dans la dernière heure
    When le domain évalue si un rappel doit être affiché
    Then un rappel est déclenché avec la fréquence horaire normale

2. Scenario: Déclencher un rappel toutes les 30 minutes après plus de 3 commandes alcoolisées
    Given il est 15h30 et le festivalier a passé 4 commandes alcoolisées dans la dernière heure
    When le domain évalue si un rappel doit être affiché
    Then un rappel est déclenché avec une fréquence de 30 minutes

3. Scenario: Ne pas déclencher de rappel en dehors de la plage horaire
    Given il est 20h00
    When le domain évalue si un rappel doit être affiché
    Then aucun rappel n'est déclenché
