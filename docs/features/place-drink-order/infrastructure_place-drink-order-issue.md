# Commander une boisson : impact package infrastructure

**Contexte**
Le package infrastructure doit fournir l'adapter réseau chargé de traduire la commande frontend en requête HTTP vers l'API, puis de convertir la réponse ou l'erreur en données exploitables par l'application.

**Critères d'acceptation**
Feature: Place a drink order through frontend infrastructure

1. Scenario: Send all ordered drinks to the backend API
    Given a place-order command containing 1 non-alcoholic drink, 1 normal alcoholic drink, and 1 premium alcoholic drink
    When the HTTP adapter sends the request
    Then it calls the configured order endpoint once
    And the request body contains the 3 selected drink items

2. Scenario: Map a successful order response
    Given the backend responds with orderId "order-1", status "pending", totalDrinkTokens 3, and remainingDrinkTokens 1
    When the HTTP adapter parses the response
    Then it returns a frontend result with order id "order-1"
    And the total drink token cost is 3
    And the remaining drink token balance is 1

3. Scenario: Map an insufficient tokens API error
    Given the backend responds with status 422 and an "InsufficientTokens" error payload
    When the HTTP adapter parses the error response
    Then it returns a typed insufficient tokens failure for the frontend application

4. Scenario: Surface a network failure during order placement
    Given the network request cannot reach the backend
    When the HTTP adapter sends the place-order request
    Then it returns a transport failure result
    And no successful order payload is produced