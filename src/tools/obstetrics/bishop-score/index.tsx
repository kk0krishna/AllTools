"use client";

import { useState } from "react";
import { ToolComponentProps } from "@/tools/registry";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Baby, ArrowRight } from "lucide-react";

const DILATION_OPTS = [
  { val: "0", label: "< 4 cm", score: 0 },
  { val: "1", label: "4 cm", score: 1 },
  { val: "2", label: "5 cm", score: 2 },
  { val: "3", label: "≥ 6 cm", score: 3 },
];

const EFFACEMENT_OPTS = [
  { val: "0", label: "< 40%", score: 0 },
  { val: "1", label: "40 - 60%", score: 1 },
  { val: "2", label: "60 - 80%", score: 2 },
  { val: "3", label: "≥ 80%", score: 3 },
];

const STATION_OPTS = [
  { val: "0", label: "-3", score: 0 },
  { val: "1", label: "-2", score: 1 },
  { val: "2", label: "-1 or 0", score: 2 },
  { val: "3", label: "+1 or +2", score: 3 },
];

const CONSISTENCY_OPTS = [
  { val: "0", label: "Firm", score: 0 },
  { val: "1", label: "Medium", score: 1 },
  { val: "2", label: "Soft", score: 2 },
];

const POSITION_OPTS = [
  { val: "0", label: "Posterior", score: 0 },
  { val: "1", label: "Mid", score: 1 },
  { val: "2", label: "Anterior", score: 2 },
];

export function BishopScoreCalculator({ metadata }: ToolComponentProps) {
  const [dilation, setDilation] = useState<number | null>(null);
  const [effacement, setEffacement] = useState<number | null>(null);
  const [station, setStation] = useState<number | null>(null);
  const [consistency, setConsistency] = useState<number | null>(null);
  const [position, setPosition] = useState<number | null>(null);

  const isComplete = dilation !== null && effacement !== null && station !== null && consistency !== null && position !== null;
  const total = (dilation || 0) + (effacement || 0) + (station || 0) + (consistency || 0) + (position || 0);

  let interp = "";
  let action = "";
  let color = "";

  if (isComplete) {
    if (total >= 8) {
      interp = "Favorable Cervix";
      action = "High probability of successful induction. Cervical ripening generally not required.";
      color = "text-emerald-600 bg-emerald-500/10 border-emerald-500/20";
    } else if (total >= 6) {
      interp = "Moderately Favorable";
      action = "Moderate probability. Consider cervical ripening agents (e.g., misoprostol, Foley balloon) prior to oxytocin.";
      color = "text-yellow-600 bg-yellow-500/10 border-yellow-500/20";
    } else {
      interp = "Unfavorable Cervix";
      action = "Low probability of successful induction with oxytocin alone. Cervical ripening strongly recommended.";
      color = "text-rose-600 bg-rose-600/10 border-rose-600/20";
    }
  }

  const renderSection = (
    title: string, 
    options: {val: string, label: string, score: number}[], 
    currentValue: number | null, 
    setValue: (val: number) => void
  ) => (
    <div className="space-y-3">
      <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.val}
            onClick={() => setValue(opt.score)}
            className={`flex-1 min-w-[80px] p-2 rounded-lg border transition-all text-sm font-medium ${
              currentValue === opt.score
                ? "border-primary bg-primary/10 text-primary"
                : "border-border/50 hover:bg-muted/50 text-muted-foreground hover:text-foreground"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="grid md:grid-cols-12 gap-8 items-start">
      <Card className="md:col-span-7 h-fit border-primary/10 shadow-md">
        <CardHeader className="pb-4 border-b bg-muted/20">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Baby className="w-5 h-5 text-primary" />
            Cervical Examination
          </CardTitle>
          <CardDescription>Select the findings from the digital exam.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {renderSection("Dilation", DILATION_OPTS, dilation, setDilation)}
          <div className="border-t pt-2" />
          {renderSection("Effacement", EFFACEMENT_OPTS, effacement, setEffacement)}
          <div className="border-t pt-2" />
          {renderSection("Fetal Station", STATION_OPTS, station, setStation)}
          <div className="border-t pt-2" />
          {renderSection("Cervical Consistency", CONSISTENCY_OPTS, consistency, setConsistency)}
          <div className="border-t pt-2" />
          {renderSection("Cervical Position", POSITION_OPTS, position, setPosition)}
        </CardContent>
      </Card>

      <div className="md:col-span-5 h-full">
        {isComplete ? (
          <Card className="h-full border-primary/20 shadow-lg relative overflow-hidden bg-gradient-to-br from-background to-muted/20 sticky top-4">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Score & Recommendation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
              <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-card border shadow-sm relative z-10 text-center">
                <div className={`flex flex-col items-center justify-center shrink-0 w-32 h-32 rounded-full border-4 ${color.replace('text-', 'border-').split(' ')[0]} shadow-inner`}>
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Score</span>
                  <span className="text-5xl font-bold font-heading tracking-tighter">{total}<span className="text-2xl text-muted-foreground">/13</span></span>
                </div>
                
                <div className="pt-2">
                  <h3 className={`text-xl font-bold mb-2 ${color.split(' ')[0]}`}>
                    {interp}
                  </h3>
                  <p className="text-muted-foreground text-sm font-medium">
                    {action}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="h-full flex items-center justify-center bg-muted/30 border-dashed min-h-[400px]">
            <CardContent className="flex flex-col items-center text-center text-muted-foreground space-y-3 p-6">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-2 shadow-sm">
                <Activity className="w-8 h-8 opacity-50" />
              </div>
              <p className="max-w-xs">Complete all 5 cervical parameters to calculate the Bishop Score.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
