"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// Dynamically import the heavy D3 wheel to speed up initial page load
const InteractiveWheel = dynamic(
  () => import("./components/InteractiveWheel").then((mod) => mod.InteractiveWheel),
  {
    ssr: false,
    loading: () => (
      <div className="w-full aspect-square max-h-[800px] flex flex-col items-center justify-center bg-muted/20 rounded-full animate-pulse border border-border">
        <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
        <span className="text-sm text-muted-foreground font-medium">Loading Compass...</span>
      </div>
    )
  }
);
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Share2, CheckCircle2, Copy, Trash2, List, Maximize2, Minimize2,
  MessageCircleHeart, ChevronDown, ChevronUp, ZoomIn, ZoomOut, RotateCcw, Printer
} from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { emotionWheelData, EmotionNode } from "./data/emotions";
import { translations } from "./data/translations";
import { MoodTrackerPanel } from "./components/MoodTrackerPanel";

const LANGUAGES = {
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  it: "Italiano",
  cs: "Čeština",
  fi: "Suomi",
  hu: "Magyar",
  pl: "Polski",
  tr: "Türkçe",
  uk: "Українська"
};

/* ─── Compact URL encoding ─── */
// Use short codes: emotions → indexes, so URL stays clean
function encodeStatus(emotions: string[], name: string, context: string): string {
  // Just use emotion names joined by pipe, then name|context
  const parts = [emotions.join(","), name, context].map(s => s || "");
  return btoa(parts.join("|")).replace(/=+$/, ""); // strip trailing = padding
}

function decodeStatus(encoded: string): { emotions: string[]; name: string; context: string } | null {
  try {
    // Re-add padding
    const padded = encoded + "=".repeat((4 - (encoded.length % 4)) % 4);
    const decoded = atob(padded);
    const [emotionsStr, name, context] = decoded.split("|");
    const emotions = emotionsStr ? emotionsStr.split(",").filter(Boolean) : [];
    return { emotions, name: name || "", context: context || "" };
  } catch {
    return null;
  }
}

interface SharedStatus {
  name: string;
  context: string;
  emotions: string[];
}

