"use client";

import { useState } from "react";
import { ToolComponentProps } from "@/tools/registry";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Syringe, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SCHEDULE = [
  { age: "Birth", vaccines: ["HepB (1st dose)"] },
  { age: "2 Months", vaccines: ["HepB (2nd dose)", "RV", "DTaP", "Hib", "PCV15", "IPV"] },
  { age: "4 Months", vaccines: ["RV", "DTaP", "Hib", "PCV15", "IPV"] },
  { age: "6 Months", vaccines: ["HepB (3rd dose, 6-18m)", "RV", "DTaP", "Hib", "PCV15", "IPV (6-18m)"] },
  { age: "12-15 Months", vaccines: ["Hib", "PCV15", "MMR", "Varicella", "HepA (2 doses, 6m apart)"] },
  { age: "15-18 Months", vaccines: ["DTaP"] },
  { age: "4-6 Years", vaccines: ["DTaP", "IPV", "MMR", "Varicella"] },
  { age: "11-12 Years", vaccines: ["Tdap", "HPV (2 or 3 doses)", "MenACWY"] },
  { age: "16 Years", vaccines: ["MenACWY (Booster)"] },
];

export function ImmunizationSchedule({ metadata }: ToolComponentProps) {
  const [ageMonths, setAgeMonths] = useState<number | "">("");

  const getDueVaccines = () => {
    if (ageMonths === "") return [];
    
    // Simple logic matching age in months to milestones
    const due = [];
    if (ageMonths === 0) due.push(SCHEDULE[0]);
    if (ageMonths >= 2 && ageMonths < 4) due.push(SCHEDULE[1]);
    if (ageMonths >= 4 && ageMonths < 6) due.push(SCHEDULE[2]);
    if (ageMonths >= 6 && ageMonths < 12) due.push(SCHEDULE[3]);
    if (ageMonths >= 12 && ageMonths < 15) due.push(SCHEDULE[4]);
    if (ageMonths >= 15 && ageMonths < 48) due.push(SCHEDULE[5]);
    if (ageMonths >= 48 && ageMonths < 132) due.push(SCHEDULE[6]); // 4-11 yrs
    if (ageMonths >= 132 && ageMonths < 192) due.push(SCHEDULE[7]); // 11-16 yrs
    if (ageMonths >= 192) due.push(SCHEDULE[8]); // 16+ yrs
    
    return due;
  };

  const dueVaccines = getDueVaccines();

  return (
    <div className="grid md:grid-cols-12 gap-8 items-start">
      <Card className="md:col-span-4 h-fit border-primary/10 shadow-md">
        <CardHeader className="pb-4 border-b bg-muted/20">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Calendar className="w-5 h-5 text-primary" />
            Patient Age
          </CardTitle>
          <CardDescription>Enter age in months to see upcoming doses.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-2">
            <Label>Age (Months)</Label>
            <Input 
              type="number" 
              placeholder="e.g. 14" 
              value={ageMonths} 
              onChange={e => setAgeMonths(e.target.value === "" ? "" : parseInt(e.target.value))} 
              min={0}
            />
            <p className="text-xs text-muted-foreground mt-2">
              For older children: <br/>4 years = 48 months<br/>11 years = 132 months<br/>16 years = 192 months
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="md:col-span-8 h-full">
        {ageMonths !== "" ? (
          <Card className="h-full border-primary/20 shadow-lg relative overflow-hidden bg-gradient-to-br from-background to-muted/20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Vaccines Due for this Age Bracket</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
              {dueVaccines.length > 0 ? (
                <div className="space-y-4 relative z-10">
                  {dueVaccines.map((milestone, idx) => (
                    <div key={idx} className="bg-card border rounded-xl overflow-hidden shadow-sm">
                      <div className="bg-emerald-500/10 px-4 py-2 border-b border-emerald-500/20">
                        <span className="font-bold text-emerald-700">{milestone.age} Milestone</span>
                      </div>
                      <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-3">
                        {milestone.vaccines.map((vax, vidx) => (
                          <div key={vidx} className="flex items-center gap-2 bg-muted/50 p-2 rounded-lg border text-sm font-medium">
                            <Syringe className="w-4 h-4 text-emerald-500" />
                            {vax}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-muted-foreground bg-muted/30 rounded-xl border-dashed border">
                  No standard milestone found for this exact month (or beyond 18 years). Check catch-up schedule.
                </div>
              )}
              
              <div className="text-xs text-muted-foreground p-4 bg-muted rounded-xl relative z-10">
                <strong>Disclaimer:</strong> This is a simplified educational reference of the standard CDC childhood schedule. It does not account for annual influenza (recommended for all &gt;6 months), COVID-19 vaccines, RSV monoclonal antibodies, or catch-up schedules.
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="h-full flex items-center justify-center bg-muted/30 border-dashed min-h-[400px]">
            <CardContent className="flex flex-col items-center text-center text-muted-foreground space-y-3 p-6">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-2 shadow-sm">
                <Activity className="w-8 h-8 opacity-50" />
              </div>
              <p className="max-w-xs">Enter patient age to view recommended vaccinations.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
