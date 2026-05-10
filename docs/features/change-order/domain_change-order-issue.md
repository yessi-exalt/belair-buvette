# Change Order : Domain Layer impact

**Context**
The domain must enforce that a Pending order can be modified immediately, while an Acknowledged order produces a change request that must be reviewed by the bartender. Any requested change must still satisfy the festival goer's drink and food token balance constraints.

**Acceptance Criteria**
Feature: Change order domain rules

1. Scenario: Allow direct modification of a Pending order
    Given an order in Pending state
    When the domain evaluates a requested item change
    Then the order can be modified immediately

2. Scenario: Create a bartender review request for an Acknowledged order
    Given an order in Acknowledged state
    When the domain evaluates a requested item change
    Then the order is not modified immediately
    And a bartender review request is required

3. Scenario: Reject a requested change when the revised order exceeds the available balances
    Given a festival goer with 2 drink tokens and 1 food token
    And a Pending order currently costing 1 drink token and 1 food token
    When the domain evaluates adding 1 premium drink and 1 meal to the order
    Then the requested change is rejected because the revised order exceeds the available balances
