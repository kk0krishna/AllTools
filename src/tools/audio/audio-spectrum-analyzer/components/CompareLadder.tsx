"use client";

import { BarChart2 } from "lucide-react";
import { AudioAnalysisResult } from "../analyzer";

interface CompareLadderProps {
  result: AudioAnalysisResult;
}

export function CompareLadder({ result }: CompareLadderProps) {
  const cutoffFreq = result.cutoffFreq;

  const items = [
    { label: "Studio Master / High-Res", freq: "24.0+ kHz", width: "100%", color: "bg-emerald-500", active: cutoffFreq >= 23000 },
    { label: "Lossless CD / True FLAC", freq: "20.0–22.0 kHz", width: "92%", color: "bg-emerald-500", active: cutoffFreq >= 19800 && cutoffFreq < 23000 },
    { label: "320 kbps MP3 / AAC Max", freq: "19.5–20.0 kHz", width: "84%", color: "bg-blue-500", active: cutoffFreq >= 18500 && cutoffFreq < 19800 },
    { label: "192–256 kbps Standard", freq: "17.5–18.5 kHz", width: "75%", color: "bg-amber-500", active: cutoffFreq >= 16500 && cutoffFreq < 18500 },
    { label: "128 kbps / Low Quality", freq: "16.0 kHz Cutoff", width: "65%", color: "bg-rose-500", active: cutoffFreq < 16500 },
  ];

  return (
    <div className="rounded-2xl bg-card p-4 sm:p-5 border-2 space-y-4 shadow-sm min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <h4 className="text-xs font-mono uppercase font-bold tracking-wider text-muted-foreground flex items-center gap-2">
          <BarChart2 className="size-4 text-primary shrink-0" /> Compare Mode: Frequency Spectrum Ladder
        </h4>
        <span className="text-[11px] font-mono text-muted-foreground">Where your track stands in audio resolution</span>
      </div>

      <div className="space-y-2.5 font-mono text-xs min-w-0">
        {items.map((item, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 transition-all min-w-0 ${
              item.active
                ? "bg-primary/10 border-primary font-bold text-foreground shadow-sm scale-[1.01]"
                : "bg-muted/40 border-border/50 text-muted-foreground opacity-70"
            }`}
          >
            {/* Top row / Left col: Status dot + Label */}
            <div className="flex items-center justify-between sm:justify-start gap-2 min-w-0 w-full sm:w-56 shrink-0">
              <div className="flex items-center gap-2 min-w-0 truncate">
                {item.active ? (
                  <span className="size-2.5 rounded-full bg-primary animate-ping shrink-0" />
                ) : (
                  <span className="size-2.5 rounded-full bg-muted-foreground/30 shrink-0" />
                )}
                <span className="truncate text-xs sm:text-sm font-semibold">{item.label}</span>
              </div>
              {/* On mobile only, show frequency right next to label if not showing bar */}
              <span className="sm:hidden text-[11px] shrink-0 font-bold ml-2">
                {item.active ? `👉 ~${(cutoffFreq / 1000).toFixed(1)}k` : item.freq}
              </span>
            </div>

            {/* Middle bar (Visible on both mobile & desktop now without breaking width) */}
            <div className="w-full sm:flex-1 bg-muted/70 h-3 sm:h-4 rounded-full overflow-hidden p-0.5 sm:mx-2">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  item.active ? "bg-gradient-to-r from-primary to-cyan-400" : item.color
                }`}
                style={{ width: item.width }}
              />
            </div>

            {/* Desktop Frequency Value */}
            <span className="hidden sm:block w-28 text-right shrink-0 text-xs font-bold">
              {item.active ? `👉 ~${(cutoffFreq / 1000).toFixed(1)} kHz` : item.freq}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
