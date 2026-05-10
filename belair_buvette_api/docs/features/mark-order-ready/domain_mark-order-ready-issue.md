# Mark Order Ready : Domain Layer impact

**Context**
The domain must enforce that an order can only be marked as ready if it is in Acknowledged state and there are enough prepared items to fulfill it. Upon the transition, the order moves to Ready for Pickup state and the festival goer can be notified for collection.

**Acceptance Criteria**
Feature: Mark order ready domain rules

1. Scenario: Allow marking an Acknowledged order as ready when enough items are prepared
    Given an order in Acknowledged state
    And enough prepared items exist to fulfill the order
    When the domain evaluates whether it can be marked as ready
    Then the transition to Ready for Pickup is allowed

2. Scenario: Reject marking an order as ready when prepared items are insufficient
    Given an order in Acknowledged state
    And the prepared items are insufficient to fulfill the order
    When the domain attempts to mark it as ready
    Then the transition is rejected with an OrderNotReadyError

3. Scenario: Reject marking a Pending order as ready
    Given an order in Pending state
    When the domain attempts to mark it as ready
    Then the transition is rejected with an OrderNotReadyError
