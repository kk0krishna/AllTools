"use client";

import React, { useEffect } from "react";
import { MecDataset } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, X } from "lucide-react";

interface ClinicalNotesDrawerProps {
  dataset: MecDataset;
  selectedNoteCode: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ClinicalNotesDrawer({
  dataset,
  selectedNoteCode,
  isOpen,
  onClose
}: ClinicalNotesDrawerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const activeNote = selectedNoteCode ? dataset.notes[selectedNoteCode] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl bg-card border border-border/80 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-border/60 bg-muted/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary shrink-0" />
            <div>
              <h3 className="text-base sm:text-lg font-bold font-heading text-foreground">
                {activeNote
                  ? `Clinical Note ${activeNote.code}: ${activeNote.title || ""}`
                  : "Clinical Footnotes & Guidance Notes"}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Evidence-based clarifications and drug interaction protocols from the MEC Wheel.
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground shrink-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {activeNote ? (
            <div className="space-y-4">
              <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <Badge className="font-mono text-sm font-bold bg-primary text-white">
                    Footnote [{activeNote.code}]
                  </Badge>
                  {activeNote.title && (
                    <span className="text-xs font-semibold text-primary">{activeNote.title}</span>
                  )}
                </div>
                <p className="text-sm sm:text-base text-foreground font-medium leading-relaxed pt-1">
                  {activeNote.text}
                </p>
              </div>

              <div className="pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                  All Clinical Notes in this Edition:
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {Object.values(dataset.notes).map((note) => {
                    const isCurrent = note.code === activeNote.code;
                    return (
                      <div
                        key={note.code}
                        className={`p-3 rounded-xl border text-xs transition-colors ${
                          isCurrent
                            ? "border-primary bg-primary/5 text-foreground font-semibold"
                            : "border-border/60 bg-card hover:bg-muted/40 text-muted-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono font-bold px-1.5 py-0.5 rounded bg-muted text-foreground text-xs">
                            {note.code}
                          </span>
                          {note.title && (
                            <span className="font-semibold text-foreground">{note.title}</span>
                          )}
                        </div>
                        <p className="leading-relaxed">{note.text}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2.5">
              {Object.values(dataset.notes).map((note) => (
                <div
                  key={note.code}
                  className="p-3.5 rounded-xl border border-border/60 bg-card hover:bg-muted/30 transition-colors space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-sm px-2 py-0.5 rounded bg-primary/15 text-primary">
                      Note {note.code}
                    </span>
                    {note.title && <span className="font-semibold text-foreground">{note.title}</span>}
                  </div>
                  <p className="text-muted-foreground leading-relaxed pt-1 text-xs sm:text-sm">
                    {note.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-border/50 bg-muted/10 flex justify-end">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
