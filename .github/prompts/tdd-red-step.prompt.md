---
agent: agent
name: TDD Red step
description: Write exactly one failing test scenario in the Belair's Buvette monorepo without touching production code.
argument-hint: RED phase only. Provide one exact scenario or one issue reference, for example: "apps/api/docs/features/place-drink-order/application_place-drink-order-issue.md scenario 1".
tools: ['execute/runInTerminal', 'read/problems', 'read/readFile', 'edit/createFile', 'edit/editFiles', 'search']
model: GPT-5.4 (copilot)
---
# TDD Red Step

<!-- Note: corrected explicit backend/frontend routing, repository-specific test paths and naming, mandatory AGENTS/testing-guidelines references, exact Gherkin mirroring, and the CRITICAL ban on production-code changes during RED. -->

## Mission

Write exactly one failing test for one scenario in the Belair's Buvette monorepo.
Stop immediately after validating that the selected test fails.

## Mandatory references

- For API work, load `apps/api/AGENTS.MD` and `apps/api/docs/testing-guidelines.md`.
- For frontend work, load `apps/frontend/AGENTS.MD` and `apps/frontend/docs/testing-guidelines.md`.
- If the input references a feature issue, load the exact issue file under `apps/api/docs/features/` or `apps/frontend/docs/features/` and mirror the selected scenario exactly.

## Workflow

1. Resolve the scenario.
   - If the user provides an issue reference, extract the exact target scenario.
   - If the scenario is ambiguous, spans multiple scenarios, or does not identify a clear app/layer/slice, ask for clarification and stop.
2. Determine the target app and test scope before writing any code.
3. Reuse a nearby existing test file when it already covers the same scope.
4. Otherwise create one new test file in the correct location using the repository naming conventions below.
5. Write one failing test that mirrors the selected scenario exactly.
   - Reuse the same business data as the scenario.
   - Assert every observable outcome named in the scenario.
   - Do not merge multiple Gherkin scenarios into one test.
6. Run only the targeted test from the owning package and confirm it fails.
7. Stop. Do not enter the GREEN phase and do not suggest production code changes in the same run.

## Routing rules

### API routing

Choose the backend layer from the behavior being tested:

| Layer | Use when the scenario is about... | Typical test location | Good example | Bad example |
| ----- | --------------------------------- | --------------------- | ------------ | ----------- |
| `domain` | pure business rules, aggregates, value objects, domain errors | `apps/api/domain/test/` | token cost calculation, balance validation | repository persistence |
| `application` | use-case orchestration, repository calls, returned result DTOs | `apps/api/application/test/` | `place-drink-order.use-case.test.ts` | HTTP status codes or SQL schema |
| `infrastructure` | adapters, persistence mappings, controllers, transport contracts | `apps/api/infrastructure/test/` | repository adapter persistence | pure aggregate rules |

### Frontend routing

Choose the frontend package from the behavior being tested:

| Scope | Use when the scenario is about... | Typical test location | Good example | Bad example |
| ----- | --------------------------------- | --------------------- | ------------ | ----------- |
| `packages/domain` | pure client-side business logic with no rendering | `apps/frontend/packages/domain/src/__tests__/` | token total calculation helper | rendered button behavior |
| `packages/application` | application services or orchestration without DOM rendering | `apps/frontend/packages/application/src/__tests__/` | submit-order service result mapping | button click UI behavior |
| `packages/infrastructure` | HTTP adapters and integration boundaries | `apps/frontend/packages/infrastructure/src/__tests__/` | API client response mapping with MSW | pure page rendering |
| `packages/ui` | components, hooks, and user-visible interactions | colocated `*.test.tsx` or `__tests__/` in `apps/frontend/packages/ui/src/` | cart button enabled state | raw API client mapping |
| `e2e` | real routed browser flows spanning multiple screens | `apps/frontend/tests/e2e/` | place order then track status in browser | isolated component prop rendering |

- If the scenario does not clearly fit one row, ask a clarifying question before generating a test.

## Naming rules

- API domain test example: `apps/api/domain/test/order.test.ts`
- API application test example: `apps/api/application/test/place-drink-order.use-case.test.ts`
- API infrastructure test example: `apps/api/infrastructure/test/in-memory-order-repository.test.ts`
- Frontend UI component test example: `apps/frontend/packages/ui/src/components/token-balance/token-balance.test.tsx`
- Frontend application test example: `apps/frontend/packages/application/src/__tests__/place-order.use-case.test.ts`

Bad naming examples:

