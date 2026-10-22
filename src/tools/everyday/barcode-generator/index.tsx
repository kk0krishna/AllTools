"use client";

import React, { useState, useRef, useEffect, useId, useTransition } from "react";
import Barcode from "react-barcode";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  Download,
  Copy,
  Check,
  Maximize2,
  X,
  Printer,
  Sparkles,
  Sliders,
  Palette,
  Eye,
  EyeOff,
  AlertCircle,
  FileCode,
  Image as ImageIcon,
  Scan,
  RotateCcw,
  Smartphone,
  ExternalLink,
  ChevronDown,
  Info
} from "lucide-react";

type BarcodeFormat =
  | "CODE128"
  | "CODE39"
  | "EAN13"
  | "EAN8"
  | "UPC"
  | "ITF14"
  | "MSI"
  | "pharmacode"
  | "codabar";

interface PresetItem {
  name: string;
  badge: string;
  format: BarcodeFormat;
  value: string;
  description: string;
}

const PRESETS: PresetItem[] = [
  {
    name: "Retail Product",
    badge: "EAN-13",
    format: "EAN13",
    value: "590123412345",
    description: "International standard retail product GTIN",
  },
  {
    name: "US Retail",
    badge: "UPC-A",
    format: "UPC",
    value: "012345678905",
    description: "North American 12-digit consumer barcode",
  },
  {
    name: "Shipping & Package",
    badge: "CODE128",
    format: "CODE128",
    value: "PKG-2026-X99",
    description: "High-density alphanumeric logistics barcode",
  },
  {
    name: "Master Carton",
    badge: "ITF-14",
    format: "ITF14",
    value: "10012345678902",
    description: "14-digit corrugated shipping container packaging",
  },
  {
    name: "Inventory Tag",
    badge: "CODE39",
    format: "CODE39",
    value: "ASSET-8409",
    description: "Alphanumeric industrial asset tracking",
  },
  {
    name: "Book ISBN",
    badge: "ISBN",
    format: "EAN13",
    value: "9780201379624",
    description: "Standard Book Identification Code",
  },
  {
    name: "Pharmaceutical",
    badge: "Pharma",
    format: "pharmacode",
    value: "12480",
    description: "Binary medicine packaging control code",
  },
];

interface ColorTheme {
  name: string;
  lineColor: string;
  background: string;
}

const COLOR_THEMES: ColorTheme[] = [
  { name: "Classic Print", lineColor: "#000000", background: "#ffffff" },
  { name: "Clean Slate", lineColor: "#0f172a", background: "#f8fafc" },
  { name: "Navy Crisp", lineColor: "#1e3a8a", background: "#ffffff" },
  { name: "Forest Tint", lineColor: "#064e3b", background: "#f0fdf4" },
  { name: "High Contrast Inverted", lineColor: "#ffffff", background: "#090d16" },
];

