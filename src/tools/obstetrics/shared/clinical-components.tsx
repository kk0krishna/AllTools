"use client";

import React, { useState } from "react";
import { AlertTriangle, Check, Copy, Printer, Share2, BookOpen, Info, HelpCircle, Award, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * Universal Medical Disclaimer required on all Obstetric Clinical Suite (OCS) calculators.
 */
export function MedicalDisclaimer() {
  return (
    <details className="border border-border/60 rounded-xl p-3 my-4 text-xs text-muted-foreground bg-muted/20 transition-all cursor-pointer group">
      <summary className="font-semibold text-foreground flex items-center gap-2 outline-none select-none">
        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
        <span>Clinical Reference & Institutional Protocol Disclaimer (Tap to expand)</span>
      </summary>
      <div className="mt-2 text-xs leading-relaxed pl-6 text-muted-foreground border-l-2 border-amber-500/40">
        This tool is intended for educational and clinical reference purposes only. It is not a substitute for professional clinical judgment, individual patient assessment, or formal medical diagnosis. Always follow local institutional protocols and current national/international obstetric guidelines.
      </div>
    </details>
  );
}

export interface ClinicalResultCardProps {
  title: string;
  primaryResult: string;
  primaryLabel: string;
  badgeText?: string;
  badgeColor?: "blue" | "green" | "orange" | "red" | "purple";
  secondaryResults?: { label: string; value: string | number; helper?: string }[];
  summaryTextForCopy?: string;
}

/**
 * Premium SaaS Result Card featuring instant Copy, Share, and Print capabilities.
 */
export function ClinicalResultCard({
  title,
  primaryResult,
  primaryLabel,
  badgeText,
  badgeColor = "blue",
  secondaryResults = [],
  summaryTextForCopy,
}: ClinicalResultCardProps) {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  const badgeColorClasses = {
    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    green: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    orange: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    red: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
    purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  }[badgeColor];

  const getCopyText = () => {
    if (summaryTextForCopy) return summaryTextForCopy;
    let text = `=== OCS CLINICAL RESULT: ${title.toUpperCase()} ===\n`;
    text += `${primaryLabel}: ${primaryResult}\n`;
    if (badgeText) text += `Status: ${badgeText}\n`;
    if (secondaryResults.length > 0) {
      text += `\n--- Detailed Metrics ---\n`;
      secondaryResults.forEach((r) => {
        text += `${r.label}: ${r.value}${r.helper ? ` (${r.helper})` : ""}\n`;
      });
    }
    text += `\nCalculated via ToolVerse Obstetric Clinical Suite (OCS)`;
    return text;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getCopyText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Failed to copy", e);
    }
  };

  const handleShare = async () => {
    const text = getCopyText();
    if (navigator.share) {
      try {
        await navigator.share({
          title: `OCS Calculation: ${title}`,
          text: text,
          url: window.location.href,
        });
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      } catch (e) {
        console.log("Share cancelled or failed", e);
      }
    } else {
      handleCopy();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Card className="border-2 border-primary/20 shadow-lg bg-gradient-to-br from-background via-background to-muted/20 overflow-hidden my-6 print:border-black print:shadow-none">
      <div className="bg-primary/5 px-6 py-4 border-b flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary animate-pulse" />
          <h3 className="font-bold text-base sm:text-lg tracking-tight text-foreground">{title}</h3>
        </div>
        <div className="flex items-center gap-1.5 print:hidden">
          <Button variant="outline" size="sm" onClick={handleCopy} className="h-8 px-2.5 text-xs font-medium">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
            {copied ? "Copied!" : "Copy"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare} className="h-8 px-2.5 text-xs font-medium">
            <Share2 className="w-3.5 h-3.5 mr-1" />
            {shared ? "Shared!" : "Share"}
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint} className="h-8 px-2 text-xs font-medium" title="Print clinical report">
            <Printer className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-border/60">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
              {primaryLabel}
            </span>
            <div className="text-3xl sm:text-5xl font-extrabold tracking-tight text-primary font-heading">
              {primaryResult}
            </div>
          </div>
          {badgeText && (
            <div className={`px-3.5 py-1.5 rounded-full border text-xs sm:text-sm font-bold uppercase tracking-wide self-start sm:self-center ${badgeColorClasses}`}>
              {badgeText}
            </div>
          )}
        </div>

        {secondaryResults.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {secondaryResults.map((item, idx) => (
              <div key={idx} className="bg-muted/40 p-3 rounded-xl border border-border/40">
                <span className="text-xs text-muted-foreground font-medium block truncate" title={item.label}>
                  {item.label}
                </span>
                <div className="text-base sm:text-lg font-bold text-foreground mt-0.5">
                  {item.value}
                </div>
                {item.helper && (
                  <span className="text-[11px] text-muted-foreground block mt-0.5 truncate">
                    {item.helper}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export interface EducationalSectionProps {
  why?: string;
  formula?: string;
  clinicalImportance?: string;
  commonMistakes?: string[];
  examPearls?: string[];
  references?: string[];
}

/**
 * Educational Mode Section rendering clinical rationale, formulas, exam pearls, and references.
 */
export function EducationalSection({
  why,
  formula,
  clinicalImportance,
  commonMistakes = [],
  examPearls = [],
  references = [],
}: EducationalSectionProps) {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggle = (key: string) => {
    setOpenSection(openSection === key ? null : key);
  };

  return (
    <details className="my-4 border rounded-2xl overflow-hidden shadow-2xs bg-card print:hidden group">
      <summary className="bg-muted/30 hover:bg-muted/50 px-5 py-3 flex items-center justify-between cursor-pointer font-bold text-xs sm:text-sm text-foreground select-none outline-none">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary shrink-0" />
          <span>📚 Clinical Rationale, Formulas & Guidelines (Tap to Expand)</span>
        </div>
      </summary>

      <div className="divide-y divide-border/60 border-t">
        {why && (
          <div>
            <button
              onClick={() => toggle("why")}
              className="w-full px-6 py-3.5 flex items-center justify-between text-left font-semibold text-sm hover:bg-muted/30 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-500" /> Why This Calculator Matters
              </span>
              {openSection === "why" ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
            </button>
            {openSection === "why" && (
              <div className="px-6 pb-4 text-sm text-muted-foreground leading-relaxed bg-muted/10">
                {why}
              </div>
            )}
          </div>
        )}

        {formula && (
          <div>
            <button
              onClick={() => toggle("formula")}
              className="w-full px-6 py-3.5 flex items-center justify-between text-left font-semibold text-sm hover:bg-muted/30 transition-colors"
            >
              <span className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-500" /> Mathematical Formula & Method
              </span>
              {openSection === "formula" ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
            </button>
            {openSection === "formula" && (
              <div className="px-6 pb-4 text-sm bg-muted/10">
                <pre className="bg-muted p-3 rounded-lg font-mono text-xs overflow-x-auto text-foreground border">
                  {formula}
                </pre>
              </div>
            )}
          </div>
        )}

        {clinicalImportance && (
          <div>
            <button
              onClick={() => toggle("importance")}
              className="w-full px-6 py-3.5 flex items-center justify-between text-left font-semibold text-sm hover:bg-muted/30 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Award className="w-4 h-4 text-orange-500" /> Clinical Importance & Actionable Guidance
              </span>
              {openSection === "importance" ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
            </button>
            {openSection === "importance" && (
              <div className="px-6 pb-4 text-sm text-muted-foreground leading-relaxed bg-muted/10">
                {clinicalImportance}
              </div>
            )}
          </div>
        )}

        {examPearls.length > 0 && (
          <div>
            <button
              onClick={() => toggle("pearls")}
              className="w-full px-6 py-3.5 flex items-center justify-between text-left font-semibold text-sm hover:bg-muted/30 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-500" /> Exam Pearls & Clinical Gotchas ({examPearls.length})
              </span>
              {openSection === "pearls" ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
            </button>
            {openSection === "pearls" && (
              <div className="px-6 pb-4 text-sm bg-muted/10">
                <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                  {examPearls.map((pearl, idx) => (
                    <li key={idx} className="leading-relaxed">
                      <strong className="text-foreground">Pearl #{idx + 1}:</strong> {pearl}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {commonMistakes.length > 0 && (
          <div>
            <button
              onClick={() => toggle("mistakes")}
              className="w-full px-6 py-3.5 flex items-center justify-between text-left font-semibold text-sm hover:bg-muted/30 transition-colors"
            >
              <span className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" /> Common Clinical & Dating Mistakes ({commonMistakes.length})
              </span>
              {openSection === "mistakes" ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
            </button>
            {openSection === "mistakes" && (
              <div className="px-6 pb-4 text-sm bg-muted/10">
                <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                  {commonMistakes.map((mistake, idx) => (
                    <li key={idx} className="leading-relaxed">
                      <strong className="text-red-600 dark:text-red-400">Pitfall:</strong> {mistake}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {references.length > 0 && (
          <div>
            <button
              onClick={() => toggle("refs")}
              className="w-full px-6 py-3.5 flex items-center justify-between text-left font-semibold text-sm hover:bg-muted/30 transition-colors"
            >
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Authoritative Guidelines & Citations ({references.length})
              </span>
              {openSection === "refs" ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
            </button>
            {openSection === "refs" && (
              <div className="px-6 pb-4 text-sm bg-muted/10">
                <ul className="space-y-1.5 list-disc list-inside text-xs text-muted-foreground">
                  {references.map((ref, idx) => (
                    <li key={idx} className="leading-relaxed font-mono">
                      {ref}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </details>
  );
}
