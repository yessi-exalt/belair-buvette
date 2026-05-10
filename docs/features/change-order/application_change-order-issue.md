# Change Order : Application Layer impact

**Context**
The application layer must orchestrate order modification: apply direct changes for Pending orders, create bartender review requests for Acknowledged orders, recalculate revised costs, and keep the festival goer's token balances consistent.

**Acceptance Criteria**
Feature: Change order application use case

1. Scenario: Successfully modify a Pending order
    Given a festival goer with 4 drink tokens and 4 food tokens
    And a Pending order costing 1 drink token and 1 food token
    When the change order use case adds 1 normal drink to the order
    Then the updated order is persisted with the revised items and costs
    And the festival goer's remaining balances are updated accordingly

2. Scenario: Create a bartender review request for an Acknowledged order
    Given an order in Acknowledged state
    When the change order use case is executed with revised items
    Then it records a change request for bartender review
    And the bartender is notified of the requested changes

3. Scenario: Fail when the revised order exceeds the available balance
    Given a festival goer with 1 drink token and 1 food token
    And a Pending order costing 1 drink token and 1 food token
    When the change order use case attempts to add 1 premium drink and 1 meal
    Then it fails with an InsufficientTokensError
    And the original order is preserved
