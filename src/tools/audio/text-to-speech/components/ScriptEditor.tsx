"use client";

import React, { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SCRIPT_PRESETS, SentenceSpan } from "../utils/speech-synthesis";
import {
  Sparkles,
  BookOpen,
  Heart,
  Zap,
  Globe,
  Bot,
  Trash2,
  Copy,
  Check,
  Clock,
  Type,
  FileText,
} from "lucide-react";

interface ScriptEditorProps {
  text: string;
  setText: (text: string) => void;
  isPlaying: boolean;
  activeSentenceIndex: number | null;
  sentences: SentenceSpan[];
  onSelectSentence?: (index: number) => void;
  onApplyPreset: (id: string) => void;
  rate: number;
}

const PRESET_ICONS: Record<string, React.ElementType> = {
  Sparkles,
  BookOpen,
  Heart,
  Zap,
  Globe,
  Bot,
};

export const ScriptEditor: React.FC<ScriptEditorProps> = ({
  text,
  setText,
  isPlaying,
  activeSentenceIndex,
  sentences,
  onSelectSentence,
  onApplyPreset,
  rate,
}) => {
  const [copied, setCopied] = React.useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Compute metrics
  const trimmed = text.trim();
  const wordCount = trimmed ? trimmed.split(/\s+/).length : 0;
  const charCount = text.length;

  // Approximate duration: average speaking rate ~140 wpm at 1.0x
  const wordsPerMinute = 140 * Math.max(0.5, rate);
  const estimatedSeconds = Math.ceil((wordCount / wordsPerMinute) * 60);
  const mins = Math.floor(estimatedSeconds / 60);
  const secs = estimatedSeconds % 60;
  const timeFormatted = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setText("");
    textareaRef.current?.focus();
  };

  return (
    <Card className="border-border/60 shadow-xs overflow-hidden">
      <CardContent className="p-4 sm:p-6 space-y-4">
        {/* Header bar: Title & Preset Pills */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold">
              <FileText className="size-4" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-base text-foreground">
                Script & Text Input
              </h3>
              <p className="text-xs text-muted-foreground">
                Enter custom text or pick a studio preset to begin
              </p>
            </div>
          </div>

          {/* Quick presets pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-medium text-muted-foreground mr-1">Presets:</span>
            {SCRIPT_PRESETS.map((preset) => {
              const IconComp = PRESET_ICONS[preset.icon] || Sparkles;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => onApplyPreset(preset.id)}
                  disabled={isPlaying}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-muted/60 hover:bg-primary/10 hover:text-primary border border-border/40 hover:border-primary/30 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  title={preset.category}
                >
                  <IconComp className="size-3 text-primary" />
                  <span>{preset.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Textarea or Interactive Highlight View */}
        <div className="relative">
          {isPlaying && sentences.length > 0 ? (
            <div className="w-full min-h-[160px] max-h-[300px] overflow-y-auto p-4 rounded-xl border border-primary/30 bg-muted/20 text-sm leading-relaxed font-sans space-y-2 select-none">
              <div className="flex items-center justify-between pb-2 border-b border-border/40 text-xs text-primary font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  Live Speech Tracking (Click any sentence to jump)
                </span>
                <span className="text-muted-foreground font-mono">
                  {activeSentenceIndex !== null ? `${activeSentenceIndex + 1} / ${sentences.length}` : "Ready"}
                </span>
              </div>
              <p className="pt-1">
                {sentences.map((span, idx) => {
                  const isActive = activeSentenceIndex === idx;
                  return (
                    <span
                      key={idx}
                      onClick={() => onSelectSentence && onSelectSentence(idx)}
                      className={`cursor-pointer transition-all duration-200 px-1 py-0.5 rounded-md inline-block mr-1 my-0.5 ${
                        isActive
                          ? "bg-primary text-primary-foreground font-medium shadow-xs scale-[1.02]"
                          : "text-foreground/80 hover:bg-muted/80 hover:text-foreground"
                      }`}
                    >
                      {span.text}{" "}
                    </span>
                  );
                })}
              </p>
            </div>
          ) : (
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type or paste text here to convert into natural human speech... (e.g. video voiceover, audiobook paragraphs, podcast intro, or customer service prompts)"
                rows={5}
                className="w-full rounded-xl border border-input bg-background/80 p-3 sm:p-4 text-sm sm:text-base leading-relaxed placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary transition-all resize-y min-h-[140px]"
              />
            </div>
          )}
        </div>

        {/* Footer info & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-3 font-mono">
            <span className="flex items-center gap-1">
              <Type className="size-3.5 text-primary" />
              <span>{charCount} chars</span>
            </span>
            <span className="text-border">•</span>
            <span>{wordCount} words</span>
            <span className="text-border">•</span>
            <span className="flex items-center gap-1 text-primary">
              <Clock className="size-3.5" />
              <span>~{timeFormatted} read time</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 ml-auto">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              disabled={!text}
              className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground"
            >
              {copied ? (
                <>
                  <Check className="size-3.5 text-emerald-500 mr-1" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="size-3.5 mr-1" />
                  <span>Copy</span>
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              disabled={!text || isPlaying}
              className="h-8 px-2.5 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="size-3.5 mr-1" />
              <span>Clear</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
