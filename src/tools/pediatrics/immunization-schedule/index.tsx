"use client";

import { useState, useMemo } from "react";
import { ToolComponentProps } from "@/tools/registry";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Syringe, Calendar, CheckCircle2, Circle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CDC_SCHEDULE = [
  { age: "Birth", months: 0, vaccines: ["HepB (1st dose)"] },
  { age: "2 Months", months: 2, vaccines: ["HepB (2nd dose)", "RV", "DTaP", "Hib", "PCV15", "IPV"] },
  { age: "4 Months", months: 4, vaccines: ["RV", "DTaP", "Hib", "PCV15", "IPV"] },
  { age: "6 Months", months: 6, vaccines: ["HepB (3rd dose, 6-18m)", "RV", "DTaP", "Hib", "PCV15", "IPV (6-18m)"] },
  { age: "12-15 Months", months: 12, vaccines: ["Hib", "PCV15", "MMR", "Varicella", "HepA (2 doses, 6m apart)"] },
  { age: "15-18 Months", months: 15, vaccines: ["DTaP"] },
  { age: "4-6 Years", months: 48, vaccines: ["DTaP", "IPV", "MMR", "Varicella"] },
  { age: "11-12 Years", months: 132, vaccines: ["Tdap", "HPV (2 or 3 doses)", "MenACWY"] },
  { age: "16 Years", months: 192, vaccines: ["MenACWY (Booster)"] },
];

const IAP_SCHEDULE = [
  { age: "Birth", months: 0, vaccines: ["BCG", "OPV 0", "Hep B 1"] },
  { age: "6 Weeks", months: 1.5, vaccines: ["DTwP 1", "IPV 1", "Hep B 2", "Hib 1", "Rotavirus 1", "PCV 1"] },
  { age: "10 Weeks", months: 2.5, vaccines: ["DTwP 2", "IPV 2", "Hib 2", "Rotavirus 2", "PCV 2"] },
  { age: "14 Weeks", months: 3.5, vaccines: ["DTwP 3", "IPV 3", "Hib 3", "Rotavirus 3", "PCV 3"] },
  { age: "6 Months", months: 6, vaccines: ["Hep B 3", "OPV 1", "Tybar (Typhoid)"] },
  { age: "9 Months", months: 9, vaccines: ["MMR 1", "MCV (Meningococcal)"] },
  { age: "12 Months", months: 12, vaccines: ["Hep A 1"] },
  { age: "15 Months", months: 15, vaccines: ["MMR 2", "Varicella 1", "PCV Booster"] },
  { age: "16-18 Months", months: 16, vaccines: ["DTwP B1", "IPV B1", "Hib B1"] },
  { age: "18-19 Months", months: 18, vaccines: ["Hep A 2", "Varicella 2"] },
  { age: "4.5-5 Years", months: 54, vaccines: ["DTwP B2", "IPV B2", "MMR 3"] },
  { age: "10-12 Years", months: 120, vaccines: ["Tdap", "HPV", "Tybar"] },
];

const NIP_INDIA_SCHEDULE = [
  { age: "Birth", months: 0, vaccines: ["BCG", "OPV 0", "Hep-B (Birth Dose)"] },
  { age: "6 Weeks", months: 1.5, vaccines: ["OPV 1", "Pentavalent 1", "Rotavirus 1", "fIPV 1", "PCV 1"] },
  { age: "10 Weeks", months: 2.5, vaccines: ["OPV 2", "Pentavalent 2", "Rotavirus 2"] },
  { age: "14 Weeks", months: 3.5, vaccines: ["OPV 3", "Pentavalent 3", "Rotavirus 3", "fIPV 2", "PCV 2"] },
  { age: "9-12 Months", months: 9, vaccines: ["MR 1", "JE 1 (Endemic areas)", "PCV Booster"] },
  { age: "16-24 Months", months: 16, vaccines: ["MR 2", "JE 2", "DPT Booster 1", "OPV Booster"] },
  { age: "5-6 Years", months: 60, vaccines: ["DPT Booster 2"] },
  { age: "10 Years", months: 120, vaccines: ["Td"] },
  { age: "16 Years", months: 192, vaccines: ["Td"] },
];

const GUIDELINES = {
  CDC: { name: "CDC (USA)", schedule: CDC_SCHEDULE },
  IAP: { name: "IAP (Indian Academy of Pediatrics)", schedule: IAP_SCHEDULE },
  NIP: { name: "India National Immunization Program (NIP)", schedule: NIP_INDIA_SCHEDULE },
};

