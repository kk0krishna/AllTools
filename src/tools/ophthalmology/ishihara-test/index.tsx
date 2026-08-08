"use client";

import { useState } from "react";
import { ToolComponentProps } from "@/tools/registry";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Eye, ArrowRight, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

// A mock simulation of plates using CSS patterns since we don't have the images offline.
const PLATES = [
  { id: 1, text: "12", isControl: true, correct: "12", bg: "bg-emerald-400", fg: "text-orange-500", desc: "Both normal and color-deficient individuals should see 12." },
  { id: 2, text: "8", isControl: false, correct: "8", bg: "bg-orange-400", fg: "text-emerald-500", desc: "Normal sees 8. Red-green deficiency sees 3." },
  { id: 3, text: "29", isControl: false, correct: "29", bg: "bg-emerald-300", fg: "text-rose-500", desc: "Normal sees 29. Red-green deficiency sees 70." },
  { id: 4, text: "5", isControl: false, correct: "5", bg: "bg-yellow-400", fg: "text-emerald-500", desc: "Normal sees 5. Red-green deficiency sees 2." },
];

export function IshiharaTest({ metadata }: ToolComponentProps) {
  const [currentPlate, setCurrentPlate] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const handleAnswer = (val: string) => {
    const newAnswers = [...answers, val];
    setAnswers(newAnswers);
    if (currentPlate < PLATES.length - 1) {
      setCurrentPlate(currentPlate + 1);
    } else {
      setIsFinished(true);
    }
  };

  const restart = () => {
    setCurrentPlate(0);
    setAnswers([]);
    setIsFinished(false);
  };

  const score = answers.reduce((acc, ans, idx) => acc + (ans === PLATES[idx].correct ? 1 : 0), 0);

  return (
    <div className="grid md:grid-cols-12 gap-8 items-start">
      <div className="md:col-span-12 max-w-3xl mx-auto w-full">
        {!isFinished ? (
          <Card className="border-primary/10 shadow-md">
            <CardHeader className="pb-4 border-b bg-muted/20 text-center flex flex-col items-center">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Eye className="w-6 h-6 text-primary" />
                Plate {currentPlate + 1} of {PLATES.length}
              </CardTitle>
              <CardDescription>What number do you see in the circle below?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 pt-8 flex flex-col items-center">
              {/* Fake Ishihara Plate using CSS dotted patterns */}
              <div 
                className={`w-64 h-64 rounded-full flex items-center justify-center shadow-inner border-4 border-white ${PLATES[currentPlate].bg}`}
                style={{
                  backgroundImage: 'radial-gradient(circle, transparent 20%, rgba(255,255,255,0.3) 20%, rgba(255,255,255,0.3) 80%, transparent 80%, transparent), radial-gradient(circle, transparent 20%, rgba(0,0,0,0.1) 20%, rgba(0,0,0,0.1) 80%, transparent 80%, transparent)',
                  backgroundSize: '10px 10px',
                  backgroundPosition: '0 0, 5px 5px'
                }}
              >
                <span className={`text-9xl font-black ${PLATES[currentPlate].fg} opacity-90 drop-shadow-sm`}>
                  {PLATES[currentPlate].text}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
                <Button variant="outline" className="h-14 text-xl" onClick={() => handleAnswer("3")}>3</Button>
                <Button variant="outline" className="h-14 text-xl" onClick={() => handleAnswer("5")}>5</Button>
                <Button variant="outline" className="h-14 text-xl" onClick={() => handleAnswer("8")}>8</Button>
                <Button variant="outline" className="h-14 text-xl" onClick={() => handleAnswer("12")}>12</Button>
                <Button variant="outline" className="h-14 text-xl" onClick={() => handleAnswer("29")}>29</Button>
                <Button variant="outline" className="h-14 text-xl" onClick={() => handleAnswer("Nothing")}>Nothing</Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-primary/20 shadow-lg relative overflow-hidden bg-gradient-to-br from-background to-muted/20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
            <CardHeader className="pb-2 text-center">
              <CardTitle className="text-2xl">Screening Complete</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
              <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-card border shadow-sm relative z-10 text-center">
                <div className={`flex flex-col items-center justify-center shrink-0 w-32 h-32 rounded-full border-4 ${score === PLATES.length ? "border-emerald-500 text-emerald-600 bg-emerald-500/10" : "border-orange-500 text-orange-600 bg-orange-500/10"} shadow-inner`}>
                  <span className="text-5xl font-bold font-heading tracking-tighter">{score}/{PLATES.length}</span>
                </div>
                
                <div className="pt-2">
                  <h3 className={`text-xl font-bold mb-1 ${score === PLATES.length ? "text-emerald-600" : "text-orange-600"}`}>
                    {score === PLATES.length ? "Normal Color Vision" : "Possible Color Vision Deficiency"}
                  </h3>
                  <p className="text-muted-foreground text-sm font-medium">
                    {score === PLATES.length 
                      ? "You correctly identified all the plates in this simulation."
                      : "You missed one or more plates. A formal test with a physical book under proper lighting is recommended."}
                  </p>
                </div>
              </div>

              <div className="space-y-3 relative z-10">
                <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Results Breakdown</h4>
                {PLATES.map((plate, idx) => {
                  const isCorrect = answers[idx] === plate.correct;
                  return (
                    <div key={plate.id} className={`flex items-start gap-3 p-3 border rounded-lg ${isCorrect ? "bg-emerald-500/5 border-emerald-500/20" : "bg-rose-500/5 border-rose-500/20"}`}>
                      {isCorrect ? <Check className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" /> : <X className="w-5 h-5 text-rose-500 mt-0.5 shrink-0" />}
                      <div>
                        <div className="font-semibold text-sm">Plate {idx + 1}: You answered "{answers[idx]}" (Correct: {plate.correct})</div>
                        <div className="text-xs text-muted-foreground mt-1">{plate.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-center relative z-10 pt-4 border-t">
                <Button onClick={restart} variant="outline" className="font-bold">
                  Restart Test
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
