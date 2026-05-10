---
name: create-issue
description: Create one markdown issue file per architecture layer (domain, application, infrastructure) from a functional request. Each file contains a title, context, and Gherkin acceptance criteria scoped to that layer. Use when formalising a feature into structured, testable issues.
---

---
name: implement-domain-entity
description: Scaffold a domain entity, value object, or aggregate in the domain layer following DDD tactical patterns — pure TypeScript, zero external dependencies, with corresponding Vitest unit tests.
---

---
name: implement-use-case
description: Scaffold a new use case in the application layer, wiring domain entities and repository ports together, with command/query handler and Vitest unit tests.
---

---
name: implement-repository
description: Implement a domain repository port as an infrastructure adapter (e.g. in-memory, database driver), respecting the dependency rule so infrastructure only imports from domain.
---

---
name: write-unit-tests
description: Write focused Vitest unit tests for a given domain entity, value object, aggregate, or use case, following the project's TDD conventions and AAA pattern.
---

---
name: review-architecture
description: Audit a file or module for violations of the hexagonal architecture dependency rule (domain ← infrastructure ← application) and propose corrections with rationale.
---
