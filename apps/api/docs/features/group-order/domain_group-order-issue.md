# Group Order : Domain Layer impact

**Context**
The domain must model a group order as a collection of token contributions from multiple festival goers. It must verify that pooled tokens are sufficient to cover the total cost and that each contributor's contribution does not exceed their available balance.

**Acceptance Criteria**
Feature: Group order domain rules

1. Scenario: Accept a group order when pooled tokens are sufficient
    Given two festival goers contributing 3 drink tokens and 2 drink tokens respectively
    And the order total is 4 drink tokens
    When the domain validates the group order
    Then the group order is accepted

2. Scenario: Reject a group order when pooled tokens are insufficient
    Given two festival goers contributing 1 drink token each
    And the order total is 4 drink tokens
    When the domain validates the group order
    Then the group order is rejected with an InsufficientPooledTokensError

3. Scenario: Reject a contribution that exceeds the contributor's balance
    Given a festival goer with 2 drink tokens
    When they attempt to contribute 3 drink tokens to a group order
    Then the contribution is rejected with an InsufficientTokensError
