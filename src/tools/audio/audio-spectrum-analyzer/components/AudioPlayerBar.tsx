"use client";

import { RefObject } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { AudioAnalysisResult } from "../analyzer";

interface AudioPlayerBarProps {
  result: AudioAnalysisResult;
  isPlaying: boolean;
  onTogglePlay: () => void;
  currentTime: number;
  isMuted: boolean;
  onToggleMute: () => void;
  audioRef: RefObject<HTMLAudioElement | null>;
}

export function AudioPlayerBar({
  result,
  isPlaying,
  onTogglePlay,
  currentTime,
  isMuted,
  onToggleMute,
  audioRef,
}: AudioPlayerBarProps) {
  const formatDuration = (secs: number) => {
    if (!secs || isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleSeekBar = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !result.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pos * result.duration;
  };

  const progressPercent = result.duration ? (currentTime / result.duration) * 100 : 0;

  return (
    <div className="p-3.5 sm:p-5 rounded-2xl bg-muted/40 border-2 border-primary/20 space-y-3.5 shadow-md min-w-0 transition-all hover:border-primary/40">
      <div className="flex items-center justify-between gap-2 sm:gap-4 min-w-0">
        <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
          <Button
            size="icon"
            variant="default"
            onClick={onTogglePlay}
            title={isPlaying ? "Pause Audio" : "Play Audio Track"}
            className="rounded-full size-12 shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transition-transform active:scale-95"
          >
            {isPlaying ? <Pause className="size-5" /> : <Play className="size-5 ml-0.5" />}
          </Button>
          <div className="min-w-0 flex-1 space-y-0.5">
            <div
              className="text-sm sm:text-base font-bold font-heading text-foreground truncate w-full"
              title={result.metadata?.title || result.fileName}
            >
              {result.metadata?.title || result.fileName}
            </div>
            <div className="text-xs font-mono text-muted-foreground flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span className="font-bold text-primary">{formatDuration(currentTime)}</span>
              <span>/</span>
              <span>{formatDuration(result.duration)}</span>
              <span className="text-muted-foreground/50">•</span>
              <span>{(result.sampleRate / 1000).toFixed(1)} kHz</span>
              <span className="text-muted-foreground/50">•</span>
              <span>~{result.bitrate} kbps</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleMute}
            className="rounded-xl size-10 text-muted-foreground hover:text-foreground hover:bg-background/80"
            title={isMuted ? "Unmute Audio" : "Mute Audio"}
          >
            {isMuted ? <VolumeX className="size-5 text-destructive" /> : <Volume2 className="size-5 text-primary" />}
          </Button>
        </div>
      </div>

      {/* Interactive Progress Scrubber Bar */}
      <div className="space-y-1">
        <div
          onClick={handleSeekBar}
          className="relative h-3 w-full bg-secondary/80 hover:bg-secondary rounded-full overflow-hidden cursor-pointer group shadow-inner transition-colors"
          title="Click to seek playback position"
        >
          <div
            className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-primary to-cyan-400 group-hover:brightness-110 transition-all rounded-full shadow-sm"
            style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] font-mono text-muted-foreground px-0.5">
          <span>Track Timeline (Click anywhere above to seek or click canvas waveform directly)</span>
          <span>{progressPercent.toFixed(0)}%</span>
        </div>
      </div>
    </div>
  );
}
