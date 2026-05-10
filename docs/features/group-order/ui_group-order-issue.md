# Commande groupée : impact package ui

**Contexte**
L'interface de commande groupée permet au festivalier de saisir un code de commande groupée, de sélectionner le nombre de tokens à contribuer (dans la limite de son solde), de consulter le résumé groupé et de soumettre sa contribution pour être redirigé vers la page Order Status.

**Critères d'acceptation**
Feature: Group order UI

1. Scenario: Afficher l'écran de saisie du code de commande groupée
    Given le festivalier accède à l'entrée "Join Group Order"
    When la page de commande groupée est rendue
    Then un champ de saisie pour le code de commande groupée est affiché

2. Scenario: Afficher le résumé après saisie d'un code valide
    Given le festivalier saisit un code valide et charge la commande groupée
    When le résumé est rendu
    Then le total groupé, le coût restant et la part de chaque contributeur sont affichés

3. Scenario: Sélectionner la contribution et la valider
    Given un festivalier avec 4 drink tokens sur l'écran de sélection
    When il sélectionne 2 drink tokens et confirme sa contribution
    Then l'application soumet la contribution avec les montants sélectionnés
    And le festivalier est redirigé vers la page Order Status
