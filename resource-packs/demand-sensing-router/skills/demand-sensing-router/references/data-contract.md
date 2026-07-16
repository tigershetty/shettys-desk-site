# Data Contract v1.0.0

## Minimum Input Grain

Use `SKU + LOCATION + PERIOD` for demand history. Keep customer or channel as an additional dimension only when it changes the operating decision.

## Demand History Input

Required columns:

```text
sku,location,period,demand
```

## Routing Context Input

Recommended columns:

```text
sku,location,signal_type,signal_date,signal_freshness_days,
response_window_days,lifecycle,volume_value_tier,service_priority,
decision_supported,planner_comment,previous_cadence
```

## Routing Board Output

Required columns:

```text
sku,location,demand_pattern,adi,cv2,signal_freshness_days,
response_window_days,lifecycle,recommended_cadence,routing_reason,
trigger_signal,decision_supported,review_flag
```

## Run Manifest

Record:

- run timestamp;
- policy version;
- input file names and extract dates;
- calculation script version;
- row counts received, routed, and rejected;
- validation result;
- unresolved exceptions.

## Missing Data Behavior

Use blank values and a review flag. Do not use `0`, `N/A`, or an invented default where the distinction matters.
