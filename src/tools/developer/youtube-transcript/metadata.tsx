import React from "react";
import { ToolEntry } from "@/tools/registry";
import { YoutubeTranscriptTool } from "./index";

export const youtubeTranscriptToolEntry: ToolEntry = {
  metadata: {
    name: "YouTube Transcript Downloader",
    description:
      "Extract, search, read, and download full text transcripts from any accessible YouTube video in TXT, Markdown, JSON, CSV, SRT, and VTT formats.",
    category: "developer",
    slug: "youtube-transcript",
    keywords: ["youtube", "transcript", "captions", "subtitles", "srt", "vtt", "download transcript", "youtube caption extractor"],
  },
  component: YoutubeTranscriptTool,
  content: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">How to Get a YouTube Transcript</h2>
        <p className="text-muted-foreground leading-relaxed">
          The YouTube Transcript Downloader allows you to instantly extract the full text transcript of any accessible YouTube video. 
          Simply paste the URL into the input field and click "Get Transcript". The tool will automatically fetch the available captions 
          and present them in a clean, readable format.
        </p>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-3">Supported Download Formats</h3>
        <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
          <li><strong>Plain Text (.txt):</strong> A clean, continuous text block without timestamps. Perfect for reading or summarizing.</li>
          <li><strong>Markdown (.md):</strong> Formatted text with a title header.</li>
          <li><strong>JSON (.json):</strong> Structured data for developers containing exact timestamps and video metadata.</li>
          <li><strong>CSV (.csv):</strong> Comma-separated values for importing into spreadsheets or databases.</li>
          <li><strong>SubRip (.srt) & WebVTT (.vtt):</strong> Standard subtitle formats with precision timestamps for video players and editors.</li>
        </ul>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg border border-border/50">
        <h4 className="font-semibold mb-2">Note on Captions</h4>
        <p className="text-sm text-muted-foreground">
          This tool relies on the captions provided by the video creator or YouTube's auto-generated captions. 
          If a video does not have any captions enabled, or if it is age-restricted or private, the transcript cannot be retrieved.
        </p>
      </div>
    </div>
  ),
};
