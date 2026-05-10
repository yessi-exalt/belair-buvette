# Commander une boisson : impact package application

**Contexte**
Le package application doit orchestrer la commande de boissons depuis le panier frontend : vérifier que la sélection est encore valide par rapport au solde courant, déclencher la soumission, vider le panier en cas de succès et préserver l'état en cas d'échec.

**Critères d'acceptation**
Feature: Place a drink order from the frontend application layer

1. Scenario: Submit a valid drink order from the cart
    Given a cart containing 1 non-alcoholic drink, 1 normal alcoholic drink, and 1 premium alcoholic drink
    And a current balance of 4 drink tokens
    When the frontend application submits the order
    Then it sends a place-order request with all selected drinks
    And it returns a result containing a total cost of 3 drink tokens
    And it updates the remaining drink token balance to 1

2. Scenario: Block submission when the cart exceeds the current balance
    Given a cart containing 1 normal alcoholic drink and 1 premium alcoholic drink
    And a current balance of 2 drink tokens
    When the frontend application evaluates whether the order can be submitted
    Then the order is marked as not submittable
    And no submission request is sent

3. Scenario: Preserve the cart when order submission fails
    Given a valid cart containing 1 normal alcoholic drink
    And a current balance of 3 drink tokens
    And the place-order request fails with an insufficient tokens error from the backend
    When the frontend application handles the failed submission
    Then the cart contents are preserved
    And the failure result exposes an insufficient tokens error state

4. Scenario: Clear the cart after a successful submission
    Given a valid cart containing 1 premium alcoholic drink
    And a current balance of 3 drink tokens
    When the frontend application receives a successful place-order response
    Then the cart is cleared
    And the returned order status is pending