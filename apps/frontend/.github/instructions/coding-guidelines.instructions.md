---
applyTo: "**/*.{ts,tsx,css}"
description: "TypeScript & React coding conventions for the Belair's Buvette project. Always follow these rules when writing, reviewing, or refactoring code."
---

# TypeScript Frontend Coding Guidelines

This document defines the TypeScript and React coding conventions for this project.
Follow these rules to keep the codebase consistent, readable, and maintainable.

## Formatting

- **Indentation:** 2 spaces per indent level.
- **Line length:** Prefer max 120 characters.
- Use Prettier for formatting, ESLint with `react-hooks` and `react-refresh` plugins.

## Naming Conventions

- **Files/Directories:** kebab-case → `contact-export.slice.ts`, `export-button.tsx`
- **React Components:** PascalCase → `ContactExportButton`, `OrderList`
- **Hooks:** camelCase with `use` prefix → `useContactExport()`, `useOrderList()`
- **Types / Interfaces:** PascalCase → `Contact`, `ExportOptions`
- **Constants:** UPPER_SNAKE_CASE → `MAX_EXPORT_ROWS`
- **All identifiers must be English:** file names, component names, hooks, types, props, variables, functions, methods, test names, and generated examples must use English words only.
- Do not introduce French identifiers such as `commande`, `festivalier`, `creer`, or `suivre`; prefer `order`, `festivalGoer`, `create`, and `track`.

## Component Design

- Prefer functional components with hooks.
- Keep components small and single-purpose.
- Separate presentational components from container (logic) components.

```tsx
const ExportButton: React.FC<{ onClick: () => void; disabled?: boolean }> = ({
  onClick,
  disabled,
}) => (
  <button onClick={onClick} disabled={disabled}>
    Export
  </button>
);
```

## Architecture — Feature-Sliced Design (FSD)

Always respect layer boundaries:

| Layer    | Path                   | Rule                                               |
| -------- | ---------------------- | -------------------------------------------------- |
| Pages    | `src/pages/`           | Orchestration only — no business logic             |
| Features | `src/features/<name>/` | Self-contained; never import from sibling features |
| Entities | `src/entities/`        | Shared domain models; no feature-level code        |
| Shared   | `src/shared/`          | Generic utilities and UI kit only                  |

Each feature follows the internal structure: `model/` (state), `ui/` (components), `api/` (data fetching).

## State Management

- **Global state:** Zustand or Redux Toolkit
- **Local UI state:** `useState`
- **Server state:** React Query or SWR

## Error Handling

- Use Error Boundaries for UI error containment.
- Use React Query `onError` callbacks for data fetching errors.
- Never silence errors silently (`catch` blocks must log or re-throw).

## Testing

- **Unit / Component tests:** Vitest + Testing Library (`packages/ui/`)
- **E2E tests:** Playwright (`tests/`)
- Test files live alongside the code they test (e.g. `Button.test.tsx` next to `Button.tsx`).
- Follow Arrange / Act / Assert structure.

## Build & Tooling

- **Build tool:** Vite
- **Package manager:** pnpm (monorepo with `pnpm-workspace.yaml`)
- **Monorepo packages:** `packages/ui`, `packages/domain`, `packages/application`, `packages/infrastructure`

## References

- [Feature-Sliced Design](https://feature-sliced.design/)
- [React Documentation](https://react.dev/)
- [Vitest](https://vitest.dev/)
- [Playwright](https://playwright.dev/)
