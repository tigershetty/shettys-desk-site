# Routing Policy v1.0.0

## Purpose

Route planning attention according to the demand pattern, available signal, and decision horizon. Do not use the policy as an automatic forecast-method selector.

## Diagnostic Measures

- **ADI:** total periods divided by periods with non-zero demand.
- **CV2:** squared coefficient of variation of non-zero demand quantities.
- **Pattern thresholds:** use ADI `1.32` and CV2 `0.49` as diagnostics for smooth, erratic, intermittent, and lumpy demand. They do not decide cadence alone.
- **Signal freshness:** age of the most recent approved order, POS, promotion, inventory, or market signal.
- **Response window:** remaining time in which replenishment, deployment, allocation, or production sequence can still change.

## Lane A: SENSE FREQUENTLY

Recommend only when all of the following are true:

- a dated recent signal exists at a daily or weekly cadence;
- the signal materially changes the near-term demand shape;
- the response window remains open;
- a named operating decision can still change;
- the item has enough signal density for a meaningful adjustment.

Frequent sensing requires the route reason, trigger signal, signal date, response window, and supported decision.

## Lane B: PLAN MONTHLY

Recommend when:

- the demand pattern and decision horizon are comparatively stable;
- new downstream information is weak, late, or unlikely to change a near-term decision;
- history, trend, seasonality, and commercial assumptions remain the useful baseline;
- the monthly process supports capacity, inventory, financial, or supply alignment.

## Lane C: SPECIAL METHOD / REVIEW

Recommend when:

- long zero-demand gaps or irregular order intervals are material;
- non-zero demand quantities vary sharply;
- the item is new, phasing in, phasing out, or becoming obsolete;
- required evidence is missing or conflicting;
- neither normal lane represents the forecasting problem honestly.

## Planner Boundary

The workflow can recommend and explain. It cannot approve a planning policy, change master data, release an order, or update the system of record.
