# Examples

Use these examples to infer the expected level of decomposition, the output format,
and when to ask for clarification instead of inventing missing requirements.

## Positive Example 1: simple request, single feature + shared UI

Input: "As a festival goer, I want to add items to a cart and see the running total"

Output:
Two files: one for the order-cart feature slice, one for the shared token-balance utility component.

file `docs/features/order-cart/feature_order-cart-issue.md`
```markdown
# Order Cart : Feature Slice impact (order-cart)
**Context**
A festival goer wants to add drink and food items to a cart and see the running
drink and food token totals update in real time before placing their order.

**Acceptance Criteria**
Feature: Add items to cart and see the running total

1. Scenario: Add a drink item to an empty cart
    Given an authenticated festival goer with 6 drink tokens and an empty cart
    When they click "Add to cart" on a normal alcoholic drink
    Then the cart sidebar shows 1 item
    And the running drink token total displays 1

2. Scenario: Running total updates for mixed items
    Given a festival goer with 6 drink tokens and 9 food tokens
    When they add 1 premium alcoholic drink and 1 meal to the cart
    Then the drink token subtotal displays 2
    And the food token subtotal displays 3

3. Scenario: Add button is disabled when balance would be exceeded
    Given a festival goer with 1 drink token
    And a premium alcoholic drink (cost: 2 tokens) in the catalogue
    When the cart is rendered
    Then the "Add to cart" button for the premium drink is disabled
    And a tooltip "Not enough drink tokens" is visible on hover

4. Scenario: Remove an item from the cart
    Given a cart with 1 normal alcoholic drink
    When the festival goer clicks the remove icon on that item
    Then the cart is empty
    And the running drink token total displays 0

5. Scenario: Adjust item quantity in the cart
    Given a cart with 1 non-alcoholic drink
    When the festival goer increases the quantity to 3
    Then the cart shows quantity 3 for that item
    And the food token subtotal remains 0
```

file `docs/features/order-cart/shared_token-balance-display-issue.md`
```markdown
# Token Balance Display : Shared Layer impact
**Context**
A reusable TokenBalance component is needed to display drink and food token counts
consistently across the cart, order status page, and menu page.

**Acceptance Criteria**
Feature: Token balance display component

1. Scenario: Render a normal balance
    Given drinkTokens = 4 and foodTokens = 7
    When the TokenBalance component is rendered
    Then it displays "4" for drink tokens with the drink icon
    And it displays "7" for food tokens with the food icon

2. Scenario: Render a zero drink token balance
    Given drinkTokens = 0 and foodTokens = 5
    When the TokenBalance component is rendered
    Then the drink token count is greyed out
    And the label "No drink tokens remaining" is visible

3. Scenario: Render a fully zero balance
    Given drinkTokens = 0 and foodTokens = 0
    When the TokenBalance component is rendered
    Then both counts are greyed out
    And the label "No tokens remaining" is visible for each type

4. Scenario: Component is responsive
    Given the TokenBalance component
    When rendered on a mobile viewport (375px)
    Then it remains legible and does not overflow its container
```

## Positive Example 2: complex request, multiple frontend slices

Input: "As a festival goer, I want to place my order from the cart, confirm it, and then track it from the order status page"

Output:
Three files: one for the order-cart feature slice, one for the order-confirmation feature slice, and one for the order-status page flow.

file `docs/features/order-cart/feature_place-order-from-cart-issue.md`
```markdown
# Place Order From Cart : Feature Slice impact (order-cart)
**Context**
The existing cart must validate balances, expose a place-order action, and remain the source
of truth for the pending order payload.

**Acceptance Criteria**
Feature: Place order from cart

1. Scenario: Place Order button is enabled for a valid cart
    Given a cart containing 1 snack and 1 normal alcoholic drink
    And the festival goer has 9 food tokens and 6 drink tokens
    When the cart drawer is rendered
    Then the "Place Order" button is enabled

2. Scenario: Place Order button is disabled for an empty cart
    Given an empty cart
    When the cart drawer is rendered
    Then the "Place Order" button is disabled

3. Scenario: Place Order button is disabled when totals exceed balance
    Given a cart total of 3 drink tokens
    And the festival goer has 2 drink tokens remaining
    When the cart drawer is rendered
    Then the "Place Order" button is disabled
    And an explanatory message is visible
```

