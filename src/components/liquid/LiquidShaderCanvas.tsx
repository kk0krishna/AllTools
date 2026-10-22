"use client";

import React, { useEffect, useRef, useState } from "react";
import { PRESET_CONFIGS, LiquidSettings } from "./types";

interface LiquidShaderCanvasProps {
  settings: LiquidSettings;
  className?: string;
  onEngineChange?: (engine: "gpu" | "safari-fallback") => void;
}

const VERTEX_SHADER_SRC = `
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = (position + 1.0) * 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER_SRC = `
  precision mediump float;
  varying vec2 vUv;
  
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform float u_ior;
  uniform float u_dispersion;
  uniform float u_caustics;
  uniform float u_viscosity;
  uniform vec3 u_colorA;
  uniform vec3 u_colorB;
  uniform vec3 u_colorC;
  uniform float u_has_pointer;

  // Fluid wave height function
  float getWave(vec2 p, float t) {
    float w = 0.0;
    float freq = 3.0 * u_viscosity;
    w += sin(p.x * freq + t * 1.8) * 0.35;
    w += cos(p.y * (freq * 0.9) - t * 1.4) * 0.35;
    w += sin((p.x + p.y) * (freq * 1.4) + t * 2.2) * 0.25;
    w += cos(length(p) * (freq * 1.8) - t * 2.0) * 0.2;

    // Interactive pointer ripple
    if (u_has_pointer > 0.5) {
      vec2 m = u_mouse;
      float d = distance(p, m);
      float ripple = sin(d * 22.0 - t * 6.0) * exp(-d * 4.5);
      w += ripple * 0.75;
    }
    return w;
  }

  void main() {
    vec2 p = (gl_FragCoord.xy * 2.0 - u_resolution) / min(u_resolution.x, u_resolution.y);
    float t = u_time * (0.8 + u_viscosity * 0.6);

    // Compute surface normals using finite difference
    float eps = 0.012;
    float h = getWave(p, t);
    float hx = getWave(p + vec2(eps, 0.0), t);
    float hy = getWave(p + vec2(0.0, eps), t);

    vec3 normal = normalize(vec3(-(hx - h) / eps, -(hy - h) / eps, 1.0));
    vec3 lightDir = normalize(vec3(0.5, 0.8, 1.2));
    if (u_has_pointer > 0.5) {
      vec2 m = (u_mouse * 2.0 - 1.0);
      lightDir = normalize(vec3(m.x * 0.8, -m.y * 0.8, 1.0));
    }

    // Specular highlight
    vec3 viewDir = vec3(0.0, 0.0, 1.0);
    vec3 halfVec = normalize(lightDir + viewDir);
    float spec = pow(max(dot(normal, halfVec), 0.0), 32.0) * u_caustics * 1.5;

    // Fresnel reflection
    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0) * 0.75;

    // Optical refraction with chromatic dispersion
    float eta = 1.0 / u_ior;
    float dispFactor = u_dispersion * 0.06;

    vec2 refractR = normal.xy * (eta - dispFactor) * 0.25;
    vec2 refractG = normal.xy * eta * 0.25;
    vec2 refractB = normal.xy * (eta + dispFactor) * 0.25;

    // Caustics intensity (curvature concentration)
    float caustic = pow(clamp(hx + hy - 2.0 * h, -1.0, 1.0) * 2.5 + 0.5, 2.0) * u_caustics;

    // Composite fluid colors with dispersion
    vec3 colR = mix(u_colorA, u_colorB, clamp(vUv.x + refractR.x + caustic * 0.3, 0.0, 1.0));
    vec3 colG = mix(u_colorB, u_colorC, clamp(vUv.y + refractG.y + caustic * 0.3, 0.0, 1.0));
    vec3 colB = mix(u_colorC, u_colorA, clamp(length(vUv - 0.5) + refractB.x + caustic * 0.3, 0.0, 1.0));

    vec3 fluidColor = vec3(colR.r, colG.g, colB.b);

    // Apply caustics, specular reflection, and fresnel sheen
    fluidColor += vec3(caustic * 0.45);
    fluidColor += vec3(spec * 0.85);
    fluidColor += vec3(fresnel * 0.35);

    // Controlled alpha for real DOM readability
    float alpha = clamp(0.22 + caustic * 0.18 + spec * 0.25, 0.15, 0.65);

    gl_FragColor = vec4(fluidColor, alpha);
  }
