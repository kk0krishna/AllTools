"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Plus, Activity, Lock, Zap, ShieldCheck } from "lucide-react";
import { ColorPalette } from "../analyzer";

interface UploadSectionProps {
  palette: ColorPalette;
  setPalette: (p: ColorPalette) => void;
  onFiles: (files: FileList | null) => void;
  onLoadDemo: () => void;
  isLoading: boolean;
  loadingStep: number;
  hasResults: boolean;
  palettes: { id: ColorPalette; name: string; gradient: string }[];
}

export function UploadSection({
  palette,
  setPalette,
  onFiles,
  onLoadDemo,
  isLoading,
  loadingStep,
  hasResults,
  palettes,
}: UploadSectionProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    onFiles(e.dataTransfer.files);
  };

  return (
    <div className="space-y-6">
      {/* 9. Tiny Trust Badges */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-mono font-bold text-muted-foreground">
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted/60 border border-border/40 text-foreground shadow-2xs">
          <Lock className="size-3.5 text-emerald-500 shrink-0" />
          <span>🔒 Local Processing</span>
        </span>
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted/60 border border-border/40 text-foreground shadow-2xs">
          <Zap className="size-3.5 text-amber-500 shrink-0" />
          <span>⚡ Instant Analysis</span>
        </span>
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted/60 border border-border/40 text-foreground shadow-2xs">
          <ShieldCheck className="size-3.5 text-blue-500 shrink-0" />
          <span>🎵 No Upload</span>
        </span>
      </div>

      {/* 4. Horizontally Scrollable Palette Chips */}
      <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 pt-1 px-1 no-scrollbar">
        <span className="text-[11px] font-mono font-bold text-muted-foreground uppercase shrink-0 mr-1">
          Palette:
        </span>
        {palettes.map((p) => (
          <button
            key={p.id}
            onClick={() => setPalette(p.id)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border shrink-0 ${
              palette === p.id
                ? "border-primary bg-primary/15 text-primary shadow-xs scale-[1.02]"
                : "border-border/60 hover:bg-muted/80 text-muted-foreground"
            }`}
          >
            <span className={`size-2.5 rounded-full bg-gradient-to-tr ${p.gradient}`} />
            <span>{p.name}</span>
          </button>
        ))}
      </div>

      {/* 1 & 5. Clean Visual Upload Card (No Duplicate Hero Headings!) */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !isLoading && fileInputRef.current?.click()}
        className={`group relative flex flex-col items-center justify-center p-8 sm:p-12 rounded-3xl border-2 border-dashed transition-all cursor-pointer bg-gradient-to-b from-card via-card/90 to-muted/20 shadow-lg text-center ${
          isDragging
            ? "border-primary bg-primary/10 scale-[0.99] shadow-xl"
            : "border-border/80 hover:border-primary/60 hover:bg-muted/30"
        }`}
      >
        <div className="p-4 rounded-full bg-primary/15 text-primary mb-3 group-hover:scale-110 transition-transform shadow-sm">
          <Upload className="size-8 sm:size-10" />
        </div>
        <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground mb-1 font-heading">
          Drop Audio Files
        </h3>
        <p className="text-xs sm:text-sm font-mono font-medium text-muted-foreground mb-6">
          MP3 • FLAC • WAV • AAC • OGG • M4A
        </p>
        <div
          className="flex flex-wrap items-center justify-center gap-3"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            size="lg"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="rounded-xl font-bold px-8 shadow-md text-sm h-11"
          >
            <Plus className="size-4 mr-2" />
            Browse Files
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={onLoadDemo}
            disabled={isLoading}
            className="rounded-xl font-bold px-6 border-primary/30 hover:bg-primary/5 text-primary text-sm h-11"
          >
            <Activity className="size-4 mr-2 text-primary animate-pulse" />
            Try Demo Track
          </Button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          multiple
          className="hidden"
          onChange={(e) => onFiles(e.target.files)}
        />
      </div>

      {/* Additional drag/drop banner above cards when files are present */}
      {hasResults && !isLoading && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex items-center justify-center p-3.5 rounded-xl border border-dashed transition-all cursor-pointer text-xs sm:text-sm font-medium text-muted-foreground ${
            isDragging
              ? "border-primary bg-primary/10 text-primary"
              : "border-border hover:bg-muted/30"
          }`}
        >
          <Upload className="size-4 mr-2" />
          <span>Drop more audio files here or click to add another track</span>
        </div>
      )}

      {/* Sophisticated Loading State Checklist */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center p-6 sm:p-10 bg-card rounded-3xl border-2 border-primary/20 space-y-5 shadow-xl max-w-xl mx-auto">
          <div className="flex items-center gap-3 text-primary">
            <Activity className="size-5 animate-spin" />
            <h4 className="text-base sm:text-lg font-bold font-heading">
              Acoustic Forensics Processing...
            </h4>
          </div>
          <div className="w-full space-y-2.5 font-mono text-xs sm:text-sm">
            {[
              { label: "Loading Audio File Buffer", step: 0 },
              { label: "Decoding PCM Audio Data", step: 1 },
              { label: "Running Cooley-Tukey Radix-2 FFT", step: 2 },
              { label: "Detecting Ultrasonic Cutoff Ceiling", step: 3 },
              { label: "Generating Labeled Spectrogram & Report", step: 4 },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                  loadingStep > item.step
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold"
                    : loadingStep === item.step
                    ? "bg-primary/10 border-primary text-primary font-bold animate-pulse"
                    : "bg-muted/40 border-border/40 text-muted-foreground opacity-50"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>
                    {loadingStep > item.step
                      ? "✓"
                      : loadingStep === item.step
                      ? "⏳"
                      : "○"}
                  </span>
                  <span>{item.label}</span>
                </span>
                <span>
                  {loadingStep > item.step
                    ? "COMPLETE"
                    : loadingStep === item.step
                    ? "IN PROGRESS"
                    : "WAITING"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
