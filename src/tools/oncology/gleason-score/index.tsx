"use client";

import { useState } from "react";
import { ToolComponentProps } from "@/tools/registry";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Dna } from "lucide-react";

export function GleasonScore({ metadata }: ToolComponentProps) {
  const [primary, setPrimary] = useState<number | null>(null);
  const [secondary, setSecondary] = useState<number | null>(null);

  const total = (primary || 0) + (secondary || 0);
  const isComplete = primary !== null && secondary !== null;

  let gradeGroup = "";
  let riskColor = "";

  if (isComplete) {
    if (total <= 6) {
      gradeGroup = "Grade Group 1";
      riskColor = "text-emerald-600 bg-emerald-500/10 border-emerald-500/20";
    } else if (total === 7) {
      if (primary === 3) {
        gradeGroup = "Grade Group 2";
        riskColor = "text-yellow-600 bg-yellow-500/10 border-yellow-500/20";
      } else {
        gradeGroup = "Grade Group 3";
        riskColor = "text-orange-500 bg-orange-500/10 border-orange-500/20";
      }
    } else if (total === 8) {
      gradeGroup = "Grade Group 4";
      riskColor = "text-orange-600 bg-orange-600/10 border-orange-600/20";
    } else if (total >= 9) {
      gradeGroup = "Grade Group 5";
      riskColor = "text-rose-600 bg-rose-600/10 border-rose-600/20";
    }
  }

  const grades = [3, 4, 5]; // 1 and 2 are no longer used on biopsy

  return (
    <div className="grid md:grid-cols-12 gap-8 items-start">
      <Card className="md:col-span-7 h-fit border-primary/10 shadow-md">
        <CardHeader className="pb-4 border-b bg-muted/20">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Dna className="w-5 h-5 text-primary" />
            Pathology Report
          </CardTitle>
          <CardDescription>Select the predominant and secondary histological patterns.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 pt-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Primary Pattern (Most Common)</h3>
            <div className="flex gap-4">
              {grades.map(g => (
                <button
                  key={g}
                  onClick={() => setPrimary(g)}
                  className={`flex-1 py-4 text-xl font-bold rounded-xl border-2 transition-all ${
                    primary === g 
                      ? "border-primary bg-primary/10 text-primary" 
                      : "border-border/50 text-muted-foreground hover:border-primary/30 hover:bg-muted"
                  }`}
                >
                  Grade {g}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">Grades 1 and 2 are typically not assigned on modern needle biopsies.</p>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Secondary Pattern (Second Most Common)</h3>
            <div className="flex gap-4">
              {grades.map(g => (
                <button
                  key={g}
                  onClick={() => setSecondary(g)}
                  className={`flex-1 py-4 text-xl font-bold rounded-xl border-2 transition-all ${
                    secondary === g 
                      ? "border-primary bg-primary/10 text-primary" 
                      : "border-border/50 text-muted-foreground hover:border-primary/30 hover:bg-muted"
                  }`}
                >
                  Grade {g}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="md:col-span-5 h-full">
        {isComplete ? (
          <Card className="h-full border-primary/20 shadow-lg relative overflow-hidden bg-gradient-to-br from-background to-muted/20 sticky top-4">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Prognostic Group</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
              <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-card border shadow-sm relative z-10 text-center">
                <div className={`flex flex-col items-center justify-center shrink-0 w-32 h-32 rounded-full border-4 ${riskColor.replace('text-', 'border-').split(' ')[0]} shadow-inner`}>
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Score</span>
                  <span className="text-5xl font-bold font-heading tracking-tighter">{total}</span>
                </div>
                
                <div className="pt-2">
                  <h3 className={`text-2xl font-bold mb-1 ${riskColor.split(' ')[0]}`}>
                    {gradeGroup}
                  </h3>
                  <p className="text-muted-foreground text-sm font-medium">
                    (Gleason {primary} + {secondary})
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
              <p className="max-w-xs">Select Primary and Secondary grades to calculate the Gleason Score and ISUP Grade Group.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
