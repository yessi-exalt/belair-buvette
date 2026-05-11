---
description: "Guidelines for creating high-quality prompt files for GitHub Copilot"
applyTo: "**/*.prompt.md"
---

# Copilot Prompt Files Guidelines

Instructions for creating effective and maintainable prompt files that guide GitHub Copilot in delivering consistent, high-quality outcomes across any repository.

## Scope and Principles

- Target audience: maintainers and contributors authoring reusable prompts for Copilot Chat.
- Goals: predictable behaviour, clear expectations, minimal permissions, and portability across repositories.
- Primary references: VS Code documentation on prompt files and organization-specific conventions.

## Repository-Specific Prompt Requirements

These rules are mandatory for prompts authored in the Belair's Buvette API repository.

### Required References

- Explicitly reference `AGENTS.MD` when the prompt must follow repository architecture, naming, or workflow conventions.
- Explicitly reference `docs/testing-guidelines.md` when the prompt creates, reviews, or debugs tests.
- Explicitly reference the relevant feature issue file under `docs/features/<feature-name>/` when the prompt derives tests or code from Gherkin scenarios.

### Explicit Layer Routing

Prompts that ask Copilot to write or review code or tests MUST state how to choose the target layer.

| Target layer | Use this layer when... | Expected file area | Good example | Bad example |
| ------------ | ---------------------- | ------------------ | ------------ | ----------- |
| `domain` | the behavior is a pure business rule, entity, value object, aggregate, or domain error | `domain/src/`, `domain/test/` | `domain/test/order.test.ts` for token-cost calculation rules | `application/test/place-drink-order.use-case.test.ts` for a pure token rule |
| `application` | the behavior is a use case orchestrating repositories, domain objects, and returned application results | `application/src/`, `application/test/` | `application/test/place-drink-order.use-case.test.ts` for a use-case result and persistence side effects | `domain/test/place-drink-order.use-case.test.ts` for repository orchestration |
| `infrastructure` | the behavior is an adapter, persistence detail, controller, transport contract, or external integration | `infrastructure/src/`, `infrastructure/test/` | `infrastructure/test/in-memory-order-repository.test.ts` for repository adapter behavior | `application/test/in-memory-order-repository.test.ts` for storage concerns |

- If the prompt cannot determine the layer from the request, instruct Copilot to stop and ask a clarifying question before generating code.

### Gherkin Fidelity Rules

- When a prompt asks Copilot to derive a test from a Gherkin scenario, instruct it to mirror the scenario exactly before simplifying anything.
- Reuse the same business data as the scenario unless the user explicitly asks for a variant.
- Assert every observable outcome named in the scenario result, not just a subset.

Good example:

```markdown
Use the application scenario exactly as written in `docs/features/place-drink-order/application_place-drink-order-issue.md`.
If the scenario says 1 non-alcoholic drink, 1 normal alcoholic drink, and 1 premium alcoholic drink, the test must use those three items and assert the pending status, total drink token cost, remaining balance, and persistence side effects.
```

Bad example:

```markdown
Write a similar happy-path test for placing one Mojito.
```

### Naming Rules With Negative Examples

- Prompts must specify the expected file naming pattern for the target layer.
- Prompts must specify that test names should stay as close as possible to the source Gherkin wording when the test is derived from acceptance criteria.

Good examples:

```markdown
Create `application/test/place-drink-order.use-case.test.ts`.
Name the test with the Given/When/Then wording from the selected scenario.
```

Bad examples:

```markdown
Create `application/test/test1.ts`.
Name the test `places order successfully`.
```

```markdown
Create `domain/test/place-drink-order.test.ts` for a use-case orchestration scenario.
```

### CRITICAL - Red Phase Restrictions

- If the prompt is for the RED phase of TDD, it MUST explicitly forbid any production code creation or modification.
- The prompt must say that only failing tests, test doubles, and test-only fixtures may be added or changed in RED.
- The prompt must instruct Copilot to stop after the failing test is written and validated as failing.

Required wording pattern:

```markdown
CRITICAL: RED phase only. Do not create or modify production code under `src/`, do not add exports, do not update barrel files, and do not change application wiring. Only write or adjust the failing test and any test-only doubles required for that test.
```

Explicit negative example:

```markdown
Do not add `export class PlaceDrinkOrderUseCase` to `application/src/index.ts` during the RED phase just to make the test compile or pass.
```

## Frontmatter Requirements

Every prompt file should include YAML frontmatter with the following fields:

### Required/Recommended Fields

