# Place a Food Order : Application Layer impact

**Context**
The application layer must orchestrate food order placement: load the festival goer, delegate cost and balance validation to the domain, persist the created order, and persist the updated food token balance.

**Acceptance Criteria**
Feature: Place a food order use case

1. Scenario: Persist a valid food order
    Given an authenticated festival goer with 6 food tokens
    When the place food order use case is executed with 1 snack and 1 meal
    Then the use case returns a pending order with a total cost of 4 food tokens
    And the remaining food token balance in the result is 2
    And the order repository is called to save the created order

2. Scenario: Surface insufficient token errors for a food order
    Given an authenticated festival goer with 2 food tokens
    When the place food order use case is executed with 1 meal costing 3 food tokens
    Then the use case fails with an InsufficientTokensError
    And no order is persisted

3. Scenario: Reject the command when the festival goer is unknown
    Given a place food order command for an unknown festival goer id
    When the use case is executed
    Then it fails with a FestivalGoerNotFoundError
