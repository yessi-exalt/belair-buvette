# Place a Food Order : Infrastructure Layer impact

**Context**
Infrastructure must provide repository adapters able to retrieve a festival goer, persist a food order containing one or several food items, and save the updated food token balance after a successful order.

**Acceptance Criteria**
Feature: Place a food order — persistence

1. Scenario: Retrieve a festival goer before placing the food order
    Given a stored festival goer with 6 food tokens
    When the festival goer repository is queried by id
    Then it returns the matching FestivalGoer aggregate with 6 food tokens

2. Scenario: Persist a food order with multiple items
    Given a valid order containing 2 snacks and 1 meal
    When the order repository saves the order
    Then the stored order contains all ordered food items
    And the stored total food token cost is 5
    And the stored status is pending

3. Scenario: Persist the updated food token balance after a successful order
    Given a festival goer with 6 food tokens who successfully placed a 4-token food order
    When the festival goer repository saves the updated aggregate
    Then the persisted remaining food token balance is 2
