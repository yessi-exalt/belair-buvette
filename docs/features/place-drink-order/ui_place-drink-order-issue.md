# Commander une boisson : impact package ui

**Contexte**
Le package ui doit fournir les composants permettant de sélectionner une ou plusieurs boissons, afficher le coût total en temps réel et empêcher la validation d'une commande quand le solde de drink tokens est insuffisant.

**Critères d'acceptation**
Feature: Place a drink order through the frontend UI

1. Scenario: Add several drinks and display the running token total
    Given a festival goer with 4 drink tokens on the order screen
    When they add 1 non-alcoholic drink, 1 normal alcoholic drink, and 1 premium alcoholic drink to the cart
    Then the cart displays 3 selected drink items
    And the running drink token total displays 3

2. Scenario: Disable order confirmation when the balance is insufficient
    Given a festival goer with 2 drink tokens on the order screen
    And a cart containing 1 normal alcoholic drink and 1 premium alcoholic drink
    When the cart summary is rendered
    Then the place-order button is disabled
    And a message explaining that there are not enough drink tokens is visible

3. Scenario: Allow order confirmation when the balance is sufficient
    Given a festival goer with 4 drink tokens on the order screen
    And a cart containing 1 normal alcoholic drink and 1 premium alcoholic drink
    When the cart summary is rendered
    Then the place-order button is enabled
    And the displayed running drink token total is 3

4. Scenario: Show an error state after an insufficient tokens response
    Given a festival goer confirms a cart containing 1 normal alcoholic drink and 1 premium alcoholic drink
    And the backend rejects the order with an insufficient tokens error
    When the UI receives the failed submission result
    Then an error message is displayed to the festival goer
    And the selected drinks remain visible in the cart