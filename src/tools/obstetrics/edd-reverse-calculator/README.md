# Reverse Due Date Calculator (`edd-reverse-calculator`)

## Architecture & Overview
This tool performs reverse obstetric dating, taking a target Estimated Due Date (EDD) as input and deriving all historical gestational milestones, including LMP equivalent, conception date, and IVF transfer target dates.

## Core Logic & Formulas
Using `ObstetricsDatingEngine.calculateReverseFromEDD()` in `src/tools/obstetrics/shared/dating-engine.ts`:
* `LMP Equivalent = EDD - 280 days`
* `Conception Date = EDD - 266 days`
* `IVF Day 5 Transfer = EDD - 261 days`
* `IVF Day 3 Transfer = EDD - 263 days`

## Maintenance & Extension
When updating embryology protocols (e.g. Day 6 blastocyst transfers or frozen embryo thawing windows), update `calculateReverseFromEDD` in the shared engine and expose the field on this UI.