file `docs/features/order-confirmation/feature_order-confirmation-issue.md`
```markdown
# Order Confirmation : Feature Slice impact (order-confirmation)
**Context**
Before submission, the festival goer must review a confirmation modal summarizing the order,
its token cost, and the estimated preparation time.

**Acceptance Criteria**
Feature: Confirm an order before submission

1. Scenario: Open the confirmation modal from the cart
    Given a non-empty valid cart
    When the festival goer clicks "Place Order"
    Then a confirmation modal opens
    And it lists all items, quantities, drink subtotal, and food subtotal

2. Scenario: Confirm submission successfully
    Given the confirmation modal is open
    When the festival goer clicks "Confirm order"
    Then the order is submitted once
    And the cart is cleared
    And the user is redirected to the Order Status page

3. Scenario: Submission failure preserves the cart
    Given the confirmation modal is open
    And the backend returns a network error
    When the festival goer clicks "Confirm order"
    Then an error toast is displayed
    And the cart contents remain unchanged
```

file `docs/features/order-status/page_order-status-issue.md`
```markdown
# Order Status Page : Page impact
**Context**
After order placement, the festival goer needs a dedicated page to monitor the order lifecycle.

**Acceptance Criteria**
Feature: Track current order status

1. Scenario: Redirect to order status after confirmation
    Given the order submission succeeds
    When the frontend receives the created order id
    Then it navigates to the Order Status page for that order

2. Scenario: Show acknowledgement countdown
    Given an order in Acknowledged state with 6 minutes remaining
    When the page renders
    Then a live countdown is displayed

3. Scenario: Show ready banner
    Given an order in Ready for Pickup state
    When the page renders
    Then a full-width success banner displays "Your order is ready!"

4. Scenario: Auto-refresh the order state
    Given the Order Status page is open
    When 30 seconds elapse
    Then the order status is refreshed automatically
```

## Positive Example 3: ambiguous request, clarify instead of guessing

Input: "I want a better order experience"

Output:
No issue file yet. Ask for clarification because the request is too broad to map reliably to slices, pages, or acceptance criteria.

```markdown
I need clarification before generating issue files.

Questions:
1. Does "better order experience" refer to browsing the menu, editing the cart, confirming the order, or tracking order status?
2. Do you expect a new feature slice, a page change, or only UX improvements inside an existing flow?
3. What user-visible outcome should be considered successful?

If you want, I can then create one or more issue files once the scope is precise.
```

## Negative Example 1: wrong decomposition

Input: "As a festival goer, I want to add items to a cart and see the running total"

Incorrect Output:
```markdown
Create one file `docs/features/cart-and-token-balance-and-menu-and-order-status.md` covering everything related to orders.
```

Why this is incorrect:
- It collapses unrelated concerns into one oversized issue.
- It does not respect the distinction between a feature slice and a shared UI component.
- It makes implementation and testing harder because there is no clear ownership boundary.

## Negative Example 2: inventing scope that was not requested

Input: "As a festival goer, I want to browse the menu on the web app"

Incorrect Output:
```markdown
Generate issues for menu browsing, cart, payment, bartender dashboard, and analytics because they are probably needed next.
```

Why this is incorrect:
- It adds payment and analytics although they are not part of the request.
- It expands the scope instead of staying anchored to the user story.
- It reduces trust because the generated work no longer matches the input.

## Negative Example 3: weak acceptance criteria

Input: "As a developer, I want a Token Balance component to display the festival goer's current balance"

Incorrect Output:
```markdown
Acceptance Criteria:
- The component works well
- The UI looks nice
- The user sees their tokens
```

Why this is incorrect:
- The criteria are not testable.
- Important states are missing, especially zero balances and responsive rendering.
- The wording is too vague to drive implementation or automated tests.