function validateBarcode(format: BarcodeFormat, val: string): { valid: boolean; message?: string; sampleFix?: string } {
  const clean = val.trim();
  if (!clean) {
    return { valid: false, message: "Enter a value to generate the barcode" };
  }

  switch (format) {
    case "EAN13":
      if (!/^\d+$/.test(clean)) {
        return { valid: false, message: "EAN-13 only accepts numeric digits (0-9).", sampleFix: "590123412345" };
      }
      if (clean.length !== 12 && clean.length !== 13) {
        return {
          valid: false,
          message: `EAN-13 requires 12 or 13 digits (current length: ${clean.length}).`,
          sampleFix: "590123412345",
        };
      }
      return { valid: true };

    case "EAN8":
      if (!/^\d+$/.test(clean)) {
        return { valid: false, message: "EAN-8 only accepts numeric digits (0-9).", sampleFix: "96385074" };
      }
      if (clean.length !== 7 && clean.length !== 8) {
        return {
          valid: false,
          message: `EAN-8 requires 7 or 8 digits (current length: ${clean.length}).`,
          sampleFix: "96385074",
        };
      }
      return { valid: true };

    case "UPC":
      if (!/^\d+$/.test(clean)) {
        return { valid: false, message: "UPC-A only accepts numeric digits (0-9).", sampleFix: "012345678905" };
      }
      if (clean.length !== 11 && clean.length !== 12) {
        return {
          valid: false,
          message: `UPC-A requires 11 or 12 digits (current length: ${clean.length}).`,
          sampleFix: "012345678905",
        };
      }
      return { valid: true };

    case "ITF14":
      if (!/^\d+$/.test(clean)) {
        return { valid: false, message: "ITF-14 only accepts numeric digits (0-9).", sampleFix: "10012345678902" };
      }
      if (clean.length !== 14) {
        return {
          valid: false,
          message: `ITF-14 requires exactly 14 digits (current length: ${clean.length}).`,
          sampleFix: "10012345678902",
        };
      }
      return { valid: true };

    case "MSI":
      if (!/^\d+$/.test(clean)) {
        return { valid: false, message: "MSI only accepts numeric digits (0-9).", sampleFix: "1234567" };
      }
      return { valid: true };

    case "pharmacode":
      if (!/^\d+$/.test(clean)) {
        return { valid: false, message: "Pharmacode requires an integer number.", sampleFix: "12345" };
      }
      const num = parseInt(clean, 10);
      if (num < 3 || num > 131070) {
        return {
          valid: false,
          message: "Pharmacode value must be between 3 and 131070.",
          sampleFix: "12480",
        };
      }
      return { valid: true };

    case "CODE39":
      if (!/^[0-9A-Z\-\.\ \$\/\+\%]+$/i.test(clean)) {
        return {
          valid: false,
          message: "CODE39 only accepts A-Z, 0-9, and symbols - . $ / + % space.",
          sampleFix: "ASSET-902",
        };
      }
      return { valid: true };

    case "codabar":
      if (!/^[A-D][0-9\-\$\:\/\.\+]+[A-D]$/i.test(clean)) {
        return {
          valid: false,
          message: "Codabar must start and end with A, B, C, or D (e.g. A12345B).",
          sampleFix: "A12345678B",
        };
      }
      return { valid: true };

    case "CODE128":
    default:
      if (!/^[\x00-\x7F]+$/.test(clean)) {
        return { valid: false, message: "CODE128 accepts standard ASCII characters." };
      }
      return { valid: true };
  }
}

