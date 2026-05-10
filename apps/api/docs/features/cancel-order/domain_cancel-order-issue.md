# Cancel Order : Domain Layer impact

**Context**
The domain must enforce that an order can only be cancelled while in Pending state. Upon cancellation, the drink and food tokens used for the order must be fully refunded and a cancellation confirmation can be emitted to the festival goer.

**Acceptance Criteria**
Feature: Cancel order domain rules

1. Scenario: Allow cancellation of a Pending order
    Given an order in Pending state
    When the domain evaluates whether it can be cancelled
    Then cancellation is allowed

2. Scenario: Reject cancellation of an Acknowledged order
    Given an order in Acknowledged state
    When the domain evaluates whether it can be cancelled
    Then cancellation is rejected with an OrderNotCancellableError

3. Scenario: Refund the full drink and food token cost upon cancellation
    Given a festival goer with 2 drink tokens and 1 food token remaining
    And a Pending order that cost 3 drink tokens and 2 food tokens
    When the domain cancels the order
    Then the festival goer's balance is restored to 5 drink tokens and 3 food tokens

4. Scenario: Produce a cancellation confirmation after a successful cancellation
    Given a Pending order has been cancelled by the domain
    When the cancellation result is built
    Then a cancellation confirmation is available for the festival goer
