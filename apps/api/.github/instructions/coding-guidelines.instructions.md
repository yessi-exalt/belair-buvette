---
applyTo: "**/*.ts"
description: "TypeScript backend coding conventions for the Belair's Buvette API project. Always follow these rules when writing, reviewing, or refactoring code."
---

# TypeScript Backend Coding Guidelines

This document defines the TypeScript coding conventions for the Belair's Buvette API project.
Follow these rules to keep the codebase consistent, readable, and maintainable.

## Formatting

- **Indentation:** 2 spaces per indent level.
- **Line length:** Prefer max 120 characters.
- Use Prettier for formatting, ESLint for linting.

## Naming Conventions

- **Files/Directories:** kebab-case → `order-repository.ts`, `place-order.use-case.ts`, `token-balance.ts`
- **Classes:** PascalCase → `Order`, `TokenBalance`, `PlaceOrderUseCase`
- **Interfaces / Types:** PascalCase → `OrderRepository`, `TokenTransferCommand`
- **Functions / Methods:** camelCase → `placeOrder()`, `calculatePreparationTime()`
- **Constants:** UPPER_SNAKE_CASE → `MAX_TOKENS_PER_TRANSFER`, `PREPARATION_TIME_PER_DRINK`
- **Enums:** PascalCase for the enum, UPPER_SNAKE_CASE for members → `OrderStatus.PENDING`
- **All identifiers must be English:** file names, class names, type names, variables, functions, methods, DTOs, and generated examples must use English words only.
- Do not introduce French identifiers such as `commande`, `festivalier`, `creer`, or `suivre`; prefer `order`, `festivalGoer`, `create`, and `track`.

## Architecture — Hexagonal / Clean Architecture

Always respect the dependency rule and layer boundaries:

| Layer          | Path               | Rule                                                                   |
| -------------- | ------------------ | ---------------------------------------------------------------------- |
| Domain         | `domain/`          | Pure business logic — no I/O, no frameworks, no external dependencies  |
| Infrastructure | `infrastructure/`  | Adapters implementing domain ports — depends on `domain` only          |
| Application    | `application/`     | Orchestration and wiring — depends on `domain` and `infrastructure`    |

### Domain Layer Rules

- Entities and value objects must be immutable or control mutation through domain methods.
- Define repository interfaces (ports) in domain — implementations live in infrastructure.
- Domain services contain logic that doesn't naturally belong to a single entity.
- Domain events represent meaningful business occurrences.
- **Never** import from `infrastructure` or `application`.

### Infrastructure Layer Rules

- Implements ports/interfaces defined in `domain`.
- Contains adapters for persistence, HTTP, messaging, and other I/O concerns.
- Framework-specific code (Express routes, database drivers) lives here exclusively.
- **Never** imports from `application`.

### Application Layer Rules

- Wires domain and infrastructure together.
- Contains use cases/command handlers that orchestrate domain logic.
- Entry point for the running application.

## TypeScript Conventions

- Use `strict: true` in tsconfig — no implicit `any`, no unchecked index access.
- Prefer `interface` for object shapes that may be extended; use `type` for unions, intersections, and mapped types.
- Use `readonly` properties for value objects and immutable data.
- Prefer `unknown` over `any` when the type is truly unknown.
- Use explicit return types on public API functions and methods.

## Error Handling

- Use domain-specific error classes extending `Error` for business rule violations.
- Never silence errors — `catch` blocks must log, re-throw, or handle explicitly.
- Validate at system boundaries (HTTP input, external API responses); trust data within domain.
- Use Result/Either patterns when a function can fail as part of normal flow (vs. exceptional errors).

## Module Design

- Each package exposes a barrel file (`src/index.ts`) as its public API.
- Keep internal modules private — only export what consumers need.
- Prefer named exports over default exports.
- Use `node:` prefix for Node.js built-in imports (`node:path`, `node:fs`).

## Testing

- **Unit tests:** Vitest for all layers (`domain/test/`, `application/test/`, `infrastructure/test/`)
- Test files use the pattern `<name>.test.ts` or `<name>.spec.ts`.
- Follow Arrange / Act / Assert structure.
- Domain tests must be pure — no mocks, no I/O.
- See `docs/testing-guidelines.md` for full details.

## Build & Tooling

- **Build tool:** Vite (library mode)
- **Package manager:** pnpm (monorepo with `pnpm-workspace.yaml`)
- **Runtime:** Node.js 24+
- **Monorepo packages:** `domain`, `application`, `infrastructure`

## References

- [Hexagonal Architecture (Alistair Cockburn)](https://alistair.cockburn.us/hexagonal-architecture/)
- [Domain-Driven Design Reference](https://www.domainlanguage.com/ddd/reference/)
- [Vitest](https://vitest.dev/)
- [Node.js Documentation](https://nodejs.org/docs/latest/api/)
