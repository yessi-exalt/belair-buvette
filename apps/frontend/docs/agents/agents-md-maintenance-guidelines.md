---
description: "Guidelines for maintaining and evolving the AGENTS.MD instruction file. Use when modifying, reviewing, or extending AGENTS.MD."
applyTo: "AGENTS.MD"
---

# AGENTS.MD Maintenance Guidelines

Reference document for any contributor or AI agent modifying the `AGENTS.MD` instruction file.
Follow these guidelines to keep the file coherent, functional, and lean.

---

## 1. Purpose of AGENTS.MD

`AGENTS.MD` is the primary behavioral contract between the AI agent and the engineering team.
It defines:

- The agent's **identity and role** within the project
- The **architectural context** the agent must reason within (FSD layers, conventions)
- The **behavioural guidelines** that govern how the agent communicates and acts
- The **core safety rules** (context markers, active partner posture, honesty constraints)

**Do not use AGENTS.MD for feature documentation, task tracking, or ADRs.**
Those belong in `FEATURES.md`, `docs/features/`, or dedicated ADR files.

---

## 2. When to Modify AGENTS.MD

Modify AGENTS.MD when:

| Trigger                                                     | Section likely affected                               |
| ----------------------------------------------------------- | ----------------------------------------------------- |
| A new architectural layer or convention is adopted          | `## Responsibilities > Architecture Context & Design` |
| A new behavioural rule is agreed upon with the team         | `## Core Guidelines`                                  |
| An existing rule is found to cause confusion or bad outputs | The relevant rule subsection                          |
| The emoji/context-marker system is updated                  | `### CRITICAL : Context Markers`                      |
| The project's testing or tech stack changes significantly   | `## Responsibilities`                                 |
| The repository structure changes                            | `## Repository Structure`                             |

**Do NOT modify AGENTS.MD to:**

- Store per-feature implementation notes → use `docs/features/`
- Fix a one-off agent mistake → address it in the chat session instead
- Add team-specific onboarding that doesn't affect agent behaviour

---

## 3. Structure Reference

The file is organised into two top-level sections. Keep this structure stable.

```
AGENTS.MD
├── Frontmatter (YAML)             # name, description — keep in sync with actual role
├── # Agent title
├── Intro paragraph                # One-paragraph role summary
├── ## Responsibilities            # What the agent actively does
│   ├── Architecture Context       # FSD layers, project conventions
│   ├── Feature Development        # How to approach new features
│   ├── Code Review & Quality      # Review posture
│   ├── Testing & Debugging        # Testing strategy
│   └── Documentation              # Doc responsibilities
├── ## Behavioral Guidelines       # High-level interaction principles (brief)
└── ## Core Guidelines             # Strict, enforceable rules
    ├── ### CRITICAL               # Must-follow, never skip
    └── ### MAJOR                  # Important, high-priority
```

---

## 4. Editing Rules

### 4.1 Frontmatter

- `name` must remain a short human-readable label (e.g. `"Belair's Buvette Engineer"`).
- `description` must be a single sentence describing the agent's role.
- Do not add arbitrary keys — only `name` and `description` are supported here.

### 4.2 Context Markers (`### CRITICAL : Context Markers`)

This subsection is **load-bearing**. It drives the emoji system used in every agent reply.

Rules for modifying it:

- **Never remove** an existing `STARTER_CHARACTER` mapping without team consensus.
- **Always stack** a new emoji on top of the default `🍀`, never replace it.
- When adding a new marker, follow the exact format:
  ```
  - **ALWAYS** start replies with <EMOJI> as STARTER_CHARACTER when <CONDITION>.
  ```
- Keep entries ordered: default first, then task-specific, then TDD phases.

### 4.3 Active Partner Rules (`### MAJOR : Active Partner`)

- Rules must be **actionable and observable** — avoid vague aspirational language.
- Each rule should map to a concrete output pattern (an emoji, a phrase, a refusal).
- Do not duplicate intent between the `## Behavioral Guidelines` prose section and the `### MAJOR` list. Prose = intent; list = enforcement.

### 4.4 Repository Structure

Update the ASCII tree in `## Repository Structure` whenever:

- A new top-level directory is added to `src/`
- A new layer is introduced in the FSD model
- A directory is removed or renamed

Keep the tree **accurate but not exhaustive** — omit generated files, `node_modules`, and build artefacts.

---

## 5. Formatting Conventions

| Element          | Convention                                                                          |
| ---------------- | ----------------------------------------------------------------------------------- |
| Section headings | `##` for top-level, `###` for subsections — no skipping levels                      |
| Inline code      | Backticks for file paths, directory names, and code symbols                         |
| Emphasis         | `**bold**` for rules, `*italic*` for examples or optional notes                     |
| Lists            | Unordered `-` for guidelines; ordered `1.` only for sequential steps                |
| Tables           | Use for mappings (trigger → section, field → requirement)                           |
| Emoji in body    | Allowed in `### CRITICAL` and `### MAJOR` sections only — keep prose sections clean |

---

## 6. Change Validation Checklist

Before committing any change to AGENTS.MD, verify:

- [ ] The frontmatter is valid YAML (no unescaped colons in values, no tabs)
- [ ] No existing `STARTER_CHARACTER` mapping was removed or altered without consensus
- [ ] The Repository Structure tree matches the actual workspace layout
- [ ] New rules follow the `ALWAYS`/`NEVER`/`MUST` imperative style already used
- [ ] The change does not introduce contradictions with existing rules
- [ ] The file stays under ~200 lines of effective content (trim if growing beyond)

---

## 7. Common Pitfalls

**Adding too much detail.** AGENTS.MD guides behaviour — it is not a wiki. If a topic needs more than 3–5 bullet points, move it to `docs/agents/` and link from AGENTS.MD.

**Weakening critical rules.** Downgrading a `CRITICAL` rule to `MAJOR` silently reduces enforcement. If a rule is causing friction, discuss its scope before softening it.

**Inconsistent emoji discipline.** Adding a new task type without defining its `STARTER_CHARACTER` creates ambiguous outputs. Always define the marker together with the task type.

**Stale repository structure.** An inaccurate tree misleads the agent about where to place files. Update it whenever the project structure changes.

**Mixing role and behaviour.** The `## Responsibilities` section answers _what_ the agent does; `## Core Guidelines` answers _how_ it behaves. Keep them separate to avoid duplication and conflation.
