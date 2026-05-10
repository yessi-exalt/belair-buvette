# Commande groupée : impact package ui

**Contexte**
L'interface de commande groupée permet au festivalier de saisir un code de commande groupée, de sélectionner le nombre de tokens à contribuer (dans la limite de son solde), de consulter le résumé groupé et de soumettre sa contribution pour être redirigé vers la page Order Status.

**Critères d'acceptation**
Feature: Group order UI

1. Scenario: Afficher l'écran de saisie du code de commande groupée
    Given le festivalier accède à l'entrée "Join Group Order"
    When la page de commande groupée est rendue
    Then un champ de saisie pour le code de commande groupée est affiché

2. Scenario: Limiter les sélecteurs de contribution par les soldes disponibles
    Given un festivalier avec 2 drink tokens et 1 food token
    When l'écran de contribution est affiché
    Then le sélecteur de drink tokens ne dépasse pas 2
    And le sélecteur de food tokens ne dépasse pas 1

3. Scenario: Afficher le résumé groupé avec tous les montants attendus
    Given le festivalier saisit un code valide et charge la commande groupée
    When le résumé est rendu
    Then le total groupé en drink tokens et food tokens est affiché
    And le coût restant et la part de chaque contributeur sont affichés

4. Scenario: Soumettre la contribution et rediriger vers Order Status
    Given un festivalier sélectionne 2 drink tokens et 1 food token pour contribuer
    When il confirme sa contribution
    Then l'application soumet la contribution avec les deux montants sélectionnés
    And le festivalier est redirigé vers la page Order Status