`;

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const num = parseInt(clean, 16);
  return [
    ((num >> 16) & 255) / 255,
    ((num >> 8) & 255) / 255,
    (num & 255) / 255,
  ];
}

export function LiquidShaderCanvas({
  settings,
  className = "",
  onEngineChange,
}: LiquidShaderCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const mousePosRef = useRef<{ x: number; y: number; active: boolean }>({
    x: 0.5,
    y: 0.5,
    active: false,
  });

  const [webGlSupported, setWebGlSupported] = useState<boolean>(true);

  useEffect(() => {
    if (settings.engine === "safari-fallback") {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    let gl: WebGLRenderingContext | null = null;
    try {
      gl = canvas.getContext("webgl", {
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      }) || (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    } catch {
      gl = null;
    }

    if (!gl) {
      console.warn("WebGL not supported, activating Safari/Universal CSS fallback");
      setWebGlSupported(false);
      onEngineChange?.("safari-fallback");
      return;
    }

    // Compile helper
    const compileShader = (type: number, src: string) => {
      const shader = gl!.createShader(type);
      if (!shader) return null;
      gl!.shaderSource(shader, src);
      gl!.compileShader(shader);
      if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
        gl!.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vert = compileShader(gl.VERTEX_SHADER, VERTEX_SHADER_SRC);
    const frag = compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SRC);
    if (!vert || !frag) {
      setWebGlSupported(false);
      onEngineChange?.("safari-fallback");
      return;
    }

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vert);
    gl.attachShader(prog, frag);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      setWebGlSupported(false);
      onEngineChange?.("safari-fallback");
      return;
    }

    gl.useProgram(prog);

    // Full screen quad buffer
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const posLoc = gl.getAttribLocation(prog, "position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uRes = gl.getUniformLocation(prog, "u_resolution");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");
    const uIor = gl.getUniformLocation(prog, "u_ior");
    const uDisp = gl.getUniformLocation(prog, "u_dispersion");
    const uCaust = gl.getUniformLocation(prog, "u_caustics");
    const uVisc = gl.getUniformLocation(prog, "u_viscosity");
    const uColA = gl.getUniformLocation(prog, "u_colorA");
    const uColB = gl.getUniformLocation(prog, "u_colorB");
    const uColC = gl.getUniformLocation(prog, "u_colorC");
    const uHasPtr = gl.getUniformLocation(prog, "u_has_pointer");

    const resize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      const w = Math.floor(canvas.clientWidth * dpr);
      const h = Math.floor(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl?.viewport(0, 0, w, h);
      }
    };

    resize();
    window.addEventListener("resize", resize);

    const startTime = performance.now();

    const render = () => {
      if (!gl || !canvas) return;

      const now = (performance.now() - startTime) * 0.001;
      const presetColors = PRESET_CONFIGS[settings.preset]?.colors || ["#38bdf8", "#818cf8", "#ffffff"];
      const colA = hexToRgb(presetColors[0]);
      const colB = hexToRgb(presetColors[1]);
      const colC = hexToRgb(presetColors[2]);

      gl.uniform1f(uTime, now);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform2f(uMouse, mousePosRef.current.x, 1.0 - mousePosRef.current.y);
      gl.uniform1f(uIor, settings.ior);
      gl.uniform1f(uDisp, settings.dispersion);
      gl.uniform1f(uCaust, settings.caustics);
      gl.uniform1f(uVisc, settings.viscosity);
      gl.uniform3f(uColA, colA[0], colA[1], colA[2]);
      gl.uniform3f(uColB, colB[0], colB[1], colB[2]);
      gl.uniform3f(uColC, colC[0], colC[1], colC[2]);
      gl.uniform1f(uHasPtr, mousePosRef.current.active ? 1.0 : 0.0);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      mousePosRef.current = { x, y, active: true };
    };

    const handlePointerLeave = () => {
      mousePosRef.current.active = false;
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      if (gl && prog) {
        gl.deleteProgram(prog);
      }
    };
  }, [settings, onEngineChange]);

  // When in Safari / Universal Fallback mode or WebGL unavailable
  if (settings.engine === "safari-fallback" || !webGlSupported) {
    const preset = PRESET_CONFIGS[settings.preset];
    return (
      <div
        className={`absolute inset-0 pointer-events-none overflow-hidden rounded-3xl ${className}`}
        aria-hidden="true"
      >
        {/* Safari Fallback: Smooth CSS caustic mesh and fluid backdrop */}
        <div
          className="absolute inset-0 opacity-40 blur-3xl animate-pulse"
          style={{
            background: `radial-gradient(circle at 30% 20%, ${preset.colors[0]}44, transparent 50%),
                         radial-gradient(circle at 75% 75%, ${preset.colors[1]}44, transparent 50%),
                         radial-gradient(circle at 50% 50%, ${preset.colors[2]}22, transparent 60%)`,
            transition: "background 0.8s ease-in-out",
          }}
        />
        {/* Prismatic edge shimmer overlay */}
        <div
          className="absolute inset-0 opacity-20 mix-blend-screen"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              ${preset.colors[0]}15 20px,
              transparent 40px
            )`,
          }}
        />
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none rounded-3xl ${className}`}
      aria-hidden="true"
      style={{
        mixBlendMode: "screen",
        opacity: 0.9,
      }}
    />
  );
}
