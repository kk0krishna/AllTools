"use client";

import { useState } from "react";
import { ToolComponentProps } from "@/tools/registry";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Activity, Info } from "lucide-react";

type UnitSystem = "metric" | "imperial";

interface BMIResult {
  bmi: number;
  category: string;
  color: string;
  ibw: number | null; // Ideal Body Weight
  healthyRange: string;
}

export function BmiCalculator({ metadata }: ToolComponentProps) {
  const [unit, setUnit] = useState<UnitSystem>("metric");
  
  // Metric state
  const [weightKg, setWeightKg] = useState("");
  const [heightCm, setHeightCm] = useState("");
  
  // Imperial state
  const [weightLbs, setWeightLbs] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");

  const [gender, setGender] = useState<"male" | "female">("male");
  const [result, setResult] = useState<BMIResult | null>(null);

  const calculate = () => {
    let weight = 0; // in kg
    let height = 0; // in cm
    let heightInchesTotal = 0;

    if (unit === "metric") {
      weight = parseFloat(weightKg);
      height = parseFloat(heightCm);
      heightInchesTotal = height / 2.54;
    } else {
      weight = parseFloat(weightLbs) * 0.453592;
      const ft = parseFloat(heightFt) || 0;
      const inch = parseFloat(heightIn) || 0;
      heightInchesTotal = (ft * 12) + inch;
      height = heightInchesTotal * 2.54;
    }

    if (!weight || !height || height <= 0 || weight <= 0) {
      setResult(null);
      return;
    }

    const heightM = height / 100;
    const bmi = weight / (heightM * heightM);
    
    // Determine category (WHO Guidelines)
    let category = "";
    let color = "";
    if (bmi < 18.5) {
      category = "Underweight";
      color = "text-blue-500 bg-blue-500/10 border-blue-500/20";
    } else if (bmi < 25) {
      category = "Normal Weight";
      color = "text-green-500 bg-green-500/10 border-green-500/20";
    } else if (bmi < 30) {
      category = "Overweight";
      color = "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
    } else if (bmi < 35) {
      category = "Obese (Class I)";
      color = "text-orange-500 bg-orange-500/10 border-orange-500/20";
    } else if (bmi < 40) {
      category = "Obese (Class II)";
      color = "text-red-500 bg-red-500/10 border-red-500/20";
    } else {
      category = "Obese (Class III - Severe)";
      color = "text-rose-600 bg-rose-600/10 border-rose-600/20";
    }

    // Devine Formula for Ideal Body Weight (IBW)
    // Male: 50.0 kg + 2.3 kg per inch over 5 feet
    // Female: 45.5 kg + 2.3 kg per inch over 5 feet
    let ibw = null;
    if (heightInchesTotal > 60) {
      const inchesOver5Ft = heightInchesTotal - 60;
      ibw = gender === "male" 
        ? 50.0 + (2.3 * inchesOver5Ft)
        : 45.5 + (2.3 * inchesOver5Ft);
    } else {
      // Approximate for under 5 feet, though standard Devine doesn't strictly apply
      ibw = gender === "male" ? 50.0 : 45.5; 
    }

    // Healthy Range (18.5 - 24.9 BMI)
    const minHealthyWeight = 18.5 * (heightM * heightM);
    const maxHealthyWeight = 24.9 * (heightM * heightM);
    
    const healthyRangeStr = unit === "metric" 
      ? `${minHealthyWeight.toFixed(1)} - ${maxHealthyWeight.toFixed(1)} kg`
      : `${(minHealthyWeight * 2.20462).toFixed(1)} - ${(maxHealthyWeight * 2.20462).toFixed(1)} lbs`;

    setResult({
      bmi: Number(bmi.toFixed(1)),
      category,
      color,
      ibw: ibw ? Number(ibw.toFixed(1)) : null,
      healthyRange: healthyRangeStr
    });
  };

  const formatWeight = (kg: number) => {
    if (unit === "metric") return `${kg} kg`;
    return `${(kg * 2.20462).toFixed(1)} lbs`;
  };

  return (
    <div className="space-y-6">
      <div className="mb-6 space-y-2">
        <h1 className="text-3xl font-bold font-heading">{metadata.name}</h1>
        <p className="text-muted-foreground text-lg">{metadata.description}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Activity className="w-5 h-5 text-primary" />
              Patient Metrics
            </CardTitle>
            <CardDescription>Enter metrics to calculate clinical insights.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Unit Toggle */}
            <div className="flex p-1 bg-muted rounded-xl">
              <button
                onClick={() => setUnit("metric")}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                  unit === "metric" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Metric (kg, cm)
              </button>
              <button
                onClick={() => setUnit("imperial")}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                  unit === "imperial" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Imperial (lbs, ft)
              </button>
            </div>

            {/* Gender Toggle */}
            <div className="flex p-1 bg-muted rounded-xl">
              <button
                onClick={() => setGender("male")}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                  gender === "male" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Male (IBW calc)
              </button>
              <button
                onClick={() => setGender("female")}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                  gender === "female" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Female (IBW calc)
              </button>
            </div>

            <div className="space-y-4">
              {unit === "metric" ? (
                <>
                  <div className="space-y-2">
                    <Label>Weight (kg)</Label>
                    <Input 
                      type="number" 
                      placeholder="e.g. 70" 
                      value={weightKg} 
                      onChange={(e) => setWeightKg(e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Height (cm)</Label>
                    <Input 
                      type="number" 
                      placeholder="e.g. 175" 
                      value={heightCm} 
                      onChange={(e) => setHeightCm(e.target.value)} 
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label>Weight (lbs)</Label>
                    <Input 
                      type="number" 
                      placeholder="e.g. 150" 
                      value={weightLbs} 
                      onChange={(e) => setWeightLbs(e.target.value)} 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Height (ft)</Label>
                      <Input 
                        type="number" 
                        placeholder="e.g. 5" 
                        value={heightFt} 
                        onChange={(e) => setHeightFt(e.target.value)} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Height (in)</Label>
                      <Input 
                        type="number" 
                        placeholder="e.g. 9" 
                        value={heightIn} 
                        onChange={(e) => setHeightIn(e.target.value)} 
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={calculate}
              className="w-full py-3 bg-primary text-primary-foreground font-medium rounded-xl hover:opacity-90 transition-opacity"
            >
              Calculate BMI
            </button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {result ? (
            <Card className="h-fit animate-in fade-in slide-in-from-bottom-4 duration-500 border-primary/20">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">Clinical Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                
                <div className={`p-6 rounded-2xl border flex flex-col items-center justify-center text-center space-y-2 ${result.color}`}>
                  <span className="text-sm font-semibold uppercase tracking-wider opacity-80">BMI Score</span>
                  <span className="text-6xl font-bold font-heading">{result.bmi}</span>
                  <span className="text-lg font-medium">{result.category}</span>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      Ideal Body Weight (IBW)
                    </span>
                    <span className="font-medium text-lg">
                      {result.ibw ? formatWeight(result.ibw) : "--"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      Healthy Weight Range
                    </span>
                    <span className="font-medium">
                      {result.healthyRange}
                    </span>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-xl flex gap-3 text-sm">
                  <Info className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                  <p className="text-muted-foreground leading-relaxed">
                    <strong>Note for clinicians:</strong> BMI does not distinguish between muscle mass and fat mass. In highly muscular individuals or athletes, BMI may overestimate body fat. Consider evaluating waist circumference or body fat percentage for a more accurate metabolic assessment.
                  </p>
                </div>

              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center bg-muted/30 border-dashed min-h-[300px]">
              <CardContent className="flex flex-col items-center text-center text-muted-foreground space-y-3 p-6">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-2">
                  <Activity className="w-8 h-8 opacity-50" />
                </div>
                <p>Enter patient metrics to view BMI categorization and ideal body weight (IBW).</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
