# Commander une boisson : impact package domain

**Contexte**
Le package domain du frontend doit modéliser les boissons commandables, le panier de boissons et les règles de calcul du coût total en drink tokens. Il doit aussi exposer une règle testable indiquant si une commande d'une ou plusieurs boissons reste compatible avec le solde disponible.

**Critères d'acceptation**
Feature: Place a drink order on the frontend domain model

1. Scenario: Calculate the cost of a mixed drink selection
    Given a drink selection with 1 non-alcoholic drink, 1 normal alcoholic drink, and 1 premium alcoholic drink
    When the frontend domain calculates the total drink token cost
    Then the total cost is 3 drink tokens

2. Scenario: Mark a drink selection as affordable when the balance is sufficient
    Given a festival goer balance of 4 drink tokens
    And a drink selection costing 3 drink tokens
    When the frontend domain evaluates whether the selection can be ordered
    Then the selection is marked as affordable

3. Scenario: Mark a drink selection as not affordable when the balance is insufficient
    Given a festival goer balance of 2 drink tokens
    And a drink selection containing 1 normal alcoholic drink and 1 premium alcoholic drink
    When the frontend domain evaluates whether the selection can be ordered
    Then the selection is marked as not affordable
    And the computed total cost remains 3 drink tokens

4. Scenario: Keep non-alcoholic drinks free in the domain model
    Given a drink selection containing 3 non-alcoholic drinks
    When the frontend domain calculates the total drink token cost
    Then the total cost is 0 drink tokens