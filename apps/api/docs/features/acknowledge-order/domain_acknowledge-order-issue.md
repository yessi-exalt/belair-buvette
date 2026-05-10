# Acknowledge Order : Domain Layer impact

**Context**
The domain must model order acknowledgement and the calculation of estimated preparation time based on current workload and order contents. Non-alcoholic drinks take 1 minute per type, normal alcoholic drinks 2 minutes per drink, premium alcoholic drinks 3 minutes per drink, snacks 2 minutes per snack type, and meals 10 minutes per meal type plus the longest drink preparation time in the order.

**Acceptance Criteria**
Feature: Acknowledge order domain rules

1. Scenario: Calculate preparation time for distinct non-alcoholic drinks
    Given an order containing 2 different non-alcoholic drinks
    And a current workload of 0 minutes
    When the domain calculates the estimated preparation time
    Then the estimated time is 2 minutes

2. Scenario: Calculate preparation time for an order with meals and drinks plus workload
    Given an order containing 1 meal and 1 premium alcoholic drink
    And a current workload of 5 minutes
    When the domain calculates the estimated preparation time
    Then the estimated time is 18 minutes

3. Scenario: Calculate preparation time for normal alcoholic drinks plus workload
    Given an order containing 2 normal alcoholic drinks
    And a current workload of 4 minutes
    When the domain calculates the estimated preparation time
    Then the estimated time is 8 minutes

4. Scenario: Transition the order to Acknowledged state with the computed ready time
    Given a Pending order
    And a current workload of 4 minutes
    When the domain acknowledges the order with the calculated estimated preparation time
    Then the order transitions to Acknowledged state
    And the estimated preparation time is recorded
