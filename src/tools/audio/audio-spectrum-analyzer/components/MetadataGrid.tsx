"use client";

import { Tag } from "lucide-react";
import { AudioAnalysisResult } from "../analyzer";

interface MetadataGridProps {
  result: AudioAnalysisResult;
}

export function MetadataGrid({ result }: MetadataGridProps) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-card to-muted/20 p-4 sm:p-5 border-2 space-y-3 shadow-sm min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <h4 className="text-xs font-mono uppercase font-bold tracking-wider text-muted-foreground flex items-center gap-2">
          <Tag className="size-4 text-primary shrink-0" /> Embedded File Metadata & Rip Software Signature
        </h4>
        <span className="text-[10px] font-mono text-muted-foreground uppercase">ID3 / Vorbis Tags</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1 min-w-0">
        {/* Title */}
        <div className="rounded-xl bg-background p-3.5 border min-w-0 shadow-xs space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block font-bold">🎵 Title</span>
          <span className="text-sm font-bold text-foreground block break-words leading-snug">
            {result.metadata?.title || result.fileName}
          </span>
        </div>

        {/* Artist */}
        <div className="rounded-xl bg-background p-3.5 border min-w-0 shadow-xs space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block font-bold">👤 Artist</span>
          <span className="text-sm font-bold text-foreground block break-words leading-snug">
            {result.metadata?.artist || "Not Tagged"}
          </span>
        </div>

        {/* Album */}
        <div className="rounded-xl bg-background p-3.5 border min-w-0 shadow-xs space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block font-bold">💿 Album</span>
          <span className="text-sm font-bold text-foreground block break-words leading-snug">
            {result.metadata?.album || "Not Tagged"}
          </span>
        </div>

        {/* Genre / Year */}
        <div className="rounded-xl bg-background p-3.5 border min-w-0 shadow-xs space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block font-bold">🎼 Genre / Year</span>
          <span className="text-sm font-bold text-foreground block break-words leading-snug">
            {result.metadata?.year ? `${result.metadata.year} • ` : ""}
            {result.metadata?.genre || "General"}
          </span>
        </div>

        {/* Featured Encoder / Rip Software Signature Box */}
        <div className="rounded-xl bg-primary/5 p-4 border border-primary/25 min-w-0 shadow-xs col-span-1 sm:col-span-2 lg:col-span-4 space-y-1">
          <span className="text-[11px] font-mono uppercase tracking-wider text-primary font-bold block">⚙️ Encoder / Rip Software Signature</span>
          <span className="text-sm font-bold text-primary block break-words leading-relaxed font-mono">
            {result.metadata?.encoder || "Standard / Untagged (No specific rip signature detected)"}
          </span>
        </div>
      </div>
    </div>
  );
}
