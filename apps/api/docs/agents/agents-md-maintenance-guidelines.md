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
- The **architectural context** the agent must reason within (Hexagonal/Clean Architecture layers, conventions)
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
│   ├── Architecture Context       # Hexagonal layers, project conventions
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

- `name` must remain a short human-readable label (e.g. `"Belair's Buvette Backend Engineer"`).
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

- Keep the tree in `## Repository Structure` current with the actual monorepo layout.
- Only include directories that affect agent reasoning (source roots, test folders, config files).
- If a new workspace package is added, update both the tree and the layer descriptions in `## Responsibilities > Architecture Context & Design`.

---

## 5. Formatting Conventions

- Use ATX headings (`#`, `##`, `###`). Never use setext (underline) headings.
- Use `>` blockquotes for important callouts, not for regular prose.
- Wrap inline code (file names, config keys, CLI commands) in backticks.
- Use fenced code blocks with a language tag for multi-line examples.
- Maintain a blank line before and after every heading, list, table, and code-block.

---

## 6. Change Validation Checklist

Before merging any change to `AGENTS.MD`, verify:

- [ ] The YAML frontmatter (`name`, `description`) is still accurate.
- [ ] The repository-structure tree matches the actual folder layout.
- [ ] No duplicate rules exist between `## Behavioral Guidelines` and `### MAJOR`.
- [ ] Context-marker emojis are ordered: default → task-specific → TDD phases.
- [ ] The Development Guidelines table lists all instruction/reference files with correct conditions.
- [ ] The file renders correctly in GitHub/GitLab Markdown preview.
