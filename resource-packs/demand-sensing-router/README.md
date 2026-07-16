# Shetty's Desk Demand Sensing Router

Version 1.2.0 | July 15, 2026

Route SKU-location combinations to **SENSE FREQUENTLY**, **PLAN MONTHLY**, or **SPECIAL METHOD / REVIEW**, then make every recommendation prove its evidence, response window, and operating decision.

## Run The Safe Sample

Open Terminal in this extracted folder and run:

~~~bash
python3 START.py
~~~

The first run uses synthetic data only. It creates four demand profiles, compares them with the known-good example, validates the supplied routing board, and prints the next files to replace.

## What You Get

- a four-page branded field guide in START-HERE.pdf;
- a one-command synthetic first run;
- deterministic ADI, CV2, and demand-pattern profiling;
- a routing policy, data contract, and validator;
- an installable Agent Skill and three worker definitions;
- sample inputs plus five planner-reviewable output examples;
- Claude Project, Cowork, Agent Skill, and chat-first paths;
- a package manifest, validation checklist, and release record.

## Use Your Data

Do not overwrite the samples. Copy:

~~~text
skills/demand-sensing-router/assets/sample-demand-history.csv
  -> my-demand-history.csv

skills/demand-sensing-router/assets/sample-routing-context.csv
  -> my-routing-context.csv
~~~

Preserve the supplied headers and grain. Open START-HERE.pdf for the exact field map, evidence contract, output review order, and troubleshooting.

## The Important Boundary

This pack prepares a first-pass operating artifact. It does not approve forecast policy, update master data, release orders, or replace planner judgment.

## Folder Map

~~~text
demand-sensing-router/
|-- START.py
|-- START-HERE.pdf
|-- START-HERE.md
|-- QUICKSTART.md
|-- MANIFEST.json
|-- VERSION.md
|-- skills/demand-sensing-router/
|-- workers/
|-- prompts/
|-- examples/
+-- validation-checklist.md
~~~

Created by [Shetty's Desk](https://shettysdesk.vercel.app).
