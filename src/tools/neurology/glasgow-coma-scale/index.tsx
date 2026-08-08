"use client";

import { useState } from "react";
import { ToolComponentProps } from "@/tools/registry";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Brain, Eye, MessageSquare, Hand } from "lucide-react";

const EYE_SCORES = [
  { score: 4, label: "Spontaneously" },
  { score: 3, label: "To speech" },
  { score: 2, label: "To pain" },
  { score: 1, label: "None" },
];

const VERBAL_SCORES = [
  { score: 5, label: "Oriented" },
  { score: 4, label: "Confused" },
  { score: 3, label: "Inappropriate words" },
  { score: 2, label: "Incomprehensible sounds" },
  { score: 1, label: "None" },
];

const MOTOR_SCORES = [
  { score: 6, label: "Obeys commands" },
  { score: 5, label: "Localizes to pain" },
  { score: 4, label: "Withdraws from pain" },
  { score: 3, label: "Abnormal flexion (decorticate)" },
  { score: 2, label: "Abnormal extension (decerebrate)" },
  { score: 1, label: "None" },
];

export function GlasgowComaScale({ metadata }: ToolComponentProps) {
  const [eye, setEye] = useState<number | null>(null);
  const [verbal, setVerbal] = useState<number | null>(null);
  const [motor, setMotor] = useState<number | null>(null);

  const total = (eye || 0) + (verbal || 0) + (motor || 0);
  const isComplete = eye !== null && verbal !== null && motor !== null;

  let severity = "";
  let severityColor = "";
  
  if (isComplete) {
    if (total >= 13) {
      severity = "Mild";
      severityColor = "text-emerald-600 bg-emerald-500/10 border-emerald-500/20";
    } else if (total >= 9) {
      severity = "Moderate";
      severityColor = "text-yellow-600 bg-yellow-500/10 border-yellow-500/20";
    } else {
      severity = "Severe";
      severityColor = "text-rose-600 bg-rose-600/10 border-rose-600/20";
    }
  }

  const renderSection = (
    title: string, 
    icon: React.ReactNode, 
    options: {score: number, label: string}[], 
    currentValue: number | null, 
    setValue: (val: number) => void
  ) => (
    <div className="space-y-3">
      <h3 className="flex items-center gap-2 font-semibold text-sm uppercase tracking-wider text-muted-foreground">
        {icon} {title}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {options.map((opt) => (
          <button
            key={opt.score}
            onClick={() => setValue(opt.score)}
            className={`text-left p-3 rounded-lg border transition-all text-sm ${
              currentValue === opt.score
                ? "border-primary bg-primary/10 text-primary font-medium"
                : "border-border/50 hover:bg-muted/50 text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="font-bold mr-2">+{opt.score}</span> {opt.label}
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
            <Brain className="w-5 h-5 text-primary" />
            Clinical Assessment
          </CardTitle>
          <CardDescription>Select the best response in each category.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {renderSection("Eye Opening", <Eye className="w-4 h-4" />, EYE_SCORES, eye, setEye)}
          <div className="border-t pt-2" />
          {renderSection("Verbal Response", <MessageSquare className="w-4 h-4" />, VERBAL_SCORES, verbal, setVerbal)}
          <div className="border-t pt-2" />
          {renderSection("Motor Response", <Hand className="w-4 h-4" />, MOTOR_SCORES, motor, setMotor)}
        </CardContent>
      </Card>

      <div className="md:col-span-5 h-full">
        {isComplete ? (
          <Card className="h-full border-primary/20 shadow-lg relative overflow-hidden bg-gradient-to-br from-background to-muted/20 sticky top-4">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">GCS Score</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
              <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-card border shadow-sm relative z-10 text-center">
                <div className={`flex flex-col items-center justify-center shrink-0 w-32 h-32 rounded-full border-4 ${severityColor.replace('text-', 'border-').split(' ')[0]} shadow-inner`}>
                  <span className="text-5xl font-bold font-heading tracking-tighter">{total}</span>
                </div>
                
                <div className="pt-2">
                  <h3 className={`text-xl font-bold mb-1 ${severityColor.split(' ')[0]}`}>
                    {severity} Brain Injury
                  </h3>
                  <p className="text-muted-foreground text-sm font-medium">
                    (E{eye} V{verbal} M{motor})
                  </p>
                </div>
              </div>
              
              <div className="text-sm space-y-2 relative z-10 p-4 bg-muted rounded-xl">
                <p><strong>Severe (GCS ≤ 8):</strong> Typically indicates coma. Consider intubation for airway protection.</p>
                <p><strong>Moderate (GCS 9-12):</strong> Significant cognitive impairment.</p>
                <p><strong>Mild (GCS 13-15):</strong> Minor cognitive impairment.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="h-full flex items-center justify-center bg-muted/30 border-dashed min-h-[400px]">
            <CardContent className="flex flex-col items-center text-center text-muted-foreground space-y-3 p-6">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-2 shadow-sm">
                <Activity className="w-8 h-8 opacity-50" />
              </div>
              <p className="max-w-xs">Complete all three sections (Eye, Verbal, Motor) to calculate the GCS score.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
