export type GlassPreset = "vision" | "ocean" | "obsidian" | "prismatic";

export type GlassEngine = "gpu" | "safari-fallback";

export interface LiquidSettings {
  ior: number; // 1.0 to 2.4 (Index of refraction)
  dispersion: number; // 0.0 to 1.0 (Chromatic aberration)
  viscosity: number; // 0.1 to 1.0 (Fluid wave speed)
  caustics: number; // 0.0 to 1.0 (Caustic intensity)
  preset: GlassPreset;
  engine: GlassEngine;
  tiltEnabled: boolean;
  fluidWaves: boolean;
}

export const PRESET_CONFIGS: Record<GlassPreset, Partial<LiquidSettings> & { name: string; description: string; colors: string[] }> = {
  vision: {
    name: "VisionOS Liquid",
    description: "Ultra-clean crystal glass with soft refractive cyan-blue caustics",
    ior: 1.52,
    dispersion: 0.35,
    viscosity: 0.65,
    caustics: 0.8,
    colors: ["#38bdf8", "#818cf8", "#ffffff"],
  },
  ocean: {
    name: "Bioluminescent Deep",
    description: "Rich oceanic emerald and electric cyan refractive fluids",
    ior: 1.33,
    dispersion: 0.55,
    viscosity: 0.85,
    caustics: 0.95,
    colors: ["#2dd4bf", "#06b6d4", "#3b82f6"],
  },
  obsidian: {
    name: "Smoked Obsidian",
    description: "High-contrast dark luxury glass with iridescent edge dispersion",
    ior: 2.1,
    dispersion: 0.7,
    viscosity: 0.45,
    caustics: 0.6,
    colors: ["#a855f7", "#ec4899", "#f43f5e"],
  },
  prismatic: {
    name: "Prismatic Aurora",
    description: "Full optical spectrum dispersion with dynamic rainbow caustic ribbons",
    ior: 1.85,
    dispersion: 0.9,
    viscosity: 0.75,
    caustics: 1.0,
    colors: ["#f59e0b", "#ec4899", "#8b5cf6"],
  },
};
