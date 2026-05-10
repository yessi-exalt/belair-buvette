# Place a Drink Order : Application Layer impact
**Context**
The application layer must orchestrate drink order placement for one or several drinks: load the festival goer, delegate cost and balance validation to the domain, persist the created order, and persist the updated token balance.

**Acceptance Criteria**
Feature: Place a drink order

1. Scenario: Persist a valid multi-drink order
    Given an authenticated festival goer with 4 drink tokens
    When the place drink order use case is executed with 1 non-alcoholic drink, 1 normal alcoholic drink, and 1 premium alcoholic drink
    Then the use case returns a pending order result with a total cost of 3 drink tokens
    And the remaining drink token balance in the result is 1
    And the order repository is called to save the created order
    And the festival goer repository is called to save the updated balance

2. Scenario: Surface insufficient token errors for a multi-drink order
    Given an authenticated festival goer with 2 drink tokens
    When the place drink order use case is executed with 1 normal alcoholic drink and 1 premium alcoholic drink
    Then the use case fails with an InsufficientTokensError
    And no order is persisted

3. Scenario: Reject the command when the festival goer is unknown
    Given a place drink order command for an unknown festival goer id
    When the use case is executed
    Then it fails with a FestivalGoerNotFoundError