export function BarcodeGenerator() {
  const [value, setValue] = useState("123456789012");
  const [format, setFormat] = useState<BarcodeFormat>("CODE128");
  const [lineColor, setLineColor] = useState("#000000");
  const [background, setBackground] = useState("#ffffff");

  // Dimensional & Visual fine-tuning
  const [barWidth, setBarWidth] = useState(2);
  const [barHeight, setBarHeight] = useState(90);
  const [margin, setMargin] = useState(14);
  const [displayValue, setDisplayValue] = useState(true);
  const [fontSize, setFontSize] = useState(16);

  // Presentation Mode: 'fit' for 100% responsive fit on any screen, 'actual' for 1:1 scale
  const [fitMode, setFitMode] = useState<"fit" | "actual">("fit");
  const [exportScale, setExportScale] = useState<number>(2); // 1x, 2x, 3x
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // SVG Measurement & Dimensions
  const [naturalDimensions, setNaturalDimensions] = useState<{ width: number; height: number }>({
    width: 340,
    height: 140,
  });

  const svgContainerRef = useRef<HTMLDivElement>(null);
  const fullscreenContainerRef = useRef<HTMLDivElement>(null);

  const validation = validateBarcode(format, value);

  // Ensure SVG has proper viewBox and responsive styling dynamically
  useEffect(() => {
    if (!validation.valid) return;

    const postProcessSvg = (container: HTMLElement | null) => {
      if (!container) return;
      const svg = container.querySelector("svg");
      if (!svg) return;

      // Extract natural dimensions from JsBarcode's generated attributes or viewBox
      let w = 0;
      let h = 0;
      const viewBox = svg.getAttribute("viewBox");
      if (viewBox) {
        const parts = viewBox.trim().split(/\s+/).map(Number);
        if (parts.length === 4 && parts[2] > 0 && parts[3] > 0) {
          w = parts[2];
          h = parts[3];
        }
      }
      if (!w || !h) {
        w = parseFloat(svg.getAttribute("width") || "320");
        h = parseFloat(svg.getAttribute("height") || "130");
      }

      setNaturalDimensions({ width: Math.round(w), height: Math.round(h) });

      // Guarantee viewBox is present for proportional vector scaling
      svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
      svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

      if (fitMode === "fit") {
        svg.style.width = "100%";
        svg.style.maxWidth = "100%";
        svg.style.height = "auto";
        svg.style.maxHeight = "280px";
        svg.style.display = "block";
        svg.style.margin = "0 auto";
      } else {
        svg.style.width = `${w}px`;
        svg.style.maxWidth = "none";
        svg.style.height = `${h}px`;
        svg.style.maxHeight = "none";
        svg.style.display = "block";
        svg.style.margin = "0 auto";
      }
    };

    postProcessSvg(svgContainerRef.current);
    if (isFullscreen) {
      postProcessSvg(fullscreenContainerRef.current);
    }
  }, [value, format, barWidth, barHeight, margin, displayValue, fontSize, lineColor, background, fitMode, isFullscreen, validation.valid]);

  // Clean filename helper
  const cleanFilename = (str: string) => {
    return str.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 30) || "barcode";
  };

  // Generate high-resolution Canvas from SVG with razor-sharp non-smoothed pixel edges
  const generateCanvas = async (scale: number = 2): Promise<HTMLCanvasElement | null> => {
    const svg = svgContainerRef.current?.querySelector("svg");
    if (!svg) return null;

    const clonedSvg = svg.cloneNode(true) as SVGSVGElement;
    let width = naturalDimensions.width || 340;
    let height = naturalDimensions.height || 140;

    const viewBox = clonedSvg.getAttribute("viewBox");
    if (viewBox) {
      const parts = viewBox.trim().split(/\s+/).map(Number);
      if (parts.length === 4 && parts[2] > 0 && parts[3] > 0) {
        width = parts[2];
        height = parts[3];
      }
    }

    clonedSvg.setAttribute("width", `${width}px`);
    clonedSvg.setAttribute("height", `${height}px`);
    clonedSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

    const svgData = new XMLSerializer().serializeToString(clonedSvg);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(width * scale);
        canvas.height = Math.round(height * scale);
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.imageSmoothingEnabled = false; // Laser-sharp bar edges
          ctx.scale(scale, scale);
          if (background && background !== "transparent") {
            ctx.fillStyle = background;
            ctx.fillRect(0, 0, width, height);
          }
          ctx.drawImage(img, 0, 0, width, height);
        }
        URL.revokeObjectURL(url);
        resolve(canvas);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(null);
      };
      img.src = url;
    });
  };

  // Download High-Resolution PNG
  const downloadPng = async (scaleMultiplier: number = exportScale) => {
    const canvas = await generateCanvas(scaleMultiplier);
    if (!canvas) return;

    const pngUrl = canvas.toDataURL("image/png");
    const downloadLink = document.createElement("a");
    downloadLink.download = `barcode-${format}-${cleanFilename(value)}-${scaleMultiplier}x.png`;
    downloadLink.href = pngUrl;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  // Download Lossless Vector SVG
  const downloadSvg = () => {
    const svg = svgContainerRef.current?.querySelector("svg");
    if (!svg) return;

    const clonedSvg = svg.cloneNode(true) as SVGSVGElement;
    let width = naturalDimensions.width || 340;
    let height = naturalDimensions.height || 140;

    clonedSvg.setAttribute("width", `${width}px`);
    clonedSvg.setAttribute("height", `${height}px`);
    clonedSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

    const svgData = new XMLSerializer().serializeToString(clonedSvg);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `barcode-${format}-${cleanFilename(value)}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Copy Image to Clipboard
  const copyImageToClipboard = async () => {
    try {
      const canvas = await generateCanvas(2);
      if (!canvas) return;

      canvas.toBlob(async (blob) => {
        if (!blob) return;
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ "image/png": blob }),
          ]);
          setCopied(true);
          setTimeout(() => setCopied(false), 2200);
        } catch (err) {
          console.warn("Direct clipboard image write not supported, falling back to data URL copy", err);
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 2200);
        }
      }, "image/png");
    } catch (err) {
      console.error("Failed to copy image:", err);
    }
  };

  // Print Thermal Label / Paper
  const printBarcode = async () => {
    const canvas = await generateCanvas(3);
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");

    const printWin = window.open("", "_blank");
    if (!printWin) return;

    printWin.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Barcode - ${value}</title>
          <style>
            @page { size: auto; margin: 8mm; }
            * { box-sizing: border-box; }
            body {
              margin: 0;
              padding: 20px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace;
              background: #fff;
            }
            .label-card {
              border: 1px dashed #ccc;
              padding: 16px;
              border-radius: 8px;
              text-align: center;
              max-width: 420px;
              width: 100%;
            }
            img {
              max-width: 100%;
              height: auto;
              image-rendering: -webkit-optimize-contrast;
              image-rendering: crisp-edges;
              image-rendering: pixelated;
              display: block;
              margin: 0 auto;
            }
            .info {
              margin-top: 10px;
              font-size: 13px;
              font-family: monospace;
              font-weight: 600;
              color: #111;
            }
            .sub {
              font-size: 10px;
              color: #777;
              margin-top: 4px;
            }
          </style>
        </head>
        <body>
          <div class="label-card">
            <img src="${dataUrl}" alt="Barcode ${value}" />
            <div class="info">${value}</div>
            <div class="sub">${format} • ToolVerse Barcode</div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() { window.close(); };
            };
          </script>
        </body>
      </html>
    `);
    printWin.document.close();
  };

  // Keyboard shortcut to close fullscreen with Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Quick Use-Case Presets Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            Quick Presets
          </Label>
          <span className="text-[11px] text-muted-foreground">Select a standard use-case</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-none -mx-1 px-1">
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => {
                setFormat(preset.format);
                setValue(preset.value);
              }}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all border",
                format === preset.format && value === preset.value
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-card hover:bg-accent/60 text-card-foreground border-border/80 hover:border-primary/40"
              )}
            >
              <span>{preset.name}</span>
              <span
                className={cn(
                  "text-[10px] px-1.5 py-0.2 rounded font-mono font-semibold",
                  format === preset.format && value === preset.value
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {preset.badge}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Studio Card */}
      <Card className="border border-border/70 shadow-lg bg-card/95 backdrop-blur-sm overflow-hidden">
        <CardHeader className="p-4 sm:p-6 border-b border-border/60 bg-muted/20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-lg sm:text-xl font-bold flex items-center gap-2">
                <Scan className="w-5 h-5 text-primary" />
                Barcode Studio
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Generate responsive, high-density vector barcodes for retail, inventory, packaging, and logistics.
              </CardDescription>
            </div>

            {/* Status & Dimensions Badge */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <Badge variant="outline" className="text-xs font-mono bg-background/80 py-1 px-2.5 border-border">
                {naturalDimensions.width} × {naturalDimensions.height} px
              </Badge>
              <Badge
                variant={validation.valid ? "default" : "destructive"}
                className="text-xs font-semibold py-1 px-2.5"
              >
                {validation.valid ? "Ready" : "Invalid Format"}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 space-y-6">
          {/* Input Controls Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Barcode Value */}
            <div className="md:col-span-8 space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="barcode-value" className="text-sm font-semibold flex items-center gap-1.5">
                  Barcode Value
                </Label>
                <span className="text-[11px] text-muted-foreground font-mono">
                  {value.length} characters
                </span>
              </div>
              <Input
                id="barcode-value"
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Enter alphanumeric or numeric code"
                className={cn(
                  "font-mono text-base tracking-wider bg-background transition-all",
                  !validation.valid && "border-destructive focus-visible:ring-destructive"
                )}
              />
              {/* Validation Warning & One-Click Sample Fix */}
              {!validation.valid && (
                <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs animate-in fade-in duration-200">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span className="truncate">{validation.message}</span>
                  </div>
                  {validation.sampleFix && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-7 text-[11px] shrink-0 border-destructive/30 hover:bg-destructive/15 text-destructive font-medium"
                      onClick={() => setValue(validation.sampleFix!)}
                    >
                      Use Sample
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Barcode Format */}
            <div className="md:col-span-4 space-y-1.5">
              <Label htmlFor="barcode-format" className="text-sm font-semibold">
                Barcode Standard
              </Label>
              <select
                id="barcode-format"
                value={format}
                onChange={(e) => setFormat(e.target.value as BarcodeFormat)}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="CODE128">CODE128 (General & Logistics)</option>
                <option value="EAN13">EAN-13 (International Retail)</option>
                <option value="UPC">UPC-A (North American Retail)</option>
                <option value="CODE39">CODE39 (Industrial & Asset)</option>
                <option value="ITF14">ITF-14 (Cartons & Master Packs)</option>
                <option value="EAN8">EAN-8 (Compact Retail)</option>
                <option value="MSI">MSI / Plessey (Supermarket Shelf)</option>
                <option value="pharmacode">Pharmacode (Pharmaceutical)</option>
                <option value="codabar">Codabar (Libraries & Photo Labs)</option>
              </select>
            </div>
          </div>

          {/* Quick Color Presets */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-border/40">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                <Palette className="w-3.5 h-3.5" />
                Color Theme:
              </span>
              <div className="flex items-center gap-1.5">
                {COLOR_THEMES.map((theme) => {
                  const isSelected = lineColor === theme.lineColor && background === theme.background;
                  return (
                    <button
                      key={theme.name}
                      type="button"
                      title={theme.name}
                      onClick={() => {
                        setLineColor(theme.lineColor);
                        setBackground(theme.background);
                      }}
                      className={cn(
                        "w-7 h-7 rounded-full border-2 transition-transform flex items-center justify-center relative overflow-hidden",
                        isSelected
                          ? "ring-2 ring-primary ring-offset-2 scale-110 border-primary"
                          : "border-border/80 hover:scale-105"
                      )}
                    >
                      <span
                        className="w-full h-full block"
                        style={{
                          background: `linear-gradient(135deg, ${theme.background} 50%, ${theme.lineColor} 50%)`,
                        }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs text-muted-foreground hover:text-foreground h-8 gap-1.5"
            >
              <Sliders className="w-3.5 h-3.5" />
              {showAdvanced ? "Hide Fine-Tuning" : "Appearance & Sizing"}
              <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", showAdvanced && "rotate-180")} />
            </Button>
          </div>

          {/* Collapsible Appearance & Sizing Controls */}
          {showAdvanced && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-muted/40 border border-border/60 animate-in fade-in duration-200">
              {/* Bar Width */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-foreground">Bar Width</span>
                  <span className="font-mono text-muted-foreground">{barWidth}px</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="4"
                  step="0.25"
                  value={barWidth}
                  onChange={(e) => setBarWidth(parseFloat(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              {/* Bar Height */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-foreground">Height</span>
                  <span className="font-mono text-muted-foreground">{barHeight}px</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="160"
                  step="5"
                  value={barHeight}
                  onChange={(e) => setBarHeight(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              {/* Margin / Quiet Zone */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-foreground">Quiet Zone (Margin)</span>
                  <span className="font-mono text-muted-foreground">{margin}px</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="35"
                  step="2"
                  value={margin}
                  onChange={(e) => setMargin(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              {/* Text Size / Display */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-foreground">Readable Text</span>
                  <div className="flex items-center gap-1.5">
                    <Switch
                      checked={displayValue}
                      onCheckedChange={(checked) => setDisplayValue(checked)}
                      id="display-value"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="range"
                    min="10"
                    max="26"
                    step="1"
                    disabled={!displayValue}
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary disabled:opacity-40"
                  />
                  <span className="text-[11px] font-mono text-muted-foreground min-w-[28px] text-right">
                    {fontSize}px
                  </span>
                </div>
              </div>

              {/* Custom Line Color */}
              <div className="space-y-1.5">
                <Label htmlFor="custom-line-color" className="text-xs font-medium">
                  Custom Bar Color
                </Label>
                <div className="flex items-center gap-2">
                  <input
                    id="custom-line-color"
                    type="color"
                    value={lineColor}
                    onChange={(e) => setLineColor(e.target.value)}
                    className="h-8 w-10 p-0 border border-input rounded cursor-pointer bg-background"
                  />
                  <Input
                    type="text"
                    value={lineColor}
                    onChange={(e) => setLineColor(e.target.value)}
                    className="h-8 font-mono text-xs uppercase"
                    maxLength={7}
                  />
                </div>
              </div>

              {/* Custom Background Color */}
              <div className="space-y-1.5">
                <Label htmlFor="custom-bg-color" className="text-xs font-medium">
                  Custom Background
                </Label>
                <div className="flex items-center gap-2">
                  <input
                    id="custom-bg-color"
                    type="color"
                    value={background}
                    onChange={(e) => setBackground(e.target.value)}
                    className="h-8 w-10 p-0 border border-input rounded cursor-pointer bg-background"
                  />
                  <Input
                    type="text"
                    value={background}
                    onChange={(e) => setBackground(e.target.value)}
                    className="h-8 font-mono text-xs uppercase"
                    maxLength={7}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* THE PRESENTATION STAGE - RESPONSIVE & MOBILE-OPTIMIZED */}
          {/* ============================================================ */}
          <div className="relative rounded-2xl border border-border/80 bg-neutral-900/[0.03] dark:bg-neutral-900/40 p-2 sm:p-5 overflow-hidden transition-all">
            {/* Stage Toolbar */}
            <div className="flex items-center justify-between pb-3 px-1 gap-2 border-b border-border/40">
              {/* Presentation Mode Toggle */}
              <div className="flex items-center gap-1 bg-background/80 border border-border/60 p-0.5 rounded-lg">
                <button
                  type="button"
                  onClick={() => setFitMode("fit")}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all",
                    fitMode === "fit"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  title="Scale barcode proportionally so 100% of it is visible on screen without scrollbars"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Fit to Screen</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFitMode("actual")}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all",
                    fitMode === "actual"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  title="View at 1:1 original pixel print size"
                >
                  <span>1:1 Actual</span>
                </button>
              </div>

              {/* Fullscreen Scanner Mode Button */}
              <div className="flex items-center gap-1.5">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setIsFullscreen(true)}
                  disabled={!validation.valid}
                  className="h-8 text-xs font-medium gap-1.5 border-border/80 hover:bg-accent/80"
                  title="Open edge-to-edge scanner mode with maximum contrast"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-primary" />
                  <span className="hidden sm:inline">Scanner Mode</span>
                  <span className="sm:hidden">Fullscreen</span>
                </Button>
              </div>
            </div>

            {/* The Barcode Surface */}
            <div className="relative flex items-center justify-center min-h-[170px] sm:min-h-[200px] py-4 px-1 sm:px-4">
              {validation.valid ? (
                <div
                  ref={svgContainerRef}
                  className={cn(
                    "transition-all duration-300 rounded-xl p-2 sm:p-5 shadow-sm border border-border/40 select-none flex items-center justify-center",
                    fitMode === "fit" ? "w-full max-w-full overflow-hidden" : "w-auto max-w-full overflow-x-auto"
                  )}
                  style={{
                    backgroundColor: background,
                  }}
                >
                  <Barcode
                    value={value}
                    format={format}
                    lineColor={lineColor}
                    background={background}
                    width={barWidth}
                    height={barHeight}
                    margin={margin}
                    displayValue={displayValue}
                    fontSize={fontSize}
                    font="monospace"
                    renderer="svg"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center space-y-2 text-muted-foreground">
                  <AlertCircle className="w-8 h-8 text-destructive/80 mb-1" />
                  <p className="text-sm font-medium text-foreground">Unable to generate barcode</p>
                  <p className="text-xs max-w-sm">{validation.message || "Please enter a valid value."}</p>
                </div>
              )}
            </div>

            {/* Bottom Tip for Mobile Users */}
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground pt-1 pb-1">
              <Info className="w-3 h-3 text-primary/70 shrink-0" />
              <span>
                {fitMode === "fit"
                  ? "Fit mode auto-scales barcode vector so all bars and numbers stay fully visible on mobile."
                  : "Actual mode displays 1:1 scale with horizontal panning."}
              </span>
            </div>
          </div>

          {/* ============================================================ */}
          {/* EXPORT & ACTION CONTROLS */}
          {/* ============================================================ */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Export & Actions
              </Label>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span>PNG Scale:</span>
                {[1, 2, 3].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setExportScale(s)}
                    className={cn(
                      "px-2 py-0.5 rounded text-[11px] font-mono font-semibold transition-all",
                      exportScale === s
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80 text-muted-foreground"
                    )}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* Primary Download PNG */}
              <Button
                type="button"
                onClick={() => downloadPng(exportScale)}
                disabled={!validation.valid}
                className="h-11 font-semibold gap-2 shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>PNG ({exportScale}x)</span>
              </Button>

              {/* Vector SVG */}
              <Button
                type="button"
                variant="outline"
                onClick={downloadSvg}
                disabled={!validation.valid}
                className="h-11 font-semibold gap-2 border-border/80 hover:bg-accent/80"
              >
                <FileCode className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Vector SVG</span>
              </Button>

              {/* Copy Image */}
              <Button
                type="button"
                variant="outline"
                onClick={copyImageToClipboard}
                disabled={!validation.valid}
                className={cn(
                  "h-11 font-semibold gap-2 border-border/80 transition-all",
                  copied && "border-green-500 bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-300"
                )}
              >
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? "Copied!" : "Copy Image"}</span>
              </Button>

              {/* Print Label */}
              <Button
                type="button"
                variant="outline"
                onClick={printBarcode}
                disabled={!validation.valid}
                className="h-11 font-semibold gap-2 border-border/80 hover:bg-accent/80"
              >
                <Printer className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Print Label</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ============================================================ */}
      {/* FULLSCREEN / SCANNER DISPLAY MODAL */}
      {/* ============================================================ */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-8 animate-in fade-in duration-200">
          {/* Modal Header */}
          <div className="w-full max-w-2xl flex items-center justify-between text-white pb-4">
            <div className="flex items-center gap-2">
              <Scan className="w-5 h-5 text-primary" />
              <span className="font-bold text-sm sm:text-base">Scanner Mode</span>
              <Badge variant="outline" className="text-white border-white/20 text-xs font-mono">
                {format}
              </Badge>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setIsFullscreen(false)}
              className="text-white hover:bg-white/10 rounded-full h-9 w-9"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* High-Contrast Presentation Card for Direct Scanning */}
          <div className="w-full max-w-2xl my-auto">
            <div
              ref={fullscreenContainerRef}
              className="bg-white rounded-2xl p-6 sm:p-12 shadow-2xl flex flex-col items-center justify-center space-y-4"
              style={{ backgroundColor: background }}
            >
              <div className="w-full flex items-center justify-center overflow-hidden">
                <Barcode
                  value={value}
                  format={format}
                  lineColor={lineColor}
                  background={background}
                  width={Math.max(barWidth, 2.2)}
                  height={Math.max(barHeight, 110)}
                  margin={Math.max(margin, 16)}
                  displayValue={displayValue}
                  fontSize={Math.max(fontSize, 18)}
                  font="monospace"
                  renderer="svg"
                />
              </div>

              <div className="text-center pt-2">
                <p className="font-mono text-lg sm:text-xl font-bold tracking-widest text-black">
                  {value}
                </p>
                <p className="text-xs text-neutral-500 font-medium mt-1">
                  Ready to scan • Hold 4-8 inches from retail or phone scanner
                </p>
              </div>
            </div>
          </div>

          {/* Modal Footer Controls */}
          <div className="w-full max-w-2xl flex flex-wrap items-center justify-center gap-3 pt-4">
            <Button
              type="button"
              onClick={copyImageToClipboard}
              variant="secondary"
              className="font-medium gap-2 text-xs sm:text-sm bg-white/20 hover:bg-white/30 text-white border-0"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? "Copied to Clipboard" : "Copy Barcode"}</span>
            </Button>

            <Button
              type="button"
              onClick={() => downloadPng(2)}
              variant="secondary"
              className="font-medium gap-2 text-xs sm:text-sm bg-white/20 hover:bg-white/30 text-white border-0"
            >
              <Download className="w-4 h-4" />
              <span>Download PNG</span>
            </Button>

            <Button
              type="button"
              onClick={() => setIsFullscreen(false)}
              className="font-semibold text-xs sm:text-sm px-6"
            >
              Done
            </Button>
          </div>
        </div>
      )}

      {/* Global CSS for Responsive Vector Scaling */}
      <style jsx global>{`
        /* Force SVG to respect container boundaries with proportional vector scaling */
        div[ref="svgContainerRef"] svg,
        .barcode-svg-container svg {
          display: block !important;
          margin: 0 auto !important;
        }
      `}</style>
    </div>
  );
}
