# Shetty's Desk Demand Sensing Router

Version `1.1.0` | July 15, 2026

Route SKU-location combinations to `SENSE FREQUENTLY`, `PLAN MONTHLY`, or `SPECIAL METHOD / REVIEW`, then make every recommendation prove its evidence, response window, and operating decision.

## What You Get

- an installable Agent Skill under `skills/demand-sensing-router/`;
- a branded `START-HERE.pdf` for a first-time user;
- deterministic ADI, CV2, and demand-pattern profiling;
- a routing policy and fixed data contract;
- three role definitions for profiling, routing, and verification;
- synthetic sample inputs and planner-reviewable expected outputs;
- Claude Cowork, Claude Code, and chat-first setup paths;
- a validation checklist that blocks unsupported routes.

## Start Here

Open `START-HERE.pdf` first. It explains which route to choose, how to run the sample, exactly which two CSV files to copy, and what to replace in every column. `QUICKSTART.md` remains the concise command reference.

## The Important Boundary

This pack prepares a first-pass operating artifact. It does not approve the forecast policy, update master data, release orders, or replace planner judgment.

## Folder Map

```text
demand-sensing-router/
├── README.md
├── START-HERE.pdf
├── START-HERE.md
├── QUICKSTART.md
├── VERSION.md
├── LICENSE.md
├── skills/demand-sensing-router/
├── workers/
├── prompts/
├── examples/
└── validation-checklist.md
```

Created by [Shetty's Desk](https://shettysdesk.vercel.app).
