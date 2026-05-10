# Group Order : Application Layer impact

**Context**
The application layer must orchestrate group order submission: aggregate contributions from all participants, validate pooled token sufficiency via the domain, persist the group order, and deduct each contributor's tokens.

**Acceptance Criteria**
Feature: Group order application use case

1. Scenario: Submit a valid group order with sufficient pooled tokens
    Given two festival goers contributing 3 and 2 drink tokens for a 4-token order
    When the group order use case is executed
    Then the group order is created and persisted
    And each contributor's token balance is updated

2. Scenario: Fail when pooled tokens are insufficient
    Given two festival goers contributing 1 drink token each for a 4-token order
    When the group order use case is executed
    Then it fails with an InsufficientPooledTokensError
    And no order is persisted

3. Scenario: Fail when a contributor's balance is insufficient for their contribution
    Given a festival goer with 1 drink token trying to contribute 2 tokens
    When the group order use case validates contributions
    Then it fails with an InsufficientTokensError for that contributor
