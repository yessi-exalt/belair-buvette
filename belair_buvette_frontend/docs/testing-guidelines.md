---
applyTo: "**/*.{test,spec}.{ts,tsx}"
description: "Testing guidelines for the Belair's Buvette project. Load explicitly when writing, reviewing, or debugging tests (unit, component, hook, integration, or E2E)."
---

# Testing Guidelines

> These guidelines apply to all packages in the monorepo.
> Stack: **Vitest v2** · **Testing Library** · **MSW** · **Playwright**

---

## Table of Contents

1. [Core Principles](#core-principles)
2. [Package-Level Test Strategy](#package-level-test-strategy)
3. [Unit Testing — Domain & Application](#unit-testing--domain--application)
4. [Component Testing — UI](#component-testing--ui)
5. [Hook Testing](#hook-testing)
6. [Integration Testing — Infrastructure](#integration-testing--infrastructure)
7. [End-to-End Testing](#end-to-end-testing)
8. [MSW Setup & Usage](#msw-setup--usage)
9. [Coverage](#coverage)
10. [What Not to Test](#what-not-to-test)

---

## Core Principles

- **Test behaviour, not implementation.** Assert on what the user sees and what functions return, not on internal state or private methods.
- **Arrange – Act – Assert.** Every test follows this structure, with a blank line separating each phase.
- **One concept per test.** If a test description needs "and", split it.
- **Prefer `userEvent` over `fireEvent`.** `userEvent` dispatches the full browser event sequence (pointerdown → mousedown → click…), making tests more realistic.
- **Prefer semantic queries.** Follow the Testing Library [query priority](https://testing-library.com/docs/queries/about#priority): `getByRole` → `getByLabelText` → `getByPlaceholderText` → `getByText` → `getByTestId`.
- **Avoid `data-testid` unless there is no semantic alternative.**

---

## Package-Level Test Strategy

| Package                   | Test type                                                 | Runner     | Environment |
| ------------------------- | --------------------------------------------------------- | ---------- | ----------- |
| `packages/domain`         | Pure unit tests (entities, value objects, business rules) | Vitest     | `node`      |
| `packages/application`    | Use-case / service unit tests                             | Vitest     | `node`      |
| `packages/infrastructure` | Integration tests with MSW                                | Vitest     | `node`      |
| `packages/ui`             | Component & hook tests                                    | Vitest     | `jsdom`     |
| `tests/e2e/`              | End-to-end flows                                          | Playwright | Chromium    |

> **Domain and Application layers must never import from Infrastructure or UI.** Tests in those packages must not require a DOM environment or HTTP mocking.

---

## Unit Testing — Domain & Application

Domain and Application tests are plain TypeScript — no rendering, no DOM.

### Naming

```
packages/domain/src/__tests__/order.test.ts
packages/application/src/__tests__/place-order.use-case.test.ts
```

### Example — Domain entity

```typescript
import { describe, it, expect } from "vitest";
import { Order } from "../order";

describe("Order", () => {
  describe("cancel()", () => {
    it("changes status to CANCELLED when pending", () => {
      // Arrange
      const order = Order.create({ items: [{ id: "drink-1", quantity: 1 }] });

      // Act
      order.cancel();

      // Assert
      expect(order.status).toBe("CANCELLED");
    });

    it("throws when order is already acknowledged", () => {
      // Arrange
      const order = Order.create({ items: [] });
      order.acknowledge();

      // Act & Assert
      expect(() => order.cancel()).toThrow(
        "Cannot cancel an acknowledged order",
      );
    });
  });
});
```

### Example — Application use case

```typescript
import { describe, it, expect, vi } from "vitest";
import { PlaceOrderUseCase } from "../place-order.use-case";
import { InMemoryOrderRepository } from "../../__mocks__/in-memory-order.repository";

describe("PlaceOrderUseCase", () => {
  it("persists the order and returns its id", async () => {
    // Arrange
    const repository = new InMemoryOrderRepository();
    const useCase = new PlaceOrderUseCase(repository);

    // Act
    const result = await useCase.execute({
      items: [{ id: "beer-1", quantity: 2 }],
    });

    // Assert
    expect(result.orderId).toBeDefined();
    expect(repository.findById(result.orderId)).toBeTruthy();
  });
});
```

---

## Component Testing — UI

### File location

Co-locate tests with the component they exercise:

```
packages/ui/src/components/Button/Button.tsx
packages/ui/src/components/Button/Button.test.tsx   ← here
```

### Setup

`@testing-library/jest-dom` matchers are loaded globally via `packages/ui/src/test-setup.ts`.
Vitest globals (`describe`, `it`, `expect`, `vi`) are available without explicit imports thanks to `globals: true` in the Vitest config — but **import them explicitly** for clarity and IDE support.

### `userEvent` setup

Always instantiate `userEvent` before the render. The `setup()` call returns a typed user that works correctly with async/await.

```typescript
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { ExportButton } from "./ExportButton";

describe("ExportButton", () => {
  it("calls onExport when clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    const onExport = vi.fn();
    render(<ExportButton onExport={onExport} />);

    // Act
    await user.click(screen.getByRole("button", { name: /export/i }));

    // Assert
    expect(onExport).toHaveBeenCalledOnce();
  });

  it("is disabled while loading", () => {
    // Arrange & Act
    render(<ExportButton onExport={vi.fn()} loading />);

    // Assert
    expect(screen.getByRole("button", { name: /export/i })).toBeDisabled();
  });
});
```

> **Do not use `fireEvent`** in new tests. It bypasses pointer and focus events, which leads to false positives on disabled buttons and interactive elements.

### Accessible queries cheatsheet

| Scenario                         | Preferred query                           |
| -------------------------------- | ----------------------------------------- |
| Button, link, checkbox, heading… | `getByRole('button', { name: /label/i })` |
| Form input with label            | `getByLabelText(/email/i)`                |
| Input without label              | `getByPlaceholderText(/search/i)`         |
| Non-interactive text             | `getByText(/welcome/i)`                   |
| No semantic alternative          | `getByTestId('spinner')`                  |

---

## Hook Testing

Use `renderHook` from `@testing-library/react` for custom hooks. Mock HTTP calls with MSW (see [MSW Setup](#msw-setup--usage)).

```typescript
import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useTokenBalance } from "./use-token-balance";
import { server } from "../../__mocks__/server";
import { http, HttpResponse } from "msw";

describe("useTokenBalance", () => {
  it("returns the current token balance", async () => {
    // Arrange
    server.use(
      http.get("/api/tokens/balance", () => HttpResponse.json({ balance: 42 })),
    );

    // Act
    const { result } = renderHook(() => useTokenBalance());

    // Assert
    await waitFor(() => expect(result.current.balance).toBe(42));
  });

  it("returns an error state on network failure", async () => {
    // Arrange
    server.use(http.get("/api/tokens/balance", () => HttpResponse.error()));

    // Act
    const { result } = renderHook(() => useTokenBalance());

    // Assert
    await waitFor(() => expect(result.current.error).toBeTruthy());
  });
});
```

---

## Integration Testing — Infrastructure

Infrastructure tests verify that adapters (HTTP clients, repositories) correctly translate between the application boundary and external systems. Use MSW to intercept real `fetch` calls.

```typescript
import { describe, it, expect } from "vitest";
import { HttpOrderRepository } from "../http-order.repository";
import { server } from "../../__mocks__/server";
import { http, HttpResponse } from "msw";

describe("HttpOrderRepository", () => {
  it("maps the API response to a domain Order", async () => {
    // Arrange
    server.use(
      http.get("/api/orders/:id", () =>
        HttpResponse.json({ id: "ord-1", status: "PENDING", items: [] }),
      ),
    );
    const repository = new HttpOrderRepository();

    // Act
    const order = await repository.findById("ord-1");

    // Assert
    expect(order.id).toBe("ord-1");
    expect(order.status).toBe("PENDING");
  });
});
```

---

## End-to-End Testing

E2E tests live in `tests/e2e/` and run with Playwright.

### Page Object Model

Encapsulate page interactions in Page Objects to avoid duplicated selectors across tests.

```typescript
// tests/e2e/pages/contacts.page.ts
import { type Page } from "@playwright/test";

export class ContactsPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto("/contacts");
  }

  async clickExport() {
    await this.page.getByRole("button", { name: /export/i }).click();
  }
}
```

```typescript
// tests/e2e/contacts.spec.ts
import { test, expect } from "@playwright/test";
import { ContactsPage } from "./pages/contacts.page";

test("user can export contacts to CSV", async ({ page }) => {
  // Arrange
  const contactsPage = new ContactsPage(page);
  await contactsPage.goto();

  // Act
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    contactsPage.clickExport(),
  ]);

  // Assert
  expect(download.suggestedFilename()).toMatch(/\.csv$/);
});
```

### E2E Guidelines

- E2E tests cover **critical user journeys only** (checkout, authentication, order placement). Do not duplicate unit test coverage.
- Use `data-testid` attributes **only in E2E tests** when a stable selector is required and no semantic role exists.
- Keep E2E tests independent — each test must be able to run in isolation without relying on previous test state.

---

## MSW Setup & Usage

### Server setup (shared mock server)

```typescript
// src/__mocks__/server.ts  (shared across packages that need it)
import { setupServer } from "msw/node";

export const server = setupServer();
```

```typescript
// vitest setup file (e.g. src/test-setup.ts)
import { beforeAll, afterAll, afterEach } from "vitest";
import { server } from "./__mocks__/server";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

> Set `onUnhandledRequest: 'error'` to catch unintentionally unhandled requests early.

### Overriding handlers per-test

Use `server.use(...)` inside a test to override the default handler for that test only. `afterEach(() => server.resetHandlers())` in the setup file ensures the override does not leak.

---

## Coverage

Run coverage with:

```bash
pnpm test:coverage
```

Reports are generated in `coverage/` as `text`, `json`, and `html`.

### Targets (per package)

| Package          | Statements | Branches |
| ---------------- | ---------- | -------- |
| `domain`         | ≥ 90 %     | ≥ 90 %   |
| `application`    | ≥ 85 %     | ≥ 80 %   |
| `infrastructure` | ≥ 75 %     | ≥ 70 %   |
| `ui`             | ≥ 80 %     | ≥ 75 %   |

Coverage is a **floor, not a goal.** 100 % coverage with poor assertions provides false confidence.

---

## What Not to Test

| Avoid                                                | Reason                                                                                              |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| CSS class names (e.g. `toHaveClass('btn--primary')`) | Couples tests to styling details; use visual/Storybook tests instead                                |
| Internal state variables                             | Tests break on safe refactors; test observable output instead                                       |
| Third-party library internals                        | Not your code; not your bug                                                                         |
| Implementation of mocks and stubs                    | Only test behaviour the SUT produces, not how the mock was called unless it's the explicit contract |
| Trivial getters / one-liner passthrough functions    | Low ROI; trust TypeScript types for those                                                           |
