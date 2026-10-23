"use client";

import React, { useState, useMemo } from "react";
import { VoiceOption } from "../types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Mic,
  Search,
  Sparkles,
  Globe,
  Volume2,
  Check,
  ChevronDown,
  User,
  Star,
} from "lucide-react";

interface VoiceSelectorProps {
  voices: VoiceOption[];
  selectedVoice: VoiceOption | null;
  onSelectVoice: (voice: VoiceOption) => void;
  onPreviewVoice: (voice: VoiceOption) => void;
  isPreviewing: boolean;
  previewVoiceURI: string | null;
}

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  voices,
  selectedVoice,
  onSelectVoice,
  onPreviewVoice,
  isPreviewing,
  previewVoiceURI,
}) => {
  const [search, setSearch] = useState("");
  const [languageFilter, setLanguageFilter] = useState("all");
  const [filterType, setFilterType] = useState<"all" | "natural" | "female" | "male">("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Available unique languages
  const availableLanguages = useMemo(() => {
    const map = new Map<string, string>();
    voices.forEach((v) => {
      const code = v.lang.split("-")[0];
      if (!map.has(code)) {
        map.set(code, v.langLabel);
      }
    });
    return Array.from(map.entries()).map(([code, label]) => ({ code, label }));
  }, [voices]);

  // Filtered voices
  const filteredVoices = useMemo(() => {
    return voices.filter((v) => {
      // Search query
      if (search) {
        const q = search.toLowerCase();
        const matchesName = v.displayName.toLowerCase().includes(q) || v.name.toLowerCase().includes(q);
        const matchesLang = v.langLabel.toLowerCase().includes(q) || v.lang.toLowerCase().includes(q);
        if (!matchesName && !matchesLang) return false;
      }

      // Language filter
      if (languageFilter !== "all") {
        if (!v.lang.startsWith(languageFilter)) return false;
      }

      // Type filter
      if (filterType === "natural" && !v.isNatural) return false;
      if (filterType === "female" && v.gender !== "female") return false;
      if (filterType === "male" && v.gender !== "male") return false;

      return true;
    });
  }, [voices, search, languageFilter, filterType]);

  const naturalCount = useMemo(() => voices.filter((v) => v.isNatural).length, [voices]);

  return (
    <Card className="border-border/60 shadow-xs">
      <CardContent className="p-4 sm:p-6 space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-500 font-bold">
              <Mic className="size-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-semibold text-base text-foreground">
                  Natural Voice Selection
                </h3>
                {naturalCount > 0 && (
                  <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary border border-primary/20">
                    <Sparkles className="size-3 mr-1 text-primary" />
                    {naturalCount} Neural Voices Detected
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Choose an ultra-realistic neural or browser voice
              </p>
            </div>
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => setFilterType("all")}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                filterType === "all"
                  ? "bg-primary text-primary-foreground border-primary shadow-xs"
                  : "bg-muted/50 border-border/40 text-muted-foreground hover:bg-muted"
              }`}
            >
              All ({voices.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType("natural")}
              className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                filterType === "natural"
                  ? "bg-primary text-primary-foreground border-primary shadow-xs"
                  : "bg-muted/50 border-border/40 text-muted-foreground hover:bg-muted"
              }`}
            >
              <Star className="size-3 text-amber-400 fill-amber-400" />
              <span>Natural ({naturalCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setFilterType("female")}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                filterType === "female"
                  ? "bg-primary text-primary-foreground border-primary shadow-xs"
                  : "bg-muted/50 border-border/40 text-muted-foreground hover:bg-muted"
              }`}
            >
              Female
            </button>
            <button
              type="button"
              onClick={() => setFilterType("male")}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                filterType === "male"
                  ? "bg-primary text-primary-foreground border-primary shadow-xs"
                  : "bg-muted/50 border-border/40 text-muted-foreground hover:bg-muted"
              }`}
            >
              Male
            </button>
          </div>
        </div>

        {/* Search & Language Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
          <div className="sm:col-span-8 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search voice name or language (e.g. Jenny, Aria, Google, English)..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
            />
          </div>

          <div className="sm:col-span-4 relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <select
              value={languageFilter}
              onChange={(e) => setLanguageFilter(e.target.value)}
              className="w-full pl-9 pr-7 py-2 text-xs sm:text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all appearance-none cursor-pointer"
            >
              <option value="all">All Languages ({availableLanguages.length})</option>
              {availableLanguages.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {/* Selected Voice Hero Card */}
        {selectedVoice && (
          <div className="p-3.5 rounded-xl border border-primary/30 bg-primary/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                <User className="size-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-heading font-semibold text-sm sm:text-base text-foreground truncate">
                    {selectedVoice.displayName}
                  </span>
                  {selectedVoice.isNatural && (
                    <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[10px] px-1.5 py-0 font-medium">
                      ⭐ Natural Neural
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 capitalize">
                    {selectedVoice.gender}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {selectedVoice.langLabel} • {selectedVoice.provider} Engine
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onPreviewVoice(selectedVoice)}
                disabled={isPreviewing && previewVoiceURI === selectedVoice.voice.voiceURI}
                className="h-8 px-3 text-xs border-primary/30 hover:bg-primary/10 text-primary"
              >
                <Volume2 className="size-3.5 mr-1" />
                <span>
                  {isPreviewing && previewVoiceURI === selectedVoice.voice.voiceURI
                    ? "Previewing..."
                    : "Test Voice"}
                </span>
              </Button>
            </div>
          </div>
        )}

        {/* Scrollable Voice Grid / List */}
        <div className="max-h-[260px] overflow-y-auto pr-1 space-y-1.5 rounded-lg border border-border/40 p-1.5 bg-muted/10">
          {filteredVoices.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              No voices found matching "{search || languageFilter}". Try clearing your search filters.
            </div>
          ) : (
            filteredVoices.map((v) => {
              const isSelected = selectedVoice?.voice.voiceURI === v.voice.voiceURI;
              const isCurrentPreview = isPreviewing && previewVoiceURI === v.voice.voiceURI;
              return (
                <div
                  key={v.voice.voiceURI}
                  onClick={() => onSelectVoice(v)}
                  className={`p-2.5 rounded-lg border transition-all flex items-center justify-between gap-2 cursor-pointer ${
                    isSelected
                      ? "border-primary bg-primary/10 shadow-xs"
                      : "border-border/30 bg-card hover:bg-muted/50 hover:border-border/80"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`size-6 rounded-md flex items-center justify-center shrink-0 text-xs font-bold ${
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isSelected ? <Check className="size-3.5" /> : v.displayName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs sm:text-sm font-medium text-foreground truncate">
                          {v.displayName}
                        </span>
                        {v.isNatural && (
                          <span className="text-[10px] font-semibold text-amber-500 bg-amber-500/10 px-1 rounded">
                            Natural
                          </span>
                        )}
                        <span className="text-[10px] text-muted-foreground uppercase px-1 rounded bg-muted/60">
                          {v.lang}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {v.langLabel}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onPreviewVoice(v);
                      }}
                      className="size-7 rounded-md hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                      title="Preview this voice"
                    >
                      <Volume2 className={`size-3.5 ${isCurrentPreview ? "text-primary animate-pulse" : ""}`} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};
