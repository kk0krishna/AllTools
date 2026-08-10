"use client";

import { useState } from "react";
import { ToolComponentProps } from "@/tools/registry";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CheckCircle2, HeartPulse } from "lucide-react";

const CLASSES = [
  { 
    cls: 1, 
    label: "Class I", 
    desc: "No limitation of physical activity. Ordinary physical activity does not cause undue fatigue, palpitation, dyspnea (shortness of breath)." 
  },
  { 
    cls: 2, 
    label: "Class II", 
    desc: "Slight limitation of physical activity. Comfortable at rest. Ordinary physical activity results in fatigue, palpitation, dyspnea." 
  },
  { 
    cls: 3, 
    label: "Class III", 
    desc: "Marked limitation of physical activity. Comfortable at rest. Less than ordinary activity causes fatigue, palpitation, or dyspnea." 
  },
  { 
    cls: 4, 
    label: "Class IV", 
    desc: "Unable to carry on any physical activity without discomfort. Symptoms of heart failure at rest. If any physical activity is undertaken, discomfort increases." 
  },
];

export function NyhaHeartFailure({ metadata }: ToolComponentProps) {
  const [selectedCls, setSelectedCls] = useState<number | null>(null);

  return (
    <div className="grid md:grid-cols-12 gap-8 items-start">
      <Card className="md:col-span-7 h-fit border-primary/10 shadow-md">
        <CardHeader className="pb-4 border-b bg-muted/20">
          <CardTitle className="flex items-center gap-2 text-xl">
            <HeartPulse className="w-5 h-5 text-primary" />
            Symptom Assessment
          </CardTitle>
          <CardDescription>Select the statement that best describes the patient&apos;s symptoms.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          {CLASSES.map((item) => (
            <button
              key={item.cls}
              onClick={() => setSelectedCls(item.cls)}
              className={`w-full flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                selectedCls === item.cls
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border/50 bg-background hover:bg-muted/50 hover:border-primary/30"
              }`}
            >
              <div className={`mt-0.5 shrink-0 ${selectedCls === item.cls ? "text-primary" : "text-muted-foreground"}`}>
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className={`font-bold mb-1 ${selectedCls === item.cls ? "text-primary" : "text-foreground"}`}>
                  {item.label}
                </div>
                <div className="text-sm text-muted-foreground leading-relaxed">
                  {item.desc}
                </div>
              </div>
            </button>
          ))}
        </CardContent>
      </Card>

      <div className="md:col-span-5 h-full">
        {selectedCls !== null ? (
          <Card className="h-full border-primary/20 shadow-lg relative overflow-hidden bg-gradient-to-br from-background to-muted/20 sticky top-4">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Classification Result</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
              <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-card border shadow-sm relative z-10 text-center">
                <div className={`flex flex-col items-center justify-center shrink-0 w-32 h-32 rounded-full border-4 ${selectedCls >= 3 ? "border-orange-500 bg-orange-500/10 text-orange-600" : "border-emerald-500 bg-emerald-500/10 text-emerald-600"} shadow-inner`}>
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">NYHA</span>
                  <span className="text-4xl font-bold font-heading tracking-tighter">Class {['I','II','III','IV'][selectedCls-1]}</span>
                </div>
                
                <div className="pt-2">
                  <h3 className={`text-xl font-bold mb-2 ${selectedCls >= 3 ? "text-orange-600" : "text-emerald-600"}`}>
                    {selectedCls === 1 ? "Mild" : selectedCls === 2 ? "Mild" : selectedCls === 3 ? "Moderate" : "Severe"} HF
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {selectedCls >= 3 
                      ? "High symptom burden. Consider advanced therapies and closer monitoring."
                      : "Lower symptom burden. Continue guideline-directed medical therapy (GDMT)."}
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
              <p className="max-w-xs">Select a classification to view clinical recommendations.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
