"use client";

import React, { useState, useMemo, useCallback } from "react";
import { whoMecData } from "../mec-common/whoData";
import { MecSectorData } from "../mec-common/types";
import { MecWheel } from "../mec-common/MecWheel";
import { MecActiveSectorCard } from "../mec-common/MecActiveSectorCard";
import { EligibilityEvaluator } from "../mec-common/EligibilityEvaluator";
import { ContraceptiveChoicesView } from "../mec-common/ContraceptiveChoicesView";
import { AdditionalInfoView } from "../mec-common/AdditionalInfoView";
import { ClinicalNotesDrawer } from "../mec-common/ClinicalNotesDrawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../mec-common/Tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Compass, Search, BookOpen, Stethoscope, HelpCircle, FileText, CheckCircle2,
  AlertTriangle, XCircle, ShieldAlert, Sparkles, X, Globe, Printer, Download
} from "lucide-react";

export function WhoMecWheelTool() {
  const [activeSectorIndex, setActiveSectorIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNoteCode, setSelectedNoteCode] = useState<string | null>(null);
  const [isNoteDrawerOpen, setIsNoteDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("wheel");
  const [selectedMethodForDetail, setSelectedMethodForDetail] = useState<string | null>(null);

  const activeSector = whoMecData.sectors[activeSectorIndex] || whoMecData.sectors[0];

  // Search filter
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return whoMecData.sectors.filter(
      (s) =>
        s.conditionName.toLowerCase().includes(q) ||
        s.categoryName.toLowerCase().includes(q) ||
        (s.subCondition && s.subCondition.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const handleSectorSelect = useCallback((sector: MecSectorData) => {
    setActiveSectorIndex(sector.sectorIndex);
  }, []);

  const handleOpenNote = useCallback((noteCode: string) => {
    setSelectedNoteCode(noteCode);
    setIsNoteDrawerOpen(true);
  }, []);

  const handleMethodClick = useCallback((methodId: string) => {
    setSelectedMethodForDetail(methodId);
    setActiveTab("methods");
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 text-foreground">
      {/* Hero Header */}
      <div className="relative rounded-3xl overflow-hidden border border-border/80 bg-gradient-to-br from-sky-950/20 via-card to-background p-5 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-sky-600 text-white hover:bg-sky-700 text-xs font-semibold px-2.5 py-0.5 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                WHO Global Standard
              </Badge>
              <Badge variant="outline" className="text-xs font-mono text-muted-foreground">
                5th Edition (2015 Guideline)
              </Badge>
              <Badge variant="outline" className="text-xs text-muted-foreground">
                Evidence-Based Contraception
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold font-heading tracking-tight text-foreground">
              WHO Medical Eligibility Criteria Wheel
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Official interactive digital edition of the World Health Organization MEC Wheel for contraceptive use. Rotate the wheel, evaluate patient criteria across 6 contraceptive method tracks and 36 medical conditions, or use the multi-condition Eligibility Evaluator.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto shrink-0">
            <a
              href="/docs/who-mec-wheel-5th-edition.pdf"
              download="WHO-MEC-Wheel-5th-Edition-Official.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border border-sky-500/40 bg-sky-500/10 hover:bg-sky-500/20 text-sky-700 dark:text-sky-300 transition-colors shadow-2xs"
              title="Download official WHO 5th Edition Medical Eligibility Criteria document"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Official WHO PDF</span>
            </a>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="text-xs flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Guide
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                setSelectedNoteCode(null);
                setIsNoteDrawerOpen(true);
              }}
              className="text-xs flex items-center gap-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Clinical Notes A-Z
            </Button>
          </div>
        </div>

        {/* MEC Rating Legend Bar */}
        <div className="mt-6 pt-5 border-t border-border/60 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          <div className="p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex items-start gap-2">
            <div className="w-5 h-5 rounded-full bg-emerald-500 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
              1
            </div>
            <div>
              <strong className="text-foreground block">Category 1: Safe</strong>
              <span className="text-muted-foreground text-[11px]">Use in any circumstance (YES)</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl border border-blue-500/30 bg-blue-500/10 flex items-start gap-2">
            <div className="w-5 h-5 rounded-full bg-blue-500 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
              2
            </div>
            <div>
              <strong className="text-foreground block">Category 2: Generally Use</strong>
              <span className="text-muted-foreground text-[11px]">Advantages outweigh risks (YES)</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-start gap-2">
            <div className="w-5 h-5 rounded-full bg-amber-500 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
              3
            </div>
            <div>
              <strong className="text-foreground block">Category 3: Caution</strong>
              <span className="text-muted-foreground text-[11px]">Risks outweigh advantages (NO*)</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 flex items-start gap-2">
            <div className="w-5 h-5 rounded-full bg-rose-500 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
              4
            </div>
            <div>
              <strong className="text-foreground block">Category 4: Contraindicated</strong>
              <span className="text-muted-foreground text-[11px]">Unacceptable health risk (NO)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full h-auto p-1 bg-muted/60 rounded-xl">
          <TabsTrigger value="wheel" className="text-xs sm:text-sm py-2.5 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-sky-500" />
            <span>Interactive Wheel</span>
          </TabsTrigger>
          <TabsTrigger value="eligibility" className="text-xs sm:text-sm py-2.5 flex items-center gap-1.5">
            <Stethoscope className="w-4 h-4 text-emerald-500" />
            <span>Eligibility Evaluator</span>
          </TabsTrigger>
          <TabsTrigger value="methods" className="text-xs sm:text-sm py-2.5 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-primary" />
            <span>Method Monographs</span>
          </TabsTrigger>
          <TabsTrigger value="additional" className="text-xs sm:text-sm py-2.5 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>EC & Drug Matrix</span>
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: INTERACTIVE WHEEL VIEW */}
        <TabsContent value="wheel" className="mt-4 space-y-6">
          {/* Quick Search & Condition Jump Bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search medical condition to rotate wheel (e.g., migraine with aura, smoking, hypertension, diabetes)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-9 text-sm h-11 bg-card rounded-xl border-border/80 shadow-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Instant Search Autocomplete Dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-card/95 backdrop-blur-md rounded-xl border border-border/80 shadow-xl max-h-60 overflow-y-auto z-30 p-1.5 space-y-1">
                {searchResults.map((sec) => (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => {
                      setActiveSectorIndex(sec.sectorIndex);
                      setSearchQuery("");
                    }}
                    className="w-full text-left p-2.5 rounded-lg hover:bg-sky-500/10 hover:text-sky-600 transition-colors flex items-center justify-between text-xs"
                  >
                    <div>
                      <strong className="text-foreground block">{sec.conditionName}</strong>
                      <span className="text-[11px] text-muted-foreground">{sec.categoryName}</span>
                    </div>
                    <Badge variant="outline" className="font-mono text-[10px]">
                      Sector #{sec.sectorIndex + 1}
                    </Badge>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dual Layout: Large Interactive Physics Wheel + Live Active Sector Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Interactive Wheel */}
            <div className="lg:col-span-6 xl:col-span-5 flex flex-col items-center justify-center p-3 sm:p-5 rounded-3xl border border-border/70 bg-card/60 backdrop-blur-md shadow-sm">
              <MecWheel
                dataset={whoMecData}
                activeSectorIndex={activeSectorIndex}
                onSectorSelect={handleSectorSelect}
                onNoteClick={handleOpenNote}
              />
            </div>

            {/* Right: Active Sector Card & Quick Actions */}
            <div className="lg:col-span-6 xl:col-span-7 space-y-4">
              <MecActiveSectorCard
                dataset={whoMecData}
                sector={activeSector}
                onNoteClick={handleOpenNote}
                onMethodClick={handleMethodClick}
              />

              {/* Quick switch to multi-condition calculator */}
              <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 flex items-center justify-between gap-3 text-xs">
                <div>
                  <strong className="text-foreground block">Have a patient with multiple conditions?</strong>
                  <span className="text-muted-foreground">
                    Evaluate combined contraindications across smoking, age, BMI & more.
                  </span>
                </div>
                <Button
                  size="sm"
                  onClick={() => setActiveTab("eligibility")}
                  className="bg-primary text-primary-foreground shrink-0 text-xs"
                >
                  Eligibility Evaluator &rarr;
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* TAB 2: ELIGIBILITY EVALUATOR */}
        <TabsContent value="eligibility" className="mt-4">
          <EligibilityEvaluator
            dataset={whoMecData}
            onMethodClick={handleMethodClick}
            onNoteClick={handleOpenNote}
          />
        </TabsContent>

        {/* TAB 3: METHOD MONOGRAPHS */}
        <TabsContent value="methods" className="mt-4">
          <ContraceptiveChoicesView
            dataset={whoMecData}
            selectedMethodId={selectedMethodForDetail}
          />
        </TabsContent>

        {/* TAB 4: ADDITIONAL INFO (EC, ARVs, SAFE LIST) */}
        <TabsContent value="additional" className="mt-4">
          <AdditionalInfoView dataset={whoMecData} />
        </TabsContent>
      </Tabs>

      {/* Clinical Notes Modal / Drawer */}
      <ClinicalNotesDrawer
        dataset={whoMecData}
        selectedNoteCode={selectedNoteCode}
        isOpen={isNoteDrawerOpen}
        onClose={() => setIsNoteDrawerOpen(false)}
      />
    </div>
  );
}
