"use client";

import React, { useState, useMemo, useEffect } from "react";
import { TranscriptDocument, TranscriptSegment } from "../lib/providers/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Copy, Clock, AlignLeft, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { formatTimestamp } from "../lib/timestamps";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface TranscriptViewerProps {
  document: TranscriptDocument;
  onContentChange?: (html: string) => void;
}

export function TranscriptViewer({ document, onContentChange }: TranscriptViewerProps) {
  const [viewMode, setViewMode] = useState<"clean" | "timestamped">("clean");
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const [activeMatchIndex, setActiveMatchIndex] = useState(0);

  const segments = document.selectedTrack.segments;

  const [editorHtml, setEditorHtml] = useState("");

  useEffect(() => {
    const cleanText = document.selectedTrack.segments.map((s) => s.text).join(" ");
    const initialHtml = `<p>${cleanText}</p>`;
    setEditorHtml(initialHtml);
    if (onContentChange) onContentChange(initialHtml);
  }, [document, onContentChange]);

  const handleEditorChange = (html: string) => {
    setEditorHtml(html);
    if (onContentChange) onContentChange(html);
  };

  // Simple client-side search logic for timestamped view
  const matchIndices = useMemo(() => {
    if (viewMode === "clean" || !searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    const indices: number[] = [];
    segments.forEach((seg, i) => {
      if (seg.text.toLowerCase().includes(query)) {
        indices.push(i);
      }
    });
    return indices;
  }, [segments, searchQuery, viewMode]);

  const handleCopy = () => {
    let text = "";
    if (viewMode === "clean") {
      const tempDiv = window.document.createElement("div");
      tempDiv.innerHTML = editorHtml;
      text = tempDiv.textContent || tempDiv.innerText || "";
    } else {
      text = segments
        .map((s) => `[${formatTimestamp(s.start, "short")}] ${s.text}`)
        .join("\n");
    }
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNextMatch = () => {
    if (matchIndices.length === 0) return;
    const next = (activeMatchIndex + 1) % matchIndices.length;
    setActiveMatchIndex(next);
    scrollToSegment(matchIndices[next]);
  };

  const handlePrevMatch = () => {
    if (matchIndices.length === 0) return;
    const prev = (activeMatchIndex - 1 + matchIndices.length) % matchIndices.length;
    setActiveMatchIndex(prev);
    scrollToSegment(matchIndices[prev]);
  };

  const scrollToSegment = (index: number) => {
    if (viewMode === "clean") return;
    const el = window.document.getElementById(`segment-${index}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const highlightText = (text: string) => {
    if (!searchQuery.trim() || viewMode === "clean") return text;
    const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === searchQuery.toLowerCase() ? (
            <mark key={i} className="bg-primary/30 text-foreground rounded px-1">
              {part}
            </mark>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    );
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['clean']
    ],
  };

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-muted/30 p-4 rounded-xl border border-border/50">
        <div className="flex bg-muted/50 p-1 rounded-lg">
          <Button
            variant={viewMode === "clean" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("clean")}
            className="rounded-md"
          >
            <AlignLeft className="w-4 h-4 mr-2" /> WYSIWYG Editor
          </Button>
          <Button
            variant={viewMode === "timestamped" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("timestamped")}
            className="rounded-md"
          >
            <Clock className="w-4 h-4 mr-2" /> Timestamps
          </Button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {viewMode === "timestamped" && (
            <div className="relative flex items-center w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 text-muted-foreground" />
              <Input
                placeholder="Search transcript..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setActiveMatchIndex(0);
                }}
                className="pl-9 pr-20"
              />
              {matchIndices.length > 0 && (
                <div className="absolute right-2 flex items-center gap-1 text-xs text-muted-foreground">
                  <span>{activeMatchIndex + 1}/{matchIndices.length}</span>
                  <button onClick={handlePrevMatch} className="hover:text-foreground"><ChevronLeft className="w-3 h-3"/></button>
                  <button onClick={handleNextMatch} className="hover:text-foreground"><ChevronRight className="w-3 h-3"/></button>
                </div>
              )}
            </div>
          )}
          
          <Button variant="outline" size="sm" onClick={handleCopy} className="min-w-[100px]">
            {copied ? <Check className="w-4 h-4 mr-2 text-green-500" /> : <Copy className="w-4 h-4 mr-2" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      </div>

      {/* Viewer */}
      <div className="bg-card border border-border/50 rounded-xl overflow-hidden font-sans leading-relaxed text-foreground/90 text-lg shadow-inner flex flex-col">
        {viewMode === "clean" ? (
          <div className="h-full min-h-[400px]">
            <ReactQuill 
              theme="snow"
              value={editorHtml}
              onChange={handleEditorChange}
              modules={modules}
              className="h-[350px] sm:h-[450px]"
            />
          </div>
        ) : (
          <div className="p-6 min-h-[400px] max-h-[600px] overflow-y-auto flex flex-col gap-3 font-mono text-sm">
            {segments.map((seg, i) => {
              const isActiveMatch = matchIndices.includes(i) && activeMatchIndex === matchIndices.indexOf(i);
              return (
                <div 
                  key={seg.id} 
                  id={`segment-${i}`}
                  className={`flex gap-4 p-2 rounded-lg transition-colors hover:bg-muted/30 ${isActiveMatch ? "bg-primary/10 border border-primary/20" : ""}`}
                >
                  <a 
                    href={`${document.video.url}&t=${Math.floor(seg.start)}s`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-primary/70 hover:text-primary shrink-0 select-none cursor-pointer hover:underline"
                    title="Open YouTube at this time"
                  >
                    [{formatTimestamp(seg.start, "short")}]
                  </a>
                  <span className="text-foreground/90 font-sans text-base">
                    {highlightText(seg.text)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
