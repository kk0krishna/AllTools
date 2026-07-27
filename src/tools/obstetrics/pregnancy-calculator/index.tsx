"use client";

import React, { useState, useMemo } from "react";
import { formatISO, addDays } from "date-fns";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ObstetricsDatingEngine, DatingResult } from "../shared/dating-engine";
import { MedicalDisclaimer, EducationalSection } from "../shared/clinical-components";

type CalculationMethod = "lmp" | "ultrasound" | "ivf" | "conception";

export function PregnancyCalculator() {
  const [method, setMethod] = useState<CalculationMethod>("lmp");
  const [referenceDate, setReferenceDate] = useState<string>(() => formatISO(new Date(), { representation: "date" }));
  
  const [lmpDate, setLmpDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 70);
    return formatISO(d, { representation: "date" });
  });
  const [cycleLength, setCycleLength] = useState<number>(28);
  
  const [scanDate, setScanDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 14);
    return formatISO(d, { representation: "date" });
  });
  const [gaWeeks, setGaWeeks] = useState<number>(8);
  const [gaDays, setGaDays] = useState<number>(0);
  
  const [transferDate, setTransferDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 50);
    return formatISO(d, { representation: "date" });
  });
  const [embryoAge, setEmbryoAge] = useState<3 | 5 | 6>(5);
  
  const [conceptionDate, setConceptionDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 56);
    return formatISO(d, { representation: "date" });
  });

  const result = useMemo<DatingResult | null>(() => {
    try {
      if (method === "lmp" && lmpDate) {
        return ObstetricsDatingEngine.calculateByLMP(lmpDate, cycleLength, referenceDate);
      } else if (method === "ultrasound" && scanDate) {
        return ObstetricsDatingEngine.calculateByUltrasound(scanDate, gaWeeks, gaDays, referenceDate);
      } else if (method === "ivf" && transferDate) {
        return ObstetricsDatingEngine.calculateByIVF(transferDate, embryoAge, referenceDate);
      } else if (method === "conception" && conceptionDate) {
        return ObstetricsDatingEngine.calculateByConception(conceptionDate, referenceDate);
      }
    } catch (err) {
      console.error("Calculation error:", err);
    }
    return null;
  }, [method, lmpDate, cycleLength, scanDate, gaWeeks, gaDays, transferDate, embryoAge, conceptionDate, referenceDate]);

  const handleNextPatient = () => {
    const today = new Date();
    setReferenceDate(formatISO(today, { representation: "date" }));
    if (method === "lmp") {
      const d = new Date();
      d.setDate(d.getDate() - 70);
      setLmpDate(formatISO(d, { representation: "date" }));
      setCycleLength(28);
    } else if (method === "ultrasound") {
      const d = new Date();
      d.setDate(d.getDate() - 14);
      setScanDate(formatISO(d, { representation: "date" }));
      setGaWeeks(8);
      setGaDays(0);
    } else if (method === "ivf") {
      const d = new Date();
      d.setDate(d.getDate() - 50);
      setTransferDate(formatISO(d, { representation: "date" }));
      setEmbryoAge(5);
    } else {
      const d = new Date();
      d.setDate(d.getDate() - 56);
      setConceptionDate(formatISO(d, { representation: "date" }));
    }
  };

  const adjustDate = (days: number) => {
    if (method === "lmp" && lmpDate) {
      setLmpDate(formatISO(addDays(new Date(lmpDate), days), { representation: "date" }));
    } else if (method === "ultrasound" && scanDate) {
      setScanDate(formatISO(addDays(new Date(scanDate), days), { representation: "date" }));
    } else if (method === "ivf" && transferDate) {
      setTransferDate(formatISO(addDays(new Date(transferDate), days), { representation: "date" }));
    } else if (method === "conception" && conceptionDate) {
      setConceptionDate(formatISO(addDays(new Date(conceptionDate), days), { representation: "date" }));
    }
  };

  return (
    <div className="space-y-3 max-w-4xl mx-auto">
      {/* ULTRA-COMPACT MOBILE TOP BAR: ZERO WASTED VERTICAL SPACE */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-card p-2 rounded-xl border shadow-2xs">
        {/* Method Pill Tabs */}
        <div className="grid grid-cols-4 gap-1 bg-muted/60 p-1 rounded-lg w-full sm:w-auto">
          <button onClick={() => setMethod("lmp")} className={`px-2.5 py-1.5 rounded-md font-extrabold text-xs transition-all ${method === "lmp" ? "bg-primary text-primary-foreground shadow-xs" : "text-foreground hover:bg-card"}`}>LMP</button>
          <button onClick={() => setMethod("ultrasound")} className={`px-2.5 py-1.5 rounded-md font-extrabold text-xs transition-all ${method === "ultrasound" ? "bg-primary text-primary-foreground shadow-xs" : "text-foreground hover:bg-card"}`}>Ultrasound</button>
          <button onClick={() => setMethod("ivf")} className={`px-2.5 py-1.5 rounded-md font-extrabold text-xs transition-all ${method === "ivf" ? "bg-primary text-primary-foreground shadow-xs" : "text-foreground hover:bg-card"}`}>IVF / FET</button>
          <button onClick={() => setMethod("conception")} className={`px-2.5 py-1.5 rounded-md font-extrabold text-xs transition-all ${method === "conception" ? "bg-primary text-primary-foreground shadow-xs" : "text-foreground hover:bg-card"}`}>Conception</button>
        </div>

        {/* Eval Date & Next Patient Action */}
        <div className="flex items-center gap-2 ml-auto">
          <div className="flex items-center gap-1 bg-muted/40 px-2 py-1 rounded-md border text-xs">
            <span className="text-muted-foreground font-semibold">Eval:</span>
            <input type="date" value={referenceDate} onChange={(e) => setReferenceDate(e.target.value)} className="bg-transparent font-extrabold text-xs focus:outline-none w-28" />
          </div>
          <Button size="sm" onClick={handleNextPatient} className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold h-8 px-3 text-xs shadow-xs">
            <RefreshCw className="w-3 h-3 mr-1" /> Next Patient
          </Button>
        </div>
      </div>

      {/* COMPACT MAIN VIEWPORT (ZERO SCROLLING) */}
      <div className="grid md:grid-cols-12 gap-3 items-center bg-card p-4 rounded-2xl border shadow-sm">
        {/* Left: Input Box (6 Cols) */}
        <div className="md:col-span-6 space-y-2 border-b md:border-b-0 md:border-r pb-3 md:pb-0 md:pr-4">
          {method === "lmp" && (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="lmp" className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-0.5">First Day of LMP</Label>
                  <Input id="lmp" type="date" value={lmpDate} onChange={(e) => setLmpDate(e.target.value)} className="h-9 font-extrabold rounded-lg border-2" />
                </div>
                <div>
                  <Label htmlFor="cyc" className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-0.5">Cycle Length (d)</Label>
                  <Input id="cyc" type="number" min={20} max={45} value={cycleLength} onChange={(e) => setCycleLength(parseInt(e.target.value) || 28)} className="h-9 font-extrabold rounded-lg border-2" />
                </div>
              </div>
              <div className="flex items-center gap-1 pt-0.5">
                <span className="text-[10px] font-bold uppercase text-muted-foreground mr-1">Nudge:</span>
                <button onClick={() => adjustDate(-7)} className="bg-muted hover:bg-muted/80 px-2 py-1 rounded text-xs font-mono font-bold">-1wk</button>
                <button onClick={() => adjustDate(-1)} className="bg-muted hover:bg-muted/80 px-2 py-1 rounded text-xs font-mono font-bold">-1d</button>
                <button onClick={() => adjustDate(1)} className="bg-muted hover:bg-muted/80 px-2 py-1 rounded text-xs font-mono font-bold">+1d</button>
                <button onClick={() => adjustDate(7)} className="bg-muted hover:bg-muted/80 px-2 py-1 rounded text-xs font-mono font-bold">+1wk</button>
              </div>
            </div>
          )}

          {method === "ultrasound" && (
            <div className="space-y-2">
              <div>
                <Label htmlFor="scan" className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-0.5">Ultrasound Scan Date</Label>
                <Input id="scan" type="date" value={scanDate} onChange={(e) => setScanDate(e.target.value)} className="h-9 font-extrabold rounded-lg border-2" />
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

          {method === "ivf" && (
            <div className="space-y-2">
              <div>
                <Label htmlFor="transfer" className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-0.5">Embryo Transfer Date</Label>
                <Input id="transfer" type="date" value={transferDate} onChange={(e) => setTransferDate(e.target.value)} className="h-9 font-extrabold rounded-lg border-2" />
              </div>
              <div>
                <Label htmlFor="age" className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-0.5">Embryo Stage at Transfer</Label>
                <select id="age" value={embryoAge} onChange={(e) => setEmbryoAge(parseInt(e.target.value) as 3 | 5 | 6)} className="h-9 w-full font-extrabold bg-background text-foreground rounded-lg border-2 px-2 text-xs">
                  <option value={5}>Day 5 Blastocyst (Standard)</option>
                  <option value={3}>Day 3 Cleavage Embryo</option>
                  <option value={6}>Day 6 Blastocyst</option>
                </select>
              </div>
            </div>
          )}

          {method === "conception" && (
            <div>
              <Label htmlFor="conc" className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-0.5">Conception / Ovulation / IUI Date</Label>
              <Input id="conc" type="date" value={conceptionDate} onChange={(e) => setConceptionDate(e.target.value)} className="h-9 font-extrabold rounded-lg border-2" />
            </div>
          )}
        </div>

        {/* Right: Instant Big Typography Result (6 Cols) */}
        <div className="md:col-span-6 text-center md:pl-2">
          {result ? (
            <div className="bg-gradient-to-br from-teal-500/15 via-teal-500/5 to-background p-4 rounded-xl border-2 border-teal-500/40 flex flex-col items-center justify-center space-y-2">
              <div className="flex items-center justify-between w-full">
                <span className="text-[10px] font-black uppercase tracking-widest text-teal-600 dark:text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-full">
                  {result.trimester}
                </span>
                <span className="text-xs font-extrabold text-muted-foreground">
                  GA: <strong className="text-foreground">{ObstetricsDatingEngine.formatGA(result.currentGAWeeks, result.currentGADays)}</strong>
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-foreground font-heading tracking-tight leading-none my-1">
                EDD: {ObstetricsDatingEngine.formatDate(result.edd, "MMM dd, yyyy")}
              </div>
              {/* Progress Bar */}
              <div className="w-full bg-muted h-2 rounded-full overflow-hidden border mt-1">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full" style={{ width: `${Math.min(100, result.progressPercentage)}%` }} />
              </div>
              <div className="flex justify-between w-full text-[10px] font-bold text-muted-foreground">
                <span>LMP: {ObstetricsDatingEngine.formatDate(result.lmpEquivalent, "MMM dd")}</span>
                <span>Term (37w): {ObstetricsDatingEngine.formatDate(result.termDate, "MMM dd")}</span>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-muted-foreground font-semibold border-2 border-dashed rounded-xl">
              Enter valid parameters to view instant EDD & GA.
            </div>
          )}
        </div>
      </div>

      {/* ALL EDUCATIONAL DETAILS & DISCLAIMERS COLLAPSED AT THE BOTTOM */}
      <EducationalSection
        why="Accurate pregnancy dating establishes the baseline from which all subsequent obstetric decisions are derived, including timing of aneuploidy screening, chorionic villus sampling, amniocentesis, anatomy scans, and intervention thresholds for preterm labor."
        formula={`1. Naegele's Rule (LMP): EDD = LMP + 280 days + (CycleLength - 28)
2. Ultrasound Dating: LMP_equivalent = ScanDate - (Weeks * 7 + Days); EDD = LMP_equivalent + 280 days
3. IVF / FET: EDD = TransferDate + 261 days (Day 5 Blastocyst) or + 263 days (Day 3 Cleavage)`}
        clinicalImportance="Redating a pregnancy after the first trimester is strongly discouraged unless ultrasound discrepancy exceeds established ACOG thresholds (7 days in 1st trimester, 10-14 days in 2nd trimester). In IVF pregnancies, the transfer date is definitive and must NEVER be modified by subsequent ultrasound measurements."
        examPearls={[
          "When cycle length exceeds 28 days, add the difference (CycleLength - 28) to the standard 280-day Naegele calculation.",
          "Viability is traditionally defined at 24w0d (168 days from LMP equivalent), while early term delivery begins at 37w0d (259 days)."
        ]}
        references={[
          "ACOG Committee Opinion No. 700: Methods for Estimating Due Date (2017)",
          "RCOG Green-top Guideline No. 62: Antenatal Care (2019)",
          "FIGO Working Group on Good Clinical Practice in Maternal-Fetal Medicine (2020)"
        ]}
      />

      <MedicalDisclaimer />
    </div>
  );
}
