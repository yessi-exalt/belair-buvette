# Cancel Order : Infrastructure Layer impact

**Context**
Infrastructure must retrieve the order to be cancelled, update its status to Cancelled, save the refunded drink and food token balances for the festival goer, and emit the cancellation confirmation.

**Acceptance Criteria**
Feature: Cancel order — persistence

1. Scenario: Retrieve the order before cancellation
    Given a stored Pending order with id "order-1"
    When the order repository is queried with "order-1"
    Then it returns the order with Pending status

2. Scenario: Persist the order with Cancelled status
    Given a Pending order that has been cancelled by the domain
    When the order repository saves the cancelled order
    Then the stored order has status Cancelled

3. Scenario: Save the refunded drink and food token balances and send confirmation
    Given a festival goer whose cancelled order cost 3 drink tokens and 2 food tokens
    When the festival goer repository saves the updated aggregate after cancellation
    Then the persisted drink token balance is increased by 3
    And the persisted food token balance is increased by 2
    And the cancellation notification is sent to the festival goer
