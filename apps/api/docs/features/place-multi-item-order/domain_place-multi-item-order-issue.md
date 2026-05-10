# Place a Multi-Item Order : Domain Layer impact

**Context**
The domain must model an order containing both drink and food items, compute the total drink and food token costs separately, and reject the order when either token balance is insufficient to cover its respective cost.

**Acceptance Criteria**
Feature: Place a multi-item order

1. Scenario: Calculate separate drink and food token costs for a mixed order
    Given an order containing 1 normal alcoholic drink and 1 snack
    When the domain calculates the total costs
    Then the total drink token cost is 1
    And the total food token cost is 1

2. Scenario: Reject a mixed order when the drink token balance is insufficient
    Given a festival goer with 1 drink token and 5 food tokens
    When they attempt to place an order with 1 premium alcoholic drink and 1 snack
    Then the order is rejected with an InsufficientTokensError for drink tokens

3. Scenario: Reject a mixed order when the food token balance is insufficient
    Given a festival goer with 3 drink tokens and 1 food token
    When they attempt to place an order with 1 normal alcoholic drink and 1 meal
    Then the order is rejected with an InsufficientTokensError for food tokens

4. Scenario: Accept a mixed order when both balances are sufficient
    Given a festival goer with 3 drink tokens and 5 food tokens
    When they place an order with 1 normal alcoholic drink and 1 snack
    Then the order is created with drink token cost 1 and food token cost 1
