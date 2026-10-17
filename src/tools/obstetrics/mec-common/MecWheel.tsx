"use client";

import React, { useRef, useEffect, useState, useCallback, useMemo } from "react";
import Image from "next/image";
import { MecDataset, MecSectorData } from "./types";
import { Volume2, VolumeX, RotateCcw, ZoomIn, ZoomOut, Maximize2, Minimize2, Info } from "lucide-react";
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

  // Sound effects toggle
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Zoom & Fullscreen
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Physics rotation states
  // Active sector at 0 deg (12 o'clock)
  // Each sector is 10 degrees (360 / 36 = 10 deg)
  const currentRotationRef = useRef<number>(-activeSectorIndex * 10);
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
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.02);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.02);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.02);
    } catch {
      // AudioContext unavailable or blocked
    }
  }, [soundEnabled]);

  // Direct DOM rotation update for high-performance 60fps
  const applyRotation = useCallback((deg: number) => {
    currentRotationRef.current = deg;
    if (wheelGroupRef.current) {
      wheelGroupRef.current.style.transform = `rotate(${deg}deg)`;
    }
    // Calculate which sector is at top (12 o'clock / 0 deg)
    // deg corresponds to: index = ((-deg % 360) + 360) % 360 / 10
    const normalizedDeg = ((-deg % 360) + 360) % 360;
    const currentIndex = Math.round(normalizedDeg / 10) % 36;
    if (currentIndex !== lastNotchIndex.current) {
      lastNotchIndex.current = currentIndex;
      playTickSound();
      const sector = dataset.sectors[currentIndex];
      if (sector) {
        onSectorSelect(sector);
      }
    }
  }, [dataset.sectors, onSectorSelect, playTickSound]);

  // Smooth animate to specific sector
  const spinToSector = useCallback((sectorIndex: number) => {
    if (rafId.current !== null) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
    const currentDeg = currentRotationRef.current;
    const targetDeg = -sectorIndex * 10;
    // Find shortest rotational path
    const currentNormalized = (currentDeg % 360 + 360) % 360;
    const targetNormalized = (targetDeg % 360 + 360) % 360;
    let diff = targetNormalized - currentNormalized;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;

    const startRot = currentDeg;
    const endRot = currentDeg + diff;
    const startTime = performance.now();
    const duration = 450; // ms

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
    const curIndex = Math.round(currentNorm / 10) % 36;
    if (curIndex !== activeSectorIndex && !isDragging.current) {
      spinToSector(activeSectorIndex);
    }
  }, [activeSectorIndex, spinToSector]);

  // Pointer angle calculation
  const getAngle = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return 0;
    const rect = containerRef.current.getBoundingClientRect();
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
        // Snap to nearest 10-degree sector
        const targetRot = Math.round(currentRot / 10) * 10;
        const norm = ((-targetRot % 360) + 360) % 360;
        const targetIndex = Math.round(norm / 10) % 36;
        spinToSector(targetIndex);
      }
    };

    if (Math.abs(currentVel) > 0.1) {
      rafId.current = requestAnimationFrame(coast);
    } else {
      const targetRot = Math.round(currentRot / 10) * 10;
      const norm = ((-targetRot % 360) + 360) % 360;
      const targetIndex = Math.round(norm / 10) % 36;
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
  const svgSectors = useMemo(() => {
    const count = dataset.sectors.length;
    const radius = 400; // viewBox size 800x800
    const innerR = 300; // outer rim width 100px
    const sectors = [];

    for (let i = 0; i < count; i++) {
      // sector i spans [i * 10 - 5, i * 10 + 5] degrees relative to 12 o'clock (0 deg)
      const centerAngle = i * 10;
      const startAngle = (centerAngle - 5 - 90) * (Math.PI / 180);
      const endAngle = (centerAngle + 5 - 90) * (Math.PI / 180);

      const x1 = 400 + radius * Math.cos(startAngle);
      const y1 = 400 + radius * Math.sin(startAngle);
      const x2 = 400 + radius * Math.cos(endAngle);
      const y2 = 400 + radius * Math.sin(endAngle);

      const x3 = 400 + innerR * Math.cos(endAngle);
      const y3 = 400 + innerR * Math.sin(endAngle);
      const x4 = 400 + innerR * Math.cos(startAngle);
      const y4 = 400 + innerR * Math.sin(startAngle);

      const pathData = `M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 0 0 ${x4} ${y4} Z`;

      sectors.push({
        index: i,
        pathData,
        sector: dataset.sectors[i]
      });
    }
    return sectors;
  }, [dataset.sectors]);

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col items-center justify-center p-2 sm:p-4 select-none touch-none ${
        isFullscreen ? "fixed inset-0 z-50 bg-background/95 backdrop-blur-md" : ""
      }`}
    >
      {/* Interactive Controls Bar */}
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20 flex items-center gap-1 sm:gap-2 bg-card/85 backdrop-blur-md p-1.5 rounded-full border border-border/80 shadow-md">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full hover:bg-muted text-foreground"
          onClick={() => setSoundEnabled((prev) => !prev)}
          title={soundEnabled ? "Mute wheel rotation sound" : "Enable rotation click sound"}
        >
          {soundEnabled ? <Volume2 className="h-4 w-4 text-primary" /> : <VolumeX className="h-4 w-4 text-muted-foreground" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full hover:bg-muted text-foreground"
          onClick={() => setZoom((prev) => Math.min(prev + 0.15, 1.6))}
          title="Zoom in wheel"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full hover:bg-muted text-foreground"
          onClick={() => setZoom((prev) => Math.max(prev - 0.15, 0.75))}
          title="Zoom out wheel"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full hover:bg-muted text-foreground"
          onClick={() => {
            setZoom(1);
            spinToSector(0);
          }}
          title="Reset wheel to top"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full hover:bg-muted text-foreground"
          onClick={toggleFullscreen}
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen View"}
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
      </div>

      {/* Viewing Slot Alignment Marker at 12 o'clock */}
      <div className="relative z-10 flex flex-col items-center pointer-events-none mb-1">
        <div className="flex items-center gap-1.5 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full shadow-lg border border-primary-foreground/20 animate-pulse">
          <span>Viewing Slot (Active Condition)</span>
        </div>
        <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-primary shadow-sm" />
      </div>

      {/* Main Wheel Container with Physics Rotation */}
      <div
        className="relative w-full max-w-[620px] aspect-square flex items-center justify-center cursor-grab active:cursor-grabbing transition-transform duration-200"
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
            sizes="(max-width: 768px) 100vw, 620px"
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
                      ? "fill-primary/20 stroke-primary stroke-[3]"
                      : isHighlighted
                      ? "fill-amber-400/30 stroke-amber-400 stroke-[3] animate-pulse"
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

        {/* STATIC COVER DISC (Upper wheel with viewing window slot at 12 o'clock) */}
        <div className="absolute inset-0 w-full h-full pointer-events-none rounded-full overflow-hidden">
          <Image
            src={dataset.upperWheelImage}
            alt="MEC Upper Wheel Viewing Slot"
            fill
            sizes="(max-width: 768px) 100vw, 620px"
            priority
            className="object-contain"
          />
        </div>

        {/* Center Pivot Pin Graphic */}
        <div className="absolute w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-slate-800 via-slate-600 to-slate-200 border-2 border-white shadow-xl flex items-center justify-center pointer-events-none z-10">
          <div className="w-2.5 h-2.5 rounded-full bg-primary ring-2 ring-white/50" />
        </div>
      </div>

      {/* User Guidance Micro-text */}
      <div className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground text-center">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        <span>Drag or flick wheel to spin &bull; Click any condition sector to rotate into view</span>
      </div>
    </div>
  );
}
