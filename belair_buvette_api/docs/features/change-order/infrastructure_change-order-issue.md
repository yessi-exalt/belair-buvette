# Change Order : Infrastructure Layer impact

**Context**
Infrastructure must retrieve the existing order and festival goer, persist direct modifications for Pending orders, and persist bartender review requests for Acknowledged orders together with the required notification.

**Acceptance Criteria**
Feature: Change order — persistence

1. Scenario: Retrieve the existing order before processing a change
    Given a stored order with id "order-1"
    When the order repository is queried with "order-1"
    Then it returns the order with its current items and status

2. Scenario: Persist a directly modified Pending order
    Given a Pending order modified to contain 2 normal alcoholic drinks and 1 snack
    When the order repository saves the updated order
    Then the stored order reflects the revised items and costs

3. Scenario: Persist a bartender review request for an Acknowledged order
    Given an Acknowledged order with requested revised items
    When the change request repository saves the review request
    Then the stored request contains the original order id and the requested revised items
    And the bartender notification is emitted
