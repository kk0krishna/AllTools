"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, ChevronDown, Tag, BarChart2, CheckCircle2 } from "lucide-react";
import { AudioAnalysisResult, ColorPalette } from "../analyzer";
import { ResultHero } from "./ResultHero";
import { SpectrogramView } from "./SpectrogramView";
import { AudioPlayerBar } from "./AudioPlayerBar";
import { MetricCards } from "./MetricCards";
import { MetadataGrid } from "./MetadataGrid";
import { CompareLadder } from "./CompareLadder";
import { ArtifactChecklist } from "./ArtifactChecklist";
import { ShareFooter } from "./ShareFooter";

interface SpectrogramCardProps {
  result: AudioAnalysisResult;
  palette: ColorPalette;
  onDelete: (id: string) => void;
}

export function SpectrogramCard({ result, palette, onDelete }: SpectrogramCardProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  // Audio time update handler
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const update = () => setCurrentTime(audio.currentTime);
    const end = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", update);
    audio.addEventListener("ended", end);
    return () => {
      audio.removeEventListener("timeupdate", update);
      audio.removeEventListener("ended", end);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSeek = (time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = time;
    setCurrentTime(time);
  };

  const generateBrandedImageBlob = async (): Promise<Blob | null> => {
    const srcCanvas = canvasRef.current;
    if (!srcCanvas) return null;
    const w = srcCanvas.width;
    const h = srcCanvas.height;
    const rightSidebarW = 115;
    const headerH = 135;
    const footerH = 60;

    const outCanvas = document.createElement("canvas");
    outCanvas.width = w + rightSidebarW;
    outCanvas.height = h + headerH + footerH;
    const ctx = outCanvas.getContext("2d");
    if (!ctx) return null;

    // 1. Dark Luxury Background
    ctx.fillStyle = "#090d16";
    ctx.fillRect(0, 0, outCanvas.width, outCanvas.height);

    // 2. Header Box
    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 15px sans-serif";
    ctx.fillText("🎵 TOOLVERSE AUDIOPHILE QUALITY AUDIT REPORT", 20, 32);

    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 22px sans-serif";
    const titleStr = `${result.metadata?.title || result.fileName} (${result.metadata?.artist || "Unknown Artist"})`;
    ctx.fillText(titleStr.substring(0, 52), 20, 65);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "14px monospace";
    ctx.fillText(
      `Format: ${result.format} | Sample: ${(result.sampleRate / 1000).toFixed(1)} kHz | Bitrate: ~${result.bitrate} kbps | DR${result.dynamicRangeScore || 10}`,
      20,
      95
    );

    // Draw Grade Badge in header right
    const badgeColor =
      result.qualityGrade === "A+" || result.qualityGrade === "A"
        ? "#059669"
        : result.qualityGrade === "B+" || result.qualityGrade === "B"
        ? "#2563eb"
        : "#d97706";
    ctx.fillStyle = badgeColor;
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(outCanvas.width - 195, 24, 175, 52, 12);
      ctx.fill();
    } else {
      ctx.fillRect(outCanvas.width - 195, 24, 175, 52);
    }
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 19px monospace";
    ctx.fillText(`GRADE ${result.qualityGrade || "A"}`, outCanvas.width - 175, 57);

    // 3. Draw Spectrogram Canvas
    ctx.drawImage(srcCanvas, 0, headerH);

    // 4. Draw Right Sidebar Y-Axis Frequency Grid & Cutoff Line
    ctx.fillStyle = "#111827";
    ctx.fillRect(w, headerH, rightSidebarW, h);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "bold 12px monospace";
    const nyquist = result.sampleRate / 2;
    const freqsToMark = [nyquist, 20000, 16000, 10000, 5000, 1000, 0];
    freqsToMark.forEach((freq) => {
      if (freq > nyquist + 100) return;
      const ratio = 1 - freq / nyquist;
      const yPos = headerH + ratio * h;
      const label = freq >= 1000 ? `${(freq / 1000).toFixed(0)}k Hz` : `${freq} Hz`;
      ctx.fillText(label, w + 12, Math.max(headerH + 15, Math.min(headerH + h - 6, yPos + 4)));
      ctx.strokeStyle = "#334155";
      ctx.beginPath();
      ctx.moveTo(w, yPos);
      ctx.lineTo(w + 8, yPos);
      ctx.stroke();
    });

    // Cutoff ceiling indicator in right sidebar
    const cutoffRatio = 1 - result.cutoffFreq / nyquist;
    const cutoffY = headerH + cutoffRatio * h;
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(w, cutoffY - 12, rightSidebarW, 24);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 11px monospace";
    ctx.fillText(`CUTOFF: ${(result.cutoffFreq / 1000).toFixed(1)}k`, w + 6, cutoffY + 4);

    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(0, cutoffY);
    ctx.lineTo(w, cutoffY);
    ctx.stroke();
    ctx.setLineDash([]);

    // 5. Footer Box
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, headerH + h, outCanvas.width, footerH);
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "bold 13px sans-serif";
    ctx.fillText(
      `💡 Verdict: ${result.verdictText} — ${result.assessmentReport?.authenticityComment || result.assessmentReport?.summary}`,
      20,
      headerH + h + 25
    );
    ctx.fillStyle = "#38bdf8";
    ctx.font = "12px monospace";
    ctx.fillText("🔍 Verified 100% locally on device • ToolVerse Audio Spectrum Analyzer", 20, headerH + h + 46);

    return new Promise((resolve) => {
      outCanvas.toBlob((blob) => resolve(blob), "image/png", 0.95);
    });
  };

  return (
    <Card className="overflow-hidden border-2 rounded-3xl transition-all duration-300 shadow-xl min-w-0">
      {/* 1. Unmistakable Verdict Result Hero (with vibrant luxury certificate colors) */}
      <ResultHero
        result={result}
        onDelete={onDelete}
      />

      <div className="bg-muted/15 px-4 sm:px-6 pt-3 pb-2 border-b">
        <p className="text-xs sm:text-sm font-semibold leading-relaxed text-foreground/90 flex items-start gap-2 bg-background/60 p-3 sm:p-3.5 rounded-xl border">
          <ShieldCheck className="size-5 text-primary shrink-0 mt-0.5" />
          <span>
            <strong className="text-foreground">{result.verdictText.split("—")[0]}</strong> —{" "}
            {result.assessmentReport?.authenticityComment || result.assessmentReport?.summary}
          </span>
        </p>
      </div>

      <CardContent className="space-y-6 p-4 sm:p-8">
        {/* 2. Spectrogram is the unmistakable centerpiece! */}
        <SpectrogramView
          result={result}
          palette={palette}
          currentTime={currentTime}
          onSeek={handleSeek}
          canvasRef={canvasRef}
        />

        {/* 3. Interactive Music Player & Scrubber RIGHT BELOW THE SPECTROGRAM! */}
        <AudioPlayerBar
          result={result}
          isPlaying={isPlaying}
          onTogglePlay={togglePlay}
          currentTime={currentTime}
          isMuted={isMuted}
          onToggleMute={toggleMute}
          audioRef={audioRef}
        />

        {/* 4. Metric cards with large numbers */}
        <MetricCards result={result} />

        <audio ref={audioRef} src={result.audioUrl} preload="auto" />

        {/* 5. Collapsible Advanced Technical & Diagnostic Sections */}
        <div className="space-y-3 pt-2">
          <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-bold px-1">
            🔍 Advanced Diagnostic & Forensics Inspection (Click to Expand):
          </p>

          {/* Collapsible Metadata Grid */}
          <details className="group rounded-2xl border bg-card/60 overflow-hidden transition-all duration-300">
            <summary className="cursor-pointer p-4 flex items-center justify-between font-mono text-xs font-bold uppercase tracking-wide text-foreground hover:bg-muted/40 transition-colors list-none select-none">
              <span className="flex items-center gap-2">
                <Tag className="size-4 text-primary" />
                <span>Embedded ID3 Tags & Rip Software Audit</span>
              </span>
              <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-normal">
                <span>{result.metadata?.encoder ? `Encoded via ${result.metadata.encoder}` : "View tags"}</span>
                <ChevronDown className="size-4 group-open:rotate-180 transition-transform duration-300" />
              </span>
            </summary>
            <div className="p-4 pt-0 border-t bg-card/90">
              <MetadataGrid result={result} />
            </div>
          </details>

          {/* Collapsible Compare Mode Ladder */}
          <details className="group rounded-2xl border bg-card/60 overflow-hidden transition-all duration-300">
            <summary className="cursor-pointer p-4 flex items-center justify-between font-mono text-xs font-bold uppercase tracking-wide text-foreground hover:bg-muted/40 transition-colors list-none select-none">
              <span className="flex items-center gap-2">
                <BarChart2 className="size-4 text-primary" />
                <span>Compare Mode: Audio Resolution Ladder</span>
              </span>
              <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-normal">
                <span>Cutoff: ~{(result.cutoffFreq / 1000).toFixed(1)} kHz ({result.qualityGradeLabel})</span>
                <ChevronDown className="size-4 group-open:rotate-180 transition-transform duration-300" />
              </span>
            </summary>
            <div className="p-4 pt-0 border-t bg-card/90">
              <CompareLadder result={result} />
            </div>
          </details>

          {/* Collapsible Artifact Checklist */}
          <details className="group rounded-2xl border bg-card/60 overflow-hidden transition-all duration-300">
            <summary className="cursor-pointer p-4 flex items-center justify-between font-mono text-xs font-bold uppercase tracking-wide text-foreground hover:bg-muted/40 transition-colors list-none select-none">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-500" />
                <span>Acoustic Forensics Artifact Checklist & Notes</span>
              </span>
              <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-normal">
                <span>Grade {result.qualityGrade || "A"} Diagnostic Proof</span>
                <ChevronDown className="size-4 group-open:rotate-180 transition-transform duration-300" />
              </span>
            </summary>
            <div className="p-4 pt-0 border-t bg-card/90">
              <ArtifactChecklist result={result} />
            </div>
          </details>
        </div>

        {/* 6. Sleek Export & Share Footer */}
        <ShareFooter result={result} generateBrandedImageBlob={generateBrandedImageBlob} />
      </CardContent>
    </Card>
  );
}
