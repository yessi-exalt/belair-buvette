---
applyTo: "**/*.{test,spec}.ts"
description: "Testing guidelines for the Belair's Buvette API project. Load explicitly when writing, reviewing, or debugging tests (unit, integration, or E2E)."
---

# Testing Guidelines

> These guidelines apply to all packages in the monorepo.
> Stack: **Vitest v3** · **Node.js 24+**

---

## Table of Contents

1. [Core Principles](#core-principles)
2. [Package-Level Test Strategy](#package-level-test-strategy)
3. [Unit Testing — Domain](#unit-testing--domain)
4. [Unit Testing — Application](#unit-testing--application)
5. [Integration Testing — Infrastructure](#integration-testing--infrastructure)
6. [End-to-End Testing](#end-to-end-testing)
7. [Test Doubles](#test-doubles)
8. [Coverage](#coverage)
9. [What Not to Test](#what-not-to-test)

---

## Core Principles

- **Test behaviour, not implementation.** Assert on what functions return and what side effects occur, not on internal state or private methods.
- **Arrange – Act – Assert.** Every test follows this structure, with a blank line separating each phase.
- **One concept per test.** If a test description needs "and", split it.
- **Domain tests must be pure.** No I/O, no network, no file system, no database — only plain TypeScript.
- **Use the narrowest test double.** Prefer stubs over mocks; prefer fakes over stubs when state matters.

---

## Package-Level Test Strategy

| Package          | Test type                                                  | Runner | Environment |
| ---------------- | ---------------------------------------------------------- | ------ | ----------- |
| `domain`         | Pure unit tests (entities, value objects, business rules)   | Vitest | `node`      |
| `application`    | Use-case / service unit tests (domain + infra wired)       | Vitest | `node`      |
| `infrastructure` | Integration tests (adapters, persistence, HTTP controllers) | Vitest | `node`      |

> **Domain must never import from Infrastructure or Application.** Tests in the domain package must not require any external dependency or test double for infrastructure concerns.

---

## Unit Testing — Domain

Domain tests are plain TypeScript — no mocking, no I/O.

### Naming

```
domain/test/order.test.ts
domain/test/token-balance.test.ts
```

### Example — Domain entity

```typescript
import { describe, it, expect } from "vitest";
import { Order } from "../src/order";

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

### Example — Value object

```typescript
import { describe, it, expect } from "vitest";
import { TokenBalance } from "../src/token-balance";

describe("TokenBalance", () => {
  it("rejects negative drink token amounts", () => {
    expect(() => TokenBalance.create({ drink: -1, food: 0 })).toThrow(
      "Token balance cannot be negative",
    );
  });

  it("deducts tokens correctly", () => {
    // Arrange
    const balance = TokenBalance.create({ drink: 6, food: 9 });

    // Act
    const updated = balance.deduct({ drink: 2, food: 3 });

    // Assert
    expect(updated.drink).toBe(4);
    expect(updated.food).toBe(6);
  });
});
```

---

## Unit Testing — Application

Application use-case tests stub or fake infrastructure dependencies injected via constructor or function parameters.

### Naming

```
application/test/place-order.use-case.test.ts
application/test/cancel-order.use-case.test.ts
```

### Example — Application use case

```typescript
import { describe, it, expect, vi } from "vitest";
import { PlaceOrderUseCase } from "../src/place-order.use-case";

describe("PlaceOrderUseCase", () => {
  it("places an order and persists it", async () => {
    // Arrange
    const orderRepository = {
      save: vi.fn().mockResolvedValue(undefined),
    };
    const useCase = new PlaceOrderUseCase(orderRepository);

    // Act
    const result = await useCase.execute({
      festivalGoerId: "goer-1",
      items: [{ id: "drink-1", quantity: 1 }],
    });

    // Assert
    expect(result.status).toBe("PENDING");
    expect(orderRepository.save).toHaveBeenCalledOnce();
  });
});
```

---

## Integration Testing — Infrastructure

Infrastructure tests validate that adapters correctly implement port interfaces. They may use real databases (via testcontainers or in-memory alternatives) or HTTP test clients.

### Naming

```
infrastructure/test/in-memory-order-repository.test.ts
infrastructure/test/order-controller.integration.test.ts
```

### Example — Repository adapter

```typescript
import { describe, it, expect } from "vitest";
import { InMemoryOrderRepository } from "../src/in-memory-order-repository";
import { Order } from "@belair-buvette-api/domain";

describe("InMemoryOrderRepository", () => {
  it("saves and retrieves an order", async () => {
    // Arrange
    const repository = new InMemoryOrderRepository();
    const order = Order.create({ items: [{ id: "drink-1", quantity: 1 }] });

    // Act
    await repository.save(order);
    const found = await repository.findById(order.id);

    // Assert
    expect(found).toEqual(order);
  });
});
```

---

## End-to-End Testing

E2E tests validate the full application stack from HTTP request to response. They start the application server and send real HTTP requests.

- Place E2E tests in a dedicated `tests/e2e/` directory or within the `application/test/` folder.
- Use `fetch` or a lightweight HTTP client to send requests.
- Prefer starting the server programmatically with a random port to avoid conflicts.

---

## Test Doubles

| Double type | When to use                                                      | Example                                 |
| ----------- | ---------------------------------------------------------------- | --------------------------------------- |
| **Stub**    | Return a canned value; no assertions on calls                    | `vi.fn().mockReturnValue(…)`            |
| **Mock**    | Verify that a specific call happened with specific arguments     | `vi.fn()` + `expect(…).toHaveBeenCalled()` |
| **Fake**    | Lightweight in-memory implementation of a port interface         | `InMemoryOrderRepository`               |
| **Spy**     | Wrap a real implementation to observe calls without changing behaviour | `vi.spyOn(obj, 'method')`          |

**Prefer fakes for repository ports** — they provide more realistic behaviour and catch more bugs than simple stubs.

---

## Coverage

| Metric     | Target |
| ---------- | ------ |
| Statements | ≥ 80 % |
| Branches   | ≥ 80 % |
| Functions  | ≥ 80 % |
| Lines      | ≥ 80 % |

- Domain layer should aim for **≥ 95 %** coverage — it's pure logic with no I/O excuses.
- Run coverage with `pnpm test -- --coverage`.

---

## What Not to Test

- **Third-party library internals** — trust the library; test your usage of it.
- **TypeScript type correctness** — the compiler handles this.
- **Trivial getters/setters** with no logic.
- **Framework boilerplate** (config files, DI wiring) — test through integration tests instead.
- **Exact error messages** — assert on error types or codes, not on human-readable strings (unless the message is part of the domain contract).
