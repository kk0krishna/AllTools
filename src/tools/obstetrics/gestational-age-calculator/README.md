# Gestational Age Calculator (`gestational-age-calculator`)

## Architecture & Overview
This package provides a lightweight, rapid clinical tool designed specifically for inpatient obstetric ward rounds and clinic scheduling. It computes precise Gestational Age (GA) in weeks and days for any reference date.

## Core Logic & Mathematics
Utilizes `ObstetricsDatingEngine` in `src/tools/obstetrics/shared/dating-engine.ts`:
* Calculates total elapsed days between the normalized LMP equivalent date and the user-specified target date.
* Converts total days to `weeks = floor(days / 7)` and `days = days % 7`.

## Maintenance & Extension
When integrating automated electronic medical record (EMR) clipboard pasting or FHIR data import, link the target date and normalized LMP directly to this component's state.
