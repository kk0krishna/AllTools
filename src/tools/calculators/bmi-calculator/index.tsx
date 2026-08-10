"use client";

import { useState, useEffect } from "react";
import { ToolComponentProps } from "@/tools/registry";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Activity, Info, Ruler, Scale } from "lucide-react";

type UnitSystem = "metric" | "imperial";

interface BMIResult {
  bmi: number;
  category: string;
  color: string;
  progressColor: string;
  progressPercent: number;
  ibw: number | null; 
  healthyRange: string;
}

export function BmiCalculator({ metadata }: ToolComponentProps) {
  const [heightUnit, setHeightUnit] = useState<"cm" | "in">("cm");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">("kg");
  const [gender, setGender] = useState<"male" | "female">("male");
  
  // State
  const [weight, setWeight] = useState("70");
  const [height, setHeight] = useState("170");
  
  const [result, setResult] = useState<BMIResult | null>(null);

  const calculate = () => {
    let weightKgCalc = 0; // in kg
    let heightCmCalc = 0; // in cm
    let heightInchesTotal = 0;

    if (weightUnit === "kg") {
      weightKgCalc = parseFloat(weight);
    } else {
      weightKgCalc = parseFloat(weight) * 0.453592;
    }

    if (heightUnit === "cm") {
      heightCmCalc = parseFloat(height);
      heightInchesTotal = heightCmCalc / 2.54;
    } else {
      heightInchesTotal = parseFloat(height);
      heightCmCalc = heightInchesTotal * 2.54;
    }

    if (!weightKgCalc || !heightCmCalc || heightCmCalc <= 0 || weightKgCalc <= 0) {
      setResult(null);
      return;
    }

    const heightM = heightCmCalc / 100;
    const bmi = weightKgCalc / (heightM * heightM);
    
    // Determine category (WHO Guidelines)
    let category = "";
    let color = "";
    let progressColor = "";
    if (bmi < 18.5) {
      category = "Underweight";
      color = "text-blue-500 bg-blue-500/10 border-blue-500/20";
      progressColor = "bg-blue-500";
    } else if (bmi < 25) {
      category = "Normal Weight";
      color = "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      progressColor = "bg-emerald-500";
    } else if (bmi < 30) {
      category = "Overweight";
      color = "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
      progressColor = "bg-yellow-500";
    } else if (bmi < 35) {
      category = "Obese (Class I)";
      color = "text-orange-500 bg-orange-500/10 border-orange-500/20";
      progressColor = "bg-orange-500";
    } else if (bmi < 40) {
      category = "Obese (Class II)";
      color = "text-orange-600 bg-orange-600/10 border-orange-600/20";
      progressColor = "bg-orange-600";
    } else {
      category = "Obese (Class III)";
      color = "text-rose-600 bg-rose-600/10 border-rose-600/20";
      progressColor = "bg-rose-600";
    }

    // Clamp BMI for the visual progress bar (between 15 and 45)
    const clampedBmi = Math.max(15, Math.min(bmi, 45));
    const progressPercent = ((clampedBmi - 15) / (45 - 15)) * 100;

    // Devine Formula for Ideal Body Weight (IBW)
    let ibw = null;
    if (heightInchesTotal > 60) {
      const inchesOver5Ft = heightInchesTotal - 60;
      ibw = gender === "male" 
        ? 50.0 + (2.3 * inchesOver5Ft)
        : 45.5 + (2.3 * inchesOver5Ft);
    } else {
      ibw = gender === "male" ? 50.0 : 45.5; 
    }

    // Healthy Range (18.5 - 24.9 BMI)
    const minHealthyWeight = 18.5 * (heightM * heightM);
    const maxHealthyWeight = 24.9 * (heightM * heightM);
    
    const healthyRangeStr = weightUnit === "kg" 
      ? `${minHealthyWeight.toFixed(1)} - ${maxHealthyWeight.toFixed(1)} kg`
      : `${(minHealthyWeight * 2.20462).toFixed(1)} - ${(maxHealthyWeight * 2.20462).toFixed(1)} lbs`;

    setResult({
      bmi: Number(bmi.toFixed(1)),
      category,
      color,
      progressColor,
      progressPercent,
      ibw: ibw ? Number(ibw.toFixed(1)) : null,
      healthyRange: healthyRangeStr
    });
  };

  // Auto calculate when inputs change
  useEffect(() => {
    calculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [heightUnit, weightUnit, gender, weight, height]);

  const formatWeight = (kg: number) => {
    if (weightUnit === "kg") return `${kg} kg`;
    return `${(kg * 2.20462).toFixed(1)} lbs`;
  };

  // Convert total inches back to ft/in for display
  const getFtInDisplay = () => {
    const totalInches = parseFloat(height) || 0;
    const ft = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return `${ft}' ${inches}"`;
  };

  return (
    <div className="grid md:grid-cols-12 gap-8 items-start">
      <Card className="md:col-span-5 h-fit border-primary/10 shadow-md">
        <CardHeader className="pb-4 border-b bg-muted/20">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Activity className="w-5 h-5 text-primary" />
            Measurements
          </CardTitle>
          <CardDescription>Adjust sliders or type exactly.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          
          {/* Biological Sex Control */}
          <div className="w-full sm:w-1/2 md:w-1/3">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Biological Sex</Label>
            <div className="flex p-1 bg-muted rounded-xl border border-border/50">
              <button
                onClick={() => setGender("male")}
                className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all ${
                  gender === "male" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Male ♂
              </button>
              <button
                onClick={() => setGender("female")}
                className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all ${
                  gender === "female" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Female ♀
              </button>
            </div>
          </div>

          <div className="space-y-8 pt-4">
            {/* Height Slider */}
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <Label className="flex items-center gap-2 text-base">
                  <Ruler className="w-4 h-4 text-primary" />
                  Height
                </Label>
                <div className="flex items-center gap-2">
                  <Input 
                    type="number" 
                    value={height} 
                    onChange={(e) => setHeight(e.target.value)} 
                    className="w-20 h-9 text-right font-semibold rounded-r-none border-r-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  <select
                    value={heightUnit}
                    onChange={(e) => {
                      const newUnit = e.target.value as "cm" | "in";
                      if (newUnit !== heightUnit) {
                        setHeightUnit(newUnit);
                        const val = newUnit === "cm" 
                          ? Math.round(parseFloat(height) * 2.54)
                          : Math.round(parseFloat(height) / 2.54);
                        if (!isNaN(val)) setHeight(val.toString());
                      }
                    }}
                    className="h-9 px-2 bg-muted border border-input rounded-r-md text-sm font-medium text-foreground outline-none focus:ring-1 focus:ring-ring"
                  >
                    <option value="cm">cm</option>
                    <option value="in">in</option>
                  </select>
                </div>
              </div>
              <input 
                type="range" 
                min={heightUnit === "cm" ? "100" : "40"} 
                max={heightUnit === "cm" ? "230" : "90"} 
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full accent-primary"
              />
              {heightUnit === "in" && (
                <div className="text-right text-xs text-muted-foreground font-medium">
                  Equals: {getFtInDisplay()}
                </div>
              )}
            </div>

            {/* Weight Slider */}
            <div className="space-y-4 border-t pt-6">
              <div className="flex justify-between items-end">
                <Label className="flex items-center gap-2 text-base">
                  <Scale className="w-4 h-4 text-primary" />
                  Weight
                </Label>
                <div className="flex items-center gap-2">
                  <Input 
                    type="number" 
                    value={weight} 
                    onChange={(e) => setWeight(e.target.value)} 
                    className="w-20 h-9 text-right font-semibold rounded-r-none border-r-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  <select
                    value={weightUnit}
                    onChange={(e) => {
                      const newUnit = e.target.value as "kg" | "lbs";
                      if (newUnit !== weightUnit) {
                        setWeightUnit(newUnit);
                        const val = newUnit === "kg"
                          ? Math.round(parseFloat(weight) / 2.20462)
                          : Math.round(parseFloat(weight) * 2.20462);
                        if (!isNaN(val)) setWeight(val.toString());
                      }
                    }}
                    className="h-9 px-2 bg-muted border border-input rounded-r-md text-sm font-medium text-foreground outline-none focus:ring-1 focus:ring-ring"
                  >
                    <option value="kg">kg</option>
                    <option value="lbs">lbs</option>
                  </select>
                </div>
              </div>
              <input 
                type="range" 
                min={weightUnit === "kg" ? "30" : "65"} 
                max={weightUnit === "kg" ? "200" : "450"} 
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full accent-primary"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="md:col-span-7 h-full">
        {result ? (
          <Card className="h-full border-primary/20 shadow-lg relative overflow-hidden bg-gradient-to-br from-background to-muted/20">
            {/* Visual background element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
            
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Your Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 pt-2">
              
              <div className="flex flex-col md:flex-row items-center gap-6 p-6 rounded-2xl bg-card border shadow-sm relative z-10">
                <div className={`flex flex-col items-center justify-center shrink-0 w-36 h-36 rounded-full border-4 ${result.color.replace('text-', 'border-').split(' ')[0]} bg-background shadow-inner`}>
                  <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-1">BMI</span>
                  <span className="text-5xl font-bold font-heading tracking-tighter">{result.bmi}</span>
                </div>
                <div className="flex flex-col gap-2 text-center md:text-left w-full">
                  <h3 className={`text-2xl font-bold ${result.color.split(' ')[0]}`}>
                    {result.category}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Based on your measurements, your body mass index falls into the <strong className="text-foreground font-medium">{result.category}</strong> category.
                  </p>
                </div>
              </div>

              {/* BMI Scale Visualizer */}
              <div className="space-y-2 relative z-10">
                <div className="flex justify-between text-xs font-semibold text-muted-foreground mb-1 px-1">
                  <span>15</span>
                  <span>18.5</span>
                  <span>25</span>
                  <span>30</span>
                  <span>40+</span>
                </div>
                <div className="h-4 w-full rounded-full bg-gradient-to-r from-blue-400 via-emerald-400 via-50% to-rose-500 relative overflow-hidden border">
                  {/* Indicator Pip */}
                  <div 
                    className="absolute top-0 bottom-0 w-1.5 bg-foreground border border-background rounded-full transition-all duration-500 shadow-md"
                    style={{ left: `max(0%, min(calc(${result.progressPercent}% - 3px), 100%))` }}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t relative z-10">
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary block mb-1">
                    Ideal Body Weight
                  </span>
                  <span className="text-2xl font-bold">
                    {result.ibw ? formatWeight(result.ibw) : "--"}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 block mb-1">
                    Healthy Range
                  </span>
                  <span className="text-2xl font-bold">
                    {result.healthyRange}
                  </span>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-xl flex gap-3 text-sm relative z-10">
                <Info className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Clinical Insight:</strong> BMI does not distinguish between muscle mass and fat mass. In muscular individuals or athletes, BMI may overestimate body fat. Always consider evaluating waist circumference or body fat percentage for a more accurate metabolic assessment.
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
              <p className="max-w-xs">Adjust the sliders or enter your metrics to view your personalized BMI classification and ideal body weight.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
