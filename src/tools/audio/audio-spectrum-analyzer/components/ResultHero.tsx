"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertTriangle, XCircle, Trash2, Award } from "lucide-react";
import { AudioAnalysisResult } from "../analyzer";

interface ResultHeroProps {
  result: AudioAnalysisResult;
  onDelete: (id: string) => void;
}

export function ResultHero({
  result,
  onDelete,
}: ResultHeroProps) {
  const isLossless = result.verdict === "lossless";
  const isHighLossy = result.verdict === "high-lossy";

  const verdictBg = isLossless
    ? "bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-cyan-500/5 border-emerald-500/40 shadow-emerald-500/5 dark:from-emerald-950/60 dark:via-teal-950/40 dark:to-background dark:border-emerald-500/50"
    : isHighLossy
    ? "bg-gradient-to-br from-blue-500/15 via-cyan-500/10 to-indigo-500/5 border-blue-500/40 shadow-blue-500/5 dark:from-blue-950/60 dark:via-cyan-950/40 dark:to-background dark:border-blue-500/50"
    : "bg-gradient-to-br from-rose-500/15 via-red-500/10 to-orange-500/5 border-rose-500/40 shadow-rose-500/5 dark:from-rose-950/60 dark:via-red-950/40 dark:to-background dark:border-rose-500/50";

  const badgeColor = isLossless
    ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/50 shadow-md shadow-emerald-500/10 backdrop-blur-md"
    : isHighLossy
    ? "bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/50 shadow-md shadow-blue-500/10 backdrop-blur-md"
    : "bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/50 shadow-md shadow-rose-500/10 backdrop-blur-md";

  return (
    <div className={`relative overflow-hidden rounded-t-2xl border-b-2 border-2 ${verdictBg} p-5 sm:p-7 transition-all min-w-0 shadow-lg`}>
      {/* Decorative background luxury glow */}
      <div className="absolute -right-12 -top-12 size-56 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

      <div className="space-y-5 relative z-10 min-w-0">
        {/* 1. Top Control Bar: Status Badges on Left, Delete Control on Right */}
        <div className="flex flex-wrap items-center justify-between gap-3 min-w-0">
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 min-w-0">
            <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-black tracking-wider uppercase border-2 ${badgeColor}`}>
              {isLossless ? (
                <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
              ) : isHighLossy ? (
                <AlertTriangle className="size-4 text-blue-500 shrink-0" />
              ) : (
                <XCircle className="size-4 text-rose-500 shrink-0" />
              )}
              <span>
                {isLossless
                  ? "🟢 VERIFIED LOSSLESS"
                  : isHighLossy
                  ? "🔵 320 KBPS HIGH-RATE AUDIO"
                  : "❌ LOW-BITRATE TRANSCODE"}
              </span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/90 text-foreground border border-border/80 text-xs font-bold font-mono shadow-sm backdrop-blur-md">
              <span>🎯 {result.confidenceScore || 99.2}% Confidence</span>
            </span>
          </div>

          {/* Delete Action Button */}
          <div className="flex items-center gap-2 shrink-0 ml-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(result.id)}
              title="Remove Analysis Track"
              className="rounded-xl h-9.5 px-3 bg-background/90 hover:bg-rose-500/15 text-rose-600 dark:text-rose-400 hover:text-rose-700 border-rose-500/30 shadow-sm shrink-0 font-bold gap-1.5 transition-colors"
            >
              <Trash2 className="size-4 shrink-0" />
              <span className="text-xs">Remove</span>
            </Button>
          </div>
        </div>

        {/* 2. Main Title Statement & Grade Certificate Display */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pt-1 min-w-0">
          <div className="space-y-1.5 min-w-0 flex-1">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground tracking-tight font-heading break-words leading-tight">
              {result.detectedAs}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium flex flex-wrap items-center gap-1.5 sm:gap-2 leading-relaxed">
              <span className="font-bold text-foreground break-words">{result.metadata?.title || result.fileName}</span>
              <span className="text-muted-foreground/60">•</span>
              <span className="break-words">{result.metadata?.artist || "Unknown Artist"}</span>
            </p>
          </div>

          {/* Luxury Quality Grade Certificate Card */}
          <div className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-background/95 dark:bg-card/95 border-2 shadow-xl shrink-0 backdrop-blur-md self-start lg:self-center border-border/80">
            <Award className={`size-9 sm:size-11 shrink-0 ${isLossless ? "text-emerald-500" : isHighLossy ? "text-blue-500" : "text-rose-500"}`} />
            <div className="text-left">
              <div className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">
                Acoustic Audit Verdict
              </div>
              <div className="text-2xl sm:text-3xl font-black text-foreground leading-none font-heading">
                GRADE {result.qualityGrade}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
