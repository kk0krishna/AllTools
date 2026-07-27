"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Activity, ZoomIn, ZoomOut } from "lucide-react";
import { AudioAnalysisResult, ColorPalette, getPaletteColor } from "../analyzer";

interface SpectrogramViewProps {
  result: AudioAnalysisResult;
  palette: ColorPalette;
  currentTime: number;
  onSeek: (time: number) => void;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export function SpectrogramView({
  result,
  palette,
  currentTime,
  onSeek,
  canvasRef,
}: SpectrogramViewProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [hoverInfo, setHoverInfo] = useState<{
    time: string;
    freq: string;
    db: string;
    left: string;
    right: string;
    top: string;
    transform: string;
  } | null>(null);

  // Render spectrogram onto canvas whenever result or palette changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !result.spectrogramData || !result.spectrogramData.length) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cols = result.spectrogramData.length;
    const bins = result.spectrogramData[0].length;
    canvas.width = cols;
    canvas.height = bins;

    const imgData = ctx.createImageData(cols, bins);
    const data = imgData.data;

    const nyquist = result.sampleRate / 2;
    const maxFreq = 22050;
    const maxBin = Math.min(bins, Math.floor((maxFreq / nyquist) * bins));

    let minDb = Infinity;
    let maxDb = -Infinity;
    for (let c = 0; c < cols; c++) {
      for (let b = 0; b < maxBin; b++) {
        const val = result.spectrogramData[c][b];
        if (val < minDb) minDb = val;
        if (val > maxDb) maxDb = val;
      }
    }
    const dbRange = maxDb - minDb || 1;

    for (let c = 0; c < cols; c++) {
      for (let b = 0; b < bins; b++) {
        const val = result.spectrogramData[c][b];
        const norm = Math.max(0, Math.min(1, (val - minDb) / dbRange));
        const [r, g, blue] = getPaletteColor(norm, palette);
        const y = bins - 1 - b;
        const idx = (y * cols + c) * 4;
        data[idx] = r;
        data[idx + 1] = g;
        data[idx + 2] = blue;
        data[idx + 3] = 255;
      }
    }

    ctx.putImageData(imgData, 0, 0);
  }, [result, palette, canvasRef]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!result.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, x / rect.width));
    onSeek(ratio * result.duration);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!result.duration || !result.spectrogramData) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ratioX = Math.max(0, Math.min(1, x / rect.width));
    const ratioY = Math.max(0, Math.min(1, y / rect.height));

    const timeSec = ratioX * result.duration;
    const m = Math.floor(timeSec / 60);
    const s = Math.floor(timeSec % 60);
    const timeFormatted = `${m}:${s < 10 ? "0" : ""}${s}`;

    const nyquist = result.sampleRate / 2;
    const freqHz = Math.round((1 - ratioY) * nyquist);
    const freqFormatted = freqHz >= 1000 ? `${(freqHz / 1000).toFixed(1)} kHz` : `${freqHz} Hz`;

    const cols = result.spectrogramData.length;
    const bins = result.spectrogramData[0].length;
    const colIdx = Math.min(cols - 1, Math.floor(ratioX * cols));
    const binIdx = Math.min(bins - 1, Math.floor((1 - ratioY) * bins));
    const dbVal = result.spectrogramData[colIdx]?.[binIdx]?.toFixed(1) || "-∞";

    const isNearRight = x > rect.width - 220;
    const isNearBottom = y > rect.height - 80;

    setHoverInfo({
      time: timeFormatted,
      freq: freqFormatted,
      db: `${dbVal} dB`,
      left: isNearRight ? "auto" : `${x + 15}px`,
      right: isNearRight ? `${rect.width - x + 15}px` : "auto",
      top: isNearBottom ? "auto" : `${y - 10}px`,
      transform: isNearBottom ? "-translate-y-full" : "",
    });
  };

  const progressPercent = result.duration ? (currentTime / result.duration) * 100 : 0;

  return (
    <div className="space-y-3 min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-muted-foreground font-mono bg-muted/30 p-3 sm:p-3.5 rounded-xl border">
        <span className="flex items-center gap-2 font-bold text-foreground">
          <Activity className="size-4 text-primary shrink-0" />
          <span>Real-Time Fast Fourier Transform (FFT) Spectrogram</span>
        </span>
        <div className="flex items-center justify-between sm:justify-end gap-4">
          <span className="text-[11px]">
            Nyquist ceiling: <strong className="text-foreground">{(result.sampleRate / 2000).toFixed(1)} kHz</strong>
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsZoomed(!isZoomed)}
            className="h-8 gap-1.5 text-xs font-semibold rounded-lg bg-background hover:bg-muted"
          >
            {isZoomed ? <ZoomOut className="size-3.5" /> : <ZoomIn className="size-3.5" />}
            <span>{isZoomed ? "Standard Height" : "Expand Height"}</span>
          </Button>
        </div>
      </div>

      <div
        className="relative overflow-hidden rounded-2xl bg-black cursor-pointer select-none border-2 border-border/80 shadow-2xl group min-w-0"
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoverInfo(null)}
      >
        <canvas
          ref={canvasRef}
          className={`block w-full transition-all duration-300 ${isZoomed ? "h-96 sm:h-[520px]" : "h-64 sm:h-80"}`}
        />

        {/* Real-time Playback Progress Line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(255,255,255,1)] pointer-events-none transition-all duration-75 z-10"
          style={{ left: `${progressPercent}%`, display: progressPercent > 0 ? "block" : "none" }}
        />

        {/* Hover Tooltip Info */}
        {hoverInfo && (
          <div
            className={`absolute pointer-events-none z-20 bg-black/95 backdrop-blur-md text-white text-[11px] font-mono px-3.5 py-2 rounded-xl border border-white/30 shadow-2xl flex gap-4 transition-all duration-75 ${hoverInfo.transform}`}
            style={{
              left: hoverInfo.left,
              right: hoverInfo.right,
              top: hoverInfo.top,
            }}
          >
            <span className="font-bold text-white">⏱️ {hoverInfo.time}</span>
            <span className="text-cyan-400 font-bold">📶 {hoverInfo.freq}</span>
            <span className="text-emerald-400 font-bold">🔊 {hoverInfo.db}</span>
          </div>
        )}

        {/* Frequency Scale Grid Markers */}
        <div className="pointer-events-none absolute right-2.5 top-0 bottom-0 flex flex-col justify-between py-2.5 text-[10px] font-mono text-white/80">
          <span className="bg-black/70 backdrop-blur-xs px-1.5 py-0.5 rounded border border-white/10">
            {(result.sampleRate / 2000).toFixed(0)}k Hz
          </span>
          <span className="bg-black/70 backdrop-blur-xs px-1.5 py-0.5 rounded border border-white/10">
            {(result.sampleRate / 2666).toFixed(0)}k Hz
          </span>
          <span className="bg-black/70 backdrop-blur-xs px-1.5 py-0.5 rounded border border-white/10">
            {(result.sampleRate / 4000).toFixed(0)}k Hz
          </span>
          <span className="bg-black/70 backdrop-blur-xs px-1.5 py-0.5 rounded border border-white/10">
            {(result.sampleRate / 8000).toFixed(0)}k Hz
          </span>
          <span className="bg-black/70 backdrop-blur-xs px-1.5 py-0.5 rounded border border-white/10">0 Hz</span>
        </div>

        {/* Overlay Click Hint */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="bg-black/80 backdrop-blur-md text-white text-xs px-4 py-2 rounded-full border border-white/30 font-semibold shadow-lg">
            Click anywhere on spectrogram to seek audio playback
          </span>
        </div>
      </div>
    </div>
  );
}
