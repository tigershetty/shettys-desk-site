# Demand Sensing Router - Start Here

Version 1.2.0 | July 15, 2026

This is the text companion to the four-page START-HERE.pdf. Begin with the synthetic sample, not production data.

## 1. Run The Safe Sample

~~~bash
python3 START.py
~~~

The first run profiles four sample SKU-locations, compares the result with a known-good output, validates the supplied routing board, and names the next files to replace.

## 2. Understand The Three Lanes

- **SENSE FREQUENTLY:** a fresh signal exists, the response window is still open, and a named operating decision can change.
- **PLAN MONTHLY:** the baseline cadence fits the decision horizon and faster evidence would not change the near-term action.
- **SPECIAL METHOD / REVIEW:** intermittent, lumpy, lifecycle, data-quality, or weak-evidence cases need a separate method or planner decision.

## 3. Replace Two Files

Copy, do not overwrite:

~~~text
sample-demand-history.csv  -> my-demand-history.csv
sample-routing-context.csv -> my-routing-context.csv
~~~

Demand history must contain sku, location, period, and numeric demand, with one row per SKU-location-period.

Routing context must preserve the planning keys and explain the signal, signal date, freshness, response window, lifecycle, portfolio priority, supported decision, planner comment, and previous cadence.

## 4. Run Your History

~~~bash
python3 skills/demand-sensing-router/scripts/profile_demand.py \
  my-demand-history.csv \
  --output my-demand-profile.csv
~~~

Then give the assistant:

1. my-demand-profile.csv;
2. my-routing-context.csv;
3. skills/demand-sensing-router/references/routing-policy.md;
4. skills/demand-sensing-router/references/data-contract.md.

Use the supplied chat-first or Cowork prompt. Do not invent missing evidence.

## 5. Review The Outputs

Start with changed routes, failed verification, and closing response windows:

1. route-change log;
2. data-quality exceptions;
3. demand-review brief;
4. routing board;
5. run manifest.

The workflow prepares evidence and a recommendation. The planner approves forecast policy, cadence, master data, and every system-of-record change.

## Troubleshooting

- python3 not found: use a managed Python 3 environment.
- Missing columns: copy the sample header exactly.
- Duplicate rows: keep one row per SKU-location-period.
- Frequent-sensing route rejected: add a dated signal, open response window, and supported decision or keep the row in review.
- Sensitive data: anonymize identifiers or use an approved enterprise AI environment.
