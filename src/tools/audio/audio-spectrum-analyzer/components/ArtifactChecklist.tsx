"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { AudioAnalysisResult } from "../analyzer";

interface ArtifactChecklistProps {
  result: AudioAnalysisResult;
}

export function ArtifactChecklist({ result }: ArtifactChecklistProps) {
  return (
    <div className="space-y-4">
      {/* 🛡️ PRIORITY 7 – ARTIFACT DETECTION CHECKLIST */}
      <div className="rounded-2xl bg-card p-5 border-2 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <h4 className="text-xs font-mono uppercase font-bold tracking-wider text-muted-foreground flex items-center gap-2">
            <CheckCircle2 className="size-4 text-emerald-500" /> Acoustic Forensics Artifact Checklist
          </h4>
          <span className="text-[11px] font-mono text-muted-foreground">
            Why this track received Grade {result.qualityGrade || "A"}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {(result.artifactChecklist || []).map((chk, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border flex items-start gap-3 transition-all ${
                chk.passed
                  ? "bg-emerald-500/5 border-emerald-500/25 text-foreground"
                  : "bg-rose-500/5 border-rose-500/25 text-foreground"
              }`}
            >
              {chk.passed ? (
                <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="size-4 text-rose-500 shrink-0 mt-0.5" />
              )}
              <div className="space-y-0.5 text-xs min-w-0">
                <p className="font-bold font-mono text-foreground break-words">{chk.label}</p>
                <p className="text-muted-foreground text-[11px] leading-relaxed break-words">{chk.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Executive Audit Notes */}
      <div className="rounded-xl bg-background/80 p-4 border text-xs text-muted-foreground space-y-1.5 font-mono">
        <div className="flex items-start gap-2">
          <span className="text-primary font-bold shrink-0">▶ Bandwidth Audit:</span>
          <span>{result.assessmentReport?.bandwidthComment}</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-primary font-bold shrink-0">▶ Dynamics Audit:</span>
          <span>{result.assessmentReport?.dynamicRangeComment}</span>
        </div>
      </div>
    </div>
  );
}
