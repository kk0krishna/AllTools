"use client";

import React, { useRef, useState, useCallback } from "react";
import { LiquidSettings } from "./types";
import { LiquidShaderCanvas } from "./LiquidShaderCanvas";

interface LiquidGlassContainerProps {
  settings: LiquidSettings;
  children: React.ReactNode;
  className?: string;
  onEngineChange?: (engine: "gpu" | "safari-fallback") => void;
  showShader?: boolean;
}

export function LiquidGlassContainer({
  settings,
  children,
  className = "",
  onEngineChange,
  showShader = true,
}: LiquidGlassContainerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50, pxX: 0, pxY: 0 });
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      const pxX = e.clientX - rect.left;
      const pxY = e.clientY - rect.top;

      setMousePos({ x, y, pxX, pxY });

      if (settings.tiltEnabled) {
        const normX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
        const normY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
        // Subtle 3D tilt (max 3 degrees)
        setTilt({
          rx: -normY * 2.5,
          ry: normX * 2.5,
        });
      }
    },
    [settings.tiltEnabled]
  );

  const handlePointerLeave = useCallback(() => {
    setIsHovered(false);
    setTilt({ rx: 0, ry: 0 });
  }, []);

  const handlePointerEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  // Compute optical dispersion fringe colors
  const dispersionGlow =
    settings.dispersion > 0.4
      ? `0 0 25px rgba(56, 189, 248, ${0.15 * settings.dispersion}), 0 0 45px rgba(236, 72, 153, ${0.12 * settings.dispersion})`
      : "none";

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className={`relative rounded-3xl transition-transform duration-200 ease-out will-change-transform ${className}`}
      style={{
        transform:
          settings.tiltEnabled && isHovered
            ? `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`
            : "perspective(1000px) rotateX(0deg) rotateY(0deg)",
        boxShadow: dispersionGlow,
      }}
    >
      {/* 1. Underlying Liquid Refraction Shader */}
      {showShader && (
        <LiquidShaderCanvas
          settings={settings}
          onEngineChange={onEngineChange}
        />
      )}

      {/* 2. Glass Substrate Layer (Backdrop blur + tinted ambient body) */}
      <div
        className="absolute inset-0 rounded-3xl bg-background/55 dark:bg-card/45 backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-2xl transition-all duration-300"
        style={{
          backdropFilter: `blur(${16 + settings.ior * 8}px) saturate(${130 + settings.dispersion * 40}%)`,
          WebkitBackdropFilter: `blur(${16 + settings.ior * 8}px) saturate(${130 + settings.dispersion * 40}%)`,
        }}
      />

      {/* 3. Optical Specular Rim (Bevel Edge Lighting following the cursor) */}
      <div
        className="absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-300"
        style={{
          opacity: isHovered ? 0.9 : 0.4,
          background: `radial-gradient(
            600px circle at ${mousePos.x}% ${mousePos.y}%,
            rgba(255, 255, 255, ${0.35 * settings.caustics}),
            transparent 60%
          )`,
          border: `1.5px solid rgba(255, 255, 255, ${0.25 + settings.caustics * 0.25})`,
          maskImage: "linear-gradient(#fff, #fff)",
          WebkitMaskImage: "linear-gradient(#fff, #fff)",
        }}
      />

      {/* 4. Fluid Caustic Surface Sheen */}
      <div
        className="absolute inset-0 rounded-3xl pointer-events-none opacity-20 mix-blend-overlay transition-opacity duration-500"
        style={{
          background: `radial-gradient(
            circle at ${mousePos.x}% ${mousePos.y}%,
            rgba(56, 189, 248, 0.4),
            rgba(236, 72, 153, 0.2) 50%,
            transparent 80%
          )`,
        }}
      />

      {/* 5. Real DOM Elements (Interactive, Accessible, Clickable HTML Controls) */}
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
}
