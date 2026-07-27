"use client";

import { useState } from "react";
import { AudioAnalysisResult, ColorPalette, analyzeAudioFile, generateDemoAudio } from "./analyzer";
import { UploadSection } from "./components/UploadSection";
import { SpectrogramCard } from "./components/SpectrogramCard";
import { Music2 } from "lucide-react";

export function AudioSpectrumAnalyzer() {
  const [results, setResults] = useState<AudioAnalysisResult[]>([]);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [palette, setPalette] = useState<ColorPalette>("magma");

  const PALETTES: { id: ColorPalette; name: string; gradient: string }[] = [
    { id: "magma", name: "🔥 Siren Magma", gradient: "from-purple-900 via-red-600 to-amber-300" },
    { id: "cyberpunk", name: "⚡ Cyberpunk", gradient: "from-blue-900 via-cyan-500 to-pink-500" },
    { id: "emerald", name: "💎 Emerald Matrix", gradient: "from-green-950 via-emerald-600 to-lime-300" },
    { id: "ocean", name: "🌊 Ocean Abyss", gradient: "from-slate-950 via-blue-700 to-cyan-300" },
    { id: "monochrome", name: "🌓 Monochrome", gradient: "from-black via-gray-500 to-white" },
  ];

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsLoading(true);
    setLoadingStep(0);
    const stepTimer = setInterval(() => {
      setLoadingStep((s) => (s < 4 ? s + 1 : 4));
    }, 350);

    const newResults: AudioAnalysisResult[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const res = await analyzeAudioFile(file);
        newResults.push(res);
      } catch (err) {
        console.error("Failed to analyze file:", file.name, err);
      }
    }

    clearInterval(stepTimer);
    setLoadingStep(4);
    setTimeout(() => {
      setResults((prev) => {
        const updated = [...newResults, ...prev];
        if (newResults.length > 0) {
          setSelectedTrackId(newResults[0].id);
        }
        return updated;
      });
      setIsLoading(false);
    }, 350);
  };

  const handleLoadDemo = async () => {
    setIsLoading(true);
    setLoadingStep(0);
    const stepTimer = setInterval(() => {
      setLoadingStep((s) => (s < 4 ? s + 1 : 4));
    }, 350);

    try {
      const { result } = await generateDemoAudio();
      clearInterval(stepTimer);
      setLoadingStep(4);
      setTimeout(() => {
        setResults((prev) => {
          const updated = [result, ...prev];
          setSelectedTrackId(result.id);
          return updated;
        });
        setIsLoading(false);
      }, 350);
    } catch (err) {
      console.error("Failed to generate demo:", err);
      clearInterval(stepTimer);
      setIsLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    setResults((prev) => {
      const target = prev.find((r) => r.id === id);
      if (target?.audioUrl) URL.revokeObjectURL(target.audioUrl);
      const remaining = prev.filter((r) => r.id !== id);
      if (selectedTrackId === id) {
        setSelectedTrackId(remaining.length > 0 ? remaining[0].id : null);
      }
      return remaining;
    });
  };

  const activeResult = results.find((r) => r.id === selectedTrackId) || results[0];

  return (
    <div className="space-y-8">
      {/* Streamlined Upload Area with Scrollable Palettes & Trust Badges */}
      <UploadSection
        palette={palette}
        setPalette={setPalette}
        onFiles={handleFiles}
        onLoadDemo={handleLoadDemo}
        isLoading={isLoading}
        loadingStep={loadingStep}
        hasResults={results.length > 0}
        palettes={PALETTES}
      />

      {/* Multi-Track Playlist Tabs Selector (Visible only when > 1 track uploaded) */}
      {results.length > 1 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-card border-2 space-y-3 shadow-md min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-mono font-bold text-muted-foreground uppercase">
            <span className="flex items-center gap-2 text-foreground">
              <Music2 className="size-4 text-primary shrink-0" />
              <span>Session Playlist ({results.length} Audio Tracks)</span>
            </span>
            <span className="text-[11px] font-normal text-muted-foreground">
              Click any track to switch inspection view:
            </span>
          </div>
          <div className="flex flex-wrap gap-2 pt-0.5">
            {results.map((res, idx) => {
              const isSelected = res.id === activeResult?.id;
              return (
                <button
                  key={res.id}
                  onClick={() => setSelectedTrackId(res.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all border min-w-0 ${
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary shadow-md font-bold scale-[1.02]"
                      : "bg-muted/50 hover:bg-muted text-foreground border-border/80 opacity-80 hover:opacity-100"
                  }`}
                >
                  <span className="truncate max-w-[150px] sm:max-w-[220px]">
                    #{idx + 1} {res.metadata?.title || res.fileName}
                  </span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold shrink-0 ${
                      isSelected ? "bg-black/20 text-white" : "bg-primary/10 text-primary"
                    }`}
                  >
                    Grade {res.qualityGrade || "A"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Currently Selected Spectrogram Card (Only shows 1 card at a time for clean UX!) */}
      {activeResult && (
        <SpectrogramCard
          key={activeResult.id}
          result={activeResult}
          palette={palette}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default AudioSpectrumAnalyzer;
