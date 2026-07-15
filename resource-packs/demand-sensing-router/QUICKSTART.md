# Quick Start

## 1. Prove The Pack

From the extracted package folder:

~~~bash
python3 START.py
~~~

Expected final line:

~~~text
FIRST RUN PASSED
~~~

The command uses synthetic data only and writes sample-run/demand-profile.csv.

## 2. Copy The Two Inputs

~~~text
sample-demand-history.csv  -> my-demand-history.csv
sample-routing-context.csv -> my-routing-context.csv
~~~

Keep the supplied column names. Use one consistent daily or weekly demand bucket and ISO dates such as 2026-07-15.

## 3. Profile Your History

~~~bash
python3 skills/demand-sensing-router/scripts/profile_demand.py \
  my-demand-history.csv \
  --output my-demand-profile.csv
~~~

ADI and CV2 are diagnostic evidence. They do not approve a cadence by themselves.

## 4. Choose A Tool Path

- **Chat first:** attach the profile, routing context, routing policy, and data contract; paste prompts/chat-first-starter.md.
- **Agent Skill:** install the complete skills/demand-sensing-router/ folder.
- **Claude Project or Cowork:** attach the skill, workers/, and inputs; use prompts/cowork-run-prompt.md.

Run manually until the team trusts the outputs and exceptions.

## 5. Review In This Order

1. route-change log;
2. data-quality exceptions;
3. demand-review brief;
4. routing board;
5. run manifest.

Do not write an approved cadence back to a planning system until a planner has reviewed the evidence.
