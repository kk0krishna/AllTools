"use client";

import React, { useState, useMemo } from "react";
import { formatISO, subDays, addDays } from "date-fns";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ObstetricsDatingEngine, DatingResult } from "../shared/dating-engine";
import { MedicalDisclaimer, EducationalSection } from "../shared/clinical-components";

export function GestationalAgeCalculator() {
  const [method, setMethod] = useState<"lmp" | "edd" | "scan">("lmp");
  const [targetDate, setTargetDate] = useState<string>(() => formatISO(new Date(), { representation: "date" }));
  
  const [lmpDate, setLmpDate] = useState<string>(() => {
    const today = new Date();
    return formatISO(subDays(today, 140), { representation: "date" });
  });
  const [eddDate, setEddDate] = useState<string>(() => {
    const today = new Date();
    return formatISO(subDays(today, -140), { representation: "date" });
  });
  const [scanDate, setScanDate] = useState<string>(() => {
    const today = new Date();
    return formatISO(subDays(today, 28), { representation: "date" });
  });
  const [gaWeeks, setGaWeeks] = useState<number>(12);
  const [gaDays, setGaDays] = useState<number>(0);

  const result = useMemo<DatingResult | null>(() => {
    try {
      if (method === "lmp" && lmpDate) {
        return ObstetricsDatingEngine.calculateByLMP(lmpDate, 28, targetDate);
      } else if (method === "edd" && eddDate) {
        const rev = ObstetricsDatingEngine.calculateReverseFromEDD(eddDate);
        if (rev) {
          return ObstetricsDatingEngine.calculateByLMP(formatISO(rev.lmpEquivalent, { representation: "date" }), 28, targetDate);
        }
      } else if (method === "scan" && scanDate) {
        return ObstetricsDatingEngine.calculateByUltrasound(scanDate, gaWeeks, gaDays, targetDate);
      }
    } catch (e) {
      console.error("GA calc error", e);
    }
    return null;
  }, [method, lmpDate, eddDate, scanDate, gaWeeks, gaDays, targetDate]);

  const handleNextPatient = () => {
    const today = new Date();
    setTargetDate(formatISO(today, { representation: "date" }));
    if (method === "lmp") {
      setLmpDate(formatISO(subDays(today, 140), { representation: "date" }));
    } else if (method === "edd") {
      setEddDate(formatISO(subDays(today, -140), { representation: "date" }));
    } else {
      setScanDate(formatISO(subDays(today, 28), { representation: "date" }));
      setGaWeeks(12);
      setGaDays(0);
    }
  };

  const adjustDate = (days: number) => {
    if (method === "lmp" && lmpDate) {
      setLmpDate(formatISO(addDays(new Date(lmpDate), days), { representation: "date" }));
    } else if (method === "edd" && eddDate) {
      setEddDate(formatISO(addDays(new Date(eddDate), days), { representation: "date" }));
    } else if (method === "scan" && scanDate) {
      setScanDate(formatISO(addDays(new Date(scanDate), days), { representation: "date" }));
    }
  };

  return (
    <div className="space-y-3 max-w-4xl mx-auto">
      {/* ULTRA-COMPACT MOBILE TOP BAR: ZERO WASTED VERTICAL SPACE */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-card p-2 rounded-xl border shadow-2xs">
        {/* Mode Selector Pill Tabs */}
        <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg">
          <button
            onClick={() => setMethod("lmp")}
            className={`px-3 py-1.5 rounded-md font-extrabold text-xs transition-all ${
              method === "lmp" ? "bg-primary text-primary-foreground shadow-xs" : "text-foreground hover:bg-card"
            }`}
          >
            LMP Date
          </button>
          <button
            onClick={() => setMethod("edd")}
            className={`px-3 py-1.5 rounded-md font-extrabold text-xs transition-all ${
              method === "edd" ? "bg-primary text-primary-foreground shadow-xs" : "text-foreground hover:bg-card"
            }`}
          >
            Known EDD
          </button>
          <button
            onClick={() => setMethod("scan")}
            className={`px-3 py-1.5 rounded-md font-extrabold text-xs transition-all ${
              method === "scan" ? "bg-primary text-primary-foreground shadow-xs" : "text-foreground hover:bg-card"
            }`}
          >
            Ultrasound
          </button>
        </div>

        {/* Target Date & Next Patient Action */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-muted/40 px-2 py-1 rounded-md border text-xs">
            <span className="text-muted-foreground font-semibold">Target:</span>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="bg-transparent font-extrabold text-xs focus:outline-none w-28"
            />
          </div>
          <Button
            size="sm"
            onClick={handleNextPatient}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold h-8 px-3 text-xs shadow-xs"
          >
            <RefreshCw className="w-3 h-3 mr-1" /> Next Patient
          </Button>
        </div>
      </div>

      {/* COMPACT MAIN VIEWPORT: INPUTS & INSTANT BIG RESULT (ZERO SCROLLING) */}
      <div className="grid md:grid-cols-12 gap-3 items-center bg-card p-4 rounded-2xl border shadow-sm">
        {/* Left: Input Box (6 Cols) */}
        <div className="md:col-span-6 space-y-2 border-b md:border-b-0 md:border-r pb-3 md:pb-0 md:pr-4">
          {method === "lmp" && (
            <div className="space-y-1.5">
              <Label htmlFor="lmp" className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                First Day of Last Menstrual Period (LMP)
              </Label>
              <Input
                id="lmp"
                type="date"
                value={lmpDate}
                onChange={(e) => setLmpDate(e.target.value)}
                className="h-10 text-base font-extrabold rounded-lg border-2 bg-background shadow-inner"
              />
              <div className="flex items-center gap-1 pt-0.5">
                <span className="text-[10px] font-bold uppercase text-muted-foreground mr-1">Nudge:</span>
                <button onClick={() => adjustDate(-7)} className="bg-muted hover:bg-muted/80 px-2 py-1 rounded text-xs font-mono font-bold">-1wk</button>
                <button onClick={() => adjustDate(-1)} className="bg-muted hover:bg-muted/80 px-2 py-1 rounded text-xs font-mono font-bold">-1d</button>
                <button onClick={() => adjustDate(1)} className="bg-muted hover:bg-muted/80 px-2 py-1 rounded text-xs font-mono font-bold">+1d</button>
                <button onClick={() => adjustDate(7)} className="bg-muted hover:bg-muted/80 px-2 py-1 rounded text-xs font-mono font-bold">+1wk</button>
              </div>
            </div>
          )}

          {method === "edd" && (
            <div className="space-y-1.5">
              <Label htmlFor="edd" className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                Known Estimated Due Date (EDD)
              </Label>
              <Input
                id="edd"
                type="date"
                value={eddDate}
                onChange={(e) => setEddDate(e.target.value)}
                className="h-10 text-base font-extrabold rounded-lg border-2 bg-background shadow-inner"
              />
              <div className="flex items-center gap-1 pt-0.5">
                <span className="text-[10px] font-bold uppercase text-muted-foreground mr-1">Nudge:</span>
                <button onClick={() => adjustDate(-7)} className="bg-muted hover:bg-muted/80 px-2 py-1 rounded text-xs font-mono font-bold">-1wk</button>
                <button onClick={() => adjustDate(-1)} className="bg-muted hover:bg-muted/80 px-2 py-1 rounded text-xs font-mono font-bold">-1d</button>
                <button onClick={() => adjustDate(1)} className="bg-muted hover:bg-muted/80 px-2 py-1 rounded text-xs font-mono font-bold">+1d</button>
                <button onClick={() => adjustDate(7)} className="bg-muted hover:bg-muted/80 px-2 py-1 rounded text-xs font-mono font-bold">+1wk</button>
              </div>
            </div>
          )}

          {method === "scan" && (
            <div className="space-y-2">
              <div>
                <Label htmlFor="scan" className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                  Ultrasound Scan Date
                </Label>
                <Input
                  id="scan"
                  type="date"
                  value={scanDate}
                  onChange={(e) => setScanDate(e.target.value)}
                  className="h-9 font-extrabold rounded-lg border-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="w" className="text-[10px] font-bold uppercase text-muted-foreground block mb-0.5">GA at Scan (Wks)</Label>
                  <Input id="w" type="number" min={4} max={40} value={gaWeeks} onChange={(e) => setGaWeeks(parseInt(e.target.value) || 0)} className="h-9 font-extrabold text-sm rounded-lg border-2" />
                </div>
                <div>
                  <Label htmlFor="d" className="text-[10px] font-bold uppercase text-muted-foreground block mb-0.5">GA at Scan (Days)</Label>
                  <Input id="d" type="number" min={0} max={6} value={gaDays} onChange={(e) => setGaDays(parseInt(e.target.value) || 0)} className="h-9 font-extrabold text-sm rounded-lg border-2" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Instant Big Typography Result (6 Cols) */}
        <div className="md:col-span-6 text-center md:pl-2">
          {result ? (
            <div className="bg-gradient-to-br from-primary/15 via-primary/5 to-background p-4 rounded-xl border-2 border-primary/40 flex flex-col items-center justify-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-0.5 rounded-full mb-1">
                {result.trimester}
              </span>
              <div className="text-4xl sm:text-5xl font-black text-foreground font-heading tracking-tight leading-none my-1">
                {ObstetricsDatingEngine.formatGA(result.currentGAWeeks, result.currentGADays)}
              </div>
              <div className="text-xs font-bold text-muted-foreground mt-1 flex items-center justify-center gap-3 w-full border-t pt-2">
                <span>EDD: <strong className="text-foreground">{ObstetricsDatingEngine.formatDate(result.edd, "MMM dd, yyyy")}</strong></span>
                <span>•</span>
                <span>Remaining: <strong className="text-foreground">{Math.max(0, result.daysRemaining)}d</strong></span>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-muted-foreground font-semibold border-2 border-dashed rounded-xl">
              Enter valid parameters to view instant GA.
            </div>
          )}
        </div>
      </div>

      {/* ALL EDUCATIONAL DETAILS & DISCLAIMERS COLLAPSED AT THE BOTTOM TO PREVENT ANDROID SCROLLING */}
      <EducationalSection
        why="During fast-paced obstetric ward rounds, clinicians need to instantly verify a patient's exact gestational age (in weeks and days) on the current day or for future scheduled procedures such as elective cesarean deliveries or induction of labor."
        formula="GA_days_today = (TargetDate - LMP_equivalent_date); GA_weeks = floor(GA_days_today / 7); GA_days = GA_days_today % 7"
        clinicalImportance="Elective non-medically indicated deliveries prior to 39w0d are associated with increased neonatal respiratory distress and ICU admissions. Accurately computing GA at the planned delivery date prevents inadvertent iatrogenic prematurity."
        examPearls={[
          "Always verify whether a date is stated as completed weeks plus days (e.g., 36w4d means 36 completed weeks and 4 days into the 37th week).",
          "If calculating for a future scheduled delivery date, ensure the target date does not cross beyond 41w0d without documented clinical fetal surveillance."
        ]}
        references={[
          "ACOG Committee Opinion No. 700: Methods for Estimating Due Date (2017)",
          "ACOG Committee Opinion No. 561: Nonmedically Indicated Early-Term Deliveries (2013)"
        ]}
      />

      <MedicalDisclaimer />
    </div>
  );
}
