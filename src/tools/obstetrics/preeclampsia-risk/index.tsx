"use client";
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToolComponentProps } from "@/tools/registry";

type RiskLevel = "Low" | "Moderate" | "High";

function assessRisk(factors: {
  age: number;
  bmi: number;
  nulliparous: boolean;
  priorPE: boolean;
  chronicHypertension: boolean;
  diabetes: boolean;
  multipleGestation: boolean;
  autoimmune: boolean;
  ckd: boolean;
}): { level: RiskLevel; color: string; aspirin: string; notes: string[] } {
  // ACOG Practice Bulletin 222 / USPSTF criteria
  const highRiskFactors = [
    factors.priorPE,
    factors.multipleGestation,
    factors.chronicHypertension,
    factors.diabetes,
    factors.autoimmune,
    factors.ckd,
  ].filter(Boolean).length;

  const moderateRiskFactors = [
    factors.nulliparous,
    factors.age >= 35,
    factors.bmi >= 30,
  ].filter(Boolean).length;

  let level: RiskLevel = "Low";
  if (highRiskFactors >= 1) level = "High";
  else if (moderateRiskFactors >= 2) level = "Moderate";

  const aspirinMsg =
    level === "High"
      ? "Low-dose aspirin 81 mg/day recommended from 12–28 weeks (ideally <16w) to delivery."
      : level === "Moderate"
      ? "Consider low-dose aspirin 81 mg/day if ≥2 moderate risk factors present."
      : "Routine care. No aspirin indicated based on current risk factors.";

  const notes: string[] = [];
  if (factors.priorPE) notes.push("Prior PE: single strongest independent risk factor.");
  if (factors.chronicHypertension) notes.push("Chronic hypertension: closely monitor BP & urine protein q4w.");
  if (factors.bmi >= 30) notes.push("Obesity: encourage weight management before next pregnancy.");
  if (factors.age >= 35) notes.push("Advanced maternal age: increased surveillance recommended.");

  const colors = { High: "text-red-600", Moderate: "text-amber-600", Low: "text-emerald-600" };
  return { level, color: colors[level], aspirin: aspirinMsg, notes };
}

const CheckRow = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) => (
  <label className="flex items-center gap-2 cursor-pointer select-none py-1">
    <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="w-4 h-4 accent-red-600" />
    <span className="text-xs">{label}</span>
  </label>
);

export function PreeclampsiaRiskCalculator({ metadata }: ToolComponentProps) {
  const [age, setAge] = useState("");
  const [bmi, setBmi] = useState("");
  const [nulliparous, setNulliparous] = useState(false);
  const [priorPE, setPriorPE] = useState(false);
  const [chronicHTN, setChronicHTN] = useState(false);
  const [diabetes, setDiabetes] = useState(false);
  const [twins, setTwins] = useState(false);
  const [autoimmune, setAutoimmune] = useState(false);
  const [ckd, setCkd] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof assessRisk> | null>(null);

  const calculate = () => {
    const a = parseFloat(age);
    const b = parseFloat(bmi);
    if (isNaN(a) || isNaN(b)) return;
    setResult(assessRisk({ age: a, bmi: b, nulliparous, priorPE, chronicHypertension: chronicHTN, diabetes, multipleGestation: twins, autoimmune, ckd }));
  };

  const reset = () => {
    setAge(""); setBmi(""); setNulliparous(false); setPriorPE(false);
    setChronicHTN(false); setDiabetes(false); setTwins(false);
    setAutoimmune(false); setCkd(false); setResult(null);
  };



  return (
    <div className="max-w-md mx-auto space-y-3 p-4">
      <div className="bg-red-600 text-white px-4 py-2 rounded-xl flex items-center justify-between">
        <span className="font-black text-sm">Preeclampsia Risk Assessment</span>
        <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">ACOG PB 222</span>
      </div>

      <Card className="p-3 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <label className="flex flex-col text-xs font-semibold">
            Maternal Age
            <Input type="number" min={15} max={60} placeholder="years" value={age} onChange={(e) => setAge(e.target.value)} className="h-9 mt-1" />
          </label>
          <label className="flex flex-col text-xs font-semibold">
            BMI (kg/m²)
            <Input type="number" min={10} max={80} placeholder="e.g. 28" value={bmi} onChange={(e) => setBmi(e.target.value)} className="h-9 mt-1" />
          </label>
        </div>

        <div className="border-t pt-2">
          <p className="text-[11px] font-bold uppercase text-red-600 mb-1">High-Risk Factors</p>
          <CheckRow label="Prior preeclampsia" checked={priorPE} onChange={setPriorPE} />
          <CheckRow label="Chronic hypertension" checked={chronicHTN} onChange={setChronicHTN} />
          <CheckRow label="Pre-existing diabetes (T1/T2)" checked={diabetes} onChange={setDiabetes} />
          <CheckRow label="Multiple gestation (twins+)" checked={twins} onChange={setTwins} />
          <CheckRow label="Autoimmune disease (SLE, APS)" checked={autoimmune} onChange={setAutoimmune} />
          <CheckRow label="Chronic kidney disease" checked={ckd} onChange={setCkd} />
        </div>

        <div className="border-t pt-2">
          <p className="text-[11px] font-bold uppercase text-amber-600 mb-1">Moderate-Risk Factors</p>
          <CheckRow label="Nulliparous (first pregnancy)" checked={nulliparous} onChange={setNulliparous} />
          {/* Age ≥35 and BMI ≥30 auto-scored from inputs above */}
          <p className="text-[10px] text-muted-foreground">Age ≥35 and BMI ≥30 scored from inputs above.</p>
        </div>

        <Button onClick={calculate} className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold h-10">
          Assess Risk
        </Button>
      </Card>

      {result && (
        <Card className="p-4 border-2 border-red-500/40 bg-gradient-to-br from-card to-red-500/5 space-y-3">
          <div className="text-center">
            <div className={`text-2xl font-black ${result.color}`}>{result.level} Risk</div>
          </div>
          <p className="text-xs bg-muted/30 rounded-lg p-2">{result.aspirin}</p>
          {result.notes.length > 0 && (
            <ul className="text-xs text-muted-foreground space-y-1 border-t pt-2">
              {result.notes.map((n, i) => <li key={i}>• {n}</li>)}
            </ul>
          )}
          <Button onClick={reset} variant="outline" size="sm" className="w-full font-bold">
            Next Patient
          </Button>
        </Card>
      )}

      <p className="text-[10px] text-muted-foreground text-center">ACOG Practice Bulletin 222 criteria. For clinical reference only.</p>
    </div>
  );
}
