"use client";

import { useState, useEffect } from "react";
import { ToolComponentProps } from "@/tools/registry";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Activity, Info, Beaker } from "lucide-react";

export function AbgAnalyzer({ metadata }: ToolComponentProps) {
  const [ph, setPh] = useState("7.40");
  const [pco2, setPco2] = useState("40");
  const [hco3, setHco3] = useState("24");

  const [result, setResult] = useState<{
    primary: string;
    compensation: string;
    expected: string;
  } | null>(null);

  useEffect(() => {
    const vPh = parseFloat(ph);
    const vPco2 = parseFloat(pco2);
    const vHco3 = parseFloat(hco3);

    if (isNaN(vPh) || isNaN(vPco2) || isNaN(vHco3)) {
      setResult(null);
      return;
    }

    let primary = "Normal";
    let expected = "";
    let compStatus = "No compensation needed";

    if (vPh < 7.35) {
      // Acidemia
      if (vPco2 > 45 && vHco3 >= 22) {
        primary = "Respiratory Acidosis";
        // Expected HCO3 increases by 1 (acute) or 4 (chronic) for every 10 pCO2 increase
        expected = "Acute: HCO3 ≈ " + (24 + ((vPco2 - 40) / 10)).toFixed(1) + 
                   " | Chronic: HCO3 ≈ " + (24 + 4 * ((vPco2 - 40) / 10)).toFixed(1);
        compStatus = "Check if HCO3 matches expected values to determine compensation type.";
      } else if (vHco3 < 22 && vPco2 <= 45) {
        primary = "Metabolic Acidosis";
        // Winter's Formula
        const expectedPco2 = (1.5 * vHco3) + 8;
        expected = "Expected pCO2: " + (expectedPco2 - 2).toFixed(1) + " to " + (expectedPco2 + 2).toFixed(1);
        if (vPco2 >= (expectedPco2 - 2) && vPco2 <= (expectedPco2 + 2)) {
          compStatus = "Adequately Compensated";
        } else if (vPco2 > (expectedPco2 + 2)) {
          compStatus = "Mixed Metabolic Acidosis & Respiratory Acidosis";
        } else {
          compStatus = "Mixed Metabolic Acidosis & Respiratory Alkalosis";
        }
      } else {
        primary = "Mixed Acidosis";
        compStatus = "Both respiratory and metabolic components are acidotic.";
      }
    } else if (vPh > 7.45) {
      // Alkalemia
      if (vPco2 < 35 && vHco3 <= 26) {
        primary = "Respiratory Alkalosis";
        expected = "Acute: HCO3 ≈ " + (24 - 2 * ((40 - vPco2) / 10)).toFixed(1) + 
                   " | Chronic: HCO3 ≈ " + (24 - 5 * ((40 - vPco2) / 10)).toFixed(1);
        compStatus = "Check if HCO3 matches expected values to determine compensation type.";
      } else if (vHco3 > 26 && vPco2 >= 35) {
        primary = "Metabolic Alkalosis";
        const expectedPco2 = (0.7 * vHco3) + 21; // roughly 0.7 * HCO3 + 21
        expected = "Expected pCO2: " + (expectedPco2 - 2).toFixed(1) + " to " + (expectedPco2 + 2).toFixed(1);
        if (vPco2 >= (expectedPco2 - 2) && vPco2 <= (expectedPco2 + 2)) {
          compStatus = "Adequately Compensated";
        } else if (vPco2 > (expectedPco2 + 2)) {
          compStatus = "Mixed Metabolic Alkalosis & Respiratory Acidosis";
        } else {
          compStatus = "Mixed Metabolic Alkalosis & Respiratory Alkalosis";
        }
      } else {
        primary = "Mixed Alkalosis";
        compStatus = "Both respiratory and metabolic components are alkalotic.";
      }
    } else {
      // Normal pH
      if (vPco2 > 45 && vHco3 > 26) {
        primary = "Fully Compensated Respiratory Acidosis or Metabolic Alkalosis";
      } else if (vPco2 < 35 && vHco3 < 22) {
        primary = "Fully Compensated Respiratory Alkalosis or Metabolic Acidosis";
      } else if (vPco2 > 45 || vPco2 < 35 || vHco3 > 26 || vHco3 < 22) {
        primary = "Mixed Disorder (pH is normal but values are abnormal)";
      }
    }

    setResult({ primary, compensation: compStatus, expected });
  }, [ph, pco2, hco3]);

  return (
    <div className="grid md:grid-cols-12 gap-8 items-start">
      <Card className="md:col-span-5 h-fit border-primary/10 shadow-md">
        <CardHeader className="pb-4 border-b bg-muted/20">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Beaker className="w-5 h-5 text-primary" />
            ABG Values
          </CardTitle>
          <CardDescription>Enter pH, PaCO2, and HCO3.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-base font-semibold">pH</Label>
              <Input type="number" step="0.01" value={ph} onChange={e => setPh(e.target.value)} className="w-24 text-right" />
            </div>
            <div className="flex justify-between items-center">
              <Label className="text-base font-semibold">PaCO₂ <span className="text-muted-foreground text-sm font-normal">(mmHg)</span></Label>
              <Input type="number" step="1" value={pco2} onChange={e => setPco2(e.target.value)} className="w-24 text-right" />
            </div>
            <div className="flex justify-between items-center">
              <Label className="text-base font-semibold">HCO₃ <span className="text-muted-foreground text-sm font-normal">(mEq/L)</span></Label>
              <Input type="number" step="1" value={hco3} onChange={e => setHco3(e.target.value)} className="w-24 text-right" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="md:col-span-7 h-full">
        {result !== null ? (
          <Card className="h-full border-primary/20 shadow-lg relative overflow-hidden bg-gradient-to-br from-background to-muted/20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Interpretation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-2">
              <div className="p-6 rounded-2xl bg-card border shadow-sm relative z-10">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Primary Disorder</span>
                <h3 className={`text-3xl font-bold mb-4 ${result.primary === 'Normal' ? 'text-emerald-600' : 'text-orange-600'}`}>
                  {result.primary}
                </h3>
                
                {result.primary !== "Normal" && (
                  <>
                    <div className="h-px bg-border my-4" />
                    <div className="space-y-3">
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">Compensation Status</span>
                        <p className="font-medium">{result.compensation}</p>
                      </div>
                      {result.expected && (
                        <div className="bg-muted p-3 rounded-lg border text-sm">
                          {result.expected}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              <div className="bg-muted p-4 rounded-xl flex gap-3 text-sm relative z-10">
                <Info className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Reminder:</strong> Evaluate the Anion Gap (Na - (Cl + HCO3)) in all cases of metabolic acidosis to determine if it is gap or non-gap.
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
              <p className="max-w-xs">Enter ABG values to view interpretation.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
