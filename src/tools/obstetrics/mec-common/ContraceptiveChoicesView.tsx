"use client";

import React, { useState } from "react";
import { MecDataset, MecMethodDefinition } from "./types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pill, Syringe, Clock, Check, X, ShieldAlert, Sparkles, ChevronDown, ChevronUp } from "lucide-react";

interface ContraceptiveChoicesViewProps {
  dataset: MecDataset;
  selectedMethodId?: string | null;
}

export function ContraceptiveChoicesView({
  dataset,
  selectedMethodId
}: ContraceptiveChoicesViewProps) {
  const [expandedMethodId, setExpandedMethodId] = useState<string | null>(
    selectedMethodId || dataset.methods[0]?.id || null
  );

  const toggleExpand = (id: string) => {
    setExpandedMethodId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold font-heading text-foreground">
            Contraceptive Method Profiles & Initiation Protocols
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            In-depth clinical guidance on mechanisms, failure rates, advantages, disadvantages, and timing.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {dataset.methods.map((method) => {
          const isExpanded = expandedMethodId === method.id;
          return (
            <Card
              key={method.id}
              className={`border transition-all duration-200 overflow-hidden ${
                isExpanded
                  ? "border-primary/50 shadow-md bg-card"
                  : "border-border/60 hover:border-border bg-card/60"
              }`}
            >
              <CardHeader
                className="p-4 sm:p-5 cursor-pointer flex flex-row items-center justify-between hover:bg-muted/30 transition-colors"
                onClick={() => toggleExpand(method.id)}
              >
                <div className="space-y-1 pr-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="text-xs font-mono font-semibold">
                      {method.shortName}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className={`text-xs ${
                        method.type === "non-hormonal"
                          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20"
                          : "bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20"
                      }`}
                    >
                      {method.type.toUpperCase()}
                    </Badge>
                    {method.duration && (
                      <Badge variant="outline" className="text-xs text-muted-foreground">
                        Duration: {method.duration}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-base sm:text-lg font-bold text-foreground mt-1">
                    {method.name}
                  </CardTitle>
                  {method.indiaBrandNames && method.indiaBrandNames.length > 0 && (
                    <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                      National Programme (India): {method.indiaBrandNames.join(" &bull; ")}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="text-right hidden sm:block">
                    <span className="text-xs text-muted-foreground block">Typical Failure Rate</span>
                    <span className="text-xs font-mono font-bold text-foreground">
                      {method.typicalFailureRate}
                    </span>
                  </div>
                  <div className="p-1 rounded-full hover:bg-muted">
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                  </div>
                </div>
              </CardHeader>

              {isExpanded && (
                <CardContent className="p-4 sm:p-5 pt-0 border-t border-border/40 space-y-4 mt-3">
                  {/* Overview & Administration */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-muted/20 rounded-xl">
                    <div>
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                        How It Works (Mechanism)
                      </span>
                      <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                        {method.mechanism}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                        Administration / Regimen
                      </span>
                      <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                        {method.administration}
                      </p>
                    </div>
                  </div>

                  {/* Advantages & Disadvantages */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl space-y-1.5">
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5" /> Key Clinical Advantages
                      </span>
                      <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
                        {method.advantages.map((adv, idx) => (
                          <li key={idx} className="leading-relaxed">
                            {adv}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 bg-rose-500/5 border border-rose-500/20 rounded-xl space-y-1.5">
                      <span className="text-xs font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                        <X className="w-3.5 h-3.5" /> Limitations & Considerations
                      </span>
                      <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
                        {method.disadvantages.map((dis, idx) => (
                          <li key={idx} className="leading-relaxed">
                            {dis}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Initiation Protocols Table */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      When to Start (Initiation Clinical Guidance)
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-lg border border-border/60 bg-card">
                        <strong className="text-foreground block mb-0.5">Routine Initiation:</strong>
                        <span className="text-muted-foreground leading-relaxed">
                          {method.initiationGuidelines.routine}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-lg border border-border/60 bg-card">
                        <strong className="text-foreground block mb-0.5">Post-Abortion:</strong>
                        <span className="text-muted-foreground leading-relaxed">
                          {method.initiationGuidelines.postAbortion}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-lg border border-border/60 bg-card">
                        <strong className="text-foreground block mb-0.5">Postpartum (Breastfeeding):</strong>
                        <span className="text-muted-foreground leading-relaxed">
                          {method.initiationGuidelines.postpartumBreastfeeding}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-lg border border-border/60 bg-card">
                        <strong className="text-foreground block mb-0.5">Postpartum (Non-Breastfeeding):</strong>
                        <span className="text-muted-foreground leading-relaxed">
                          {method.initiationGuidelines.postpartumNonBreastfeeding}
                        </span>
                      </div>
                    </div>

                    {method.initiationGuidelines.emergencyBackupNeeded && (
                      <div className="flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                        <ShieldAlert className="w-4 h-4 shrink-0" />
                        <span>
                          <strong>Backup Protection:</strong> If started outside designated cycle days, abstain from sex or use condoms for{" "}
                          <strong>{method.initiationGuidelines.backupDuration || "7 days"}</strong>.
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
