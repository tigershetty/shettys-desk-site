# Validation Checklist

## Input Gate

- [ ] Grain is stated as SKU-location-period.
- [ ] Demand and forecast extracts have dates.
- [ ] Negative demand, returns, and corrections are treated explicitly.
- [ ] Signal type and signal date are present where frequent sensing is considered.
- [ ] Response window and supported decision are named.
- [ ] Lifecycle and planner comments are included.

## Calculation Gate

- [ ] ADI is total periods divided by non-zero periods.
- [ ] CV2 is calculated on non-zero demand quantities.
- [ ] Zero-demand items are sent to review.
- [ ] Thresholds are treated as diagnostics, not universal policy.

## Routing Gate

- [ ] Every row uses one of the three allowed lanes.
- [ ] Frequent sensing has a fresh signal, open response window, and named decision.
- [ ] Variability alone never triggers frequent sensing.
- [ ] New, phase-in, phase-out, intermittent, and lumpy items receive explicit method review.
- [ ] Missing evidence is blank and flagged rather than invented.

## Review Gate

- [ ] Every lane change appears in the route-change log.
- [ ] Failed rows appear in data-quality exceptions.
- [ ] The brief starts with changed lanes and closing response windows.
- [ ] Source dates, policy version, and validation result appear in the manifest.
- [ ] Planner approval is recorded before any system-of-record change.
