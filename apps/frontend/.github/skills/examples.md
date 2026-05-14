# Examples

Use these examples to infer the expected level of decomposition across frontend
packages, the required file naming, and when to ask for clarification instead
of inventing missing requirements.

Even when the user request mentions a page, a shared component, or a feature
slice, the generated issue files must still use the repository package prefixes:
`domain_`, `application_`, `infrastructure_`, and `ui_`.

## Positive Example 1: simple request, one feature across three packages

Input: "As a festival goer, I want to add items to a cart and see the running total"

Output:
Three files: one for the domain rules, one for the application orchestration, and one for the rendered UI.

file `docs/features/manage-cart/domain_manage-cart-issue.md`
```markdown
# Manage Cart : impact package domain

**Context**
The domain package models the cart by separating the total cost into drink
tokens and food tokens. It must expose a rule that determines whether an item
can be added given the current balance.

**Acceptance Criteria**
Feature: Manage cart domain model

1. Scenario: Calculate drink and food subtotals separately for a mixed cart
    Given a cart containing 1 regular alcoholic drink and 1 meal
    When the domain calculates the cart subtotals
    Then the drink subtotal is 1 drink token
    And the food subtotal is 3 food tokens

2. Scenario: Reject adding an item that would exceed the available balance
    Given a festival goer with 2 food tokens
    And a cart already containing 1 snack
    When the domain evaluates whether a meal can be added
    Then the addition is rejected because the total would exceed the available food balance
```

file `docs/features/manage-cart/application_manage-cart-issue.md`
```markdown
# Manage Cart : impact package application

**Context**
The application package manages cart state: adding items, removing items,
adjusting quantities, and updating the total in real time. It verifies that
each addition remains compatible with the current balance before updating state.

**Acceptance Criteria**
Feature: Manage cart application use case

1. Scenario: Add an item to the cart and update subtotals in real time
    Given a festival goer with 4 drink tokens and 4 food tokens
    And an empty cart
    When the application adds 1 regular alcoholic drink and 1 snack
    Then the cart contains 2 items
    And the displayed drink subtotal is 1 drink token
    And the displayed food subtotal is 1 food token

2. Scenario: Reject adding an item when the balance is insufficient
    Given a festival goer with 1 food token
    And a cart already containing 1 snack
    When the application tries to add 1 meal
    Then the addition is rejected
    And the returned state explains that a tooltip must be displayed
```

file `docs/features/manage-cart/ui_manage-cart-issue.md`
```markdown
# Manage Cart : impact package ui

**Context**
The cart component displays the selected items, the current subtotals, and the
add or remove controls with the expected disabled states.

**Acceptance Criteria**
Feature: Manage cart UI

1. Scenario: Render the cart drawer with drink and food subtotals
    Given a festival goer adds 1 regular alcoholic drink and 1 snack to the cart
    When the cart drawer is rendered
    Then the cart displays the 2 selected items
    And the displayed drink subtotal is 1 drink token
    And the displayed food subtotal is 1 food token

2. Scenario: Disable the Add to cart button when the addition would exceed the balance
    Given a festival goer with 1 food token
    And a cart already containing 1 snack
    When the menu page is rendered with a visible meal
    Then the meal Add to cart button is disabled
    And a tooltip explaining the insufficient balance is accessible
```

## Positive Example 2: complex request, one feature across all packages

Input: "As a festival goer, I want to place my order from the cart, confirm it, and then track it from the order status page"

Output:
Four files: one per impacted package for the `order-status` feature.

file `docs/features/order-status/domain_order-status-issue.md`
```markdown
# Track Order Status : impact package domain

**Context**
The domain package describes the displayable state of an order, its transitions,
and derived information such as readable labels and timing indicators.

**Acceptance Criteria**
Feature: Order status domain model

1. Scenario: Expose a readable label for a ready order
    Given an order in the Ready for Pickup state
    When the domain exposes its trackable status
    Then the display label is consistent with an order ready to be collected
```

file `docs/features/order-status/application_order-status-issue.md`
```markdown
# Track Order Status : impact package application

**Context**
The application package orchestrates the initial order load and the periodic
refresh of its status for the order tracking page.

**Acceptance Criteria**
Feature: Order status application flow

1. Scenario: Load an order from its identifier
    Given a known order identifier
    When the application initializes order tracking
    Then it requests the corresponding order from infrastructure

2. Scenario: Refresh the order status automatically
    Given the tracking page is open
    When 30 seconds elapse
    Then the application triggers a new status load
```

file `docs/features/order-status/infrastructure_order-status-issue.md`
```markdown
# Track Order Status : impact package infrastructure

**Context**
The infrastructure package translates application calls to the API and maps the
HTTP response to the model consumed by the frontend.

**Acceptance Criteria**
Feature: Order status infrastructure adapter

1. Scenario: Map an order API response to the frontend model
    Given a backend response containing an order status and remaining time
    When the infrastructure adapter maps the response
    Then the application receives a model consistent with the frontend contract
```

file `docs/features/order-status/ui_order-status-issue.md`
```markdown
# Track Order Status : impact package ui

**Context**
The ui package renders the order tracking screen, including the ready banner,
countdown, and loading states visible to the festival goer.

**Acceptance Criteria**
Feature: Order status UI

1. Scenario: Display the countdown for an acknowledged order
    Given an acknowledged order with 6 minutes remaining
    When the tracking screen is rendered
    Then a visible countdown is displayed

2. Scenario: Display a full-screen banner for a ready order
    Given an order in the Ready for Pickup state
    When the tracking screen is rendered
    Then a visible success banner announces that the order is ready
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
- It does not respect the repository split by frontend package.
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

## Negative Example 4: wrong file prefix and wrong package mapping

Input: "As a festival goer, I want to track my current order on its own page"

Incorrect Output:
```markdown
file `docs/features/order-status/page_order-status-issue.md`

# Order Status Page : Page impact
```

Why this is incorrect:
- Frontend issue files in this repository use package prefixes such as `ui_`, not `page_`.
- A routed screen is still documented through impacted packages, especially `application_` and `ui_`.
- The title format must stay `# {Feature Title} : impact package {layer}`.

## Negative Example 5: wrong language and wrong section headers

Input: "As a developer, I want a reusable Token Balance component"

Incorrect Output:
```markdown
file `docs/features/token-balance/ui_token-balance-issue.md`

# Token Balance : impact package ui

**Context**
Reusable token balance component.

**Acceptance Criteria**
Feature: Token balance
```

Why this is incorrect:
- Frontend issue files are written in English in this repository.
- The required section headers are `**Context**` and `**Acceptance Criteria**`.
- The issue content is too vague to guide implementation or tests.
