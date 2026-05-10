# Group Order : Infrastructure Layer impact

**Context**
Infrastructure must persist group orders with all contributor records and update each contributing festival goer's token balance after a successful group order.

**Acceptance Criteria**
Feature: Group order — persistence

1. Scenario: Persist a group order with all contributor records
    Given a group order from two festival goers with their respective contributions
    When the order repository saves the group order
    Then the stored group order contains both contributor records with their contributed amounts

2. Scenario: Deduct tokens from each contributor's balance
    Given two festival goers who contributed 3 and 2 drink tokens respectively
    When the festival goer repository saves the updated aggregates
    Then the first festival goer's drink token balance is reduced by 3
    And the second festival goer's drink token balance is reduced by 2

3. Scenario: Retrieve all contributing festival goers before persisting
    Given a group order command referencing two festival goer ids
    When the festival goer repository is queried
    Then both festival goer aggregates are returned for validation
