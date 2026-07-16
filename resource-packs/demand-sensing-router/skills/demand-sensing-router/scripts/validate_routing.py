#!/usr/bin/env python3
"""Reject routing-board rows that violate the minimum evidence contract."""

from __future__ import annotations

import argparse
import csv
from pathlib import Path


REQUIRED = {
    "sku",
    "location",
    "demand_pattern",
    "signal_freshness_days",
    "response_window_days",
    "lifecycle",
    "recommended_cadence",
    "routing_reason",
    "trigger_signal",
    "decision_supported",
    "review_flag",
}
ALLOWED = {"SENSE FREQUENTLY", "PLAN MONTHLY", "SPECIAL METHOD / REVIEW"}
SPECIAL_LIFECYCLES = {"NEW", "PHASE-IN", "PHASE-OUT", "OBSOLETE"}


def positive_number(value: str) -> bool:
    try:
        return float(value) > 0
    except ValueError:
        return False


def validate(path: Path) -> list[str]:
    errors: list[str] = []
    with path.open(newline="", encoding="utf-8-sig") as handle:
        reader = csv.DictReader(handle)
        missing = REQUIRED.difference(reader.fieldnames or [])
        if missing:
            return [f"Missing required columns: {', '.join(sorted(missing))}"]

        for row_number, row in enumerate(reader, start=2):
            cadence = (row["recommended_cadence"] or "").strip().upper()
            lifecycle = (row["lifecycle"] or "").strip().upper()
            prefix = f"Row {row_number} ({row['sku']} / {row['location']}):"

            if cadence not in ALLOWED:
                errors.append(f"{prefix} unsupported cadence '{cadence}'")
                continue
            if not row["routing_reason"].strip():
                errors.append(f"{prefix} routing reason is required")
            if cadence == "SENSE FREQUENTLY":
                if not row["trigger_signal"].strip():
                    errors.append(f"{prefix} frequent sensing requires a trigger signal")
                if not row["signal_freshness_days"].strip():
                    errors.append(f"{prefix} frequent sensing requires dated signal freshness")
                if not positive_number(row["response_window_days"].strip()):
                    errors.append(f"{prefix} frequent sensing requires an open response window")
                if not row["decision_supported"].strip():
                    errors.append(f"{prefix} frequent sensing requires a supported decision")
            if lifecycle in SPECIAL_LIFECYCLES and cadence != "SPECIAL METHOD / REVIEW":
                errors.append(f"{prefix} lifecycle '{lifecycle}' requires special-method review")
    return errors


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("routing_board", type=Path)
    args = parser.parse_args()

    errors = validate(args.routing_board)
    if errors:
        print("Routing validation failed:")
        for error in errors:
            print(f"- {error}")
        raise SystemExit(1)
    print("Routing validation passed")


if __name__ == "__main__":
    main()
