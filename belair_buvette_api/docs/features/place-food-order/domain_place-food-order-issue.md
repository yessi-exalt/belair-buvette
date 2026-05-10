# Place a Food Order : Domain Layer impact

**Context**
The domain must model food order items (snacks and meals), compute the total food token cost for a food order, and reject the order when the available food token balance is insufficient.

**Acceptance Criteria**
Feature: Place a food order

1. Scenario: Place an order for a snack
    Given a festival goer with 3 food tokens
    When they place an order containing 1 snack
    Then the order is created with a total cost of 1 food token
    And the festival goer's remaining food token balance is 2

2. Scenario: Place an order for a meal
    Given a festival goer with 6 food tokens
    When they place an order containing 1 meal
    Then the order is created with a total cost of 3 food tokens
    And the festival goer's remaining food token balance is 3

3. Scenario: Reject a food order when the balance is insufficient
    Given a festival goer with 2 food tokens
    When they attempt to place an order containing 1 meal costing 3 food tokens
    Then the order is rejected with an InsufficientTokensError
    And the festival goer's remaining food token balance is still 2

4. Scenario: Calculate the total food token cost for a mixed food order
    Given an order containing 2 snacks and 1 meal
    When the total food token cost is calculated
    Then the total cost is 5 food tokens
