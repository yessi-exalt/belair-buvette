# Place a Drink Order : Domain Layer impact
**Context**
A festival goer wants to order one or several drinks depending on their available drink token balance. The domain must model drink order items, compute the total token cost for a multi-drink order, and reject the order when the available balance is insufficient.

**Acceptance Criteria**
Feature: Place a drink order

1. Scenario: Place an order for a non-alcoholic drink
    Given a festival goer with 3 drink tokens
    When they place an order containing 1 non-alcoholic drink
    Then the order is created with a total cost of 0 drink tokens
    And the festival goer's remaining drink token balance is 3

2. Scenario: Place an order for several drinks within the available balance
    Given a festival goer with 4 drink tokens
    When they place an order containing 1 non-alcoholic drink, 1 normal alcoholic drink, and 1 premium alcoholic drink
    Then the order is created with a total cost of 3 drink tokens
    And the festival goer's remaining drink token balance is 1

3. Scenario: Reject an order when the total cost exceeds the available balance
    Given a festival goer with 2 drink tokens
    When they attempt to place an order containing 1 normal alcoholic drink and 1 premium alcoholic drink
    Then the order is rejected with an InsufficientTokensError
    And the festival goer's remaining drink token balance is still 2

4. Scenario: Calculate the total token cost from all ordered drinks
    Given an order containing 1 non-alcoholic drink, 1 normal alcoholic drink, and 1 premium alcoholic drink
    When the total drink token cost is calculated
    Then the total cost is 3 drink tokens