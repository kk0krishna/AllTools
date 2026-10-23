"use client";

import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Pause,
  Square,
  SkipBack,
  SkipForward,
  Activity,
  Sparkles,
} from "lucide-react";

interface AudioVisualizerProps {
  isPlaying: boolean;
  isPaused: boolean;
  onPlay: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onPrevSentence: () => void;
  onNextSentence: () => void;
  currentSentenceIdx: number | null;
  totalSentences: number;
  disabled?: boolean;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  isPlaying,
  isPaused,
  onPlay,
  onPause,
  onResume,
  onStop,
  onPrevSentence,
  onNextSentence,
  currentSentenceIdx,
  totalSentences,
  disabled = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Dynamic canvas waveform animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let phase = 0;
    const numBars = 48;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const barWidth = width / numBars - 2;

      for (let i = 0; i < numBars; i++) {
        // Base bar height
        let barHeight = 4;

        if (isPlaying && !isPaused) {
          // Dynamic frequency oscillation simulation
          const sin1 = Math.sin(phase + i * 0.25);
          const sin2 = Math.cos(phase * 1.5 + i * 0.4);
          const sin3 = Math.sin(phase * 0.7 - i * 0.15);
          const factor = Math.max(0.1, (sin1 + sin2 + sin3 + 3) / 6);
          barHeight = Math.max(6, factor * (height * 0.85));
        } else if (isPaused) {
          barHeight = 8 + Math.sin(i * 0.3) * 4;
        }

        const x = i * (barWidth + 2);
        const y = (height - barHeight) / 2;

        // Gradient coloring
        const grad = ctx.createLinearGradient(0, y, 0, y + barHeight);
        if (isPlaying && !isPaused) {
          grad.addColorStop(0, "rgba(236, 72, 153, 0.9)"); // Pink
          grad.addColorStop(0.5, "rgba(168, 85, 247, 0.9)"); // Purple
          grad.addColorStop(1, "rgba(59, 130, 246, 0.9)"); // Blue
        } else {
          grad.addColorStop(0, "rgba(148, 163, 184, 0.3)");
          grad.addColorStop(1, "rgba(148, 163, 184, 0.2)");
        }

        ctx.fillStyle = grad;
        // Rounded bar
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 3);
        ctx.fill();
      }

      if (isPlaying && !isPaused) {
        phase += 0.12;
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, isPaused]);

  // Handle high-dpi canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(dpr, dpr);
  }, []);

  const progressPercent =
    totalSentences > 0 && currentSentenceIdx !== null
      ? Math.min(100, Math.round(((currentSentenceIdx + 1) / totalSentences) * 100))
      : 0;

  return (
    <div className="p-4 sm:p-5 rounded-2xl border border-border/60 bg-gradient-to-b from-card to-card/60 shadow-xs space-y-4">
      {/* Top Status line */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          {isPlaying && !isPaused ? (
            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] animate-pulse">
              <span className="size-1.5 rounded-full bg-emerald-500 mr-1.5 inline-block"></span>
              Live Speaking
            </Badge>
          ) : isPaused ? (
            <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[10px]">
              <span className="size-1.5 rounded-full bg-amber-500 mr-1.5 inline-block"></span>
              Paused
            </Badge>
          ) : (
            <Badge variant="outline" className="text-[10px] text-muted-foreground">
              <Sparkles className="size-3 mr-1 text-primary" />
              Studio Ready
            </Badge>
          )}

          {totalSentences > 0 && (
            <span className="text-muted-foreground font-mono">
              Sentence{" "}
              <strong className="text-foreground">
                {currentSentenceIdx !== null ? currentSentenceIdx + 1 : 0}
              </strong>{" "}
              of {totalSentences}
            </span>
          )}
        </div>

        <div className="text-muted-foreground font-mono font-medium">
          {progressPercent}% Complete
        </div>
      </div>

      {/* Waveform Canvas */}
      <div className="w-full h-16 sm:h-20 bg-background/50 rounded-xl border border-border/40 p-2 overflow-hidden flex items-center justify-center">
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-primary transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-center gap-3 pt-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onPrevSentence}
          disabled={disabled || !isPlaying || currentSentenceIdx === null || currentSentenceIdx <= 0}
          className="h-9 px-3 rounded-xl border-border/50 hover:bg-muted"
          title="Previous sentence"
        >
          <SkipBack className="size-4" />
        </Button>

        {isPlaying && !isPaused ? (
          <Button
            type="button"
            size="lg"
            onClick={onPause}
            className="h-11 px-6 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-md shadow-amber-500/20"
          >
            <Pause className="size-5 mr-1.5 fill-current" />
            <span>Pause</span>
          </Button>
        ) : isPaused ? (
          <Button
            type="button"
            size="lg"
            onClick={onResume}
            className="h-11 px-6 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md shadow-primary/20"
          >
            <Play className="size-5 mr-1.5 fill-current" />
            <span>Resume</span>
          </Button>
        ) : (
          <Button
            type="button"
            size="lg"
            onClick={onPlay}
            disabled={disabled}
            className="h-11 px-7 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md shadow-primary/25 hover:scale-[1.02] transition-transform"
          >
            <Play className="size-5 mr-2 fill-current" />
            <span>Play Natural Voice</span>
          </Button>
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onStop}
          disabled={disabled || (!isPlaying && !isPaused)}
          className="h-9 px-3 rounded-xl border-border/50 text-destructive hover:bg-destructive/10 hover:text-destructive"
          title="Stop speech"
        >
          <Square className="size-4 fill-current" />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onNextSentence}
          disabled={
            disabled ||
            !isPlaying ||
            currentSentenceIdx === null ||
            currentSentenceIdx >= totalSentences - 1
          }
          className="h-9 px-3 rounded-xl border-border/50 hover:bg-muted"
          title="Next sentence"
        >
          <SkipForward className="size-4" />
        </Button>
      </div>
    </div>
  );
};
