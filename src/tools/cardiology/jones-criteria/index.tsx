"use client";

import { useState } from "react";
import { ToolComponentProps } from "@/tools/registry";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";
import { Checkbox as UiCheckbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";

export function JonesCriteria({ metadata }: ToolComponentProps) {
  const [hasStrep, setHasStrep] = useState(false);
  
  const [majorCarditis, setMajorCarditis] = useState(false);
  const [majorPolyarthritis, setMajorPolyarthritis] = useState(false);
  const [majorChorea, setMajorChorea] = useState(false);
  const [majorErythema, setMajorErythema] = useState(false);
  const [majorNodules, setMajorNodules] = useState(false);

  const [minorFever, setMinorFever] = useState(false);
  const [minorArthralgia, setMinorArthralgia] = useState(false);
  const [minorReactants, setMinorReactants] = useState(false);
  const [minorPrInterval, setMinorPrInterval] = useState(false);

  const majorCount = [majorCarditis, majorPolyarthritis, majorChorea, majorErythema, majorNodules].filter(Boolean).length;
  // Note: if polyarthritis is present, arthralgia cannot be counted as a minor criterion.
  const effectiveMinorArthralgia = majorPolyarthritis ? false : minorArthralgia;
  // Note: if carditis is present, prolonged PR cannot be counted.
  const effectiveMinorPrInterval = majorCarditis ? false : minorPrInterval;
  
  const minorCount = [minorFever, effectiveMinorArthralgia, minorReactants, effectiveMinorPrInterval].filter(Boolean).length;

  const isDiagnosed = hasStrep && (majorCount >= 2 || (majorCount === 1 && minorCount >= 2));

  return (
    <div className="grid md:grid-cols-12 gap-8 items-start">
      <Card className="md:col-span-7 h-fit border-primary/10 shadow-md">
        <CardHeader className="pb-4 border-b bg-muted/20">
          <CardTitle className="flex items-center gap-2 text-xl">
            <ShieldAlert className="w-5 h-5 text-primary" />
            Diagnostic Criteria
          </CardTitle>
          <CardDescription>Select all applicable symptoms and lab findings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="flex items-center justify-between p-4 rounded-xl border-2 border-primary/30 bg-primary/5">
            <div className="space-y-0.5">
              <label className="font-semibold text-foreground">Evidence of preceding Strep infection?</label>
              <div className="text-sm text-muted-foreground">e.g., positive throat culture, rapid Ag test, elevated ASO titer.</div>
            </div>
            <Switch checked={hasStrep} onCheckedChange={setHasStrep} />
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Major Criteria</h3>
            <div className="grid gap-2">
              {[
                { state: majorCarditis, set: setMajorCarditis, label: "Carditis (clinical or subclinical)" },
                { state: majorPolyarthritis, set: setMajorPolyarthritis, label: "Polyarthritis" },
                { state: majorChorea, set: setMajorChorea, label: "Sydenham Chorea" },
                { state: majorErythema, set: setMajorErythema, label: "Erythema Marginatum" },
                { state: majorNodules, set: setMajorNodules, label: "Subcutaneous Nodules" },
              ].map((item, idx) => (
                <label key={idx} className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:bg-muted/50 cursor-pointer">
                  <UiCheckbox checked={item.state} onCheckedChange={(c) => item.set(c as boolean)} />
                  <span className="text-sm font-medium">{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Minor Criteria</h3>
            <div className="grid gap-2">
              <label className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:bg-muted/50 cursor-pointer">
                <UiCheckbox checked={minorFever} onCheckedChange={(c) => setMinorFever(c as boolean)} />
                <span className="text-sm font-medium">Fever (≥ 38.5°C)</span>
              </label>
              <label className={`flex items-center gap-3 p-3 rounded-lg border border-border/50 cursor-pointer ${majorPolyarthritis ? 'opacity-50' : 'hover:bg-muted/50'}`}>
                <UiCheckbox checked={minorArthralgia} disabled={majorPolyarthritis} onCheckedChange={(c) => setMinorArthralgia(c as boolean)} />
                <span className="text-sm font-medium">Arthralgia {majorPolyarthritis && "(Excluded by Polyarthritis)"}</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:bg-muted/50 cursor-pointer">
                <UiCheckbox checked={minorReactants} onCheckedChange={(c) => setMinorReactants(c as boolean)} />
                <span className="text-sm font-medium">Elevated acute phase reactants (ESR ≥ 60 or CRP ≥ 3.0)</span>
              </label>
              <label className={`flex items-center gap-3 p-3 rounded-lg border border-border/50 cursor-pointer ${majorCarditis ? 'opacity-50' : 'hover:bg-muted/50'}`}>
                <UiCheckbox checked={minorPrInterval} disabled={majorCarditis} onCheckedChange={(c) => setMinorPrInterval(c as boolean)} />
                <span className="text-sm font-medium">Prolonged PR interval for age {majorCarditis && "(Excluded by Carditis)"}</span>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="md:col-span-5 h-full">
        <Card className="h-full border-primary/20 shadow-lg relative overflow-hidden bg-gradient-to-br from-background to-muted/20 sticky top-4">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Diagnosis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <div className={`flex flex-col items-center gap-4 p-6 rounded-2xl border shadow-sm relative z-10 text-center ${isDiagnosed ? "bg-rose-500/10 border-rose-500/20" : "bg-card border-border/50"}`}>
              <div className={`flex flex-col items-center justify-center shrink-0 w-24 h-24 rounded-full border-4 ${isDiagnosed ? "border-rose-500 bg-background text-rose-600" : "border-muted bg-muted text-muted-foreground"} shadow-inner`}>
                <ShieldAlert className="w-10 h-10" />
              </div>
              
              <div className="pt-2">
                <h3 className={`text-xl font-bold mb-2 ${isDiagnosed ? "text-rose-600" : "text-muted-foreground"}`}>
                  {isDiagnosed ? "Positive for ARF" : "Does Not Meet Criteria"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {isDiagnosed 
                    ? "Patient meets the Jones Criteria for Acute Rheumatic Fever."
                    : "Patient currently does not meet the diagnostic threshold."}
                </p>
              </div>
            </div>

            <div className="space-y-2 relative z-10">
              <div className="flex justify-between items-center p-3 bg-background rounded-lg border">
                <span className="text-sm font-medium text-muted-foreground">Preceding Strep</span>
                <span className={`font-bold ${hasStrep ? "text-emerald-500" : "text-rose-500"}`}>{hasStrep ? "Yes" : "No"}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-background rounded-lg border">
                <span className="text-sm font-medium text-muted-foreground">Major Criteria</span>
                <span className="font-bold text-foreground">{majorCount}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-background rounded-lg border">
                <span className="text-sm font-medium text-muted-foreground">Minor Criteria</span>
                <span className="font-bold text-foreground">{minorCount}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
