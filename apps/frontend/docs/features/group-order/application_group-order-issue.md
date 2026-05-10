# Commande groupée : impact package application

**Contexte**
Le package application doit orchestrer la saisie du code de commande groupée, la sélection des tokens à contribuer, l'affichage du résumé et la soumission de la contribution. Après soumission, il redirige vers la page Order Status.

**Critères d'acceptation**
Feature: Group order application use case

1. Scenario: Rejoindre une commande groupée avec un code valide
    Given un festivalier saisit un code de commande groupée valide
    When l'application charge la commande groupée
    Then elle retourne le résumé avec les totaux groupés en drink tokens et food tokens
    And elle retourne le coût restant et la part de chaque contributeur

2. Scenario: Soumettre une contribution mixte à une commande groupée
    Given un festivalier avec 4 drink tokens et 3 food tokens contribue 2 drink tokens et 1 food token
    When l'application soumet la contribution
    Then la contribution est envoyée à l'infrastructure avec les deux montants
    And le résultat prépare une redirection vers la page Order Status

3. Scenario: Refuser une contribution qui dépasse le solde disponible
    Given un festivalier avec 1 drink token et 1 food token
    When l'application tente de contribuer 2 drink tokens et 1 food token
    Then elle retourne une erreur de solde insuffisant
    And aucune requête de contribution n'est envoyée

4. Scenario: Retourner une erreur pour un code de commande groupée invalide
    Given un code de commande groupée invalide
    When l'application tente de charger la commande groupée
    Then elle retourne une erreur de commande groupée introuvable
