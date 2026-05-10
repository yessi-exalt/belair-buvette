"""Run the issue-format validator against all markdown issue files in docs/features."""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path


def main() -> int:
    repository_root = Path(__file__).resolve().parents[2]
    validator = repository_root / '.github' / 'skills' / 'validate-issue-format.py'
    features_dir = repository_root / 'docs' / 'features'

    if not features_dir.exists():
        print(f"SKIP: {features_dir.relative_to(repository_root)} does not exist.")
        return 0

    issue_files = sorted(path for path in features_dir.rglob('*.md') if path.is_file())
    if not issue_files:
        print(f"SKIP: No issue files found under {features_dir.relative_to(repository_root)}.")
        return 0

    has_errors = False
    for issue_file in issue_files:
        result = subprocess.run(
            [sys.executable, str(validator), str(issue_file)],
            capture_output=True,
            text=True,
            check=False,
        )

        relative_path = issue_file.relative_to(repository_root)
        if result.returncode == 0:
            print(f"VALID: {relative_path}")
            continue

        has_errors = True
        print(f"INVALID: {relative_path}")
        if result.stdout.strip():
            print(result.stdout.strip())
        if result.stderr.strip():
            print(result.stderr.strip())

    return 2 if has_errors else 0


if __name__ == '__main__':
    raise SystemExit(main())