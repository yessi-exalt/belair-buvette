# Reference — create-issue

## Output format

Each issue is a standalone Markdown file with: `# Title`, `**Contexte**`, `**Critères d'acceptation**` (Gherkin), `**Notes**` (optional).

## File naming convention

Files follow the pattern `{layer}_{feature-slug}-issue.md` and live under `docs/features/{feature-slug}/`.

Example: `docs/features/place-drink-order/ui_place-drink-order-issue.md`

## Layer split strategy

For every feature request, produce **one file per package**:

| File prefix | Package |
|---|---|
| `domain_` | Frontend domain model — types, business rules, token cost computation |
| `application_` | Frontend use-case orchestration — cart state, submission logic, error handling |
| `infrastructure_` | HTTP adapters — translating use-case commands to API calls and mapping responses |
| `ui_` | React components — rendering, user interactions, disabled states, error display |

If the request does not impact a given package, omit that file. If the request is ambiguous, ask a clarifying question before generating files.

## Title format

`# {Feature Title} : impact package {layer}`

Examples:
- `# Commander une boisson : impact package domain`
- `# Commander une boisson : impact package application`
- `# Commander une boisson : impact package infrastructure`
- `# Commander une boisson : impact package ui`

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

All issue files in this repository are written in **French**.
Use `**Contexte**` and `**Critères d'acceptation**` as section headers.