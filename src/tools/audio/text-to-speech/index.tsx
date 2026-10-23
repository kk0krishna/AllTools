"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { VoiceOption, AudioExportItem } from "./types";
import {
  parseVoice,
  sortVoices,
  splitIntoSentences,
  SentenceSpan,
  SCRIPT_PRESETS,
} from "./utils/speech-synthesis";
import { TabAudioRecorder } from "./utils/audio-recorder";
import { ScriptEditor } from "./components/ScriptEditor";
import { VoiceSelector } from "./components/VoiceSelector";
import { VoiceAcoustics } from "./components/VoiceAcoustics";
import { AudioVisualizer } from "./components/AudioVisualizer";
import { AudioExportSection } from "./components/AudioExportSection";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ShieldCheck, Zap, Headphones, Volume2, Info } from "lucide-react";

export function TextToSpeechStudio() {
  // Script state
  const [text, setText] = useState<string>(
    "Experience the next evolution of sound. Lightning-fast performance, crystal-clear acoustics, and zero-compromise privacy—crafted for creators who demand perfection."
  );

  // Voices state
  const [voices, setVoices] = useState<VoiceOption[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<VoiceOption | null>(null);

  // Acoustics state
  const [rate, setRate] = useState<number>(1.0);
  const [pitch, setPitch] = useState<number>(1.0);
  const [volume, setVolume] = useState<number>(1.0);

  // Playback state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [activeSentenceIndex, setActiveSentenceIndex] = useState<number | null>(null);

  // Preview voice state
  const [isPreviewing, setIsPreviewing] = useState<boolean>(false);
  const [previewVoiceURI, setPreviewVoiceURI] = useState<string | null>(null);

  // Audio capture state
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [exportedItems, setExportedItems] = useState<AudioExportItem[]>([]);
  const recorderRef = useRef<TabAudioRecorder | null>(null);

  // Speech tracking refs
  const sentencesRef = useRef<SentenceSpan[]>([]);
  const sentenceIndexRef = useRef<number>(0);
  const isPlayingRef = useRef<boolean>(false);

  // Load voices from browser
  const loadVoices = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const rawVoices = window.speechSynthesis.getVoices();
    if (rawVoices.length === 0) return;

    const parsed = rawVoices.map(parseVoice);
    const sorted = sortVoices(parsed);
    setVoices(sorted);

    setSelectedVoice((current) => {
      if (current) {
        const stillExists = sorted.find((v) => v.voice.voiceURI === current.voice.voiceURI);
        if (stillExists) return stillExists;
      }
      // Pick best natural voice or first available
      const natural = sorted.find((v) => v.isNatural && v.lang.startsWith("en"));
      return natural || sorted[0] || null;
    });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      if (recorderRef.current) {
        recorderRef.current.cancel();
      }
    };
  }, [loadVoices]);

  // Update sentences breakdown
  const sentences = splitIntoSentences(text);
  sentencesRef.current = sentences;

  // Speak a single sentence
  const speakSentence = (index: number) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (index >= sentencesRef.current.length || !isPlayingRef.current) {
      stopPlayback();
      return;
    }

    sentenceIndexRef.current = index;
    setActiveSentenceIndex(index);

    const span = sentencesRef.current[index];
    const utterance = new SpeechSynthesisUtterance(span.text);

    if (selectedVoice) {
      utterance.voice = selectedVoice.voice;
      utterance.lang = selectedVoice.lang;
    }
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    utterance.onend = () => {
      if (!isPlayingRef.current) return;
      const nextIdx = index + 1;
      if (nextIdx < sentencesRef.current.length) {
        // Small breathing gap between sentences
        setTimeout(() => {
          if (isPlayingRef.current) speakSentence(nextIdx);
        }, 120);
      } else {
        stopPlayback();
      }
    };

    utterance.onerror = (e) => {
      console.warn("Speech synthesis utterance error:", e);
      if (isPlayingRef.current) {
        const nextIdx = index + 1;
        if (nextIdx < sentencesRef.current.length) {
          speakSentence(nextIdx);
        } else {
          stopPlayback();
        }
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  const startPlayback = (startIndex: number = 0) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Speech Synthesis is not supported in this browser.");
      return;
    }
    if (!text.trim()) return;

    window.speechSynthesis.cancel();
    isPlayingRef.current = true;
    setIsPlaying(true);
    setIsPaused(false);
    sentenceIndexRef.current = startIndex;
    speakSentence(startIndex);
  };

  const pausePlayback = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.pause();
    setIsPaused(true);
  };

  const resumePlayback = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.resume();
    setIsPaused(false);
  };

  const stopPlayback = async () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    isPlayingRef.current = false;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setActiveSentenceIndex(null);

    // Stop recorder if active
    if (recorderRef.current && isRecording) {
      try {
        const recorded = await recorderRef.current.stop();
        recorderRef.current = null;
        setIsRecording(false);

        const newItem: AudioExportItem = {
          id: `rec-${Date.now()}`,
          name: `recorded-speech-${Date.now().toString().slice(-4)}.webm`,
          blob: recorded.blob,
          url: recorded.url,
          format: "webm",
          durationSeconds: recorded.durationSeconds,
          sizeBytes: recorded.blob.size,
          createdAt: new Date(),
          textExcerpt: text.trim().slice(0, 70) + (text.length > 70 ? "..." : ""),
        };
        setExportedItems((prev) => [newItem, ...prev]);
      } catch (err) {
        console.error("Failed to stop recording:", err);
        setIsRecording(false);
      }
    }
  };

  // Skip sentence navigation
  const handlePrevSentence = () => {
    const current = sentenceIndexRef.current;
    if (current > 0) {
      window.speechSynthesis.cancel();
      speakSentence(current - 1);
    }
  };

  const handleNextSentence = () => {
    const current = sentenceIndexRef.current;
    if (current < sentencesRef.current.length - 1) {
      window.speechSynthesis.cancel();
      speakSentence(current + 1);
    }
  };

  // Preview single voice
  const handlePreviewVoice = (v: VoiceOption) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    setIsPreviewing(true);
    setPreviewVoiceURI(v.voice.voiceURI);

    const sample = `Hello! I am ${v.displayName}, ready to speak for you.`;
    const utterance = new SpeechSynthesisUtterance(sample);
    utterance.voice = v.voice;
    utterance.lang = v.lang;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    utterance.onend = () => {
      setIsPreviewing(false);
      setPreviewVoiceURI(null);
    };
    utterance.onerror = () => {
      setIsPreviewing(false);
      setPreviewVoiceURI(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Apply script preset
  const handleApplyPreset = (id: string) => {
    const preset = SCRIPT_PRESETS.find((p) => p.id === id);
    if (!preset) return;
    stopPlayback();
    setText(preset.text);
    if (preset.suggestedRate) setRate(preset.suggestedRate);
    if (preset.suggestedPitch) setPitch(preset.suggestedPitch);
  };

  // Tab Audio Recording
  const handleStartTabRecording = async () => {
    if (!text.trim()) return;
    try {
      const recorder = new TabAudioRecorder();
      recorderRef.current = recorder;
      await recorder.start();
      setIsRecording(true);

      // Brief delay to ensure stream is active before speaking
      setTimeout(() => {
        startPlayback(0);
      }, 300);
    } catch (err: unknown) {
      recorderRef.current = null;
      setIsRecording(false);
      const errorMsg = err instanceof Error ? err.message : "Audio recording was cancelled or failed.";
      alert(errorMsg);
    }
  };

  const handleStopTabRecording = () => {
    stopPlayback();
  };

  const handleAddExportItem = (item: AudioExportItem) => {
    setExportedItems((prev) => [item, ...prev]);
  };

  const handleRemoveExportItem = (id: string) => {
    setExportedItems((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target?.url) URL.revokeObjectURL(target.url);
      return prev.filter((item) => item.id !== id);
    });
  };

  const handleResetAcoustics = () => {
    setRate(1.0);
    setPitch(1.0);
    setVolume(1.0);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Studio Banner */}
      <div className="p-4 sm:p-5 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-pink-500/5 to-indigo-500/10 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="size-11 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shadow-xs shrink-0">
            <Headphones className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-bold text-lg sm:text-xl text-foreground">
                Instant Text to Natural Voice Studio
              </h2>
              <Badge className="bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20 text-[10px] hidden sm:inline-flex">
                Neural TTS Engine
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Natural speech synthesis with live waveform tracking & instant audio file export
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground shrink-0">
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="size-3.5" />
            <span>100% Local Privacy</span>
          </span>
          <span className="text-border">•</span>
          <span className="flex items-center gap-1 text-primary">
            <Zap className="size-3.5" />
            <span>Zero Server Latency</span>
          </span>
        </div>
      </div>

      {/* Script Text Editor */}
      <ScriptEditor
        text={text}
        setText={setText}
        isPlaying={isPlaying}
        activeSentenceIndex={activeSentenceIndex}
        sentences={sentences}
        onSelectSentence={(idx) => {
          window.speechSynthesis.cancel();
          speakSentence(idx);
        }}
        onApplyPreset={handleApplyPreset}
        rate={rate}
      />

      {/* Playback & Live Waveform Suite */}
      <AudioVisualizer
        isPlaying={isPlaying}
        isPaused={isPaused}
        onPlay={() => startPlayback(0)}
        onPause={pausePlayback}
        onResume={resumePlayback}
        onStop={stopPlayback}
        onPrevSentence={handlePrevSentence}
        onNextSentence={handleNextSentence}
        currentSentenceIdx={activeSentenceIndex}
        totalSentences={sentences.length}
        disabled={!text.trim()}
      />

      {/* Voice Selection & Acoustics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <VoiceSelector
            voices={voices}
            selectedVoice={selectedVoice}
            onSelectVoice={(v) => {
              setSelectedVoice(v);
              if (isPlaying) {
                window.speechSynthesis.cancel();
                speakSentence(sentenceIndexRef.current);
              }
            }}
            onPreviewVoice={handlePreviewVoice}
            isPreviewing={isPreviewing}
            previewVoiceURI={previewVoiceURI}
          />
        </div>

        <div className="lg:col-span-5">
          <VoiceAcoustics
            rate={rate}
            setRate={setRate}
            pitch={pitch}
            setPitch={setPitch}
            volume={volume}
            setVolume={setVolume}
            onReset={handleResetAcoustics}
          />
        </div>
      </div>

      {/* Audio Files Generation & Export Section */}
      <AudioExportSection
        text={text}
        rate={rate}
        pitch={pitch}
        selectedLang={selectedVoice?.lang || "en-US"}
        isRecording={isRecording}
        onStartTabRecording={handleStartTabRecording}
        onStopTabRecording={handleStopTabRecording}
        exportedItems={exportedItems}
        onAddExportItem={handleAddExportItem}
        onRemoveExportItem={handleRemoveExportItem}
      />
    </div>
  );
}
