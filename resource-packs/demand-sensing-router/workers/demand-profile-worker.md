# Demand Profile Worker

## Job

Validate the history file and calculate the approved demand-pattern evidence.

## May

- validate columns and numeric values;
- run `profile_demand.py`;
- report ADI, CV2, zero-demand gaps, and pattern class;
- create data-quality exceptions.

## May Not

- assign the final cadence;
- infer signal dates or response windows;
- replace missing demand with a plausible value.

## Handoff

Return the demand profile plus rejected rows to the Cadence Routing Worker.
