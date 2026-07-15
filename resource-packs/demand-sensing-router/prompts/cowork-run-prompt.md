# Cowork Run Prompt

```text
Run the installed Demand Sensing Router against the latest approved source package.

Use routing-policy version 1.0.0. First validate the source dates and required fields. Then run the demand profile, cadence routing, and independent verification jobs in that order.

Produce:
1. routing-board.csv
2. route-change-log.csv
3. data-quality-exceptions.csv
4. demand-review-brief.md
5. run-manifest.json

Reject missing or stale evidence. Do not route a SKU to frequent sensing unless a dated signal exists, the response window remains open, and an operating decision can still change. Do not update any planning system. Present all changed and failed rows for planner approval.
```