| Field           | Required    | Description                                                                                 |
| --------------- | ----------- | ------------------------------------------------------------------------------------------- |
| `description`   | Recommended | A short description of the prompt (single sentence, actionable outcome)                     |
| `name`          | Optional    | The name shown after typing `/` in chat. Defaults to filename if not specified              |
| `agent`         | Recommended | The agent to use: `ask`, `edit`, `agent`, or a custom agent name. Defaults to current agent |
| `model`         | Optional    | The language model to use. Defaults to the currently selected model                         |
| `tools`         | Optional    | List of tool/tool set names available for this prompt                                       |
| `argument-hint` | Optional    | Hint text shown in chat input to guide user interaction                                     |

### Guidelines

- Use consistent quoting (single quotes recommended) and keep one field per line for readability and version control clarity
- If `tools` are specified and the current agent is `ask` or `edit`, the default agent becomes `agent`
- Preserve any additional metadata (`language`, `tags`, `visibility`, etc.) required by your organization

## File Naming and Placement

- Use kebab-case filenames ending with `.prompt.md` and store them under `.github/prompts/` unless your workspace standard specifies another directory.
- Provide a short filename that communicates the action (for example, `generate-readme.prompt.md` rather than `prompt1.prompt.md`).

## Body Structure

- Start with an `#` level heading that matches the prompt intent so it surfaces well in Quick Pick search.
- Organize content with predictable sections. Recommended baseline: `Mission` or `Primary Directive`, `Scope & Preconditions`, `Inputs`, `Workflow` (step-by-step), `Output Expectations`, and `Quality Assurance`.
- Adjust section names to fit the domain, but retain the logical flow: why → context → inputs → actions → outputs → validation.
- Reference related prompts or instruction files using relative links to aid discoverability.

## Input and Context Handling

- Use `${input:variableName[:placeholder]}` for required values and explain when the user must supply them. Provide defaults or alternatives where possible.
- Call out contextual variables such as `${selection}`, `${file}`, `${workspaceFolder}` only when they are essential, and describe how Copilot should interpret them.
- Document how to proceed when mandatory context is missing (for example, "Request the file path and stop if it remains undefined").

## Tool and Permission Guidance

- Limit `tools` to the smallest set that enables the task. List them in the preferred execution order when the sequence matters.
- If the prompt inherits tools from a chat mode, mention that relationship and state any critical tool behaviours or side effects.
- Warn about destructive operations (file creation, edits, terminal commands) and include guard rails or confirmation steps in the workflow.

## Instruction Tone and Style

- Write in direct, imperative sentences targeted at Copilot (for example, "Analyze", "Generate", "Summarize").
- Keep sentences short and unambiguous, following Google Developer Documentation translation best practices to support localization.
- Avoid idioms, humor, or culturally specific references; favor neutral, inclusive language.

## Output Definition

- Specify the format, structure, and location of expected results (for example, "Create `docs/adr/adr-XXXX.md` using the template below").
- Include success criteria and failure triggers so Copilot knows when to halt or retry.
- Provide validation steps—manual checks, automated commands, or acceptance criteria lists—that reviewers can execute after running the prompt.

## Examples and Reusable Assets

- Embed Good/Bad examples or scaffolds (Markdown templates, JSON stubs) that the prompt should produce or follow.
- Maintain reference tables (capabilities, status codes, role descriptions) inline to keep the prompt self-contained. Update these tables when upstream resources change.
- Link to authoritative documentation instead of duplicating lengthy guidance.

## Quality Assurance Checklist

- [ ] Frontmatter fields are complete, accurate, and least-privilege.
- [ ] Inputs include placeholders, default behaviours, and fallbacks.
- [ ] Workflow covers preparation, execution, and post-processing without gaps.
- [ ] Output expectations include formatting and storage details.
- [ ] Validation steps are actionable (commands, diff checks, review prompts).
- [ ] Security, compliance, and privacy policies referenced by the prompt are current.
- [ ] Prompt executes successfully in VS Code (`Chat: Run Prompt`) using representative scenarios.

## Maintenance Guidance

- Version-control prompts alongside the code they affect; update them when dependencies, tooling, or review processes change.
- Review prompts periodically to ensure tool lists, model requirements, and linked documents remain valid.
- Coordinate with other repositories: when a prompt proves broadly useful, extract common guidance into instruction files or shared prompt packs.

## Additional Resources

- [Prompt Files Documentation](https://code.visualstudio.com/docs/copilot/customization/prompt-files#_prompt-file-format)
- [Awesome Copilot Prompt Files](https://github.com/github/awesome-copilot/tree/main/prompts)
- [Tool Configuration](https://code.visualstudio.com/docs/copilot/chat/chat-agent-mode#_agent-mode-tools)
