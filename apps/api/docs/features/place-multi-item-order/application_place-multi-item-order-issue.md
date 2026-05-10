# Place a Multi-Item Order : Application Layer impact

**Context**
The application layer must orchestrate multi-item order placement combining drinks and food, delegating cost and dual-balance validation to the domain, persisting the order, and updating both token balances.

**Acceptance Criteria**
Feature: Place a multi-item order use case

1. Scenario: Persist a valid multi-item order with drinks and food
    Given a festival goer with 4 drink tokens and 6 food tokens
    When the place multi-item order use case is executed with 1 normal drink and 1 meal
    Then the use case returns a pending order with drink cost 1 and food cost 3
    And the remaining drink token balance is 3
    And the remaining food token balance is 3
    And the order repository saves the full order

2. Scenario: Fail when drink tokens are insufficient in a multi-item order
    Given a festival goer with 0 drink tokens and 6 food tokens
    When the use case is executed with 1 normal drink and 1 meal
    Then it fails with an InsufficientTokensError for drink tokens
    And no order is persisted

3. Scenario: Fail when food tokens are insufficient in a multi-item order
    Given a festival goer with 4 drink tokens and 2 food tokens
    When the use case is executed with 1 normal drink and 1 meal
    Then it fails with an InsufficientTokensError for food tokens
    And no order is persisted
