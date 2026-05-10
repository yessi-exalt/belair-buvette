# Consult Token Balance : Application Layer impact

**Context**
The application layer must expose a use case that loads the current token balance for a given festival goer and returns both drink and food token amounts.

**Acceptance Criteria**
Feature: Consult token balance use case

1. Scenario: Return the current balance for a known festival goer
    Given a stored festival goer with 4 drink tokens and 7 food tokens
    When the get balance use case is executed with the festival goer id
    Then it returns a result containing 4 drink tokens and 7 food tokens

2. Scenario: Fail gracefully when the festival goer is unknown
    Given a get balance command with an unknown festival goer id
    When the use case is executed
    Then it fails with a FestivalGoerNotFoundError

3. Scenario: Return a zero balance when both token types are exhausted
    Given a festival goer with 0 drink tokens and 0 food tokens
    When the get balance use case is executed
    Then it returns a result containing 0 drink tokens and 0 food tokens
