# Mark Order Ready : Infrastructure Layer impact

**Context**
Infrastructure must retrieve the Acknowledged order, load the prepared item counts needed to fulfill it, persist the order with Ready for Pickup status, and trigger a notification to inform the festival goer that their order is ready for collection.

**Acceptance Criteria**
Feature: Mark order ready — persistence

1. Scenario: Retrieve the Acknowledged order and prepared item counts before marking it ready
    Given a stored Acknowledged order with id "order-1"
    And a prepared item store containing the current prepared counts
    When the mark-ready flow loads its dependencies
    Then it returns the order with Acknowledged status
    And it returns the prepared item counts

2. Scenario: Persist the order with Ready for Pickup status
    Given an Acknowledged order marked as ready by the domain
    When the order repository saves the updated order
    Then the stored order has status Ready for Pickup

3. Scenario: Notify the festival goer that their order is ready
    Given an order successfully marked as ready
    When the notification gateway sends the ready notification
    Then the festival goer receives a notification indicating their order is ready for pickup
