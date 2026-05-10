# Place a Multi-Item Order : Infrastructure Layer impact

**Context**
Infrastructure must persist multi-item orders containing both drink and food items, store both token costs, and update both the drink and food token balances of the festival goer after a successful order.

**Acceptance Criteria**
Feature: Place a multi-item order — persistence

1. Scenario: Persist an order containing both drink and food items
    Given a valid order with 1 normal alcoholic drink and 1 snack
    When the order repository saves the order
    Then the stored order contains the drink item and the food item
    And the stored drink token cost is 1 and the food token cost is 1

2. Scenario: Update both token balances after a successful multi-item order
    Given a festival goer with 4 drink tokens and 6 food tokens who placed an order costing 1 drink token and 3 food tokens
    When the festival goer repository saves the updated aggregate
    Then the persisted drink token balance is 3
    And the persisted food token balance is 3

3. Scenario: Retrieve a festival goer with both token balances for a multi-item order
    Given a stored festival goer with 4 drink tokens and 6 food tokens
    When the repository is queried before placing a multi-item order
    Then it returns the aggregate with both drink and food token balances correct
