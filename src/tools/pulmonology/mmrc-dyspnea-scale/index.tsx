"use client";

import { useState } from "react";
import { ToolComponentProps } from "@/tools/registry";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CheckCircle2, Wind } from "lucide-react";

const GRADES = [
  { grade: 0, text: "I only get breathless with strenuous exercise." },
  { grade: 1, text: "I get short of breath when hurrying on the level or walking up a slight hill." },
  { grade: 2, text: "I walk slower than people of the same age on the level because of breathlessness, or I have to stop for breath when walking on my own pace on the level." },
  { grade: 3, text: "I stop for breath after walking about 100 meters or after a few minutes on the level." },
  { grade: 4, text: "I am too breathless to leave the house or I am breathless when dressing or undressing." },
];

export function MmrcDyspneaScale({ metadata }: ToolComponentProps) {
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);

  return (
    <div className="grid md:grid-cols-12 gap-8 items-start">
      <Card className="md:col-span-7 h-fit border-primary/10 shadow-md">
        <CardHeader className="pb-4 border-b bg-muted/20">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Wind className="w-5 h-5 text-primary" />
            Dyspnea Questionnaire
          </CardTitle>
          <CardDescription>Select the statement that best describes your breathlessness.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          {GRADES.map((item) => (
            <button
              key={item.grade}
              onClick={() => setSelectedGrade(item.grade)}
              className={`w-full flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                selectedGrade === item.grade
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border/50 bg-background hover:bg-muted/50 hover:border-primary/30"
              }`}
            >
              <div className={`mt-0.5 shrink-0 ${selectedGrade === item.grade ? "text-primary" : "text-muted-foreground"}`}>
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className={`font-bold mb-1 ${selectedGrade === item.grade ? "text-primary" : "text-foreground"}`}>
                  Grade {item.grade}
                </div>
                <div className="text-sm text-muted-foreground leading-relaxed">
                  {item.text}
                </div>
              </div>
            </button>
          ))}
        </CardContent>
      </Card>

      <div className="md:col-span-5 h-full">
        {selectedGrade !== null ? (
          <Card className="h-full border-primary/20 shadow-lg relative overflow-hidden bg-gradient-to-br from-background to-muted/20 sticky top-4">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Scale Result</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
              <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-card border shadow-sm relative z-10 text-center">
                <div className={`flex flex-col items-center justify-center shrink-0 w-32 h-32 rounded-full border-4 ${selectedGrade >= 2 ? "border-orange-500 bg-orange-500/10 text-orange-600" : "border-emerald-500 bg-emerald-500/10 text-emerald-600"} shadow-inner`}>
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">mMRC Grade</span>
                  <span className="text-5xl font-bold font-heading tracking-tighter">{selectedGrade}</span>
                </div>
                
                <div className="pt-2">
                  <h3 className={`text-xl font-bold mb-2 ${selectedGrade >= 2 ? "text-orange-600" : "text-emerald-600"}`}>
                    {selectedGrade >= 2 ? "More Symptomatic" : "Less Symptomatic"}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {selectedGrade >= 2 
                      ? "A score of 2 or higher indicates significant symptomatic burden and typically places a COPD patient in a higher GOLD risk category (Group B or E)."
                      : "A score of 0 or 1 indicates lesser symptomatic burden, aligning with GOLD risk category Group A."}
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
              <p className="max-w-xs">Select a statement on the left to determine your mMRC Grade.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
