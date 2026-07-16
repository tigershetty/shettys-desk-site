---
name: demand-sensing-router
description: Build and validate a planner-reviewable routing board that assigns SKU-location combinations to frequent demand sensing, standard monthly planning, or special-method review. Use when working with demand history, forecast cadence, ADI and CV2 profiles, recent order or POS signals, lifecycle status, response windows, or requests to decide which items should receive different forecasting attention.
---

# Demand Sensing Router

Prepare the evidence and first-pass routing artifact. Keep the final cadence, forecasting method, and system-of-record change with the planner.

## Run The Workflow

1. Inspect the supplied files and identify the SKU-location grain, period grain, extract dates, and missing required fields.
2. Read `references/routing-policy.md` before assigning a lane. Read `references/data-contract.md` before creating outputs.
3. When period-level demand history is available, run:

   ```bash
   python3 scripts/profile_demand.py INPUT.csv --output demand-profile.csv
   ```

4. Join the demand profile to signal freshness, response window, volume or value, lifecycle, service priority, and planner comments. Do not infer missing evidence.
5. Recommend exactly one lane for each row:
   - `SENSE FREQUENTLY`
   - `PLAN MONTHLY`
   - `SPECIAL METHOD / REVIEW`
6. State one routing reason, one trigger signal, and one operating decision for every recommendation.
7. Compare against the previous routing board when supplied. Explain every lane change.
8. Run the routing validator before presenting the package:

   ```bash
   python3 scripts/validate_routing.py routing-board.csv
   ```

9. Produce the five artifacts defined in the data contract.

## Apply The Decision Gates

- Treat demand sensing as a near-term signal adjustment, not a universally superior forecast.
- Do not route an item to frequent sensing from variability alone.
- Require a dated fresh signal, an open response window, and a named decision for `SENSE FREQUENTLY`.
- Route intermittent, lumpy, new, phase-in, phase-out, and structurally uncertain cases to special review when the standard binary would hide the method problem.
- Flag missing, stale, conflicting, or low-confidence evidence. Never fill gaps with plausible values.
- Keep stable items visible without giving them the same review priority as changed or failed rows.

## Return The Package

Create:

1. `routing-board.csv`
2. `route-change-log.csv`
3. `data-quality-exceptions.csv`
4. `demand-review-brief.md`
5. `run-manifest.json`

Start the review with changed lanes, failed validation, and closing response windows. Include the policy version and source dates in the manifest.
