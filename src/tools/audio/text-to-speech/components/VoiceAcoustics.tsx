"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sliders,
  Gauge,
  Activity,
  Volume2,
  VolumeX,
  RotateCcw,
} from "lucide-react";

interface VoiceAcousticsProps {
  rate: number;
  setRate: (rate: number) => void;
  pitch: number;
  setPitch: (pitch: number) => void;
  volume: number;
  setVolume: (volume: number) => void;
  onReset: () => void;
  disabled?: boolean;
}

export const VoiceAcoustics: React.FC<VoiceAcousticsProps> = ({
  rate,
  setRate,
  pitch,
  setPitch,
  volume,
  setVolume,
  onReset,
  disabled = false,
}) => {
  return (
    <Card className="border-border/60 shadow-xs">
      <CardContent className="p-4 sm:p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 font-bold">
              <Sliders className="size-4" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-base text-foreground">
                Voice Acoustics & Modulation
              </h3>
              <p className="text-xs text-muted-foreground">
                Tune pace, vocal pitch, and output levels
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onReset}
            disabled={disabled}
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="size-3 mr-1" />
            <span>Reset</span>
          </Button>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* 1. Speaking Speed / Rate */}
          <div className="space-y-2.5 p-3 rounded-xl border border-border/40 bg-muted/20">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                <Gauge className="size-3.5 text-primary" />
                <span>Speed / Rate</span>
              </span>
              <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                {rate.toFixed(2)}x
              </span>
            </div>

            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.05"
              value={rate}
              onChange={(e) => setRate(parseFloat(e.target.value))}
              disabled={disabled}
              className="w-full accent-primary h-1.5 bg-muted rounded-lg cursor-pointer"
            />

            <div className="flex items-center justify-between pt-1">
              {[0.75, 1.0, 1.25, 1.5].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setRate(val)}
                  disabled={disabled}
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                    Math.abs(rate - val) < 0.02
                      ? "bg-primary text-primary-foreground font-bold shadow-xs"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {val === 1.0 ? "1.0x" : `${val}x`}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Vocal Pitch */}
          <div className="space-y-2.5 p-3 rounded-xl border border-border/40 bg-muted/20">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                <Activity className="size-3.5 text-indigo-500" />
                <span>Pitch</span>
              </span>
              <span className="text-xs font-mono font-bold text-indigo-500 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                {pitch.toFixed(2)}
              </span>
            </div>

            <input
              type="range"
              min="0.5"
              max="1.8"
              step="0.05"
              value={pitch}
              onChange={(e) => setPitch(parseFloat(e.target.value))}
              disabled={disabled}
              className="w-full accent-indigo-500 h-1.5 bg-muted rounded-lg cursor-pointer"
            />

            <div className="flex items-center justify-between pt-1">
              {[
                { val: 0.8, label: "Deep" },
                { val: 1.0, label: "Natural" },
                { val: 1.3, label: "Bright" },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setPitch(val)}
                  disabled={disabled}
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                    Math.abs(pitch - val) < 0.02
                      ? "bg-indigo-500 text-white font-bold shadow-xs"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Master Volume */}
          <div className="space-y-2.5 p-3 rounded-xl border border-border/40 bg-muted/20">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                {volume === 0 ? (
                  <VolumeX className="size-3.5 text-rose-500" />
                ) : (
                  <Volume2 className="size-3.5 text-emerald-500" />
                )}
                <span>Volume</span>
              </span>
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                {Math.round(volume * 100)}%
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              disabled={disabled}
              className="w-full accent-emerald-500 h-1.5 bg-muted rounded-lg cursor-pointer"
            />

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setVolume(volume === 0 ? 1 : 0)}
                disabled={disabled}
                className="text-[10px] font-mono text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {volume === 0 ? "Unmute" : "Mute"}
              </button>
              <button
                type="button"
                onClick={() => setVolume(0.5)}
                disabled={disabled}
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                  Math.abs(volume - 0.5) < 0.02
                    ? "bg-emerald-500 text-white font-bold"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                50%
              </button>
              <button
                type="button"
                onClick={() => setVolume(1.0)}
                disabled={disabled}
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                  Math.abs(volume - 1.0) < 0.02
                    ? "bg-emerald-500 text-white font-bold"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                100%
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
