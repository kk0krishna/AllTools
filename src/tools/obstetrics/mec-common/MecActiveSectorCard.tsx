"use client";

import React from "react";
import { MecSectorData, MecDataset } from "./types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ExternalLink, ShieldCheck, ShieldAlert, AlertCircle, Ban } from "lucide-react";

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
  // High-contrast, crystal-clear clinical badges
  const getScoreBadge = (scoreStr: string) => {
    const rawNum = scoreStr.split(/[\^/, -]/)[0].trim();
    if (rawNum === "1") {
      return {
        badgeStyle: "bg-emerald-600 text-white font-black shadow-sm ring-1 ring-emerald-700/50",
        label: "Cat 1: Safe",
        desc: "Use in any circumstance. No restrictions. (YES)",
        icon: <ShieldCheck className="w-3.5 h-3.5" />
      };
    } else if (rawNum === "2") {
      return {
        badgeStyle: "bg-blue-600 text-white font-black shadow-sm ring-1 ring-blue-700/50",
        label: "Cat 2: Generally Use",
        desc: "Advantages generally outweigh theoretical or proven risks. (YES)",
        icon: <ShieldCheck className="w-3.5 h-3.5" />
      };
    } else if (rawNum === "3") {
      return {
        badgeStyle: "bg-amber-500 text-slate-950 font-black shadow-sm ring-1 ring-amber-600/50",
        label: "Cat 3: Caution",
        desc: "Risks outweigh advantages; only if other methods unavailable. (NO*)",
        icon: <AlertCircle className="w-3.5 h-3.5" />
      };
    } else if (rawNum === "4") {
      return {
        badgeStyle: "bg-rose-600 text-white font-black shadow-sm ring-1 ring-rose-700/50",
        label: "Cat 4: Contraindicated",
        desc: "Unacceptable health risk; method NOT to be used. (NO)",
        icon: <Ban className="w-3.5 h-3.5" />
      };
    }
    return {
      badgeStyle: "bg-gradient-to-r from-blue-600 to-amber-500 text-white font-black shadow-sm ring-1 ring-border/50",
      label: `Cat ${scoreStr}`,
      desc: "Conditional clinical evaluation required",
      icon: <ShieldAlert className="w-3.5 h-3.5" />
    };
  };

  return (
    <Card className="border border-border/80 shadow-lg bg-card/95 backdrop-blur-md overflow-hidden">
      <CardHeader className="p-4 sm:p-5 border-b border-border/60 bg-muted/20">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Badge variant="outline" className="font-mono text-xs uppercase tracking-wider bg-background/90 font-bold text-primary border-primary/30">
            {sector.categoryName}
          </Badge>
          <span className="text-xs text-muted-foreground font-mono font-medium">
            Sector #{sector.sectorIndex + 1} of {dataset.sectors.length}
          </span>
        </div>
        <CardTitle className="text-xl sm:text-2xl font-black font-heading text-foreground mt-1.5 tracking-tight">
          {sector.conditionName}
        </CardTitle>
        {sector.subCondition && (
          <CardDescription className="text-xs sm:text-sm text-muted-foreground mt-0.5 leading-relaxed">
            {sector.subCondition}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between pb-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            Contraceptive Method Ratings (Viewing Slot)
          </h4>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {sector.scores.map((scoreItem) => {
            const methodDef = dataset.methods.find((m) => m.id === scoreItem.methodId);
            if (!methodDef) return null;
            const badgeMeta = getScoreBadge(scoreItem.score);

            return (
              <div
                key={scoreItem.methodId}
                className="group p-3.5 rounded-xl border border-border/70 hover:border-primary/50 bg-card hover:bg-muted/20 transition-all duration-150 shadow-xs space-y-2.5"
              >
                {/* Top Row: Method Title & High-Contrast Score Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => onMethodClick?.(methodDef.id)}
                        className="font-bold text-sm sm:text-base text-foreground hover:text-primary transition-colors text-left flex items-center gap-1.5"
                      >
                        <span className="leading-tight">{methodDef.name}</span>
                        <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-primary shrink-0" />
                      </button>
                      <span className="text-xs text-muted-foreground font-mono bg-muted/60 px-1.5 py-0.5 rounded shrink-0">
                        {methodDef.shortName}
                      </span>
                    </div>

                    {methodDef.indiaBrandNames && methodDef.indiaBrandNames.length > 0 && (
                      <div className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold mt-1">
                        National Basket: {methodDef.indiaBrandNames.join(", ")}
                      </div>
                    )}
                  </div>

                  {/* High-Contrast Clinical Category Badge */}
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-sm shrink-0 shadow-xs ${badgeMeta.badgeStyle}`}
                    title={badgeMeta.desc}
                  >
                    <span className="font-black text-base leading-none">{scoreItem.score}</span>
                    <span className="text-xs font-sans font-bold tracking-tight hidden xs:inline sm:inline">
                      {badgeMeta.label.split(":")[1]}
                    </span>
                  </div>
                </div>

                {/* Secondary Row: Footnote Clinical Notes & Clarifications */}
                {((scoreItem.notes && scoreItem.notes.length > 0) || scoreItem.clarification) && (
                  <div className="pt-2 border-t border-border/50 flex flex-wrap items-center gap-2 text-xs">
                    {scoreItem.notes && scoreItem.notes.length > 0 && (
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                          Notes:
                        </span>
                        {scoreItem.notes.map((note) => (
                          <button
                            key={note}
                            type="button"
                            onClick={() => onNoteClick?.(note)}
                            className="px-2 py-0.5 text-xs font-mono font-bold bg-primary/10 hover:bg-primary/25 text-primary border border-primary/30 rounded-md transition-colors"
                            title={`Click to view Clinical Note ${note}`}
                          >
                            Note {note}
                          </button>
                        ))}
                      </div>
                    )}

                    {scoreItem.clarification && (
                      <p className="text-xs text-muted-foreground italic flex-1 min-w-[200px] leading-snug">
                        {scoreItem.clarification}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
