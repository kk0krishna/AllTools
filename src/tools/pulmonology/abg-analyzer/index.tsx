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
  const [na, setNa] = useState("140");
  const [cl, setCl] = useState("105");

  const vPh = parseFloat(ph);
  const vPco2 = parseFloat(pco2);
  const vHco3 = parseFloat(hco3);
  const vNa = parseFloat(na);
  const vCl = parseFloat(cl);


  let result = null;

  if (!isNaN(vPh) && !isNaN(vPco2) && !isNaN(vHco3)) {
    let primary = "Normal";
    let expected = "";
    let compStatus = "No compensation needed";
    let treatment = "";
    let anionGap = null;
    let agType = "";

    if (!isNaN(vNa) && !isNaN(vCl)) {
      anionGap = vNa - (vCl + vHco3);
    }

    if (vPh < 7.35) {
      // Acidemia
      if (vPco2 > 45 && vHco3 >= 22) {
        primary = "Respiratory Acidosis";
        expected = "Acute: HCO3 ≈ " + (24 + ((vPco2 - 40) / 10)).toFixed(1) + 
                   " | Chronic: HCO3 ≈ " + (24 + 4 * ((vPco2 - 40) / 10)).toFixed(1);
        compStatus = "Check if HCO3 matches expected values to determine compensation type.";
        treatment = "Focus on improving ventilation. Treat underlying cause (e.g., bronchodilators for COPD, BiPAP, or intubation if severe).";
      } else if (vHco3 < 22 && vPco2 <= 45) {
        primary = "Metabolic Acidosis";
        const expectedPco2 = (1.5 * vHco3) + 8;
        expected = "Expected pCO2: " + (expectedPco2 - 2).toFixed(1) + " to " + (expectedPco2 + 2).toFixed(1);
        if (vPco2 >= (expectedPco2 - 2) && vPco2 <= (expectedPco2 + 2)) {
          compStatus = "Adequately Compensated";
        } else if (vPco2 > (expectedPco2 + 2)) {
          compStatus = "Mixed Metabolic Acidosis & Respiratory Acidosis";
        } else {
          compStatus = "Mixed Metabolic Acidosis & Respiratory Alkalosis";
        }
        
        if (anionGap !== null) {
          if (anionGap > 12) {
            agType = "High Anion Gap (HAGMA)";
            treatment = "Investigate MUDPILES: Methanol, Uremia, DKA, Propylene Glycol, Isoniazid/Iron, Lactic Acidosis, Ethylene Glycol, Salicylates.";
          } else {
            agType = "Normal Anion Gap (NAGMA)";
            treatment = "Investigate HARDASS: Hyperalimentation, Addison's, RTA, Diarrhea, Acetazolamide, Spironolactone, Saline infusion.";
          }
        }
      } else {
        primary = "Mixed Acidosis";
        compStatus = "Both respiratory and metabolic components are acidotic.";
        treatment = "Requires aggressive management of both ventilation and metabolic underlying causes.";
      }
    } else if (vPh > 7.45) {
      // Alkalemia
      if (vPco2 < 35 && vHco3 <= 26) {
        primary = "Respiratory Alkalosis";
        expected = "Acute: HCO3 ≈ " + (24 - 2 * ((40 - vPco2) / 10)).toFixed(1) + 
                   " | Chronic: HCO3 ≈ " + (24 - 5 * ((40 - vPco2) / 10)).toFixed(1);
        compStatus = "Check if HCO3 matches expected values to determine compensation type.";
        treatment = "Treat underlying cause of hyperventilation (e.g., anxiety, pain, hypoxemia, fever, sepsis).";
      } else if (vHco3 > 26 && vPco2 >= 35) {
        primary = "Metabolic Alkalosis";
        const expectedPco2 = (0.7 * vHco3) + 21;
        expected = "Expected pCO2: " + (expectedPco2 - 2).toFixed(1) + " to " + (expectedPco2 + 2).toFixed(1);
        if (vPco2 >= (expectedPco2 - 2) && vPco2 <= (expectedPco2 + 2)) {
          compStatus = "Adequately Compensated";
        } else if (vPco2 > (expectedPco2 + 2)) {
          compStatus = "Mixed Metabolic Alkalosis & Respiratory Acidosis";
        } else {
          compStatus = "Mixed Metabolic Alkalosis & Respiratory Alkalosis";
        }
        treatment = "Assess fluid status and urine chloride. Often saline-responsive (vomiting, diuretics) or saline-resistant (hyperaldosteronism).";
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

    result = { primary, compensation: compStatus, expected, anionGap, agType, treatment };
  }

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
            <div className="flex justify-between items-center border-t pt-4 mt-4">
              <Label className="text-base font-semibold">Na⁺ <span className="text-muted-foreground text-sm font-normal">(mEq/L) - Optional</span></Label>
              <Input type="number" step="1" value={na} onChange={e => setNa(e.target.value)} className="w-24 text-right" />
            </div>
            <div className="flex justify-between items-center">
              <Label className="text-base font-semibold">Cl⁻ <span className="text-muted-foreground text-sm font-normal">(mEq/L) - Optional</span></Label>
              <Input type="number" step="1" value={cl} onChange={e => setCl(e.target.value)} className="w-24 text-right" />
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
                    <div className="space-y-4">
                      {result.anionGap !== null && result.primary.includes("Metabolic Acidosis") && (
                        <div>
                          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">Anion Gap</span>
                          <p className="font-medium flex items-center gap-2">
                            {result.anionGap.toFixed(1)} mEq/L
                            <span className="text-xs bg-muted px-2 py-0.5 rounded-full">{result.agType}</span>
                          </p>
                        </div>
                      )}
                      
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">Compensation Status</span>
                        <p className="font-medium">{result.compensation}</p>
                      </div>
                      
                      {result.expected && (
                        <div className="bg-muted/50 p-3 rounded-lg border text-sm font-mono text-muted-foreground">
                          {result.expected}
                        </div>
                      )}

                      {result.treatment && (
                        <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 mt-2">
                          <span className="text-xs font-semibold uppercase tracking-wider text-primary block mb-1">Treatment Insights</span>
                          <p className="text-sm">{result.treatment}</p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              <div className="bg-muted p-4 rounded-xl flex gap-3 text-sm relative z-10">
                <Info className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Reminder:</strong> Evaluate the Delta Ratio (ΔAG / ΔHCO3) in cases of HAGMA to identify hidden mixed metabolic disorders (e.g., concomitant NAGMA or Metabolic Alkalosis).
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
