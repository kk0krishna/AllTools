"use client";

import { useState } from "react";
import { ToolComponentProps } from "@/tools/registry";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Eye, ArrowRight, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import Image from "next/image";

// Using the actual images extracted from reference files.
const PLATES = [
  { id: 1, src: "/images/ishihara/ishihara12_By9C.png", correct: "12", deficient: "12", desc: "Plate 1 (Control): Both normal and color-deficient individuals should see 12." },
  { id: 2, src: "/images/ishihara/ishihara8_By9C.png", correct: "8", deficient: "3", desc: "Plate 2: Normal sees 8. Red-green deficiency sees 3." },
  { id: 3, src: "/images/ishihara/ishihara29_By9C.png", correct: "29", deficient: "70", desc: "Plate 3: Normal sees 29. Red-green deficiency sees 70." },
  { id: 4, src: "/images/ishihara/ishihara5_By9C.png", correct: "5", deficient: "2", desc: "Plate 4: Normal sees 5. Red-green deficiency sees 2." },
  { id: 5, src: "/images/ishihara/ishihara74_By9C.png", correct: "74", deficient: "21", desc: "Plate 5: Normal sees 74. Red-green deficiency sees 21." },
  { id: 6, src: "/images/ishihara/ishihara7_By9C.png", correct: "7", deficient: "Nothing", desc: "Plate 6: Normal sees 7. Color deficient sees nothing." },
  { id: 7, src: "/images/ishihara/ishihara45_By9C.png", correct: "45", deficient: "Nothing", desc: "Plate 7: Normal sees 45. Color deficient sees nothing." },
  { id: 8, src: "/images/ishihara/ishihara2_By9C.png", correct: "2", deficient: "Nothing", desc: "Plate 8: Normal sees 2. Color deficient sees nothing." },
  { id: 9, src: "/images/ishihara/ishihara16_By9C.png", correct: "16", deficient: "Nothing", desc: "Plate 9: Normal sees 16. Color deficient sees nothing." },
  { id: 10, src: "/images/ishihara/ishihara35_By9C.png", correct: "35", deficient: "5", desc: "Plate 10: Normal sees 35. Protanopia sees 5, Deuteranopia sees 3." },
  { id: 11, src: "/images/ishihara/ishihara96_By9C.png", correct: "96", deficient: "6", desc: "Plate 11: Normal sees 96. Protanopia sees 6, Deuteranopia sees 9." },
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

  const score = answers.reduce((acc, ans, idx) => acc + (ans.trim() === PLATES[idx].correct ? 1 : 0), 0);
  
  // Interpretation Logic
  let interpretation = "Normal Color Vision";
  let interpretationColor = "text-emerald-600";
  let interpretationDesc = "You correctly identified all or almost all plates.";
  let deficiencyLikely = false;

  if (isFinished) {
    if (score <= 8) {
      deficiencyLikely = true;
      interpretation = "Red-Green Color Vision Deficiency";
      interpretationColor = "text-rose-600";
      interpretationDesc = "Your results strongly indicate a red-green color vision deficiency. Please consult an eye care professional for a formal diagnosis.";
    } else if (score < PLATES.length) {
      interpretation = "Possible Mild Color Vision Deficiency";
      interpretationColor = "text-orange-500";
      interpretationDesc = "You missed a few plates. This could be due to screen calibration, lighting, or a mild color vision deficiency.";
    }
  }
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
              <CardDescription>
                Identify the number or path hidden in the plates. This is a digital approximation and NOT a clinical &quot;gold standard&quot; test.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 pt-8 flex flex-col items-center">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full overflow-hidden shadow-inner border-4 border-muted">
                <Image 
                  src={PLATES[currentPlate].src} 
                  alt={`Ishihara Plate ${PLATES[currentPlate].id}`} 
                  fill
                  className="object-cover"
                  priority={currentPlate === 0}
                />
              </div>

              <div className="flex flex-col items-center w-full max-w-sm space-y-4">
                <Label className="text-sm text-muted-foreground">What number do you see?</Label>
                <div className="flex w-full gap-2">
                  <Input 
                    type="number" 
                    id="plate-answer"
                    placeholder="Enter number..." 
                    className="text-center text-lg h-12"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAnswer(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <Button 
                    className="h-12 px-6" 
                    onClick={() => {
                      const input = document.getElementById('plate-answer') as HTMLInputElement;
                      if (input) {
                        handleAnswer(input.value || "Nothing");
                        input.value = '';
                      }
                    }}
                  >
                    Next
                  </Button>
                </div>
                <Button 
                  variant="ghost" 
                  className="text-muted-foreground"
                  onClick={() => handleAnswer("Nothing")}
                >
                  I don&apos;t see a number
                </Button>
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
                  <h3 className={`text-xl font-bold mb-1 ${interpretationColor}`}>
                    {interpretation}
                  </h3>
                  <p className="text-muted-foreground text-sm font-medium">
                    {interpretationDesc}
                  </p>
                </div>
              </div>

              <div className="space-y-3 relative z-10">
                <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Results Breakdown</h4>
                {PLATES.map((plate, idx) => {
                  const isCorrect = answers[idx].trim() === plate.correct;
                  const isDeficientPattern = answers[idx].trim() === plate.deficient || (answers[idx].trim() === "3" && plate.id === 10) || (answers[idx].trim() === "9" && plate.id === 11);
                  return (
                    <div key={plate.id} className={`flex items-start gap-3 p-3 border rounded-lg ${isCorrect ? "bg-emerald-500/5 border-emerald-500/20" : "bg-rose-500/5 border-rose-500/20"}`}>
                      {isCorrect ? <Check className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" /> : <X className="w-5 h-5 text-rose-500 mt-0.5 shrink-0" />}
                      <div>
                        <div className="font-semibold text-sm">
                          Plate {idx + 1}: You answered &quot;{answers[idx]}&quot; 
                          {isCorrect ? " (Correct)" : ` (Correct: ${plate.correct})`}
                          {!isCorrect && isDeficientPattern && <span className="ml-2 text-rose-600 text-xs px-2 py-0.5 bg-rose-100 dark:bg-rose-900/30 rounded-full">Typical Deficiency Answer</span>}
                        </div>
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
