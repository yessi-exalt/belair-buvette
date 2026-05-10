# Reference — create-issue

## Output format

Each issue is a standalone Markdown file with: `# Title`, `**Context**`, `**Acceptance Criteria**` (Gherkin), `**Notes**` (optional).

## File naming convention

Files follow the pattern `{layer}_{feature-slug}-issue.md` and live under `docs/features/{feature-slug}/`.

Example: `docs/features/place-drink-order/domain_place-drink-order-issue.md`

## Layer split strategy

For every feature request, produce **one file per architecture layer**:

| File prefix | Layer |
|---|---|
| `domain_` | Core business logic — entities, aggregates, value objects, domain rules |
| `application_` | Use-case orchestration — command handlers, repository port wiring |
| `infrastructure_` | Adapters — repository implementations, HTTP controllers, persistence |

If the request touches only one or two layers, omit the files for layers with no impact. If the request is ambiguous, ask a clarifying question before generating files.

## Title format

`# {Feature Title} : {Layer} Layer impact`

Examples:
- `# Place a Drink Order : Domain Layer impact`
- `# Place a Drink Order : Application Layer impact`
- `# Place a Drink Order : Infrastructure Layer impact`

## Gherkin structure

Every acceptance-criteria block **must** open with a `Feature:` line, then list numbered `Scenario:` blocks. Each scenario **must** contain `Given`, `When`, and `Then` steps in that order.

Example skeleton:
```
Feature: <feature name>

1. Scenario: <happy path>
    Given ...
    When ...
    Then ...

2. Scenario: <failure case>
    Given ...
    When ...
    Then ...
```

Include at least one negative/failure scenario per file.

## Language policy

All issue files in this repository are written in **English**.
Use `**Context**` and `**Acceptance Criteria**` as section headers.