export function ImmunizationSchedule({ metadata }: ToolComponentProps) {
  const [dob, setDob] = useState<string>("");
  const [guideline, setGuideline] = useState<keyof typeof GUIDELINES>("NIP");
  const [checkedVaccines, setCheckedVaccines] = useState<Record<string, boolean>>({});

  const toggleVaccine = (id: string) => {
    setCheckedVaccines(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const calculateDates = useMemo(() => {
    if (!dob) return [];
    const birthDate = new Date(dob);
    if (isNaN(birthDate.getTime())) return [];
    
    const activeSchedule = GUIDELINES[guideline].schedule;

    return activeSchedule.map(milestone => {
      const milestoneDate = new Date(birthDate);
      milestoneDate.setDate(birthDate.getDate() + Math.round(milestone.months * 30.44));
      
      const isPast = milestoneDate < new Date();
      
      return {
        ...milestone,
        date: milestoneDate.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }),
        isPast
      };
    });
  }, [dob, guideline]);

  return (
    <div className="grid md:grid-cols-12 gap-8 items-start">
      <Card className="md:col-span-4 h-fit border-primary/10 shadow-md">
        <CardHeader className="pb-4 border-b bg-muted/20">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Calendar className="w-5 h-5 text-primary" />
            Patient Info
          </CardTitle>
          <CardDescription>Enter details to generate a personalized timeline.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-2">
            <Label>Guideline</Label>
            <select
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={guideline}
              onChange={e => {
                setGuideline(e.target.value as keyof typeof GUIDELINES);
                setCheckedVaccines({});
              }}
            >
              {Object.entries(GUIDELINES).map(([key, value]) => (
                <option key={key} value={key}>{value.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label>Date of Birth</Label>
            <Input 
              type="date" 
              value={dob} 
              onChange={e => setDob(e.target.value)} 
            />
          </div>
        </CardContent>
      </Card>

      <div className="md:col-span-8 h-full">
        {dob ? (
          <Card className="h-full border-primary/20 shadow-lg relative overflow-hidden bg-gradient-to-br from-background to-muted/20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Personalized Timeline - {GUIDELINES[guideline].name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
              <div className="space-y-6 relative z-10">
                {calculateDates.map((milestone, idx) => (
                  <div key={idx} className={`bg-card border rounded-xl overflow-hidden shadow-sm transition-opacity ${milestone.isPast ? 'opacity-75' : ''}`}>
                    <div className={`px-4 py-2 border-b flex justify-between items-center ${milestone.isPast ? 'bg-muted/50 border-border/50' : 'bg-emerald-500/10 border-emerald-500/20'}`}>
                      <span className={`font-bold ${milestone.isPast ? 'text-muted-foreground' : 'text-emerald-700'}`}>{milestone.age} Milestone</span>
                      <span className={`text-sm font-semibold ${milestone.isPast ? 'text-muted-foreground' : 'text-primary'}`}>Due: {milestone.date}</span>
                    </div>
                    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {milestone.vaccines.map((vax, vidx) => {
                        const id = `${idx}-${vidx}`;
                        const isChecked = checkedVaccines[id] || false;
                        return (
                          <div 
                            key={vidx} 
                            onClick={() => toggleVaccine(id)}
                            className={`flex items-center gap-3 p-3 rounded-lg border text-sm font-medium cursor-pointer transition-all hover:bg-muted/50 ${isChecked ? 'bg-primary/5 border-primary/30 text-primary' : 'bg-card'}`}
                          >
                            {isChecked ? <CheckCircle2 className="w-5 h-5 text-primary shrink-0" /> : <Circle className="w-5 h-5 text-muted-foreground shrink-0" />}
                            <span className={isChecked ? 'line-through opacity-70' : ''}>{vax}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-xs text-muted-foreground p-4 bg-muted rounded-xl relative z-10">
                <strong>Disclaimer:</strong> This timeline is a simplified educational tool based on standard schedules. It does not replace clinical judgment, nor does it account for complex catch-up schedules or high-risk conditions. Always consult the official guidelines.
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="h-full flex items-center justify-center bg-muted/30 border-dashed min-h-[400px]">
            <CardContent className="flex flex-col items-center text-center text-muted-foreground space-y-3 p-6">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-2 shadow-sm">
                <Calendar className="w-8 h-8 opacity-50" />
              </div>
              <p className="max-w-xs">Enter patient date of birth to view personalized vaccination timeline.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
