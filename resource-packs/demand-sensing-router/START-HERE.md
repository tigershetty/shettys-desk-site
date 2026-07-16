# Demand Sensing Router - Start Here

Version `1.1.0` | July 15, 2026

This guide is for someone using the pack for the first time. Start with the synthetic sample. Do not begin with production data.

## What You Are Building

The pack helps prepare a reviewable recommendation for each SKU-location:

- `SENSE FREQUENTLY`
- `PLAN MONTHLY`
- `SPECIAL METHOD / REVIEW`

It creates evidence for a planner. It does not change a forecast policy, planning master data, production order, or system of record.

## Choose A First-Run Path

### Path A - Chat first

Use this when you want to understand the method before installing anything.

1. Run the profiling script in the sample pack.
2. Upload the resulting profile, the sample routing context, the routing policy, and the data contract to Claude, ChatGPT, or another file-capable assistant.
3. Paste `prompts/chat-first-starter.md`.
4. Ask for the five expected outputs and review every route.

### Path B - Agent Skill

Use this when your tool supports Agent Skills or a skills folder.

1. Install `skills/demand-sensing-router/` in the tool's skills directory.
2. Keep the included references and scripts inside the skill folder.
3. Ask the agent to run the Demand Sensing Router against the supplied files.
4. Validate the routing board before accepting the output.

### Path C - Claude Project or Cowork

Use this when a business user wants one controlled project with reusable instructions.

1. Add the skill folder, `workers/`, and the two CSV input files to one project.
2. Use `prompts/cowork-run-prompt.md` as the run instruction.
3. Run manually until the team trusts the outputs and exceptions.
4. Only then consider a recurring pre-review run.

## Run The Synthetic Sample

Open Terminal, move into this package folder, and run:

```bash
python3 skills/demand-sensing-router/scripts/profile_demand.py \
  skills/demand-sensing-router/assets/sample-demand-history.csv \
  --output demand-profile.csv
```

Expected result:

```text
Wrote 4 demand profiles to demand-profile.csv
```

Then validate the supplied routing-board example:

```bash
python3 skills/demand-sensing-router/scripts/validate_routing.py \
  examples/routing-board-example.csv
```

Expected result:

```text
Routing validation passed
```

## Replace The Sample Data

Do not overwrite the original examples. Make two copies:

```text
sample-demand-history.csv  -> my-demand-history.csv
sample-routing-context.csv -> my-routing-context.csv
```

Keep the column names exactly as supplied.

### Demand History

File to copy:

```text
skills/demand-sensing-router/assets/sample-demand-history.csv
```

| Sample column | Replace with |
|---|---|
| `sku` | Your item, material, or product code |
| `location` | Your planning location, plant, DC, or market |
| `period` | One consistent daily or weekly period format |
| `demand` | Historical actual demand for that period |

Use one row per SKU-location-period. Do not mix daily and weekly buckets for the same SKU-location.

### Routing Context

File to copy:

```text
skills/demand-sensing-router/assets/sample-routing-context.csv
```

| Sample column | Replace with |
|---|---|
| `sku`, `location` | The same keys used in demand history |
| `signal_type` | POS, orders, promotion, launch plan, or another approved signal |
| `signal_date` | The date the signal was observed or extracted |
| `signal_freshness_days` | Days between the signal date and review date |
| `response_window_days` | Days remaining for the supported decision to change |
| `lifecycle` | Active, phase-in, phase-out, or your governed equivalent |
| `volume_value_tier` | Your approved portfolio tier |
| `service_priority` | High, medium, low, or your approved service class |
| `decision_supported` | Replenishment, deployment, allocation, capacity, sequence, or method choice |
| `planner_comment` | A short known event, assumption, or one-off explanation |
| `previous_cadence` | The previously approved routing lane |

Use ISO dates such as `2026-07-15`. A signal without a date cannot pass the freshness check.

## Run Your Own Files

```bash
python3 skills/demand-sensing-router/scripts/profile_demand.py \
  my-demand-history.csv \
  --output my-demand-profile.csv
```

Give the assistant these four files:

1. `my-demand-profile.csv`
2. `my-routing-context.csv`
3. `skills/demand-sensing-router/references/routing-policy.md`
4. `skills/demand-sensing-router/references/data-contract.md`

Then use the chat-first or Cowork prompt supplied in the pack.

## Review The Outputs

The workflow should produce:

1. a routing board;
2. a route-change log;
3. data-quality exceptions;
4. a demand-review brief;
5. a run manifest.

Start the meeting with routes that changed, failed verification, or have a closing response window. The planner approves every policy or system-of-record change.

## Troubleshooting

- `python3: command not found`: install Python 3 or use a managed company environment.
- Missing-column error: compare your header row with the supplied sample exactly.
- Duplicate-row error: keep only one row per SKU-location-period.
- Unsupported frequent-sensing route: add a dated signal, an open response window, and the decision the signal can still change.
- Mixed daily and weekly history: separate the series or convert it to one consistent bucket.
- Sensitive data: anonymize item and customer identifiers before using an external AI service unless your approved enterprise environment permits the data.

## Final Checklist

- [ ] The sample scripts run successfully.
- [ ] My two input files preserve the supplied column names.
- [ ] Every signal has a source date.
- [ ] Every frequent-sensing recommendation names an open decision window.
- [ ] Changed routes explain why they moved.
- [ ] Failed checks remain exceptions.
- [ ] A planner approves the final cadence and any system update.
