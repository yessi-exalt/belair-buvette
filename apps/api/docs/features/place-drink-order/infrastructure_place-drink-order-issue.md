# Place a Drink Order : Infrastructure Layer impact
**Context**
Infrastructure must provide repository adapters able to retrieve a festival goer, persist a drink order containing one or several items, and save the updated token balance after a successful order.

**Acceptance Criteria**
Feature: Place a drink order — persistence

1. Scenario: Retrieve a festival goer before placing the order
    Given a stored festival goer with 4 drink tokens
    When the festival goer repository is queried by id
    Then it returns the matching FestivalGoer aggregate with 4 drink tokens

2. Scenario: Persist a multi-drink order
    Given a valid order containing 1 non-alcoholic drink, 1 normal alcoholic drink, and 1 premium alcoholic drink
    When the order repository saves the order
    Then the stored order contains all ordered drink items
    And the stored total drink token cost is 3
    And the stored status is pending

3. Scenario: Persist the updated drink token balance after a successful order
    Given a festival goer with 4 drink tokens who successfully placed a 3-token drink order
    When the festival goer repository saves the updated aggregate
    Then the persisted remaining drink token balance is 1