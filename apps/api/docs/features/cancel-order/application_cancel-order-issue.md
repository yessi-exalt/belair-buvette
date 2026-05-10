# Cancel Order : Application Layer impact

**Context**
The application layer must orchestrate order cancellation: validate the order is still in Pending state, trigger the domain cancellation, persist the cancelled order, save the refunded drink and food token balances, and send a cancellation confirmation.

**Acceptance Criteria**
Feature: Cancel order application use case

1. Scenario: Successfully cancel a Pending order
    Given a festival goer with 2 drink tokens and 1 food token
    And a Pending order costing 3 drink tokens and 2 food tokens
    When the cancel order use case is executed
    Then the order is cancelled
    And the festival goer's balances are restored to 5 drink tokens and 3 food tokens
    And the order repository is updated with the Cancelled status
    And a cancellation confirmation is sent to the festival goer

2. Scenario: Fail to cancel an Acknowledged order
    Given an order in Acknowledged state
    When the cancel order use case is executed
    Then it fails with an OrderNotCancellableError
    And no changes are persisted

3. Scenario: Fail when the order is not found
    Given a cancel command with an unknown order id
    When the use case is executed
    Then it fails with an OrderNotFoundError
