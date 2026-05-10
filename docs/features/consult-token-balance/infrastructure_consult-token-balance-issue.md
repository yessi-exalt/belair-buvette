# Consult Token Balance : Infrastructure Layer impact

**Context**
Infrastructure must provide a repository adapter able to retrieve a festival goer aggregate and expose its current drink and food token balances for the application layer.

**Acceptance Criteria**
Feature: Consult token balance persistence

1. Scenario: Retrieve a festival goer by id from the repository
    Given a stored festival goer with id "goer-1" and 4 drink tokens
    When the festival goer repository is queried with id "goer-1"
    Then it returns the festival goer aggregate with 4 drink tokens

2. Scenario: Return nothing when the festival goer is not found
    Given no festival goer with id "unknown-id" in the repository
    When the repository is queried with "unknown-id"
    Then it returns a not-found result

3. Scenario: Retrieve both drink and food token balances correctly
    Given a stored festival goer with 3 drink tokens and 8 food tokens
    When the repository retrieves the festival goer
    Then the returned aggregate exposes 3 drink tokens and 8 food tokens
