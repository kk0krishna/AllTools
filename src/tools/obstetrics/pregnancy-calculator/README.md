# Pregnancy Dating & Due Date Engine (`pregnancy-calculator`)

## Architecture & Overview
This package implements the primary clinical dating engine for ToolVerse Obstetric Clinical Suite (OCS). It provides multi-modal calculation support for establishing gestational age and estimated due dates across all standard clinical scenarios.

## Core Logic & Algorithms
The calculation engine is located in `src/tools/obstetrics/shared/dating-engine.ts` and uses `date-fns` for timezone-safe date arithmetic.
* **Naegele's Rule (LMP)**: `EDD = LMP + 280 days + (CycleLength - 28)`
* **Ultrasound Scan**: `LMP_equiv = ScanDate - (Weeks * 7 + Days); EDD = LMP_equiv + 280`
* **IVF Transfer**: `EDD = TransferDate + 261` (for Day 5 embryo) or `+ 263` (for Day 3 embryo).

## UI & UX Details
* Responsive tabs for switching dating modes.
* Interactive calculation reference date selector (allowing doctors to calculate what GA a patient *was* at a past clinic visit or *will be* at a scheduled surgery date).
* Visual progress bar displaying trimester, viability (24w0d), and term (37w0d) milestones.

## Maintenance & Guidelines
When extending formulas or adding biometric dating curves, ensure alignment with ACOG Committee Opinion No. 700 and RCOG ultrasound guidance.
