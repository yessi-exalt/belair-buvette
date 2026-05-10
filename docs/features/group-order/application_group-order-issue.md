# Commande groupée : impact package application

**Contexte**
Le package application doit orchestrer la saisie du code de commande groupée, la sélection des tokens à contribuer, l'affichage du résumé et la soumission de la contribution. Après soumission, il redirige vers la page Order Status.

**Critères d'acceptation**
Feature: Group order application use case

1. Scenario: Rejoindre une commande groupée avec un code valide
    Given un festivalier saisit un code de commande groupée valide
    When l'application charge la commande groupée
    Then elle retourne le résumé avec le total groupé et le coût restant

2. Scenario: Soumettre la contribution à une commande groupée
    Given un festivalier avec 4 drink tokens contribue 2 drink tokens
    When l'application soumet la contribution
    Then la contribution est envoyée à l'infrastructure
    And le solde restant est 2 drink tokens

3. Scenario: Retourner une erreur pour un code de commande groupée invalide
    Given un code de commande groupée invalide
    When l'application tente de charger la commande groupée
    Then elle retourne une erreur de commande groupée introuvable
