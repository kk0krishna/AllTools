"use client";

import React, { useState } from "react";
import { AudioExportItem } from "../types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatBytes, formatDuration, synthesizeAcousticWav } from "../utils/wav-synthesizer";
import { isDisplayAudioCaptureSupported } from "../utils/audio-recorder";
import {
  Download,
  FileAudio,
  Radio,
  Zap,
  Globe,
  Trash2,
  Play,
  Pause,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  Sparkles,
  ExternalLink,
} from "lucide-react";

interface AudioExportSectionProps {
  text: string;
  rate: number;
  pitch: number;
  selectedLang: string;
  isRecording: boolean;
  onStartTabRecording: () => void;
  onStopTabRecording: () => void;
  exportedItems: AudioExportItem[];
  onAddExportItem: (item: AudioExportItem) => void;
  onRemoveExportItem: (id: string) => void;
}

export const AudioExportSection: React.FC<AudioExportSectionProps> = ({
  text,
  rate,
  pitch,
  selectedLang,
  isRecording,
  onStartTabRecording,
  onStopTabRecording,
  exportedItems,
  onAddExportItem,
  onRemoveExportItem,
}) => {
  const [isSynthesizingWav, setIsSynthesizingWav] = useState(false);
  const [showCaptureGuide, setShowCaptureGuide] = useState(false);
  const [activePlayId, setActivePlayId] = useState<string | null>(null);
  const [audioElements] = useState<Map<string, HTMLAudioElement>>(new Map());

  const canRecordTab = isDisplayAudioCaptureSupported();

  // Instant In-Browser WAV Synthesizer (Zero screen-sharing prompt)
  const handleInstantWavSynthesis = async () => {
    if (!text.trim()) return;
    setIsSynthesizingWav(true);
    try {
      const wavBlob = await synthesizeAcousticWav(text, rate, pitch);
      const url = URL.createObjectURL(wavBlob);
      const durationSeconds = Math.max(1, Math.round(text.trim().split(/\s+/).length / (140 * rate / 60)));

      const newItem: AudioExportItem = {
        id: `wav-${Date.now()}`,
        name: `voice-synthesized-${Date.now().toString().slice(-4)}.wav`,
        blob: wavBlob,
        url,
        format: "wav",
        durationSeconds,
        sizeBytes: wavBlob.size,
        createdAt: new Date(),
        textExcerpt: text.trim().slice(0, 70) + (text.length > 70 ? "..." : ""),
      };

      onAddExportItem(newItem);

      // Trigger instant automatic download
      const link = document.createElement("a");
      link.href = url;
      link.download = newItem.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("WAV synthesis error:", err);
      alert("Failed to synthesize WAV file. Please try again with shorter text.");
    } finally {
      setIsSynthesizingWav(false);
    }
  };

  // Google Natural Cloud MP3 Link
  const langCode = selectedLang.split("-")[0] || "en";
  const encodedText = encodeURIComponent(text.trim().slice(0, 200));
  const googleMp3Url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${langCode}&q=${encodedText}`;

  // Toggle playback of exported audio item
  const handleTogglePlay = (item: AudioExportItem) => {
    let audio = audioElements.get(item.id);
    if (!audio) {
      audio = new Audio(item.url);
      audio.onended = () => setActivePlayId(null);
      audioElements.set(item.id, audio);
    }

    if (activePlayId === item.id) {
      audio.pause();
      setActivePlayId(null);
    } else {
      // Pause all others
      audioElements.forEach((a) => a.pause());
      audio.currentTime = 0;
      audio.play();
      setActivePlayId(item.id);
    }
  };

  const handleDownloadItem = (item: AudioExportItem) => {
    const link = document.createElement("a");
    link.href = item.url;
    link.download = item.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="border-border/60 shadow-xs">
      <CardContent className="p-4 sm:p-6 space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 font-bold">
              <Download className="size-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-semibold text-base text-foreground">
                  Audio Files Generation & Export
                </h3>
                <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px]">
                  Lossless WAV / WebM / MP3
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Export text to downloadable voice audio files for videos, podcasts, and projects
              </p>
            </div>
          </div>
        </div>

        {/* Action Generation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Option 1: Tab Audio Capture (Natural Voice) */}
          <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                  <Radio className="size-3.5" />
                  <span>Studio Voice Recorder</span>
                </span>
                <Badge variant="outline" className="text-[10px] text-primary border-primary/30">
                  Recommended
                </Badge>
              </div>
              <h4 className="font-heading font-semibold text-sm text-foreground mt-1.5">
                Record Natural Voice Output
              </h4>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Captures the selected neural voice (Microsoft Natural, Google, Siri) with pristine 48kHz audio fidelity into a downloadable file.
              </p>
            </div>

            <div className="space-y-2 pt-1">
              {isRecording ? (
                <Button
                  type="button"
                  onClick={onStopTabRecording}
                  className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground font-semibold h-9 rounded-lg animate-pulse"
                >
                  <span className="size-2 rounded-full bg-white mr-2 inline-block"></span>
                  <span>Stop & Save Audio File</span>
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={() => {
                    setShowCaptureGuide(true);
                    onStartTabRecording();
                  }}
                  disabled={!text.trim() || !canRecordTab}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-9 rounded-lg"
                >
                  <Radio className="size-3.5 mr-1.5" />
                  <span>Record to Audio File (.webm)</span>
                </Button>
              )}

              <button
                type="button"
                onClick={() => setShowCaptureGuide(!showCaptureGuide)}
                className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1 mx-auto pt-0.5 cursor-pointer"
              >
                <HelpCircle className="size-3" />
                <span>How does browser tab recording work?</span>
              </button>
            </div>
          </div>

          {/* Option 2: Instant Client-Side WAV Synthesizer (0-Prompt) */}
          <div className="p-4 rounded-xl border border-border/40 bg-muted/20 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                  <Zap className="size-3.5 text-amber-500" />
                  <span>Instant Offline Synthesizer</span>
                </span>
                <Badge variant="secondary" className="text-[10px]">
                  Zero Prompts
                </Badge>
              </div>
              <h4 className="font-heading font-semibold text-sm text-foreground mt-1.5">
                Generate 1-Click WAV File
              </h4>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Uses browser Web Audio formant synthesis to build a clean 16-bit PCM WAV audio file directly in memory. Works 100% offline.
              </p>
            </div>

            <div className="pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={handleInstantWavSynthesis}
                disabled={!text.trim() || isSynthesizingWav}
                className="w-full h-9 rounded-lg border-border/60 hover:bg-muted"
              >
                {isSynthesizingWav ? (
                  <span className="flex items-center gap-1.5 text-xs">
                    <Sparkles className="size-3.5 animate-spin text-amber-500" />
                    <span>Rendering WAV File...</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-xs">
                    <Download className="size-3.5" />
                    <span>Instant WAV File Download</span>
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Capture Guide Accordion / Banner */}
        {showCaptureGuide && (
          <div className="p-3.5 rounded-xl border border-primary/30 bg-primary/5 text-xs text-muted-foreground space-y-2">
            <div className="flex items-center justify-between font-semibold text-foreground">
              <span className="flex items-center gap-1.5 text-primary">
                <CheckCircle2 className="size-4" />
                <span>Simple 2-Step Browser Audio Capture</span>
              </span>
              <button
                type="button"
                onClick={() => setShowCaptureGuide(false)}
                className="text-muted-foreground hover:text-foreground text-xs"
              >
                Dismiss
              </button>
            </div>
            <ol className="list-decimal list-inside space-y-1 pl-1">
              <li>
                When your browser displays the sharing dialog, click the <strong>"Current Tab"</strong> or <strong>"This Tab"</strong> option.
              </li>
              <li>
                Ensure the checkbox labeled <strong>"Also share tab audio"</strong> (or "Share audio") is <strong>checked</strong>.
              </li>
              <li>
                The tool will play the natural voice and automatically save the pristine audio file right below when done!
              </li>
            </ol>
          </div>
        )}

        {/* Cloud MP3 Quick Stream & Download Box */}
        {text.trim() && (
          <div className="p-3.5 rounded-xl border border-border/40 bg-card/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <Globe className="size-4 text-sky-500 shrink-0" />
              <div>
                <span className="font-semibold text-foreground">
                  Direct Multi-Lingual MP3 Audio Stream
                </span>
                <p className="text-muted-foreground text-[11px]">
                  Language: {selectedLang} • Standard cloud voice stream
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <audio controls src={googleMp3Url} className="h-8 max-w-[200px]" />
              <a
                href={googleMp3Url}
                target="_blank"
                rel="noopener noreferrer"
                download="natural-speech.mp3"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border/60 hover:bg-muted text-xs font-medium text-foreground transition-colors"
                title="Open or download MP3 file"
              >
                <Download className="size-3.5" />
                <span>MP3 File</span>
              </a>
            </div>
          </div>
        )}

        {/* Exported Audio Session Library */}
        <div className="space-y-2.5 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="font-heading font-semibold text-xs sm:text-sm text-foreground flex items-center gap-1.5">
              <FileAudio className="size-4 text-primary" />
              <span>Generated Audio Files ({exportedItems.length})</span>
            </h4>
            {exportedItems.length > 0 && (
              <span className="text-[11px] text-muted-foreground">
                Click download to save files to your computer
              </span>
            )}
          </div>

          {exportedItems.length === 0 ? (
            <div className="py-7 text-center rounded-xl border border-dashed border-border/60 bg-muted/10 text-xs text-muted-foreground">
              No audio files generated yet. Record natural voice or click "Instant WAV Download" above!
            </div>
          ) : (
            <div className="space-y-2">
              {exportedItems.map((item) => {
                const isPlaying = activePlayId === item.id;
                return (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl border border-border/40 bg-card hover:border-primary/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        type="button"
                        onClick={() => handleTogglePlay(item)}
                        className={`size-9 rounded-lg flex items-center justify-center transition-colors shrink-0 cursor-pointer ${
                          isPlaying
                            ? "bg-primary text-primary-foreground shadow-xs"
                            : "bg-muted/80 text-foreground hover:bg-primary/10 hover:text-primary"
                        }`}
                        title={isPlaying ? "Pause" : "Play preview"}
                      >
                        {isPlaying ? <Pause className="size-4 fill-current" /> : <Play className="size-4 fill-current ml-0.5" />}
                      </button>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-semibold text-foreground truncate">
                            {item.name}
                          </span>
                          <Badge variant="outline" className="text-[10px] uppercase px-1.5 py-0 font-mono">
                            .{item.format}
                          </Badge>
                          <span className="text-[11px] text-muted-foreground font-mono">
                            {formatBytes(item.sizeBytes)}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground truncate italic">
                          "{item.textExcerpt}"
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-auto sm:ml-0">
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleDownloadItem(item)}
                        className="h-8 px-3 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                      >
                        <Download className="size-3.5 mr-1" />
                        <span>Download</span>
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveExportItem(item.id)}
                        className="h-8 px-2 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                        title="Delete file"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
