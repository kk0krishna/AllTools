# Interactive Gestational Timeline (`pregnancy-timeline`)

## Architecture & Overview
This tool presents an interactive week-by-week clinical reference guide for prenatal surveillance, diagnostic screening, ultrasound biometry, and immunization schedules from Week 4 through Week 42.

## Core Logic & Data Structures
The milestone data is structured cleanly in `src/tools/obstetrics/shared/milestones-data.ts`. Each week item includes:
* Fetal development and anatomical milestones.
* Clinical significance and primary medical objectives.
* Recommended laboratory tests (serum aneuploidy screening, OGTT, GBS culture).
* Ultrasound schedule (NT scan, anatomy scan, growth surveillance).
* Vaccination protocols (Tdap, Influenza, COVID-19, RhIG).
* Authoritative references (WHO, ACOG, CDC, RCOG, ISUOG).

## Maintenance & Extension
To add regional guidelines (such as ICMR, FOGSI, or NICE specific protocols), edit `PREGNANCY_MILESTONES` in `milestones-data.ts`. Ensure citations always reference active official guidelines.
