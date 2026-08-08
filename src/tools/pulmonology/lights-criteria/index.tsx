"use client";

import { useState, useEffect } from "react";
import { ToolComponentProps } from "@/tools/registry";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Activity, Info, Droplets } from "lucide-react";

export function LightsCriteria({ metadata }: ToolComponentProps) {
  const [pfProtein, setPfProtein] = useState("");
  const [sProtein, setSProtein] = useState("");
  const [pfLdh, setPfLdh] = useState("");
  const [sLdh, setSLdh] = useState("");
  const [ulnLdh, setUlnLdh] = useState("200"); // Common default

  const pfP = parseFloat(pfProtein);
  const sP = parseFloat(sProtein);
  const pfL = parseFloat(pfLdh);
  const sL = parseFloat(sLdh);
  const uln = parseFloat(ulnLdh);

  const reasons: string[] = [];
  let canEvaluate = false;
  let isExudate = false;

  if (!isNaN(pfP) && !isNaN(sP) && sP > 0) {
    canEvaluate = true;
    if (pfP / sP > 0.5) {
      isExudate = true;
      reasons.push(`Fluid/Serum Protein ratio is > 0.5 (${(pfP/sP).toFixed(2)})`);
    }
  }

  if (!isNaN(pfL) && !isNaN(sL) && sL > 0) {
    canEvaluate = true;
    if (pfL / sL > 0.6) {
      isExudate = true;
      reasons.push(`Fluid/Serum LDH ratio is > 0.6 (${(pfL/sL).toFixed(2)})`);
    }
  }

  if (!isNaN(pfL) && !isNaN(uln) && uln > 0) {
    canEvaluate = true;
    if (pfL > (2/3 * uln)) {
      isExudate = true;
      reasons.push(`Fluid LDH is > 2/3 the upper limit of normal serum LDH`);
    }
  }

  const result = canEvaluate ? { isExudate, reasons } : null;

  return (
    <div className="grid md:grid-cols-12 gap-8 items-start">
      <Card className="md:col-span-5 h-fit border-primary/10 shadow-md">
        <CardHeader className="pb-4 border-b bg-muted/20">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Droplets className="w-5 h-5 text-primary" />
            Lab Values
          </CardTitle>
          <CardDescription>Enter pleural fluid and serum chemistry.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Protein (g/dL or g/L)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Pleural Fluid</Label>
                <Input type="number" value={pfProtein} onChange={e => setPfProtein(e.target.value)} placeholder="e.g. 3.2" />
              </div>
              <div className="space-y-2">
                <Label>Serum</Label>
                <Input type="number" value={sProtein} onChange={e => setSProtein(e.target.value)} placeholder="e.g. 6.0" />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">LDH (U/L)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Pleural Fluid</Label>
                <Input type="number" value={pfLdh} onChange={e => setPfLdh(e.target.value)} placeholder="e.g. 150" />
              </div>
              <div className="space-y-2">
                <Label>Serum</Label>
                <Input type="number" value={sLdh} onChange={e => setSLdh(e.target.value)} placeholder="e.g. 180" />
              </div>
            </div>
            <div className="space-y-2 pt-2">
              <Label>Serum LDH Upper Limit of Normal (ULN)</Label>
              <Input type="number" value={ulnLdh} onChange={e => setUlnLdh(e.target.value)} />
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
              <div className={`p-6 rounded-2xl border shadow-sm relative z-10 ${result.isExudate ? "bg-orange-500/10 border-orange-500/20" : "bg-emerald-500/10 border-emerald-500/20"}`}>
                <h3 className={`text-3xl font-bold mb-2 ${result.isExudate ? "text-orange-600" : "text-emerald-600"}`}>
                  {result.isExudate ? "Exudate" : "Transudate"}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {result.isExudate 
                    ? "The fluid is exudative. This typically suggests local pleural disease (e.g., pneumonia, malignancy, pulmonary embolism, infection)." 
                    : "The fluid is transudative (none of Light's criteria are met). This typically suggests systemic processes (e.g., heart failure, cirrhosis, nephrotic syndrome)."}
                </p>
              </div>

              {result.isExudate && result.reasons.length > 0 && (
                <div className="space-y-2 relative z-10">
                  <h4 className="font-semibold text-sm">Criteria Met:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    {result.reasons.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
              )}

              <div className="bg-muted p-4 rounded-xl flex gap-3 text-sm relative z-10">
                <Info className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Clinical Insight:</strong> Light&apos;s criteria are highly sensitive (98%) for identifying exudates, but have lower specificity. If Light&apos;s criteria suggest exudate but clinical suspicion strongly favors transudate (like heart failure), calculating the serum-to-pleural fluid albumin gradient (gradient &gt; 1.2 g/dL suggests transudate) may be helpful.
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
              <p className="max-w-xs">Enter Protein and/or LDH levels to evaluate Light&apos;s Criteria.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
