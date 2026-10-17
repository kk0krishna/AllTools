"use client";

import React, { useRef, useEffect, useState, useCallback, useMemo } from "react";
import Image from "next/image";
import { MecDataset, MecSectorData } from "./types";
import { Volume2, VolumeX, RotateCcw, ZoomIn, ZoomOut, Maximize2, Minimize2, ChevronLeft, ChevronRight, Compass, Scan } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MecWheelProps {
  dataset: MecDataset;
  activeSectorIndex: number;
  onSectorSelect: (sector: MecSectorData) => void;
  highlightedSectorIndex?: number | null;
  onNoteClick?: (noteCode: string) => void;
}

export function MecWheel({
  dataset,
  activeSectorIndex,
  onSectorSelect,
  highlightedSectorIndex,
  onNoteClick
}: MecWheelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wheelGroupRef = useRef<HTMLDivElement>(null);
  const svgOverlayRef = useRef<SVGSVGElement>(null);

  // View Mode: 'semicircle' (focused top half with large fonts for small screens) or 'full' (full 360 circle)
  const [viewMode, setViewMode] = useState<"semicircle" | "full">("full");

  // Automatically default to semicircle mode on small screens (< 640px)
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 640) {
      setViewMode("semicircle");
    }
  }, []);

  // Sound effects toggle
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Zoom & Fullscreen
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Physics rotation states
  // Sector i spans [i * 10, (i + 1) * 10] deg; its center is at (i * 10 + 5) deg.
  // To rotate sector i to 12 o'clock (0 deg), rotation angle = -(i * 10 + 5) deg.
  const currentRotationRef = useRef<number>(-(activeSectorIndex * 10 + 5));
  const isDragging = useRef(false);
  const pointerIsDown = useRef(false);
  const lastAngle = useRef(0);
  const lastTime = useRef(0);
  const velocity = useRef(0);
  const rafId = useRef<number | null>(null);
  const lastNotchIndex = useRef(activeSectorIndex);

  // Audio tick generator
  const playTickSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(650, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.02);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.02);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.02);
    } catch {
      // AudioContext unavailable
    }
  }, [soundEnabled]);

  // Direct DOM rotation update for high-performance 60fps
  const applyRotation = useCallback((deg: number) => {
    currentRotationRef.current = deg;
    if (wheelGroupRef.current) {
      wheelGroupRef.current.style.transform = `rotate(${deg}deg)`;
    }
    // Calculate which sector center is closest to 12 o'clock (0 deg)
    // Sector i center is at i * 10 + 5 deg.
    // When rotated by deg, sector i center is at (deg + i * 10 + 5).
    // Center at 0 => deg = -(i * 10 + 5) => (-deg) = i * 10 + 5.
    // Normalized to [0, 360):
    const normalizedDeg = ((-deg % 360) + 360) % 360;
    const currentIndex = Math.floor(normalizedDeg / 10) % 36;
    if (currentIndex !== lastNotchIndex.current) {
      lastNotchIndex.current = currentIndex;
      playTickSound();
      const sector = dataset.sectors[currentIndex];
      if (sector) {
        onSectorSelect(sector);
      }
    }
  }, [dataset.sectors, onSectorSelect, playTickSound]);

  // Smooth animate to specific sector center
  const spinToSector = useCallback((sectorIndex: number) => {
    if (rafId.current !== null) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
    const currentDeg = currentRotationRef.current;
    // Target angle brings sectorIndex center (sectorIndex * 10 + 5) to 0 deg
    const targetDeg = -(sectorIndex * 10 + 5);

    // Find shortest rotational path
    const currentNormalized = (currentDeg % 360 + 360) % 360;
    const targetNormalized = (targetDeg % 360 + 360) % 360;
    let diff = targetNormalized - currentNormalized;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;

    const startRot = currentDeg;
    const endRot = currentDeg + diff;
    const startTime = performance.now();
    const duration = 400; // ms

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      const newDeg = startRot + (endRot - startRot) * eased;
      applyRotation(newDeg);

      if (progress < 1) {
        rafId.current = requestAnimationFrame(animate);
      } else {
        rafId.current = null;
        applyRotation(endRot);
      }
    };

    rafId.current = requestAnimationFrame(animate);
  }, [applyRotation]);

  // Synchronize with external activeSectorIndex change (e.g. from search / click)
  useEffect(() => {
    const currentNorm = ((-currentRotationRef.current % 360) + 360) % 360;
    const curIndex = Math.floor(currentNorm / 10) % 36;
    if (curIndex !== activeSectorIndex && !isDragging.current) {
      spinToSector(activeSectorIndex);
    }
  }, [activeSectorIndex, spinToSector]);

  // Pointer angle calculation
  const getAngle = useCallback((clientX: number, clientY: number) => {
    const el = wheelGroupRef.current || containerRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = clientX - cx;
    const dy = clientY - cy;
    return Math.atan2(dy, dx) * (180 / Math.PI);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!e.isPrimary) return;
    pointerIsDown.current = true;
    isDragging.current = false;
    lastAngle.current = getAngle(e.clientX, e.clientY);
    lastTime.current = performance.now();
    velocity.current = 0;

    if (rafId.current !== null) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!pointerIsDown.current) return;
    const currentAngle = getAngle(e.clientX, e.clientY);
    const currentTime = performance.now();
    let delta = currentAngle - lastAngle.current;

    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;

    if (Math.abs(delta) > 0.5) {
      isDragging.current = true;
    }

    if (!isDragging.current) return;

    const dt = currentTime - lastTime.current;
    if (dt > 0) {
      velocity.current = velocity.current * 0.4 + (delta / dt) * 0.6;
    }

    applyRotation(currentRotationRef.current + delta);
    lastAngle.current = currentAngle;
    lastTime.current = currentTime;
  };

  const handlePointerUp = () => {
    if (!pointerIsDown.current) return;
    pointerIsDown.current = false;

    if (!isDragging.current) return;

    // Momentum coasting and snap to notch
    let currentVel = velocity.current;
    let currentRot = currentRotationRef.current;
    const friction = 0.94;

    const coast = () => {
      currentVel *= friction;
      currentRot += currentVel * 16;
      applyRotation(currentRot);

      if (Math.abs(currentVel) > 0.05) {
        rafId.current = requestAnimationFrame(coast);
      } else {
        // Snap to nearest 10-degree sector center
        const norm = ((-currentRot % 360) + 360) % 360;
        const targetIndex = Math.floor(norm / 10) % 36;
        spinToSector(targetIndex);
      }
    };

    if (Math.abs(currentVel) > 0.1) {
      rafId.current = requestAnimationFrame(coast);
    } else {
      const norm = ((-currentRot % 360) + 360) % 360;
      const targetIndex = Math.floor(norm / 10) % 36;
      spinToSector(targetIndex);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  // Compute SVG sectors for clicking
  // Sector i spans [i * 10, (i + 1) * 10] deg relative to 12 o'clock (0 deg)
  const svgSectors = useMemo(() => {
    const count = dataset.sectors.length;
    const radius = 400; // viewBox 800x800
    const innerR = 300; // outer condition rim width
    const sectors = [];

    const round = (val: number) => Number(val.toFixed(2));

    for (let i = 0; i < count; i++) {
      const startDeg = i * 10;
      const endDeg = (i + 1) * 10;
      const startAngle = (startDeg - 90) * (Math.PI / 180);
      const endAngle = (endDeg - 90) * (Math.PI / 180);

      const x1 = round(400 + radius * Math.cos(startAngle));
      const y1 = round(400 + radius * Math.sin(startAngle));
      const x2 = round(400 + radius * Math.cos(endAngle));
      const y2 = round(400 + radius * Math.sin(endAngle));

      const x3 = round(400 + innerR * Math.cos(endAngle));
      const y3 = round(400 + innerR * Math.sin(endAngle));
      const x4 = round(400 + innerR * Math.cos(startAngle));
      const y4 = round(400 + innerR * Math.sin(startAngle));

      const pathData = `M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 0 0 ${x4} ${y4} Z`;

      sectors.push({
        index: i,
        pathData,
        sector: dataset.sectors[i]
      });
    }
    return sectors;
  }, [dataset.sectors]);

  const activeSector = dataset.sectors[activeSectorIndex] || dataset.sectors[0];

  return (
    <div
      ref={containerRef}
      className={`relative w-full flex flex-col items-center justify-center p-1 sm:p-3 select-none touch-none ${
        isFullscreen ? "fixed inset-0 z-50 bg-background/95 backdrop-blur-xl p-4 overflow-y-auto" : ""
      }`}
    >
      {/* Clean Toolbar Header ABOVE the wheel - Completely unobstructed */}
      <div className="w-full max-w-[580px] flex items-center justify-between gap-1.5 sm:gap-2 mb-2 p-1.5 sm:p-2 rounded-2xl bg-card/90 backdrop-blur-md border border-border/70 shadow-xs z-20">
        {/* Left: Previous / Next Sector Stepper */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs font-semibold flex items-center gap-1 hover:bg-muted text-foreground"
            onClick={() => spinToSector((activeSectorIndex - 1 + 36) % 36)}
            title="Previous condition sector"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Prev</span>
          </Button>
          <span className="text-[11px] sm:text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-muted text-foreground whitespace-nowrap">
            {activeSectorIndex + 1} / 36
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs font-semibold flex items-center gap-1 hover:bg-muted text-foreground"
            onClick={() => spinToSector((activeSectorIndex + 1) % 36)}
            title="Next condition sector"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Right: View Mode, Sound, Zoom, Reset, Fullscreen */}
        <div className="flex items-center gap-0.5 sm:gap-1">
          <Button
            variant={viewMode === "semicircle" ? "secondary" : "ghost"}
            size="sm"
            className="h-8 px-2 text-xs font-semibold rounded-lg flex items-center gap-1 text-foreground"
            onClick={() => setViewMode((prev) => (prev === "semicircle" ? "full" : "semicircle"))}
            title={
              viewMode === "semicircle"
                ? "Show full 360° wheel"
                : "Focus top semicircle (large fonts for small screens)"
            }
          >
            <Scan className="h-3.5 w-3.5 text-primary" />
            <span className="hidden xs:inline">
              {viewMode === "semicircle" ? "Full Wheel" : "Large Arc"}
            </span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg hover:bg-muted text-foreground"
            onClick={() => setSoundEnabled((prev) => !prev)}
            title={soundEnabled ? "Mute audio ticks" : "Enable rotation click sound"}
          >
            {soundEnabled ? (
              <Volume2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <VolumeX className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg hover:bg-muted text-foreground"
            onClick={() => setZoom((prev) => Math.min(prev + 0.15, 1.5))}
            title="Zoom in wheel"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg hover:bg-muted text-foreground"
            onClick={() => setZoom((prev) => Math.max(prev - 0.15, 0.75))}
            title="Zoom out wheel"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg hover:bg-muted text-foreground"
            onClick={() => {
              setZoom(1);
              spinToSector(0);
            }}
            title="Reset to Sector 1"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg hover:bg-muted text-foreground"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen View"}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Viewing Slot Top Alignment Indicator at 12 o'clock */}
      <div className="relative z-10 flex flex-col items-center pointer-events-none mb-1">
        <div className="flex items-center gap-1.5 px-3 py-1 bg-primary text-primary-foreground text-[11px] sm:text-xs font-bold rounded-full shadow-md uppercase tracking-wider">
          <Compass className="w-3.5 h-3.5" />
          <span>Active Viewing Window</span>
        </div>
        <div className="w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[8px] border-t-primary -mt-[1px]" />
      </div>

      {/* Main Wheel Responsive Scaled Container with Physics Rotation */}
      <div
        className={`relative w-full flex justify-center items-start overflow-hidden transition-all duration-300 ${
          viewMode === "semicircle"
            ? "h-[270px] xs:h-[310px] sm:h-[360px] md:h-[400px]"
            : "aspect-square max-w-[340px] xs:max-w-[380px] sm:max-w-[460px] md:max-w-[520px] lg:max-w-[560px]"
        }`}
      >
        <div
          className={`relative aspect-square flex items-center justify-center cursor-grab active:cursor-grabbing transition-transform duration-200 shrink-0 ${
            viewMode === "semicircle"
              ? "w-[440px] xs:w-[500px] sm:w-[560px] md:w-[620px] -mt-1"
              : "w-full h-full"
          }`}
          style={{ transform: `scale(${zoom})` }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {/* ROTATING BASE WHEEL (Lower disc with conditions & concentric scores) */}
          <div
            ref={wheelGroupRef}
            className="absolute inset-0 w-full h-full will-change-transform rounded-full shadow-2xl overflow-hidden"
            style={{
              transform: `rotate(${currentRotationRef.current}deg)`,
              transition: isDragging.current ? "none" : undefined
            }}
          >
            <Image
              src={dataset.lowerWheelImage}
              alt="MEC Lower Wheel Disc"
              fill
              sizes="(max-width: 640px) 460px, (max-width: 768px) 520px, 600px"
              priority
              className="object-contain pointer-events-none"
            />

            {/* SVG Clickable Sector Overlays on Lower Wheel */}
            <svg
              ref={svgOverlayRef}
              viewBox="0 0 800 800"
              className="absolute inset-0 w-full h-full pointer-events-auto"
            >
              {svgSectors.map(({ index, pathData, sector }) => {
                const isSelected = activeSectorIndex === index;
                const isHighlighted = highlightedSectorIndex === index;
                return (
                  <path
                    key={sector.id}
                    d={pathData}
                    className={`transition-colors cursor-pointer ${
                      isSelected
                        ? "fill-primary/25 stroke-primary stroke-[3]"
                        : isHighlighted
                        ? "fill-amber-400/35 stroke-amber-400 stroke-[3] animate-pulse"
                        : "fill-transparent hover:fill-primary/10 stroke-transparent"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      spinToSector(index);
                    }}
                  >
                    <title>{`${sector.categoryName}: ${sector.conditionName}`}</title>
                  </path>
                );
              })}
            </svg>
          </div>

          {/* STATIC COVER DISC (Upper wheel with transparent viewing window slot at 12 o'clock) */}
          <div className="absolute inset-0 w-full h-full pointer-events-none rounded-full overflow-hidden">
            <Image
              src={dataset.upperWheelImage}
              alt="MEC Upper Wheel Viewing Slot"
              fill
              sizes="(max-width: 640px) 460px, (max-width: 768px) 520px, 600px"
              priority
              className="object-contain"
            />
          </div>

          {/* Center Pivot Pin Graphic */}
          <div className="absolute w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-slate-800 via-slate-600 to-slate-200 border-2 border-white shadow-xl flex items-center justify-center pointer-events-none z-10">
            <div className="w-2.5 h-2.5 rounded-full bg-primary ring-2 ring-white/50" />
          </div>
        </div>
      </div>

      {/* User Guidance Micro-text */}
      <div className="mt-2.5 flex items-center justify-center gap-2 text-xs text-muted-foreground text-center">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        <span>Drag or flick to spin &bull; Click sector to center &bull; Step with Prev/Next</span>
      </div>

      {/* Mobile Quick-HUD for Active Condition (Shown on small screens for instant reading without scrolling) */}
      <div className="w-full max-w-[580px] mt-3 p-3 rounded-2xl bg-card border border-border/80 shadow-xs lg:hidden">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary">
            {activeSector.categoryName}
          </span>
          <span className="text-[10px] font-mono text-muted-foreground">
            Sector #{activeSector.sectorIndex + 1} of 36
          </span>
        </div>
        <h4 className="text-sm font-bold text-foreground line-clamp-1 mb-2">
          {activeSector.conditionName}
        </h4>
        {/* Horizontal scrollable row of contraceptive ratings */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {activeSector.scores.map((sc) => {
            const m = dataset.methods.find((md) => md.id === sc.methodId);
            if (!m) return null;
            const rawScore = sc.score.split(/[\^/, -]/)[0].trim();
            const badgeClass =
              rawScore === "1"
                ? "bg-emerald-600 text-white"
                : rawScore === "2"
                ? "bg-blue-600 text-white"
                : rawScore === "3"
                ? "bg-amber-500 text-slate-950 font-black"
                : rawScore === "4"
                ? "bg-rose-600 text-white"
                : "bg-slate-600 text-white";

            return (
              <div
                key={sc.methodId}
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-muted/60 border border-border/60 shrink-0 text-xs"
              >
                <span className="text-[11px] font-medium text-foreground">{m.shortName}:</span>
                <span className={`px-1.5 py-0.5 rounded text-[11px] font-mono font-black ${badgeClass}`}>
                  {sc.score}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
