"use client";

import React, { useState } from "react";
import { Calendar, Activity, ShieldCheck, Stethoscope } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PREGNANCY_MILESTONES } from "../shared/milestones-data";
import { MedicalDisclaimer, EducationalSection } from "../shared/clinical-components";

export function PregnancyTimeline() {
  const [selectedWeek, setSelectedWeek] = useState<number>(12);

  const currentMilestone = PREGNANCY_MILESTONES.find((m) => m.week === selectedWeek) || PREGNANCY_MILESTONES[0];

  return (
    <div className="space-y-3 max-w-4xl mx-auto">
      {/* COMPACT TOP BAR: WEEK SELECTOR */}
      <div className="flex items-center justify-between gap-2 bg-card p-2 rounded-xl border shadow-2xs">
        <span className="font-extrabold text-xs text-foreground px-2 flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-primary" /> Gestational Milestone Protocol
        </span>
        <div className="flex items-center gap-1.5 ml-auto">
          <span className="text-xs font-bold text-muted-foreground">Select Week:</span>
          <select
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(parseInt(e.target.value))}
            className="bg-primary text-primary-foreground font-black text-sm px-3 py-1 rounded-lg border-0 outline-none cursor-pointer shadow-xs"
          >
            {PREGNANCY_MILESTONES.map((m) => (
              <option key={m.week} value={m.week} className="bg-background text-foreground font-bold">
                Week {m.week} ({m.trimester})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* COMPACT WEEK SELECTOR PILLS */}
      <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar">
        {PREGNANCY_MILESTONES.map((m) => (
          <button
            key={m.week}
            onClick={() => setSelectedWeek(m.week)}
            className={`px-2.5 py-1 rounded-lg font-extrabold text-xs shrink-0 transition-all ${
              m.week === selectedWeek ? "bg-primary text-primary-foreground shadow-xs" : "bg-card hover:bg-muted text-foreground border"
            }`}
          >
            W{m.week}
          </button>
        ))}
      </div>

      {/* COMPACT MAIN VIEWPORT (ZERO SCROLLING NEEDED FOR PRIMARY SUMMARY) */}
      <Card className="border-2 border-primary/30 shadow-sm bg-gradient-to-br from-background via-background to-muted/10 overflow-hidden">
        <div className="bg-primary/10 px-4 py-2.5 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black text-primary font-heading">Week {currentMilestone.week}</span>
            <span className="bg-background text-foreground text-[10px] font-black uppercase px-2 py-0.5 rounded-full border">
              {currentMilestone.trimester}
            </span>
          </div>
          <span className="text-xs font-extrabold text-foreground">{currentMilestone.title}</span>
        </div>

        <CardContent className="p-4 space-y-3">
          {/* Fetal Development */}
          <div className="bg-muted/40 p-2.5 rounded-xl border text-xs text-foreground font-medium leading-relaxed">
            <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-0.5 flex items-center gap-1">
              <Activity className="w-3.5 h-3.5" /> Fetal Development Summary:
            </span>
            {currentMilestone.fetalDevelopment}
          </div>

          <div className="grid sm:grid-cols-2 gap-2 text-xs">
            {/* Objectives */}
            <div className="bg-blue-500/5 p-2.5 rounded-xl border border-blue-500/20 space-y-1">
              <span className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Key Clinical Objectives:
              </span>
              <ul className="space-y-1 pl-3 list-disc text-foreground">
                {currentMilestone.clinicalSignificance.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Recommended Tests */}
            <div className="bg-purple-500/5 p-2.5 rounded-xl border border-purple-500/20 space-y-1">
              <span className="font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1">
                <Stethoscope className="w-3.5 h-3.5" /> Antenatal Screening & Scans:
              </span>
              <ul className="space-y-1 pl-3 list-disc text-foreground">
                {currentMilestone.recommendedTests.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
                {currentMilestone.ultrasound.map((item, idx) => (
                  <li key={`us-${idx}`} className="text-emerald-600 dark:text-emerald-400 font-bold">{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ALL EDUCATIONAL DETAILS & DISCLAIMERS COLLAPSED AT THE BOTTOM */}
      <EducationalSection
        why="A standardized antenatal timeline prevents omission of time-sensitive screening tests (such as first-trimester aneuploidy screening, 20-week anatomy scans, and 24-28 week gestational diabetes tests) and optimizes maternal-fetal immunization timing (such as Tdap between 27 and 36 weeks and Anti-D administration at 28 weeks)."
        clinicalImportance="Every obstetric encounter should systematically verify: (1) Accurate gestational dating, (2) Blood pressure and urine proteinuria surveillance, (3) Appropriate fetal growth velocity, and (4) Timely administration of prophylactic interventions (Aspirin for preeclampsia, RhIG for Rh-negative mothers, and antibiotics for GBS colonization)."
        examPearls={[
          "Nuchal Translucency (NT) screening MUST be performed between 11w0d and 13w6d (when CRL is between 45 mm and 84 mm).",
          "The anatomical survey is optimally performed between 18w0d and 22w0d to balance structural visualization and gestational age limits for clinical decision making.",
          "Universal screening for Group B Streptococcus (GBS) via vaginal-rectal culture is recommended between 36w0d and 37w6d."
        ]}
        references={[
          "WHO Recommendations on Antenatal Care for a Positive Pregnancy Experience (2016)",
          "ACOG Committee Opinion No. 700: Methods for Estimating Due Date (2017)",
          "CDC Immunization Schedule for Pregnant Women (2023)",
          "RCOG Routine Antenatal Care Guidelines (2019)"
        ]}
      />

      <MedicalDisclaimer />
    </div>
  );
}
