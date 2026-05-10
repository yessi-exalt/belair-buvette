# Acknowledge Order : Application Layer impact

**Context**
The application layer must orchestrate order acknowledgement: retrieve the order, load the current workload, trigger the domain acknowledgement with preparation time calculation, persist the acknowledged order, and notify the festival goer.

**Acceptance Criteria**
Feature: Acknowledge order application use case

1. Scenario: Successfully acknowledge a Pending order with current workload
    Given a Pending order with 2 normal alcoholic drinks
    And the current workload is 4 minutes
    When the acknowledge order use case is executed
    Then the order transitions to Acknowledged with an estimated preparation time of 8 minutes
    And the order repository is updated
    And the festival goer is notified

2. Scenario: Fail to acknowledge an order that is not Pending
    Given an order already in Acknowledged state
    When the acknowledge order use case is executed
    Then it fails with an OrderAlreadyAcknowledgedError

3. Scenario: Fail when the order is not found
    Given an acknowledge command with an unknown order id
    When the acknowledge order use case is executed
    Then it fails with an OrderNotFoundError
