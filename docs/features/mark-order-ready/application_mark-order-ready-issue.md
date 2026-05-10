# Mark Order Ready : Application Layer impact

**Context**
The application layer must orchestrate the mark-as-ready flow: retrieve the order, load the prepared item counts, validate the order is Acknowledged and fulfillable, transition it to Ready for Pickup via the domain, persist the updated order, and notify the festival goer.

**Acceptance Criteria**
Feature: Mark order ready application use case

1. Scenario: Successfully mark an Acknowledged order as ready
    Given an Acknowledged order with id "order-1"
    And enough prepared items are available
    When the mark order ready use case is executed
    Then the order transitions to Ready for Pickup
    And the order repository is updated
    And the festival goer is notified

2. Scenario: Fail when prepared items are insufficient
    Given an Acknowledged order with id "order-1"
    And prepared items are insufficient to fulfill it
    When the mark order ready use case is executed
    Then it fails with an OrderNotReadyError
    And no changes are persisted

3. Scenario: Fail when the order is not found
    Given a mark-ready command with an unknown order id
    When the use case is executed
    Then it fails with an OrderNotFoundError
