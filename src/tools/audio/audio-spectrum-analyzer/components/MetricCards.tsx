"use client";

import { Activity, ShieldCheck, Gauge, Zap } from "lucide-react";
import { AudioAnalysisResult } from "../analyzer";

interface MetricCardsProps {
  result: AudioAnalysisResult;
}

export function MetricCards({ result }: MetricCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 min-w-0">
      {/* Cutoff Frequency */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-card to-muted/40 border-2 border-border/80 flex flex-col justify-between shadow-md hover:border-primary/50 transition-all min-w-0">
        <div className="flex items-center justify-between text-muted-foreground mb-2">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider">Cutoff Ceiling</span>
          <Activity className="size-4 text-primary shrink-0" />
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-foreground">
            {(result.cutoffFreq / 1000).toFixed(1)} <span className="text-sm font-normal text-muted-foreground">kHz</span>
          </div>
          <p className="text-[11px] font-mono text-muted-foreground mt-1 truncate" title={result.qualityGradeLabel}>
            {result.qualityGradeLabel}
          </p>
        </div>
      </div>

      {/* Dynamic Range */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-card to-muted/40 border-2 border-border/80 flex flex-col justify-between shadow-md hover:border-primary/50 transition-all min-w-0">
        <div className="flex items-center justify-between text-muted-foreground mb-2">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider">Dynamic Range</span>
          <Gauge className="size-4 text-primary shrink-0" />
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-foreground">
            DR{result.dynamicRangeScore || 10} <span className="text-sm font-normal text-muted-foreground">Score</span>
          </div>
          <p className="text-[11px] font-mono text-muted-foreground mt-1">
            RMS: {(result.rmsDbFS || 0).toFixed(1)} dBFS
          </p>
        </div>
      </div>

      {/* Bitrate & Sample Rate */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-card to-muted/40 border-2 border-border/80 flex flex-col justify-between shadow-md hover:border-primary/50 transition-all min-w-0">
        <div className="flex items-center justify-between text-muted-foreground mb-2">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider">Estimated Bitrate</span>
          <Zap className="size-4 text-primary shrink-0" />
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-foreground">
            ~{result.bitrate} <span className="text-sm font-normal text-muted-foreground">kbps</span>
          </div>
          <p className="text-[11px] font-mono text-muted-foreground mt-1">
            {(result.sampleRate / 1000).toFixed(1)} kHz • {result.format.split(" ")[0]}
          </p>
        </div>
      </div>

      {/* Peak Health */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-card to-muted/40 border-2 border-border/80 flex flex-col justify-between shadow-md hover:border-primary/50 transition-all min-w-0">
        <div className="flex items-center justify-between text-muted-foreground mb-2">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider">Peak Health</span>
          <ShieldCheck className={`size-4 shrink-0 ${result.isClipped ? "text-rose-500" : "text-emerald-500"}`} />
        </div>
        <div>
          <div className={`text-2xl sm:text-3xl font-black font-heading tracking-tight ${result.isClipped ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"}`}>
            {result.isClipped ? "⚠️ CLIPPED" : "CLEAN ✓"}
          </div>
          <p className="text-[11px] font-mono text-muted-foreground mt-1">
            Peak: {(result.peakDbFS || 0).toFixed(1)} dBFS
          </p>
        </div>
      </div>
    </div>
  );
}
