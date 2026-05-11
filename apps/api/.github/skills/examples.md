# Examples

Use these examples to infer the expected split across domain, application, and
infrastructure, the required file naming, and when clarification is mandatory.

Application examples below describe use-case orchestration and repository side
effects. HTTP endpoints and controller contracts belong to infrastructure.

## Positive Example 1: simple request, one file per layer

Input: "As a festival goer, I want to place an order for a drink"

Output:
Three files, one per layer: domain, application, infrastructure.

file `docs/features/place-drink-order/domain_place-drink-order-issue.md`
```markdown
# Place a Drink Order : Domain Layer impact
**Context**
A festival goer wants to place an order for a drink. The domain must model the
drink item, its token cost rules, and the order aggregate enforcing balance constraints.

**Acceptance Criteria**
Feature: Place a drink order

1. Scenario: Successfully place an order for a non-alcoholic drink
    Given a festival goer with 3 drink tokens
    When they place an order for a non-alcoholic drink
    Then the order is created with a total cost of 0 drink tokens
    And the festival goer's drink token balance remains 3

2. Scenario: Successfully place an order for a normal alcoholic drink
    Given a festival goer with 3 drink tokens
    When they place an order for a normal alcoholic drink
    Then the order is created with a total cost of 1 drink token
    And the festival goer's drink token balance is decreased by 1

3. Scenario: Successfully place an order for a premium alcoholic drink
    Given a festival goer with 3 drink tokens
    When they place an order for a premium alcoholic drink
    Then the order is created with a total cost of 2 drink tokens
    And the festival goer's drink token balance is decreased by 2

4. Scenario: Insufficient drink tokens for an alcoholic drink
    Given a festival goer with 0 drink tokens
    When they attempt to place an order for a normal alcoholic drink
    Then the order is rejected with an InsufficientTokensError
    And the festival goer's drink token balance remains 0
```

file `docs/features/place-drink-order/application_place-drink-order-issue.md`
```markdown
# Place a Drink Order : Application Layer impact
**Context**
A festival goer wants to place an order for a drink. The application layer orchestrates
the use case, delegates to the domain, and persists the resulting order via the repository port.

**Acceptance Criteria**
Feature: Place a drink order

1. Scenario: Persist a valid drink order
    Given an authenticated festival goer with 3 drink tokens
    When the place drink order use case is executed with 1 normal alcoholic drink
    Then the use case returns a pending order result with a total cost of 1 drink token
    And the remaining drink token balance in the result is 2
    And the order repository is called to save the created order
    And the festival goer repository is called to save the updated balance

2. Scenario: Surface insufficient token errors
    Given an authenticated festival goer with 0 drink tokens
    When the place drink order use case is executed with 1 normal alcoholic drink
    Then the use case fails with an InsufficientTokensError
    And no order is persisted

3. Scenario: Reject the command when the festival goer is unknown
    Given a place drink order command for an unknown festival goer id
    When the use case is executed
    Then it fails with a FestivalGoerNotFoundError
```

file `docs/features/place-drink-order/infrastructure_place-drink-order-issue.md`
```markdown
# Place a Drink Order : Infrastructure Layer impact
**Context**
The infrastructure layer must implement the order repository port and the festival goer
repository port to persist and retrieve aggregates during order placement.

**Acceptance Criteria**
Feature: Place a drink order — persistence

1. Scenario: Persist a new order
    Given a valid Order aggregate for a non-alcoholic drink
    When the OrderRepository.save() adapter is called
    Then the order is stored in the database with status "pending" and correct token cost

2. Scenario: Retrieve a festival goer by id
    Given a festival goer record in the database with 3 drink tokens
    When FestivalGoerRepository.findById() is called with the matching id
    Then it returns a FestivalGoer domain entity with drinkTokens = 3

3. Scenario: Update festival goer token balance after order
    Given a festival goer with 3 drink tokens after placing a 1-token order
    When FestivalGoerRepository.save() is called with the updated aggregate
    Then the persisted record reflects drinkTokens = 2
```

## Positive Example 2: complex request, cross-cutting business rules

Input: "As a group of festival goers, we want to pool our tokens to place a group order"

Output:
Three files, still one per layer, but each file captures collaboration and allocation rules.

