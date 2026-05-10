# Consult Token Balance : Domain Layer impact

**Context**
The domain must model the FestivalGoer aggregate with its two token balances (drink tokens and food tokens). It must enforce that balances are always non-negative and expose the daily allocation rules (6 drink tokens and 9 food tokens per day, no carry-over).

**Acceptance Criteria**
Feature: Consult token balance

1. Scenario: Retrieve the drink and food token balances for a festival goer
    Given a festival goer with 4 drink tokens and 7 food tokens
    When the domain reads the balance
    Then it returns 4 drink tokens and 7 food tokens

2. Scenario: Prevent a negative drink token balance
    Given a festival goer with 0 drink tokens
    When an attempt is made to deduct 1 drink token
    Then the domain raises an InsufficientTokensError
    And the drink token balance remains 0

3. Scenario: Apply the daily allocation on a new festival day
    Given a festival goer on a new festival day with 0 tokens
    When the daily allocation is applied
    Then the festival goer receives 6 drink tokens and 9 food tokens
