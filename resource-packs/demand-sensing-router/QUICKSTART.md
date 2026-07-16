# Quick Start

New to Agent Skills or AI workflow packs? Open `START-HERE.pdf` before using this command reference.

## 1. Profile The Sample Demand

From this package directory, run:

```bash
python3 skills/demand-sensing-router/scripts/profile_demand.py \
  skills/demand-sensing-router/assets/sample-demand-history.csv \
  --output demand-profile.csv
```

This creates one diagnostic profile per SKU-location. ADI and CV2 are evidence, not automatic cadence decisions.

## 2. Install Or Attach The Skill

### Codex or another Agent Skills-compatible tool

Copy `skills/demand-sensing-router/` into the tool's skills directory, then ask:

```text
Use the Demand Sensing Router skill to combine demand-profile.csv with
skills/demand-sensing-router/assets/sample-routing-context.csv.

Produce the five-artifact package. Do not invent missing data.
```

### Claude Project or Cowork

Attach the skill folder, `workers/`, and the two sample CSV files to one controlled project or plugin. Use `prompts/cowork-run-prompt.md` as the run instruction.

### Chat-first test

Attach the routing policy, data contract, demand profile, and context file. Use `prompts/chat-first-starter.md`. This is suitable for a first manual run, not a scheduled production workflow.

## 3. Validate The Board

After the routing board is created, run:

```bash
python3 skills/demand-sensing-router/scripts/validate_routing.py \
  examples/routing-board-example.csv
```

The validator rejects a frequent-sensing route without a dated signal, an open response window, or a supported decision.

## 4. Review The Exceptions First

Open, in order:

1. `examples/route-change-log-example.csv`
2. `examples/data-quality-exceptions-example.csv`
3. `examples/demand-review-brief-example.md`
4. `examples/routing-board-example.csv`

Do not write an approved cadence back to a planning system until the planner has reviewed the recommendation.
