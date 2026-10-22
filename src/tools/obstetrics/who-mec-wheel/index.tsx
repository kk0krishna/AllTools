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
      {/* Compact Header - Fits comfortably above the fold */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-1 no-print">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-sky-600 text-white text-[10px] sm:text-xs font-semibold px-2 py-0.5">
              WHO 5th Edition (2015)
            </Badge>
            <span className="text-[11px] text-muted-foreground hidden xs:inline">
              Evidence-Based Contraceptive Guidelines
            </span>
          </div>
          <h1 className="text-xl sm:text-3xl font-extrabold font-heading text-foreground tracking-tight">
            WHO Medical Eligibility Criteria Wheel
          </h1>
        </div>

        {/* Quick Actions: PDF & Notes Drawer */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0">
          <a
            href="/docs/who-mec-wheel-5th-edition.pdf"
            download="WHO-MEC-Wheel-5th-Edition-Official.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-sky-500/40 bg-sky-500/10 hover:bg-sky-500/20 text-sky-700 dark:text-sky-300 transition-colors shadow-2xs"
            title="Download official WHO 5th Edition Medical Eligibility Criteria document"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Official PDF</span>
          </a>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedNoteCode(null);
              setIsNoteDrawerOpen(true);
            }}
            className="text-xs h-8 flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Notes A-Z</span>
          </Button>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 w-full p-1 bg-muted/60 rounded-xl">
          <TabsTrigger value="wheel" className="text-xs sm:text-sm py-2 flex items-center justify-center gap-1">
            <Compass className="w-3.5 h-3.5 text-sky-500 shrink-0" />
            <span className="truncate">Wheel</span>
          </TabsTrigger>
          <TabsTrigger value="eligibility" className="text-xs sm:text-sm py-2 flex items-center justify-center gap-1">
            <Stethoscope className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span className="truncate">Evaluator</span>
          </TabsTrigger>
          <TabsTrigger value="methods" className="text-xs sm:text-sm py-2 flex items-center justify-center gap-1">
            <FileText className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="truncate">Methods</span>
          </TabsTrigger>
          <TabsTrigger value="additional" className="text-xs sm:text-sm py-2 flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="truncate">EC & Matrix</span>
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: INTERACTIVE WHEEL VIEW */}
        <TabsContent value="wheel" className="mt-3 space-y-4">
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
