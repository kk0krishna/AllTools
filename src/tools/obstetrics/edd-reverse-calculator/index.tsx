"use client";

import React, { useState } from "react";
import { formatISO, addDays, addMonths } from "date-fns";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ObstetricsDatingEngine } from "../shared/dating-engine";
import { MedicalDisclaimer, EducationalSection } from "../shared/clinical-components";

export function EDDReverseCalculator() {
  const [targetEDD, setTargetEDD] = useState<string>(() => {
    const defaultDate = addDays(new Date(), 180);
    return formatISO(defaultDate, { representation: "date" });
  });

  const result = targetEDD ? ObstetricsDatingEngine.calculateReverseFromEDD(targetEDD) : null;

  const handleNextPatient = () => {
    const defaultDate = addDays(new Date(), 180);
    setTargetEDD(formatISO(defaultDate, { representation: "date" }));
  };

  const setMonthsAhead = (months: number) => {
    setTargetEDD(formatISO(addMonths(new Date(), months), { representation: "date" }));
  };

  return (
    <div className="space-y-3 max-w-4xl mx-auto">
      {/* COMPACT TOP ACTION BAR */}
      <div className="flex items-center justify-between gap-2 bg-card p-2 rounded-xl border shadow-2xs">
        <span className="font-extrabold text-xs text-foreground px-2">⚡ Reverse EDD & Conception Calculator</span>
        <Button size="sm" onClick={handleNextPatient} className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold h-8 px-3 text-xs shadow-xs ml-auto">
          <RefreshCw className="w-3 h-3 mr-1" /> Next Patient
        </Button>
      </div>

      {/* COMPACT MAIN VIEWPORT (ZERO SCROLLING) */}
      <div className="grid md:grid-cols-12 gap-3 items-center bg-card p-4 rounded-2xl border shadow-sm">
        {/* Left: Input Box (6 Cols) */}
        <div className="md:col-span-6 space-y-2 border-b md:border-b-0 md:border-r pb-3 md:pb-0 md:pr-4">
          <Label htmlFor="edd" className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
            Target Delivery Date (EDD / C-Section)
          </Label>
          <Input
            id="edd"
            type="date"
            value={targetEDD}
            onChange={(e) => setTargetEDD(e.target.value)}
            className="h-10 text-lg font-extrabold rounded-lg border-2 bg-background shadow-inner"
          />
          <div className="space-y-1 pt-1">
            <span className="text-[10px] font-bold uppercase text-muted-foreground block">Quick Target Delivery Presets:</span>
            <div className="grid grid-cols-4 gap-1.5">
              <button onClick={() => setMonthsAhead(6)} className="bg-muted hover:bg-muted/80 py-1.5 rounded text-xs font-extrabold">+6 Mo</button>
              <button onClick={() => setMonthsAhead(7)} className="bg-muted hover:bg-muted/80 py-1.5 rounded text-xs font-extrabold">+7 Mo</button>
              <button onClick={() => setMonthsAhead(8)} className="bg-muted hover:bg-muted/80 py-1.5 rounded text-xs font-extrabold">+8 Mo</button>
              <button onClick={() => setMonthsAhead(9)} className="bg-muted hover:bg-muted/80 py-1.5 rounded text-xs font-extrabold">+9 Mo</button>
            </div>
          </div>
        </div>

        {/* Right: Instant Results (6 Cols) */}
        <div className="md:col-span-6 md:pl-2">
          {result ? (
            <div className="bg-gradient-to-br from-purple-500/15 via-purple-500/5 to-background p-4 rounded-xl border-2 border-purple-500/40 space-y-2 text-left">
              <div className="flex justify-between items-center border-b pb-1.5">
                <span className="text-xs font-semibold text-muted-foreground">Est. Conception / IUI:</span>
                <span className="text-base font-black text-purple-600 dark:text-purple-400">{ObstetricsDatingEngine.formatDate(result.conceptionDate, "MMM dd, yyyy")}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-muted-foreground">LMP Equivalent:</span>
                <span className="text-sm font-extrabold text-foreground">{ObstetricsDatingEngine.formatDate(result.lmpEquivalent, "MMM dd, yyyy")}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-muted-foreground">IVF Day 5 Blastocyst:</span>
                <span className="text-sm font-extrabold text-foreground">{ObstetricsDatingEngine.formatDate(result.ivfDay5Transfer, "MMM dd, yyyy")}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-muted-foreground">IVF Day 3 Embryo:</span>
                <span className="text-sm font-extrabold text-foreground">{ObstetricsDatingEngine.formatDate(result.ivfDay3Transfer, "MMM dd, yyyy")}</span>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-muted-foreground font-semibold border-2 border-dashed rounded-xl">
              Select target EDD to view reverse calculations.
            </div>
          )}
        </div>
      </div>

      {/* ALL EDUCATIONAL DETAILS & DISCLAIMERS COLLAPSED AT THE BOTTOM */}
      <EducationalSection
        why="Reverse pregnancy dating is invaluable for IVF clinics planning frozen embryo transfer (FET) schedules, forensic medical evaluations determining conception timelines, and patients wishing to align birth timing with maternity leave or seasonal preferences."
        formula={`1. LMP Equivalent = Target_EDD - 280 days
2. Conception / IUI Date = Target_EDD - 266 days
3. IVF Day 5 Blastocyst Transfer = Target_EDD - 261 days
4. IVF Day 3 Cleavage Transfer = Target_EDD - 263 days`}
        clinicalImportance="While biological variation in spontaneous labor means only 5% of deliveries occur precisely on the EDD, reverse calculations establish the exact reference timeline from which term (37w0d) and post-term (42w0d) boundaries are governed."
        examPearls={[
          "The human gestation period is defined as 280 days (40 weeks) from LMP, or precisely 266 days (38 weeks) from fertilization.",
          "In IVF pregnancies, embryo transfer occurs after fertilization has already taken place in vitro (3 days after egg retrieval for cleavage stage, or 5 days for blastocysts)."
        ]}
        references={[
          "ACOG Committee Opinion No. 700: Methods for Estimating Due Date (2017)",
          "FIGO Recommendations on Obstetric Dating and Nomenclature (2019)"
        ]}
      />

      <MedicalDisclaimer />
    </div>
  );
}
