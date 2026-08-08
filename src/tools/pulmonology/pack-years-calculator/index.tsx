"use client";

import { useState, useEffect } from "react";
import { ToolComponentProps } from "@/tools/registry";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Activity, Info, Flame, Calendar } from "lucide-react";

export function PackYearsCalculator({ metadata }: ToolComponentProps) {
  const [cigsPerDay, setCigsPerDay] = useState("20");
  const [yearsSmoked, setYearsSmoked] = useState("10");
  const [packYears, setPackYears] = useState<number | null>(null);

  useEffect(() => {
    const cigs = parseFloat(cigsPerDay);
    const years = parseFloat(yearsSmoked);

    if (!isNaN(cigs) && !isNaN(years) && cigs >= 0 && years >= 0) {
      setPackYears((cigs / 20) * years);
    } else {
      setPackYears(null);
    }
  }, [cigsPerDay, yearsSmoked]);

  let riskCategory = "";
  let riskColor = "";
  if (packYears !== null) {
    if (packYears === 0) {
      riskCategory = "Non-smoker or Negligible";
      riskColor = "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
    } else if (packYears < 10) {
      riskCategory = "Mild History";
      riskColor = "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
    } else if (packYears < 20) {
      riskCategory = "Moderate History";
      riskColor = "text-orange-500 bg-orange-500/10 border-orange-500/20";
    } else {
      riskCategory = "Heavy History (High Risk)";
      riskColor = "text-rose-600 bg-rose-600/10 border-rose-600/20";
    }
  }

  return (
    <div className="grid md:grid-cols-12 gap-8 items-start">
      <Card className="md:col-span-5 h-fit border-primary/10 shadow-md">
        <CardHeader className="pb-4 border-b bg-muted/20">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Activity className="w-5 h-5 text-primary" />
            Smoking History
          </CardTitle>
          <CardDescription>Enter daily usage and duration.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <Label className="flex items-center gap-2 text-base">
                <Flame className="w-4 h-4 text-primary" />
                Cigarettes Per Day
              </Label>
              <Input 
                type="number" 
                value={cigsPerDay} 
                onChange={(e) => setCigsPerDay(e.target.value)} 
                className="w-24 h-8 text-right font-semibold"
                min="0"
              />
            </div>
            <input 
              type="range" 
              min="0" max="100" 
              value={cigsPerDay}
              onChange={(e) => setCigsPerDay(e.target.value)}
              className="w-full accent-primary"
            />
          </div>

          <div className="space-y-4 border-t pt-6">
            <div className="flex justify-between items-end">
              <Label className="flex items-center gap-2 text-base">
                <Calendar className="w-4 h-4 text-primary" />
                Years Smoked
              </Label>
              <Input 
                type="number" 
                value={yearsSmoked} 
                onChange={(e) => setYearsSmoked(e.target.value)} 
                className="w-24 h-8 text-right font-semibold"
                min="0"
              />
            </div>
            <input 
              type="range" 
              min="0" max="80" 
              value={yearsSmoked}
              onChange={(e) => setYearsSmoked(e.target.value)}
              className="w-full accent-primary"
            />
          </div>
        </CardContent>
      </Card>

      <div className="md:col-span-7 h-full">
        {packYears !== null ? (
          <Card className="h-full border-primary/20 shadow-lg relative overflow-hidden bg-gradient-to-br from-background to-muted/20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Your Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 pt-2">
              <div className="flex flex-col md:flex-row items-center gap-6 p-6 rounded-2xl bg-card border shadow-sm relative z-10">
                <div className={`flex flex-col items-center justify-center shrink-0 w-36 h-36 rounded-full border-4 ${riskColor.replace('text-', 'border-').split(' ')[0]} bg-background shadow-inner`}>
                  <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-1">Pack Years</span>
                  <span className="text-4xl font-bold font-heading tracking-tighter">{packYears.toFixed(1)}</span>
                </div>
                <div className="flex flex-col gap-2 text-center md:text-left w-full">
                  <h3 className={`text-2xl font-bold ${riskColor.split(' ')[0]}`}>
                    {riskCategory}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    A history of <strong className="text-foreground font-medium">{packYears.toFixed(1)} pack years</strong> is considered a {riskCategory.toLowerCase()} for tobacco-related pathologies.
                  </p>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-xl flex gap-3 text-sm relative z-10">
                <Info className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Clinical Insight:</strong> Lung cancer screening via low-dose CT is currently recommended by the USPSTF for adults aged 50 to 80 years who have a <strong>20 pack-year smoking history</strong> and currently smoke or have quit within the past 15 years.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="h-full flex items-center justify-center bg-muted/30 border-dashed min-h-[400px]">
            <CardContent className="flex flex-col items-center text-center text-muted-foreground space-y-3 p-6">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-2 shadow-sm">
                <Activity className="w-8 h-8 opacity-50" />
              </div>
              <p className="max-w-xs">Enter daily cigarette use and years smoked to calculate pack years.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