export function EmotionCompassTool() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [userName, setUserName] = useState("");
  const [contextMsg, setContextMsg] = useState("");
  const [copied, setCopied] = useState(false);
  const [sharedStatus, setSharedStatus] = useState<SharedStatus | null>(null);
  const [shareCollapsed, setShareCollapsed] = useState(false);
  const [language, setLanguage] = useState<string>("en");

  // Parse shared status on mount
  useEffect(() => {
    const statusParam = searchParams.get("s") || searchParams.get("status");
    if (statusParam) {
      const decoded = decodeStatus(statusParam);
      if (decoded && decoded.emotions.length > 0) {
        setSharedStatus(decoded);
        setSelectedEmotions(decoded.emotions);
        setUserName(decoded.name);
        setContextMsg(decoded.context);
      }
    }
  }, [searchParams]);

  const toggleEmotion = useCallback((emotion: string) => {
    setSelectedEmotions(prev =>
      prev.includes(emotion)
        ? prev.filter(e => e !== emotion)
        : [...prev, emotion]
    );
    if (sharedStatus) setSharedStatus(null);
  }, [sharedStatus]);

  const handleShare = async () => {
    const encoded = encodeStatus(selectedEmotions, userName, contextMsg);
    const shareUrl = `${window.location.origin}${pathname}?s=${encoded}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Emotion Compass",
          text: `${userName ? userName + " is" : "I am"} feeling ${selectedEmotions.join(", ")}.`,
          url: shareUrl,
        });
        return;
      } catch { /* user cancelled */ }
    }

    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleClear = () => {
    setSelectedEmotions([]);
    setUserName("");
    setContextMsg("");
    setSharedStatus(null);
    router.replace(pathname);
  };

  // Build a flat map of all emotions and their descriptions
  const emotionMap = useMemo(() => {
    const map = new Map<string, string>();
    const traverse = (node: EmotionNode) => {
      if (node.name && node.description) {
        map.set(node.name, node.description);
      }
      if (node.children) node.children.forEach(traverse);
    };
    traverse(emotionWheelData);
    return map;
  }, []);

  // Fullscreen & Zoom
  const wheelContainerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      wheelContainerRef.current?.requestFullscreen().catch(() => { });
    } else {
      document.exitFullscreen();
    }
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.2, 0.4));
  const handleResetZoom = () => setZoomLevel(1);
  const handlePrint = () => {
    // Reset zoom before printing to ensure it fits the page
    setZoomLevel(1);
    setTimeout(() => window.print(), 100);
  };

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  return (
    <div className="w-full">
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { size: portrait; margin: 10mm; }
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .print-area { position: absolute; left: 0; top: 0; width: 100%; min-height: 95vh; display: flex; flex-direction: column; }
          .print-header { flex-shrink: 0; }
          .print-content { flex: 1 1 auto; display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; min-height: 50vh; }
          .print-emotions { margin-top: 1rem; width: 100%; text-align: center; }
          .print-emotions ul { list-style: none; padding: 0; display: flex; flex-wrap: wrap; justify-content: center; gap: 0.5rem; margin-top: 1rem; }
          .print-emotions li { background: #f3f4f6; padding: 0.4rem 0.8rem; border-radius: 9999px; font-size: 0.875rem; border: 1px solid #e5e7eb; }
          .no-print { display: none !important; }
        }
      `}} />

      <div className="mb-6 text-center max-w-2xl mx-auto no-print">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-2">How are you feeling today?</h2>
        <p className="text-muted-foreground">Click and turn the interactive Feelings Wheel to explore your emotions.</p>
      </div>

      {/* Shared Status Banner */}
      {sharedStatus && (
        <Card className="mb-6 border-primary/20 shadow-lg overflow-hidden relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <MessageCircleHeart className="w-5 h-5 mr-2 text-primary" />
              {sharedStatus.name ? `${sharedStatus.name}'s Status` : "Shared Emotion Status"}
            </CardTitle>
            {sharedStatus.context && (
              <CardDescription className="italic">&ldquo;{sharedStatus.context}&rdquo;</CardDescription>
            )}
          </CardHeader>
          <CardContent className="pb-3">
            <div className="flex flex-wrap gap-1.5">
              {sharedStatus.emotions.map(e => (
                <Badge key={e} variant="default" className="px-2.5 py-0.5 text-xs">{e}</Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="outline" size="sm" onClick={handleClear}>Create My Own</Button>
          </CardFooter>
        </Card>
      )}

      {/* Main Layout: Wheel-first, large, with compact sidebar */}
      <div className="flex flex-col xl:flex-row gap-6 items-start">

        {/* ─── LEFT: LARGE WHEEL ─── */}
        <div
          id="emotion-wheel"
          ref={wheelContainerRef}
          className={`flex-1 w-full min-w-0 relative print-area ${isFullscreen ? "bg-background flex flex-col items-center justify-center h-screen" : ""}`}
        >
          {/* Controls Bar for Zoom and Print */}
          <div className="absolute top-2 right-2 z-10 flex flex-col gap-2 no-print">
            <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full shadow-md" onClick={handleZoomIn} title="Zoom In">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full shadow-md" onClick={handleZoomOut} title="Zoom Out">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full shadow-md" onClick={handleResetZoom} title="Reset Zoom">
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button variant="default" size="icon" className="h-8 w-8 rounded-full shadow-md mt-2" onClick={handlePrint} title="Download Printable PDF">
              <Printer className="h-4 w-4" />
            </Button>
          </div>

          {/* Print Branding Header (Visible only in print) */}
          <div className="hidden print:flex print-header flex-col items-center w-full mb-4 pb-2 border-b-2 border-gray-100">
            <img src="/logo/android-chrome-192x192.png" alt="CliniKKit" className="w-12 h-12 mb-1 rounded-xl" />
            <h1 className="text-2xl font-bold text-emerald-600 mb-0">CliniKKit Feelings Wheel</h1>
            <p className="text-gray-500 text-xs">Explore your emotions step-by-step from the core outward.</p>
          </div>

          {/* Fullscreen Action Buttons (Visible only in fullscreen) */}
          {isFullscreen && (
            <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-3 no-print bg-background/80 backdrop-blur-md p-3 rounded-2xl border shadow-lg">
              <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(selectedEmotions.join(", "))} disabled={selectedEmotions.length === 0} title="Copy Selected (Save)" className="justify-start">
                <Copy className="h-4 w-4 mr-2" /> Save
              </Button>
              <Button variant="ghost" size="sm" onClick={handleShare} disabled={selectedEmotions.length === 0} title="Share Emotions" className="justify-start">
                <Share2 className="h-4 w-4 mr-2" /> Share
              </Button>
              <Button variant="ghost" size="sm" onClick={handleClear} disabled={selectedEmotions.length === 0} className="text-destructive hover:bg-destructive/10 hover:text-destructive justify-start" title="Reset All">
                <Trash2 className="h-4 w-4 mr-2" /> Reset
              </Button>
            </div>
          )}

          <div className="print-content">
            <div className={`w-full mx-auto flex items-center justify-center ${isFullscreen ? "max-h-[92vh] max-w-[92vh] flex-1" : "max-w-[780px]"} print:w-full print:h-full print:max-w-none print:max-h-none`}>
              <InteractiveWheel
                size={700}
                selectedEmotions={selectedEmotions}
                language={language}
                zoomLevel={zoomLevel}
                onEmotionToggle={toggleEmotion}
                isFullscreen={isFullscreen}
              />
            </div>

            {/* Print Selected Emotions (Visible only in print) */}
            {selectedEmotions.length > 0 && (
              <div className="hidden print:block print-emotions">
                <h3 className="font-bold text-gray-700 text-lg">My Selected Feelings:</h3>
                <ul>
                  {selectedEmotions.map(emotion => (
                    <li key={emotion}>
                      {language === "en" ? emotion : (translations[emotion]?.[language]?.name || emotion)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Fullscreen Button */}
          <div className={`flex justify-center mt-3 no-print ${isFullscreen ? "absolute bottom-5 left-1/2 -translate-x-1/2" : ""}`}>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFullscreen}
              className="text-muted-foreground hover:text-foreground text-xs h-8 bg-background/80 backdrop-blur"
            >
              {isFullscreen
                ? <><Minimize2 className="w-3.5 h-3.5 mr-1.5" /> Exit Fullscreen</>
                : <><Maximize2 className="w-3.5 h-3.5 mr-1.5" /> Fullscreen</>
              }
            </Button>
          </div>

          {/* Print Footer Leads (Visible only in print) */}
          <div className="hidden print:flex flex-col items-center w-full text-center pt-4 border-t-2 border-gray-100 text-gray-600 text-[13px] mt-auto">
            <p>Access hundreds of free medical calculators and developer utilities at <strong>https://clinikkit.web.app</strong></p>
            <p className="mt-1">Try the interactive compass online: <strong>https://clinikkit.web.app/tools/psychology/emotion-compass</strong></p>
          </div>
        </div>

        {/* ─── RIGHT: COMPACT SIDEBAR ─── */}
        <div className="w-full xl:w-[360px] flex-shrink-0 flex flex-col gap-4 no-print">

          {/* Selected Feelings */}
          <Card className="shadow-sm overflow-hidden">
            <CardHeader className="py-3 px-4 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <List className="w-3 h-3 text-primary" />
                  </div>
                  Selected Feelings
                  {selectedEmotions.length > 0 && (
                    <Badge variant="secondary" className="ml-1 text-[10px] h-5 px-1.5">{selectedEmotions.length}</Badge>
                  )}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <select
                    className="h-7 text-xs bg-muted/50 border border-border rounded-md px-1.5 py-0 focus:outline-none focus:ring-1 focus:ring-primary text-muted-foreground hover:text-foreground cursor-pointer"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    title="Change language"
                  >
                    {Object.entries(LANGUAGES).map(([code, name]) => (
                      <option key={code} value={code}>{name}</option>
                    ))}
                  </select>
                  <Button
                    variant="ghost" size="sm"
                    className="h-7 text-[11px] px-2 hidden sm:flex"
                    onClick={() => navigator.clipboard.writeText(selectedEmotions.join(", "))}
                    disabled={selectedEmotions.length === 0}
                  >
                    <Copy className="w-3 h-3 mr-1" /> Copy
                  </Button>
                  <Button
                    variant="ghost" size="sm"
                    className="h-7 w-7 p-0 hover:text-destructive"
                    onClick={handleClear}
                    disabled={selectedEmotions.length === 0}
                    title="Clear All"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[320px] overflow-y-auto">
                {selectedEmotions.length === 0 ? (
                  <div className="py-10 text-center text-muted-foreground/40 px-4">
                    <p className="text-xs">Click on the wheel to select feelings.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border/60">
                    {selectedEmotions.map(emotion => (
                      <div
                        key={emotion}
                        className="px-4 py-2.5 hover:bg-muted/40 cursor-pointer transition-colors group"
                        onClick={() => toggleEmotion(emotion)}
                        title="Click to remove"
                      >
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium text-foreground text-sm">
                            {language === "en" ? emotion : (translations[emotion]?.[language]?.name || emotion)}
                          </h4>
                          <span className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity text-xs flex-shrink-0 ml-2">✕</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1 leading-relaxed">
                          {language === "en"
                            ? (emotionMap.get(emotion) || `Feeling a sense of ${emotion.toLowerCase()}.`)
                            : (translations[emotion]?.[language]?.description || emotionMap.get(emotion) || `Feeling a sense of ${emotion.toLowerCase()}.`)
                          }
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <MoodTrackerPanel
            selectedEmotions={selectedEmotions}
            onClear={handleClear}
          />

          {/* Quick Share Link Section */}
          <Card className="shadow-sm overflow-hidden">
            <CardHeader
              className="py-3 px-4 cursor-pointer select-none"
              onClick={() => setShareCollapsed(!shareCollapsed)}
            >
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Share2 className="w-3.5 h-3.5 text-primary" /> Share Status
                </CardTitle>
                {shareCollapsed ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronUp className="w-4 h-4 text-muted-foreground" />}
              </div>
            </CardHeader>
            {!shareCollapsed && (
              <>
                <CardContent className="px-4 pb-3 pt-0 space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="userName" className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Your Name (Optional)</Label>
                    <Input id="userName" placeholder="e.g. Alex" className="h-8 text-sm" value={userName} onChange={e => setUserName(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="contextMsg" className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Context (Optional)</Label>
                    <Input id="contextMsg" placeholder="What's going on?" className="h-8 text-sm" value={contextMsg} onChange={e => setContextMsg(e.target.value)} />
                  </div>
                </CardContent>
                <CardFooter className="px-4 pb-3 pt-0">
                  <Button
                    className="w-full h-9 text-sm"
                    onClick={handleShare}
                    disabled={selectedEmotions.length === 0}
                  >
                    {copied
                      ? <><CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Copied!</>
                      : <>Share your emotions</>
                    }
                  </Button>
                </CardFooter>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
