#!/usr/bin/env python3
"""Run the Demand Sensing Router's safe synthetic first-run checks."""

from __future__ import annotations

import csv
import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parent
SKILL = ROOT / "skills" / "demand-sensing-router"
HISTORY = SKILL / "assets" / "sample-demand-history.csv"
CONTEXT = SKILL / "assets" / "sample-routing-context.csv"
PROFILE = ROOT / "sample-run" / "demand-profile.csv"
EXPECTED_PROFILE = ROOT / "examples" / "demand-profile-example.csv"
BOARD = ROOT / "examples" / "routing-board-example.csv"


def run(command: list[str]) -> None:
    result = subprocess.run(command, cwd=ROOT, text=True, capture_output=True)
    if result.returncode:
        print(result.stdout, end="")
        print(result.stderr, end="", file=sys.stderr)
        raise SystemExit(result.returncode)
    print(f"  PASS  {result.stdout.strip()}")


def read_rows(path: Path) -> list[dict[str, str]]:
    with path.open(newline="", encoding="utf-8-sig") as handle:
        return list(csv.DictReader(handle))


def main() -> None:
    required = [HISTORY, CONTEXT, EXPECTED_PROFILE, BOARD]
    missing = [path.relative_to(ROOT) for path in required if not path.exists()]
    if missing:
        print("First run stopped: required package files are missing.")
        for path in missing:
            print(f"  MISSING  {path}")
        raise SystemExit(1)

    PROFILE.parent.mkdir(exist_ok=True)
    print("Shetty's Desk Demand Sensing Router / safe first run")
    print("1/3 Profile the synthetic demand history")
    run(
        [
            sys.executable,
            str(SKILL / "scripts" / "profile_demand.py"),
            str(HISTORY),
            "--output",
            str(PROFILE),
        ]
    )

    print("2/3 Compare the profile with the known-good example")
    if read_rows(PROFILE) != read_rows(EXPECTED_PROFILE):
        print("  FAIL  Generated profile does not match examples/demand-profile-example.csv")
        raise SystemExit(1)
    print("  PASS  4 generated profiles match the known-good example")

    print("3/3 Validate the supplied routing board")
    run([sys.executable, str(SKILL / "scripts" / "validate_routing.py"), str(BOARD)])

    print("\nFIRST RUN PASSED")
    print("No external service or production data was used.")
    print("\nNext:")
    print("  1. Copy sample-demand-history.csv to my-demand-history.csv.")
    print("  2. Copy sample-routing-context.csv to my-routing-context.csv.")
    print("  3. Preserve the supplied headers and replace only the sample rows.")
    print("  4. Use prompts/chat-first-starter.md for the lightest manual path.")
    print("\nOpen START-HERE.pdf for the field map and planner review order.")


if __name__ == "__main__":
    main()
