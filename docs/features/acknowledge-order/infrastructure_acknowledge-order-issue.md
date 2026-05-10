# Acknowledge Order : Infrastructure Layer impact

**Context**
Infrastructure must retrieve the Pending order, load the current workload snapshot, persist the order with Acknowledged status and estimated preparation time, and provide a notification gateway to inform the festival goer.

**Acceptance Criteria**
Feature: Acknowledge order — persistence

1. Scenario: Retrieve the Pending order and current workload before acknowledgement
    Given a stored Pending order with id "order-1"
    And a workload repository containing a current workload snapshot
    When the acknowledge flow loads its dependencies
    Then it returns the Pending order with its items
    And it returns the current workload value

2. Scenario: Persist the order with Acknowledged status and preparation time
    Given an order acknowledged with 8 minutes preparation time
    When the order repository saves the acknowledged order
    Then the stored order has status Acknowledged
    And the stored estimated preparation time is 8 minutes

3. Scenario: Notify the festival goer via the notification gateway
    Given an order successfully acknowledged with a preparation time
    When the notification gateway sends the acknowledgement notification
    Then the festival goer receives a notification with the estimated preparation time
