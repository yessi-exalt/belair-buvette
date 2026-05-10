# Transférer des tokens : impact package domain

**Contexte**
Le package domain doit modéliser les règles de transfert : jusqu'à 3 drink tokens et 3 food tokens par transaction, dans la limite du solde disponible du festivalier émetteur.

**Critères d'acceptation**
Feature: Token transfer domain rules

1. Scenario: Autoriser un transfert mixte dans la limite de 3 tokens par type
    Given un festivalier avec 5 drink tokens et 4 food tokens
    When il transfère 3 drink tokens et 2 food tokens à un autre festivalier
    Then le transfert est autorisé
    And son solde restant est 2 drink tokens et 2 food tokens

2. Scenario: Refuser un transfert dépassant le maximum par type
    Given un festivalier avec 5 drink tokens et 5 food tokens
    When il tente de transférer 4 drink tokens et 1 food token
    Then le transfert est refusé car il dépasse le maximum autorisé pour les drink tokens

3. Scenario: Refuser un transfert qui dépasse le solde disponible
    Given un festivalier avec 2 drink tokens et 1 food token
    When il tente de transférer 2 drink tokens et 2 food tokens
    Then le transfert est refusé car le solde est insuffisant
