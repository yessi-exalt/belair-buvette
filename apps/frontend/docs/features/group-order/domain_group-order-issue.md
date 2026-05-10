# Commande groupée : impact package domain

**Contexte**
Le package domain doit modéliser la contribution d'un festivalier à une commande groupée : nombre de drink tokens et food tokens à contribuer, dans la limite du solde disponible. Il doit exposer le calcul du total groupé et vérifier sa suffisance pour couvrir le coût.

**Critères d'acceptation**
Feature: Group order domain model

1. Scenario: Valider une contribution mixte dans la limite des soldes disponibles
    Given un festivalier avec 4 drink tokens et 3 food tokens
    When il contribue 2 drink tokens et 1 food token à une commande groupée
    Then la contribution est acceptée
    And son solde restant est 2 drink tokens et 2 food tokens

2. Scenario: Refuser une contribution qui dépasse l'un des soldes disponibles
    Given un festivalier avec 2 drink tokens et 1 food token
    When il tente de contribuer 2 drink tokens et 2 food tokens
    Then la contribution est refusée car elle dépasse le solde disponible

3. Scenario: Calculer les totaux groupés et le coût restant
    Given deux festivaliers contribuent respectivement 2 drink tokens et 1 food token puis 1 drink token et 2 food tokens
    And le coût total de la commande groupée est de 5 drink tokens et 4 food tokens
    When le domain calcule le résumé groupé
    Then le total groupé est 3 drink tokens et 3 food tokens
    And le coût restant est 2 drink tokens et 1 food token