file `docs/features/group-order/domain_group-order-issue.md`
```markdown
# Group Order : Domain Layer impact
**Context**
The domain must model pooled contributions, total order cost validation, and the rule that
the group order behaves as a single order once contributions are accepted.

**Acceptance Criteria**
Feature: Pool tokens for a group order

1. Scenario: Accept a valid pooled contribution set
    Given festival goer A contributes 2 drink tokens and 1 food token
    And festival goer B contributes 1 drink token and 2 food tokens
    And the group order total cost is 3 drink tokens and 3 food tokens
    When the group order is created
    Then the order is accepted
    And each contributor's reserved balance matches their contribution

2. Scenario: Reject an underfunded group order
    Given pooled contributions totaling 2 drink tokens
    And the order requires 3 drink tokens
    When the group order is created
    Then the creation is rejected with an InsufficientPooledTokensError

3. Scenario: Reject a contributor who exceeds their balance
    Given festival goer A has 1 food token available
    When they attempt to contribute 2 food tokens
    Then the contribution is rejected
    And no group order is created
```

file `docs/features/group-order/application_group-order-issue.md`
```markdown
# Group Order : Application Layer impact
**Context**
The application layer orchestrates contributor lookup, validates contributions, creates the
group order aggregate, and persists the final result atomically.

**Acceptance Criteria**
Feature: Create a group order

1. Scenario: Create a group order from multiple contributors
    Given two known festival goers and a valid pooled payload
    When the group order use case is executed
    Then the use case returns a pending group order result containing the contributor breakdown
    And the group order repository is called to save the created order
    And each contributor balance is saved once

2. Scenario: Unknown contributor
    Given one contributor id does not exist
    When the group order use case is executed
    Then it fails with a FestivalGoerNotFoundError
    And no balances are modified

3. Scenario: Persistence failure rolls back the operation
    Given the aggregate passes domain validation
    And the order repository save fails
    When the use case completes
    Then it fails with an application persistence error
    And no contributor balance is persisted as deducted
```

file `docs/features/group-order/infrastructure_group-order-issue.md`
```markdown
# Group Order : Infrastructure Layer impact
**Context**
Infrastructure must persist the group order and contributor balance updates consistently.

**Acceptance Criteria**
Feature: Persist a group order

1. Scenario: Store contributor allocations
    Given a valid group order aggregate
    When the persistence adapter saves it
    Then each contributor allocation is stored with the order id

2. Scenario: Save contributor balances after reservation
    Given two updated FestivalGoer aggregates after contribution
    When the repository adapter persists them
    Then each remaining balance matches the reserved contribution

3. Scenario: Restore state on transaction failure
    Given the contributor balances were about to be persisted
    And the database transaction fails
    When the adapter reports the failure
    Then no partial contributor deduction remains stored
```

## Positive Example 3: ambiguous request, ask clarification first

Input: "I want the bartender workflow to be smarter"

Output:
No issue file yet. Ask for clarification because the request could refer to acknowledgement timing, ready-state transitions, change approval rules, or notifications.

```markdown
I need clarification before generating issue files.

Questions:
1. Does "smarter" refer to order acknowledgement, readiness estimation, change approval, or notifications?
2. Should the behavior change in the domain rules, only in the application orchestration, or in exposed API endpoints?
3. What concrete business rule should become true after this change?
```

## Negative Example 1: broken architecture split

Input: "As a festival goer, I want to place an order for food"

Incorrect Output:
```markdown
Create a single file `docs/features/place-food-order/full-stack-issue.md` with domain entities, API details, SQL schema, and UI ideas together.
```

Why this is incorrect:
- It ignores the one-file-per-layer expectation used in this repository.
- It mixes business rules, orchestration, and infrastructure details in one document.
- It makes ownership and testing boundaries unclear.

## Negative Example 2: violating the dependency rule in the description

Input: "As a festival goer, I want to cancel my order"

Incorrect Output:
```markdown
The domain layer should import the HTTP controller so it can directly return 200 OK when cancellation succeeds.
```

Why this is incorrect:
- The domain must remain framework-agnostic.
- HTTP concerns belong to infrastructure or application, not to domain entities or aggregates.
- The generated guidance would push implementers toward an architectural violation.

## Negative Example 3: pretending ambiguity does not exist

Input: "Handle token resets"

Incorrect Output:
```markdown
Create issues for midnight cron jobs, loyalty bonuses, refund reconciliation, and archival reporting.
```

Why this is incorrect:
- The input is too ambiguous to know whether the user means daily festival reset, transfer rollback, or another workflow.
- It invents extra features that are not present in the request.
- A clarification step is required before writing issue files.

## Negative Example 4: bad naming and wrong layer wording

Input: "As a festival goer, I want to place an order for a drink"

Incorrect Output:
```markdown
file `docs/features/place-drink-order/placeDrinkOrder.md`

# place drink order
```

Why this is incorrect:
- File names must follow `{layer}_{feature-slug}-issue.md`.
- Titles must follow `# {Feature Title} : {Layer} Layer impact`.
- Loose naming makes the target layer ambiguous and breaks repository conventions.
