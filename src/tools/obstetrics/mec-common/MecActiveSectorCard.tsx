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
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            Contraceptive Method Ratings (Viewing Slot)
          </h4>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {sector.scores.map((scoreItem) => {
            const methodDef = dataset.methods.find((m) => m.id === scoreItem.methodId);
            if (!methodDef) return null;
            const badgeMeta = getScoreBadge(scoreItem.score);

            return (
              <div
                key={scoreItem.methodId}
                className="group flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-border/70 hover:border-primary/50 bg-card hover:bg-muted/30 transition-all duration-150 gap-2 sm:gap-4 shadow-2xs"
              >
                {/* Method Name & Quick Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onMethodClick?.(methodDef.id)}
                      className="font-bold text-sm sm:text-base text-foreground hover:text-primary transition-colors text-left flex items-center gap-1.5"
                    >
                      <span>{methodDef.name}</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-primary shrink-0" />
                    </button>
                    <span className="text-xs text-muted-foreground font-mono hidden md:inline">
                      ({methodDef.shortName})
                    </span>
                  </div>

                  {methodDef.indiaBrandNames && methodDef.indiaBrandNames.length > 0 && (
                    <div className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5 font-bold">
                      National Basket: {methodDef.indiaBrandNames[0]}
                    </div>
                  )}

                  {scoreItem.clarification && (
                    <p className="text-xs text-muted-foreground mt-1 leading-snug line-clamp-2">
                      {scoreItem.clarification}
                    </p>
                  )}
                </div>

                {/* High-Contrast Score Pill & Footnotes */}
                <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-sm sm:text-base min-w-[42px] justify-center text-center ${badgeMeta.badgeStyle}`}
                    title={badgeMeta.desc}
                  >
                    <span>{scoreItem.score}</span>
                    <span className="text-[11px] font-sans font-semibold opacity-95 hidden sm:inline ml-1">
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
                          className="px-2 py-1 text-xs font-mono font-bold bg-primary/15 hover:bg-primary/25 text-primary border border-primary/30 rounded-md transition-colors"
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
      </CardContent>
    </Card>
  );
}
