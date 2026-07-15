#!/usr/bin/env python3
"""Calculate ADI, CV2, and a diagnostic demand-pattern class from CSV history."""

from __future__ import annotations

import argparse
import csv
import statistics
from collections import defaultdict
from pathlib import Path


REQUIRED = {"sku", "location", "period", "demand"}


def classify(adi: float, cv2: float, nonzero_periods: int) -> str:
    if nonzero_periods == 0:
        return "NO DEMAND / REVIEW"
    if adi < 1.32:
        return "SMOOTH" if cv2 < 0.49 else "ERRATIC"
    return "INTERMITTENT" if cv2 < 0.49 else "LUMPY"


def profile(path: Path) -> list[dict[str, str]]:
    grouped: dict[tuple[str, str], list[float]] = defaultdict(list)

    with path.open(newline="", encoding="utf-8-sig") as handle:
        reader = csv.DictReader(handle)
        missing = REQUIRED.difference(reader.fieldnames or [])
        if missing:
            raise ValueError(f"Missing required columns: {', '.join(sorted(missing))}")

        for row_number, row in enumerate(reader, start=2):
            sku = (row.get("sku") or "").strip()
            location = (row.get("location") or "").strip()
            if not sku or not location:
                raise ValueError(f"Row {row_number}: sku and location are required")
            try:
                demand = float(row["demand"])
            except (TypeError, ValueError) as exc:
                raise ValueError(f"Row {row_number}: demand must be numeric") from exc
            if demand < 0:
                raise ValueError(f"Row {row_number}: negative demand requires review")
            grouped[(sku, location)].append(demand)

    output: list[dict[str, str]] = []
    for (sku, location), values in sorted(grouped.items()):
        nonzero = [value for value in values if value > 0]
        adi = len(values) / len(nonzero) if nonzero else float("inf")
        if len(nonzero) > 1 and statistics.fmean(nonzero) > 0:
            cv = statistics.pstdev(nonzero) / statistics.fmean(nonzero)
            cv2 = cv * cv
        else:
            cv2 = 0.0

        output.append(
            {
                "sku": sku,
                "location": location,
                "periods": str(len(values)),
                "nonzero_periods": str(len(nonzero)),
                "adi": "" if not nonzero else f"{adi:.3f}",
                "cv2": f"{cv2:.3f}",
                "demand_pattern": classify(adi, cv2, len(nonzero)),
            }
        )
    return output


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("input", type=Path)
    parser.add_argument("--output", type=Path, default=Path("demand-profile.csv"))
    args = parser.parse_args()

    rows = profile(args.input)
    fields = ["sku", "location", "periods", "nonzero_periods", "adi", "cv2", "demand_pattern"]
    with args.output.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields)
        writer.writeheader()
        writer.writerows(rows)

    print(f"Wrote {len(rows)} demand profiles to {args.output}")


if __name__ == "__main__":
    main()
