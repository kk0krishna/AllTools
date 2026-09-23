"use client";

import React, { useState } from "react";
import { ToolComponentProps } from "@/tools/registry";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Video, Loader2, AlertCircle } from "lucide-react";
import { TranscriptDocument, TranscriptTrackInfo } from "./lib/providers/types";
import { formatters } from "./lib/formatters";
import { TranscriptViewer } from "./components/TranscriptViewer";
import { DownloadMenu } from "./components/DownloadMenu";
import { saveAs } from "file-saver";
import TurndownService from "turndown";
import { ToolLayout } from '@/components/tools/ToolLayout';
import { VercelTranscriptProvider } from './lib/providers/vercel-transcript-provider';
import type { TranscriptEntry } from './lib/providers/types';

// NOTE: Using the user's deployed Vercel URL
const provider = new VercelTranscriptProvider("https://vercel-transcript-backend.vercel.app");

export function YoutubeTranscriptTool({ metadata }: ToolComponentProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusText, setStatusText] = useState("");
  const [document, setDocument] = useState<TranscriptDocument | null>(null);
  const [availableTracks, setAvailableTracks] = useState<TranscriptTrackInfo[]>([]);
  const [selectedLanguageCode, setSelectedLanguageCode] = useState<string>("en");
  const [editedHtml, setEditedHtml] = useState<string | null>(null);
  
  // URL validation regex for youtube (handles watch, shorts, live, embed, youtu.be, m.youtube.com)
  const extractVideoId = (inputUrl: string): string | null => {
    const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts|live)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = inputUrl.match(regExp);
    return match ? match[1] : null;
  };

  const handleFetch = async () => {
    const videoId = extractVideoId(url);
    if (!videoId) {
      setError("Please enter a valid YouTube video URL.");
      return;
    }

    setLoading(true);
    setError(null);
    setDocument(null);
    setAvailableTracks([]);
    
    try {
      setStatusText("Checking YouTube link...");
      const videoInfo = await provider.getVideoInfo(videoId);
      
      setStatusText("Finding available captions...");
      const tracks = await provider.listTracks(videoId);
      
      if (tracks.length === 0) {
        throw new Error("No accessible transcript or captions were found for this video.");
      }
      
      setAvailableTracks(tracks);
      
      setStatusText("Loading transcript...");
      // Prefer manually supplied English captions if multiple
      const enManual = tracks.find(t => t.languageCode.startsWith('en') && t.kind === "manual");
      const initialLang = enManual?.languageCode || tracks[0].languageCode;
      setSelectedLanguageCode(initialLang);
      
      const transcriptTrack = await provider.getTranscript(videoId, initialLang);
      
      setDocument({
        video: videoInfo,
        selectedTrack: transcriptTrack,
        fetchedAt: new Date().toISOString(),
        source: "youtube",
      });
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to retrieve the transcript. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    setSelectedLanguageCode(newLang);
    if (!document) return;
    
    setLoading(true);
    setError(null);
    try {
      setStatusText("Loading transcript...");
      const transcriptTrack = await provider.getTranscript(document.video.videoId, newLang);
      setDocument(prev => prev ? { ...prev, selectedTrack: transcriptTrack } : null);
    } catch(err: any) {
      setError(err.message || "Failed to load the selected language.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (format: "txt" | "md" | "json" | "csv" | "srt" | "vtt") => {
    if (!document) return;
    
    // If we have edited text and are downloading a text format, use the edited HTML
    if (editedHtml && (format === "txt" || format === "md")) {
      let finalContent = "";
      if (format === "md") {
        const turndownService = new TurndownService();
        finalContent = turndownService.turndown(editedHtml);
      } else {
        // Simple HTML strip for plain text
        const tempDiv = window.document.createElement("div");
        tempDiv.innerHTML = editedHtml;
        finalContent = tempDiv.textContent || tempDiv.innerText || "";
      }
      
      const blob = new Blob([finalContent], { type: "text/plain;charset=utf-8" });
      const sanitizeFilename = (name: string) => name.replace(/[\\/:*?"<>|]/g, "").trim() || "transcript";
      const filename = `${sanitizeFilename(document.video.title || document.video.videoId)}-transcript.${format}`;
      saveAs(blob, filename);
      return;
    }
    
    const formatter = formatters[format];
    const content = formatter.format(document);
    
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const sanitizeFilename = (name: string) => name.replace(/[\\/:*?"<>|]/g, "").trim() || "transcript";
    
    const filename = `${sanitizeFilename(document.video.title || document.video.videoId)}-transcript.${format}`;
    saveAs(blob, filename);
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-8 w-full animate-in fade-in zoom-in-95 duration-500 pb-12">
      {/* Hero Section */}
      <section className="text-center space-y-4 pt-8">
        <div className="mx-auto w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-red-500/20">
          <Video className="w-8 h-8" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold font-heading tracking-tight">
          YouTube Transcript
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Get a clean, copyable transcript from any accessible YouTube video.
        </p>
      </section>

      {/* Input Section */}
      <Card className="border-border/50 shadow-xl bg-card/40 backdrop-blur-sm overflow-hidden">
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Video className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Paste YouTube URL..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleFetch()}
                className="pl-12 h-14 text-lg bg-background"
                disabled={loading}
              />
            </div>
            <Button
              size="lg"
              className="h-14 px-8 text-base font-semibold"
              onClick={handleFetch}
              disabled={loading || !url.trim()}
              suppressHydrationWarning
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Get Transcript"}
            </Button>
          </div>
          
          {loading && (
            <div className="mt-6 flex flex-col items-center justify-center text-muted-foreground animate-pulse gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <p className="text-sm font-medium">{statusText}</p>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-sm leading-relaxed">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Section */}
      {document && !loading && !error && (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
          {/* Metadata Header */}
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between p-6 bg-card border border-border/50 rounded-xl shadow-sm">
            <div className="flex items-center gap-4">
              {document.video.thumbnailUrl && (
                <img 
                  src={document.video.thumbnailUrl} 
                  alt="Thumbnail" 
                  className="w-32 h-auto rounded-lg object-cover shadow-sm border border-border/50"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
              )}
              <div className="flex flex-col gap-1">
                <h2 className="font-semibold text-lg line-clamp-1" title={document.video.title}>{document.video.title || "Unknown Video"}</h2>
                <div className="text-sm text-muted-foreground flex flex-wrap items-center gap-2">
                  <span>{document.video.channelName || "Unknown Channel"}</span>
                  <span>•</span>
                  <span className="capitalize">{document.selectedTrack.kind} Caption</span>
                  <span>•</span>
                  <span>{document.selectedTrack.languageName}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full md:w-auto mt-4 md:mt-0">
              {availableTracks.length > 1 && (
                <div className="flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-lg border border-border/50 w-full sm:w-auto">
                  <label htmlFor="lang-select" className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    Language
                  </label>
                  <select
                    id="lang-select"
                    value={selectedLanguageCode}
                    onChange={handleLanguageChange}
                    className="bg-transparent border-0 text-sm font-medium focus:ring-0 cursor-pointer w-full sm:w-auto outline-none"
                  >
                    {availableTracks.map(track => (
                      <option key={track.languageCode} value={track.languageCode}>
                        {track.languageName} {track.kind === "auto" ? "(Auto)" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              <div className="flex gap-2 w-full sm:w-auto justify-end">
                <DownloadMenu onDownload={handleDownload} />
              </div>
            </div>
          </div>

          {/* Transcript Viewer */}
          <TranscriptViewer 
            document={document} 
            onContentChange={setEditedHtml}
          />
        </div>
      )}
    </div>
  );
}
