"use client";

import React from "react";
import { MecSectorData, MecDataset } from "./types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertTriangle, XCircle, Info, Sparkles, ExternalLink } from "lucide-react";

interface MecActiveSectorCardProps {
  dataset: MecDataset;
  sector: MecSectorData;
  onNoteClick?: (noteCode: string) => void;
  onMethodClick?: (methodId: string) => void;
}

export function MecActiveSectorCard({
  dataset,
  sector,
  onNoteClick,
  onMethodClick
}: MecActiveSectorCardProps) {
  // Helper to format score styling
  const getScoreBadge = (scoreStr: string) => {
    const rawNum = scoreStr.split(/[\^/, -]/)[0].trim();
    if (rawNum === "1") {
      return {
        bg: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
        indicator: "bg-emerald-500",
        label: "Cat 1: Safe",
        desc: "Use in any circumstance (YES)"
      };
    } else if (rawNum === "2") {
      return {
        bg: "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30",
        indicator: "bg-blue-500",
        label: "Cat 2: Generally Use",
        desc: "Advantages outweigh theoretical or proven risks"
      };
    } else if (rawNum === "3") {
      return {
        bg: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
        indicator: "bg-amber-500",
        label: "Cat 3: Caution",
        desc: "Risks outweigh advantages; only if other methods unavailable (NO)"
      };
    } else if (rawNum === "4") {
      return {
        bg: "bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30",
        indicator: "bg-rose-500",
        label: "Cat 4: Contraindicated",
        desc: "Unacceptable health risk; method NOT to be used (NO)"
      };
    }
    return {
      bg: "bg-slate-500/15 text-slate-700 dark:text-slate-400 border-slate-500/30",
      indicator: "bg-slate-500",
      label: `Cat ${scoreStr}`,
      desc: "Conditional clinical judgement required"
    };
  };

  return (
    <Card className="border border-border/70 shadow-lg bg-card/90 backdrop-blur-md overflow-hidden">
      <CardHeader className="p-4 sm:p-5 border-b border-border/50 bg-muted/20">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge variant="outline" className="font-mono text-xs uppercase tracking-wider bg-background/80">
            {sector.categoryName}
          </Badge>
          <span className="text-xs text-muted-foreground font-mono">
            Sector #{sector.sectorIndex + 1} of {dataset.sectors.length}
          </span>
        </div>
        <CardTitle className="text-xl sm:text-2xl font-bold font-heading text-foreground mt-1">
          {sector.conditionName}
        </CardTitle>
        {sector.subCondition && (
          <CardDescription className="text-sm text-muted-foreground mt-0.5">
            {sector.subCondition}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="p-4 sm:p-5 space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          Contraceptive Eligibility Ratings (Inner Wheel Slot)
        </h4>

        <div className="grid grid-cols-1 gap-2.5">
          {sector.scores.map((scoreItem) => {
            const methodDef = dataset.methods.find((m) => m.id === scoreItem.methodId);
            if (!methodDef) return null;
            const badgeMeta = getScoreBadge(scoreItem.score);

            return (
              <div
                key={scoreItem.methodId}
                className="group flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl border border-border/60 hover:border-primary/40 bg-card hover:bg-muted/30 transition-all duration-150 gap-2 sm:gap-4"
              >
                {/* Method Name & Quick Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${badgeMeta.indicator}`} />
                    <button
                      type="button"
                      onClick={() => onMethodClick?.(methodDef.id)}
                      className="font-semibold text-sm sm:text-base text-foreground hover:text-primary transition-colors text-left flex items-center gap-1"
                    >
                      <span>{methodDef.name}</span>
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                    </button>
                    <span className="text-xs text-muted-foreground font-mono hidden md:inline">
                      ({methodDef.shortName})
                    </span>
                  </div>

                  {methodDef.indiaBrandNames && methodDef.indiaBrandNames.length > 0 && (
                    <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5 font-medium">
                      India: {methodDef.indiaBrandNames[0]}
                    </div>
                  )}

                  {scoreItem.clarification && (
                    <p className="text-xs text-muted-foreground mt-1 leading-snug line-clamp-2">
                      {scoreItem.clarification}
                    </p>
                  )}
                </div>

                {/* Score Pill & Footnotes */}
                <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono font-bold text-sm ${badgeMeta.bg}`}
                    title={badgeMeta.desc}
                  >
                    <span>{scoreItem.score}</span>
                    <span className="text-xs font-sans font-normal opacity-90 hidden sm:inline">
                      {badgeMeta.label.split(":")[1]}
                    </span>
                  </div>

                  {/* Footnote button tags */}
                  {scoreItem.notes && scoreItem.notes.length > 0 && (
                    <div className="flex items-center gap-1">
                      {scoreItem.notes.map((note) => (
                        <button
                          key={note}
                          type="button"
                          onClick={() => onNoteClick?.(note)}
                          className="px-2 py-1 text-xs font-mono font-bold bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-md transition-colors"
                          title={`Click to view Clinical Note ${note}`}
                        >
                          Note {note}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Global Clinical Guidance Banner */}
        <div className="p-3 bg-muted/40 rounded-xl border border-border/50 text-xs text-muted-foreground flex items-start gap-2 mt-4">
          <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Clinical Reminder:</strong> Category 1 and 2 indicate the method can be safely used. Category 3 and 4 indicate the method is not recommended or contraindicated. Condoms (male or female) must always be used consistently if protection against STIs/HIV is required.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
