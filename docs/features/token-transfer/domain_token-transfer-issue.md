# Transférer des tokens : impact package domain

**Contexte**
Le package domain doit modéliser les règles de transfert : jusqu'à 3 drink tokens et 3 food tokens par transaction, dans la limite du solde disponible du festivalier émetteur.

**Critères d'acceptation**
Feature: Token transfer domain rules

1. Scenario: Autoriser un transfert dans la limite de 3 drink tokens
    Given un festivalier avec 5 drink tokens
    When il transfère 3 drink tokens à un autre festivalier
    Then le transfert est autorisé
    And son solde restant est 2 drink tokens

2. Scenario: Refuser un transfert dépassant le maximum de 3 drink tokens par transaction
    Given un festivalier avec 5 drink tokens
    When il tente de transférer 4 drink tokens
    Then le transfert est refusé car il dépasse le maximum de 3 par transaction

3. Scenario: Refuser un transfert qui dépasse le solde disponible
    Given un festivalier avec 2 drink tokens
    When il tente de transférer 3 drink tokens
    Then le transfert est refusé car le solde est insuffisant
