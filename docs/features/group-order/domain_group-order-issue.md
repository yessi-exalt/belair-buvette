# Commande groupée : impact package domain

**Contexte**
Le package domain doit modéliser la contribution d'un festivalier à une commande groupée : nombre de drink tokens et food tokens à contribuer, dans la limite du solde disponible. Il doit exposer le calcul du total groupé et vérifier sa suffisance pour couvrir le coût.

**Critères d'acceptation**
Feature: Group order domain model

1. Scenario: Valider la contribution dans la limite du solde disponible
    Given un festivalier avec 4 drink tokens
    When il contribue 3 drink tokens à une commande groupée
    Then la contribution est acceptée
    And son solde restant est 1 drink token

2. Scenario: Refuser une contribution qui dépasse le solde disponible
    Given un festivalier avec 2 drink tokens
    When il tente de contribuer 3 drink tokens
    Then la contribution est refusée car elle dépasse le solde

3. Scenario: Calculer le total groupé de plusieurs contributions
    Given trois festivaliers contribuant respectivement 2, 1 et 3 drink tokens
    When le domain calcule le total groupé
    Then le total est 6 drink tokens
