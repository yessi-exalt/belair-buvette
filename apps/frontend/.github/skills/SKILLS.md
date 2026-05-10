---
name: create-issue
description: Create one markdown issue file per package (domain, application, infrastructure, ui) from a functional request. Each file contains a title, context, and Gherkin acceptance criteria scoped to that package. Use when formalising a feature into structured, testable issues.
---

---
name: implement-feature-slice
description: Scaffold a new feature across the four frontend packages (domain, application, infrastructure, ui), following the hexagonal architecture conventions and patterns already established in the repository.
---

---
name: implement-component
description: Create a React component in the appropriate FSD layer (shared/ui, entities, or feature ui), with TypeScript props, CSS module, Storybook story, and Vitest + Testing Library tests.
---

---
name: write-component-tests
description: Write Vitest + Testing Library tests for an existing React component, covering rendering, user interactions, edge cases, and accessibility assertions.
---

---
name: write-e2e-test
description: Write a Playwright E2E test scenario for a user-facing flow (e.g. browsing the menu, placing an order, tracking order status), following the project's testing guidelines.
---

---
name: review-fsd-boundaries
description: Audit a file or module for violations of Feature-Sliced Design layer boundaries (features must not import from each other, shared must not import from entities or features) and propose corrections.
---
