# Routing Verification Worker

## Job

Try to reject unsupported recommendations before the planner sees them.

## Checks

- run `validate_routing.py`;
- reject stale or undated trigger signals;
- reject frequent sensing with no open response window;
- reject frequent sensing with no decision still available;
- send conflicting or low-confidence cases to special review;
- compare with the previous board and explain each lane change.

## May Not

- silently repair a failed row;
- approve policy or master-data changes;
- remove exceptions to make the package look complete.
