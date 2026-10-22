"use client";

import React, { useState } from "react";
import {
  Sliders,
  Sparkles,
  Search,
  Cpu,
  RefreshCw,
  Compass,
  Heart,
  Wind,
  Calculator,
  Flame,
  CheckCircle2,
  Layers,
  Check,
  X,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { LiquidSettings, PRESET_CONFIGS, GlassPreset, GlassEngine } from "./types";
import { toolsRegistry } from "@/tools/registry";
import { Button } from "@/components/ui/button";

interface LiquidControlsPanelProps {
  settings: LiquidSettings;
  onUpdateSettings: (updater: (prev: LiquidSettings) => LiquidSettings) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function LiquidControlsPanel({
  settings,
  onUpdateSettings,
  searchQuery,
  onSearchChange,
}: LiquidControlsPanelProps) {
  const [activeTab, setActiveTab] = useState<"search" | "optics" | "engine">("search");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Filter tools based on query
  const filteredTools =
    searchQuery.trim() === ""
      ? []
      : toolsRegistry
          .filter(
            (t) =>
              t.metadata.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              t.metadata.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
              t.metadata.category.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .slice(0, 5);

  const setPreset = (preset: GlassPreset) => {
    const config = PRESET_CONFIGS[preset];
    onUpdateSettings((prev) => ({
      ...prev,
      preset,
      ior: config.ior ?? prev.ior,
      dispersion: config.dispersion ?? prev.dispersion,
      viscosity: config.viscosity ?? prev.viscosity,
      caustics: config.caustics ?? prev.caustics,
    }));
  };

  const getIorLabel = (ior: number) => {
    if (ior <= 1.1) return "Air (1.0)";
    if (ior <= 1.35) return "Water (1.33)";
    if (ior <= 1.5) return "Acrylic (1.49)";
    if (ior <= 1.6) return "Crown Glass (1.52)";
    if (ior <= 1.8) return "Flint Glass (1.65)";
    if (ior <= 2.1) return "Sapphire (1.77)";
    return "Diamond (2.42)";
  };

  return (
    <div className="flex flex-col w-full p-4 sm:p-6 md:p-8">
      {/* 1. Header Toolbar with Tab Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-white/15 dark:border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-xs sm:text-sm font-bold tracking-wider uppercase text-foreground/80 font-mono">
            Liquid DOM Studio
          </span>
          <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wide rounded-full bg-cyan-500/15 text-cyan-500 border border-cyan-500/30">
            {settings.engine === "gpu" ? "GPU Shader Active" : "Safari Fallback"}
          </span>
        </div>

        {/* Real HTML Tab Buttons */}
        <div className="flex items-center gap-1 p-1 bg-black/10 dark:bg-white/5 rounded-xl border border-white/10">
          <button
            type="button"
            onClick={() => setActiveTab("search")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "search"
                ? "bg-white dark:bg-slate-800 text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Search className="w-3.5 h-3.5 text-sky-500" />
            <span>Search & Launch</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("optics")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "optics"
                ? "bg-white dark:bg-slate-800 text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-purple-500" />
            <span>Glass Optics</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("engine")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "engine"
                ? "bg-white dark:bg-slate-800 text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-emerald-500" />
            <span>Engine & Fallback</span>
          </button>
        </div>
      </div>

      {/* 2. TAB CONTENT 1: SEARCH & QUICK LAUNCH */}
      {activeTab === "search" && (
        <div className="flex flex-col gap-4 animate-in fade-in duration-300">
          {/* Main Search Input inside Liquid Shell */}
          <div className="relative w-full">
            <div className="relative flex items-center bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-2xl border border-white/30 dark:border-white/10 shadow-inner group focus-within:ring-2 focus-within:ring-sky-500/40 focus-within:border-sky-500/50 transition-all overflow-hidden">
              <Search className="absolute left-4 w-5 h-5 text-muted-foreground group-focus-within:text-sky-500 transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 250)}
                placeholder="Search tools (e.g. WHO MEC Wheel, Emotion Compass, ABG Analyzer)..."
                className="w-full pl-12 pr-10 py-3.5 text-sm sm:text-base bg-transparent border-0 outline-none text-foreground placeholder:text-muted-foreground/60"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange("")}
                  className="absolute right-3 p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-black/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Live Autocomplete Dropdown */}
            {isSearchFocused && searchQuery.trim() !== "" && (
              <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-2xl border border-white/20 dark:border-white/10 shadow-2xl z-50 flex flex-col gap-1 animate-in fade-in slide-in-from-top-2">
                {filteredTools.length > 0 ? (
                  filteredTools.map((tool) => (
                    <Link
                      key={tool.metadata.slug}
                      href={`/tools/${tool.metadata.category}/${tool.metadata.slug}`}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-sky-500/10 dark:hover:bg-sky-500/20 transition-colors group"
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm text-foreground group-hover:text-sky-500 transition-colors">
                          {tool.metadata.name}
                        </span>
                        <span className="text-xs text-muted-foreground line-clamp-1">
                          {tool.metadata.description}
                        </span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-sky-500 shrink-0 ml-2" />
                    </Link>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-muted-foreground">
                    No tools found matching &quot;{searchQuery}&quot;
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Tool Launch Pills */}
          <div className="flex flex-col gap-2 pt-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              Featured Clinical & Everyday Tools
            </span>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/tools/obstetrics/who-mec-wheel"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 text-emerald-700 dark:text-emerald-300 text-xs font-semibold transition-all hover:scale-105 shadow-sm"
              >
                <Compass className="w-3.5 h-3.5 text-emerald-500" />
                WHO MEC Wheel
              </Link>

              <Link
                href="/tools/obstetrics/india-mec-wheel"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/25 text-sky-700 dark:text-sky-300 text-xs font-semibold transition-all hover:scale-105 shadow-sm"
              >
                <Compass className="w-3.5 h-3.5 text-sky-500" />
                India MEC Wheel
              </Link>

              <Link
                href="/tools/psychology/emotion-compass"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/25 text-violet-700 dark:text-violet-300 text-xs font-semibold transition-all hover:scale-105 shadow-sm"
              >
                <Heart className="w-3.5 h-3.5 text-violet-500" />
                Emotion Compass
              </Link>

              <Link
                href="/tools/pulmonology/abg-analyzer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/25 text-cyan-700 dark:text-cyan-300 text-xs font-semibold transition-all hover:scale-105 shadow-sm"
              >
                <Wind className="w-3.5 h-3.5 text-cyan-500" />
                ABG Analyzer
              </Link>

              <Link
                href="/tools/calculators/bmi-calculator"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/25 text-blue-700 dark:text-blue-300 text-xs font-semibold transition-all hover:scale-105 shadow-sm"
              >
                <Calculator className="w-3.5 h-3.5 text-blue-500" />
                BMI Calculator
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 3. TAB CONTENT 2: GLASS OPTICS SETTINGS */}
      {activeTab === "optics" && (
        <div className="flex flex-col gap-4 animate-in fade-in duration-300">
          {/* Preset Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground/80 flex items-center justify-between">
              <span>Glass Optical Preset</span>
              <span className="text-[11px] font-normal text-muted-foreground font-mono">
                {PRESET_CONFIGS[settings.preset].name}
              </span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(["vision", "ocean", "obsidian", "prismatic"] as GlassPreset[]).map((p) => {
                const config = PRESET_CONFIGS[p];
                const isActive = settings.preset === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPreset(p)}
                    className={`flex items-center gap-2 p-2 rounded-xl text-xs font-semibold transition-all border ${
                      isActive
                        ? "bg-white/80 dark:bg-slate-800 border-sky-500 text-foreground shadow-md ring-1 ring-sky-500/30"
                        : "bg-black/5 dark:bg-white/5 border-white/10 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <div
                      className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                      style={{
                        background: `linear-gradient(135deg, ${config.colors[0]}, ${config.colors[1]})`,
                      }}
                    />
                    <span className="truncate">{config.name.split(" ")[0]}</span>
                    {isActive && <Check className="w-3 h-3 text-sky-500 ml-auto shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Range Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {/* IOR Slider */}
            <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-white/10">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground/90">Refraction Index (IOR)</span>
                <span className="font-mono text-[11px] text-sky-500 font-bold">
                  {settings.ior.toFixed(2)} • {getIorLabel(settings.ior)}
                </span>
              </div>
              <input
                type="range"
                min="1.0"
                max="2.42"
                step="0.02"
                value={settings.ior}
                onChange={(e) =>
                  onUpdateSettings((prev) => ({ ...prev, ior: parseFloat(e.target.value) }))
                }
                className="w-full accent-sky-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
              />
              <span className="text-[10px] text-muted-foreground">
                Controls optical light bending angle through the glass shell
              </span>
            </div>

            {/* Dispersion / Chromatic Aberration Slider */}
            <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-white/10">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground/90">Dispersion (RGB Split)</span>
                <span className="font-mono text-[11px] text-purple-500 font-bold">
                  {Math.round(settings.dispersion * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={settings.dispersion}
                onChange={(e) =>
                  onUpdateSettings((prev) => ({
                    ...prev,
                    dispersion: parseFloat(e.target.value),
                  }))
                }
                className="w-full accent-purple-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
              />
              <span className="text-[10px] text-muted-foreground">
                Splits light into spectral prism wavelengths at refractive borders
              </span>
            </div>

            {/* Viscosity Slider */}
            <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-white/10">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground/90">Fluid Viscosity</span>
                <span className="font-mono text-[11px] text-emerald-500 font-bold">
                  {Math.round(settings.viscosity * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.2"
                max="1.0"
                step="0.05"
                value={settings.viscosity}
                onChange={(e) =>
                  onUpdateSettings((prev) => ({
                    ...prev,
                    viscosity: parseFloat(e.target.value),
                  }))
                }
                className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
              />
              <span className="text-[10px] text-muted-foreground">
                Governs surface tension, ripple wave frequency, and damping
              </span>
            </div>

            {/* Caustics Intensity Slider */}
            <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-white/10">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground/90">Caustic Shimmer</span>
                <span className="font-mono text-[11px] text-amber-500 font-bold">
                  {Math.round(settings.caustics * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={settings.caustics}
                onChange={(e) =>
                  onUpdateSettings((prev) => ({
                    ...prev,
                    caustics: parseFloat(e.target.value),
                  }))
                }
                className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
              />
              <span className="text-[10px] text-muted-foreground">
                Concentration of photon rays converging on the substrate
              </span>
            </div>
          </div>

          {/* Toggle Switches */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <button
              type="button"
              onClick={() =>
                onUpdateSettings((prev) => ({ ...prev, tiltEnabled: !prev.tiltEnabled }))
              }
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                settings.tiltEnabled
                  ? "bg-sky-500/15 border-sky-500/30 text-sky-600 dark:text-sky-300"
                  : "bg-black/5 dark:bg-white/5 border-white/10 text-muted-foreground"
              }`}
            >
              <div
                className={`w-4 h-4 rounded flex items-center justify-center border ${
                  settings.tiltEnabled ? "bg-sky-500 border-sky-500 text-white" : "border-muted-foreground"
                }`}
              >
                {settings.tiltEnabled && <Check className="w-3 h-3" />}
              </div>
              <span>Interactive 3D Perspective Tilt</span>
            </button>

            <button
              type="button"
              onClick={() =>
                onUpdateSettings((prev) => ({ ...prev, fluidWaves: !prev.fluidWaves }))
              }
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                settings.fluidWaves
                  ? "bg-purple-500/15 border-purple-500/30 text-purple-600 dark:text-purple-300"
                  : "bg-black/5 dark:bg-white/5 border-white/10 text-muted-foreground"
              }`}
            >
              <div
                className={`w-4 h-4 rounded flex items-center justify-center border ${
                  settings.fluidWaves
                    ? "bg-purple-500 border-purple-500 text-white"
                    : "border-muted-foreground"
                }`}
              >
                {settings.fluidWaves && <Check className="w-3 h-3" />}
              </div>
              <span>Continuous Fluid Shimmer Waves</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. TAB CONTENT 3: ENGINE & FALLBACK SYSTEM */}
      {activeTab === "engine" && (
        <div className="flex flex-col gap-4 animate-in fade-in duration-300">
          <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-white/10 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-foreground flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-500" />
                Active Rendering Pipeline
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                60 FPS Target
              </span>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Liquid DOM natively supports progressive GPU composition. When WebGPU or WebGL is
              available, real-time refractive caustics and Snell&apos;s law ray bending are
              computed in hardware. For Safari, iOS, and low-power devices, an optimized CSS
              backdrop-filter &amp; specular gradient pipeline seamlessly takes over.
            </p>

            {/* Engine Switcher Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() =>
                  onUpdateSettings((prev) => ({ ...prev, engine: "gpu" as GlassEngine }))
                }
                className={`flex flex-col items-start gap-1 p-3 rounded-xl border text-left transition-all ${
                  settings.engine === "gpu"
                    ? "bg-sky-500/15 border-sky-500/40 text-foreground shadow-md ring-1 ring-sky-500/20"
                    : "bg-black/5 dark:bg-white/5 border-white/10 text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs text-sky-500">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>⚡ WebGPU / WebGL Shader</span>
                </div>
                <span className="text-[11px] text-muted-foreground">
                  Hardware-accelerated refractive fluids, caustic ripples &amp; dispersion
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  onUpdateSettings((prev) => ({
                    ...prev,
                    engine: "safari-fallback" as GlassEngine,
                  }))
                }
                className={`flex flex-col items-start gap-1 p-3 rounded-xl border text-left transition-all ${
                  settings.engine === "safari-fallback"
                    ? "bg-purple-500/15 border-purple-500/40 text-foreground shadow-md ring-1 ring-purple-500/20"
                    : "bg-black/5 dark:bg-white/5 border-white/10 text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs text-purple-500">
                  <Layers className="w-3.5 h-3.5" />
                  <span>🍏 Safari &amp; Universal CSS Fallback</span>
                </div>
                <span className="text-[11px] text-muted-foreground">
                  Zero-overhead CSS backdrop-filter, multi-stop specular bevels &amp; glow
                </span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
            <span>Built with React 19 + Tailwind CSS + WebGL Optics</span>
            <button
              type="button"
              onClick={() => setPreset("vision")}
              className="flex items-center gap-1 text-sky-500 hover:underline font-semibold"
            >
              <RefreshCw className="w-3 h-3" />
              Reset to Defaults
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
