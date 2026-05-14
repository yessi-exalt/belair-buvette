"""Validate issue markdown generated for the create-issue skill."""

from __future__ import annotations

import re
import sys
from pathlib import Path


def validate_issue_format(content: str) -> tuple[bool, list[str]]:
    """Validate the expected markdown structure and basic Gherkin syntax."""
    errors: list[str] = []

    if not re.search(r"(?m)^#\s+.+", content):
        errors.append("Title is missing or malformed. Expect a top-level markdown title starting with '# '.")

    if not re.search(r"\*\*Context\*\*\s*\n\s*\S.+", content):
        errors.append(
            "Context section is missing or malformed. Expect a '**Context**' section with at least one non-empty line.",
        )

    if not re.search(r"\*\*Acceptance Criteria\*\*", content):
        errors.append("Acceptance Criteria section is missing or malformed. Expect '**Acceptance Criteria**' header.")

    if not re.search(r"(?m)^\s*Feature:.*$", content):
        errors.append("Gherkin 'Feature:' is missing.")

    scenarios = list(re.finditer(r"(?m)^\s*(?:\d+\.\s+)?Scenario:\s*(.+)$", content))
    if not scenarios:
        errors.append("No 'Scenario:' found in Gherkin.")
    else:
        for index, match in enumerate(scenarios):
            title = match.group(1).strip()
            start = match.end()
            end = scenarios[index + 1].start() if index + 1 < len(scenarios) else len(content)
            block = content[start:end]

            has_given = re.search(r"(?m)^\s*Given\b", block)
            has_when = re.search(r"(?m)^\s*When\b", block)
            has_then = re.search(r"(?m)^\s*Then\b", block)

            missing_steps: list[str] = []
            if not has_given:
                missing_steps.append("Given")
            if not has_when:
                missing_steps.append("When")
            if not has_then:
                missing_steps.append("Then")

            if missing_steps:
                errors.append(f"Scenario '{title}' is missing steps: {', '.join(missing_steps)}.")
            elif not (has_given.start() < has_when.start() < has_then.start()):
                errors.append(f"Scenario '{title}' steps ordering seems incorrect. Expect Given -> When -> Then.")

            malformed_steps = []
            for line in block.splitlines():
                if re.match(r"^\s*(Given|When|Then|And)\b", line) and not re.match(
                    r"^\s*(Given|When|Then|And)\s+\S",
                    line,
                ):
                    malformed_steps.append(line.strip())

            if malformed_steps:
                errors.append(f"Scenario '{title}' has malformed step lines: {malformed_steps}")

    return (len(errors) == 0, errors)


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        script_name = Path(argv[0]).name if argv else 'validate-issue-format.py'
        print(f"INVALID: Usage: python {script_name} <issue_file>")
        return 2

    issue_file = Path(argv[1])
    try:
        content = issue_file.read_text(encoding="utf-8")
    except OSError as error:
        print(f"INVALID: Could not read file '{issue_file}': {error}")
        return 2

    is_valid, errors = validate_issue_format(content)
    if is_valid:
        print("VALID")
        return 0

    print("INVALID: Validation failed with the following errors:")
    for error in errors:
        print(f"- {error}")
    return 2


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))