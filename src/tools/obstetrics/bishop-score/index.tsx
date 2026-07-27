"use client";
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToolComponentProps } from "@/tools/registry";

// Bishop Score scoring table
const DILATION_SCORE = (cm: number) => cm >= 6 ? 3 : cm >= 5 ? 2 : cm >= 4 ? 1 : 0;
const EFFACEMENT_SCORE = (pct: number) => pct >= 80 ? 3 : pct >= 60 ? 2 : pct >= 40 ? 1 : 0;
const STATION_SCORE = (s: number) => s >= 1 ? 3 : s === 0 ? 2 : s === -1 ? 1 : 0;
const CONSISTENCY_SCORE = (c: string) => c === "soft" ? 2 : c === "medium" ? 1 : 0;
const POSITION_SCORE = (p: string) => p === "anterior" ? 2 : p === "mid" ? 1 : 0;

function getInterpretation(score: number): { label: string; color: string; action: string } {
  if (score >= 8) return { label: "Favorable", color: "text-emerald-600", action: "Likely successful induction. Proceed with IOL per protocol." };
  if (score >= 6) return { label: "Moderately Favorable", color: "text-amber-600", action: "Consider cervical ripening agents (PGE2/misoprostol) before oxytocin." };
  return { label: "Unfavorable", color: "text-red-600", action: "Cervical ripening strongly recommended before induction." };
}

export function BishopScoreCalculator({ metadata }: ToolComponentProps) {
  const [dilation, setDilation] = useState<string>("");
  const [effacement, setEffacement] = useState<string>("");
  const [station, setStation] = useState<string>("-3");
  const [consistency, setConsistency] = useState("firm");
  const [position, setPosition] = useState("posterior");
  const [result, setResult] = useState<{ score: number; interp: ReturnType<typeof getInterpretation> } | null>(null);

  const calculate = () => {
    const d = parseFloat(dilation);
    const e = parseFloat(effacement);
    const s = parseFloat(station);
    if (isNaN(d) || isNaN(e) || isNaN(s)) return;
    const score =
      DILATION_SCORE(d) +
      EFFACEMENT_SCORE(e) +
      STATION_SCORE(s) +
      CONSISTENCY_SCORE(consistency) +
      POSITION_SCORE(position);
    setResult({ score, interp: getInterpretation(score) });
  };

  const reset = () => {
    setDilation("");
    setEffacement("");
    setStation("-3");
    setConsistency("firm");
    setPosition("posterior");
    setResult(null);
  };

  return (
    <div className="max-w-md mx-auto space-y-3 p-4">
      {/* Compact Header */}
      <div className="bg-purple-600 text-white px-4 py-2 rounded-xl flex items-center justify-between">
        <span className="font-black text-sm">Bishop Score Calculator</span>
        <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">ACOG</span>
      </div>

      {/* Inputs grid – 2 col, compact */}
      <Card className="p-3 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <label className="flex flex-col text-xs font-semibold">
            Dilation (cm, 0–10)
            <Input
              type="number" min={0} max={10} step={0.5}
              placeholder="e.g. 2"
              value={dilation}
              onChange={(e) => setDilation(e.target.value)}
              className="h-9 mt-1"
            />
          </label>
          <label className="flex flex-col text-xs font-semibold">
            Effacement (%, 0–100)
            <Input
              type="number" min={0} max={100}
              placeholder="e.g. 50"
              value={effacement}
              onChange={(e) => setEffacement(e.target.value)}
              className="h-9 mt-1"
            />
          </label>
        </div>

        <label className="flex flex-col text-xs font-semibold">
          Station (−3 to +2)
          <select
            value={station}
            onChange={(e) => setStation(e.target.value)}
            className="mt-1 border rounded-md h-9 px-2 text-sm bg-background"
          >
            {[-3, -2, -1, 0, 1, 2].map((s) => (
              <option key={s} value={s}>{s >= 0 ? `+${s}` : s}</option>
            ))}
          </select>
        </label>

        <div className="grid grid-cols-2 gap-2">
          <label className="flex flex-col text-xs font-semibold">
            Consistency
            <select
              value={consistency}
              onChange={(e) => setConsistency(e.target.value)}
              className="mt-1 border rounded-md h-9 px-2 text-sm bg-background"
            >
              <option value="firm">Firm</option>
              <option value="medium">Medium</option>
              <option value="soft">Soft</option>
            </select>
          </label>
          <label className="flex flex-col text-xs font-semibold">
            Position
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="mt-1 border rounded-md h-9 px-2 text-sm bg-background"
            >
              <option value="posterior">Posterior</option>
              <option value="mid">Mid</option>
              <option value="anterior">Anterior</option>
            </select>
          </label>
        </div>

        <Button onClick={calculate} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold h-10">
          Calculate Score
        </Button>
      </Card>

      {/* Result */}
      {result && (
        <Card className="p-4 border-2 border-purple-500/50 bg-gradient-to-br from-card to-purple-500/5">
          <div className="text-center space-y-1 mb-3">
            <div className="text-4xl font-black text-purple-600">{result.score}<span className="text-lg font-bold text-muted-foreground">/13</span></div>
            <div className={`font-extrabold text-base ${result.interp.color}`}>{result.interp.label}</div>
          </div>
          <p className="text-xs text-muted-foreground border-t pt-2">{result.interp.action}</p>
          <Button onClick={reset} variant="outline" size="sm" className="w-full mt-3 font-bold">
            Next Patient
          </Button>
        </Card>
      )}

      {/* Scoring reference – collapsed */}
      <details className="text-xs border rounded-xl overflow-hidden">
        <summary className="px-3 py-2 bg-muted/30 cursor-pointer font-semibold">Scoring Reference (tap)</summary>
        <div className="p-3 space-y-1">
          <table className="w-full text-[11px] border-collapse">
            <thead>
              <tr className="bg-muted/40">
                <th className="text-left p-1">Parameter</th>
                <th className="p-1">0</th>
                <th className="p-1">1</th>
                <th className="p-1">2</th>
                <th className="p-1">3</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="p-1">Dilation</td><td className="p-1 text-center">&lt;4</td><td className="p-1 text-center">4</td><td className="p-1 text-center">5</td><td className="p-1 text-center">≥6</td></tr>
              <tr className="bg-muted/20"><td className="p-1">Effacement</td><td className="p-1 text-center">&lt;40%</td><td className="p-1 text-center">40-60</td><td className="p-1 text-center">60-80</td><td className="p-1 text-center">≥80%</td></tr>
              <tr><td className="p-1">Station</td><td className="p-1 text-center">−3</td><td className="p-1 text-center">−2</td><td className="p-1 text-center">−1/0</td><td className="p-1 text-center">+1/+2</td></tr>
              <tr className="bg-muted/20"><td className="p-1">Consistency</td><td className="p-1 text-center">Firm</td><td className="p-1 text-center">Med</td><td className="p-1 text-center">Soft</td><td className="p-1 text-center">—</td></tr>
              <tr><td className="p-1">Position</td><td className="p-1 text-center">Post</td><td className="p-1 text-center">Mid</td><td className="p-1 text-center">Ant</td><td className="p-1 text-center">—</td></tr>
            </tbody>
          </table>
        </div>
      </details>

      <p className="text-[10px] text-muted-foreground text-center">For clinical reference only. Always follow institutional protocols.</p>
    </div>
  );
}