- `apps/api/application/test/test1.ts`
- `apps/api/domain/test/place-drink-order.use-case.test.ts` for repository orchestration
- `apps/frontend/packages/ui/src/components/token-balance/index.test.tsx` when the component is named `token-balance.tsx`

## CRITICAL - RED phase restrictions

- RED phase only. Do not create or modify production code.
- Only edit files whose purpose is testing: `*.test.ts`, `*.test.tsx`, `*.spec.ts`, `*.spec.tsx`, or files under `__tests__/` used only by tests.
- Do not add exports, do not update barrel files, do not edit `src/index.ts`, do not change app wiring, and do not create production helpers just to satisfy the test.
- The test must fail for a real reason in the current codebase, not because of a syntax error you introduced deliberately.

Explicit negative examples:

```markdown
Do not add `export class PlaceDrinkOrderUseCase` to `apps/api/application/src/index.ts` during the RED phase just to make the test compile or pass.
```

```markdown
Do not use `await import('../src/index.js')` or `await import('../index')` to check that a class is exported. Write the test as if the class is already defined — the test fails because the class does not exist yet locally.
```

## Test-writing rules

- Use Vitest for both apps.
- For API tests, use plain TypeScript test doubles and prefer fakes for repositories.
- For frontend component tests, use Testing Library semantic queries and `userEvent`.
- Follow Arrange / Act / Assert.
- Add exactly **one new failing `it()` block** per RED step. Do not merge multiple Gherkin scenarios into a single test.
- If a test file already exists for the same adapter or scope (e.g., `in-memory-order-repository.test.ts`), **add the new `it()` to that file**. Do not create a separate file for every scenario.
- When a Gherkin scenario contains multiple `And` outcomes, keep them together in the same test because they belong to the same scenario.
- Do not use `await import('../index')` or `await import('../src/index.js')`. Use a **static `import` statement** pointing directly to the expected production file path (e.g., `import { InMemoryOrderRepository } from '../src/in-memory-order-repository.js'`). The test must fail because the source file does not exist yet, producing a `Cannot find module` error at collection time.
- **Never use `declare const ClassName` or `declare class ClassName`.** These bypass the module system entirely and produce a `ReferenceError: ClassName is not defined` at runtime. That is not a valid RED failure — it proves nothing about the missing implementation.

## Run commands

- API example: `cd apps/api/application && pnpm test -- test/place-drink-order.use-case.test.ts`
- Frontend UI example: `cd apps/frontend && pnpm test -- packages/ui/src/components/token-balance/token-balance.test.tsx`

## Examples

### Backend RED example

Input:
`apps/api/docs/features/place-drink-order/application_place-drink-order-issue.md scenario 1`

Expected outcome:

- create or update `apps/api/application/test/place-drink-order.use-case.test.ts`
- mirror the selected Given/When/Then data exactly
- run only that file and confirm it fails
- stop without touching `apps/api/application/src/`

### Infrastructure RED example

Input: a scenario about saving and retrieving an order in the repository adapter.

Expected test code:

```typescript
import { describe, expect, it } from 'vitest';
import { InMemoryOrderRepository } from '../src/in-memory-order-repository.js';
import type { Order } from '@belair-buvette-api/domain';

describe('InMemoryOrderRepository', () => {
  it('saves and retrieves an order by id', async () => {
    // Arrange
    const repository = new InMemoryOrderRepository();
    const order: Order = { id: 'order-1', festivalGoerId: 'goer-1', status: 'EN_ATTENTE', items: [] };

    // Act
    await repository.save(order);
    const found = await repository.findById('order-1');

    // Assert
    expect(found.id).toBe('order-1');
  });
});
```

Expected RED failure: `Error: Cannot find module '../src/in-memory-order-repository.js'`

**Not acceptable:** `ReferenceError: InMemoryOrderRepository is not defined` — this means a `declare const` was used instead of a real import, which is always wrong.

Expected outcome:

- add the new `it()` block to the existing `infrastructure/test/in-memory-order-repository.test.ts` when that file already covers the same adapter
- the test imports the adapter via a static `import` from `../src/`
- it fails at module resolution, not at runtime
- stop without creating `apps/api/infrastructure/src/in-memory-order-repository.ts`

### Frontend RED example

Input:
`apps/frontend/docs/features/manage-cart/ui_manage-cart-issue.md scenario 4`

Expected outcome:

- create or update a UI test under `apps/frontend/packages/ui/src/` if the scenario is a rendered cart interaction
- assert the disabled Add to cart button and the visible tooltip using Testing Library queries
- run only that test file and confirm it fails
- stop without editing production UI components