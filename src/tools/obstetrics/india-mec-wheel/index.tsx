"use client";

import React, { useState, useMemo, useCallback } from "react";
import { indiaMecData } from "../mec-common/indiaData";
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
  Compass, Search, BookOpen, Stethoscope, FileText, CheckCircle2,
  AlertTriangle, XCircle, Sparkles, X, HeartHandshake, ShieldCheck, Printer, Download
} from "lucide-react";

export function IndiaMecWheelTool() {
  const [activeSectorIndex, setActiveSectorIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNoteCode, setSelectedNoteCode] = useState<string | null>(null);
  const [isNoteDrawerOpen, setIsNoteDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("wheel");
  const [selectedMethodForDetail, setSelectedMethodForDetail] = useState<string | null>(null);

  const activeSector = indiaMecData.sectors[activeSectorIndex] || indiaMecData.sectors[0];

  // Search filter
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return indiaMecData.sectors.filter(
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
            <Badge className="bg-emerald-600 text-white text-[10px] sm:text-xs font-semibold px-2 py-0.5">
              MoHFW & WHO India (2022-2023)
            </Badge>
            <span className="text-[11px] text-muted-foreground hidden xs:inline">
              Includes Chhaya & Antara
            </span>
          </div>
          <h1 className="text-xl sm:text-3xl font-extrabold font-heading text-foreground tracking-tight">
            India-Adapted WHO MEC Wheel
          </h1>
        </div>

        {/* Quick Actions: PDF & Notes Drawer */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0">
          <a
            href="/docs/india-adapted-mec-reference-guide.pdf"
            download="India-Adapted-WHO-MEC-Wheel-Reference-Guide.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 transition-colors shadow-2xs"
            title="Download official India-Adapted WHO MEC Reference Guide (MoHFW)"
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
            <Compass className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span className="truncate">Wheel</span>
          </TabsTrigger>
          <TabsTrigger value="eligibility" className="text-xs sm:text-sm py-2 flex items-center justify-center gap-1">
            <Stethoscope className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="truncate">Evaluator</span>
          </TabsTrigger>
          <TabsTrigger value="methods" className="text-xs sm:text-sm py-2 flex items-center justify-center gap-1">
            <FileText className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">Methods</span>
          </TabsTrigger>
          <TabsTrigger value="additional" className="text-xs sm:text-sm py-2 flex items-center justify-center gap-1">
            <HeartHandshake className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="truncate">EC & Matrix</span>
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: INTERACTIVE WHEEL VIEW */}
        <TabsContent value="wheel" className="mt-3 space-y-4">
          {/* Quick Search & Condition Jump Bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search condition (e.g., anaemia, centchroman, post abortal, hypertension, diabetes, LSCS)..."
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
                    className="w-full text-left p-2.5 rounded-lg hover:bg-emerald-500/10 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors flex items-center justify-between text-xs"
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
                dataset={indiaMecData}
                activeSectorIndex={activeSectorIndex}
                onSectorSelect={handleSectorSelect}
                onNoteClick={handleOpenNote}
              />
            </div>

            {/* Right: Active Sector Card & Quick Actions */}
            <div className="lg:col-span-6 xl:col-span-7 space-y-4">
              <MecActiveSectorCard
                dataset={indiaMecData}
                sector={activeSector}
                onNoteClick={handleOpenNote}
                onMethodClick={handleMethodClick}
              />

              {/* Quick switch to multi-condition calculator */}
              <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 flex items-center justify-between gap-3 text-xs">
                <div>
                  <strong className="text-foreground block">Multiple client risk factors?</strong>
                  <span className="text-muted-foreground">
                    Evaluate composite criteria across anemia, LSCS, smoking, and age.
                  </span>
                </div>
                <Button
                  size="sm"
                  onClick={() => setActiveTab("eligibility")}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white shrink-0 text-xs"
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
            dataset={indiaMecData}
            onMethodClick={handleMethodClick}
            onNoteClick={handleOpenNote}
          />
        </TabsContent>

        {/* TAB 3: METHOD MONOGRAPHS */}
        <TabsContent value="methods" className="mt-4">
          <ContraceptiveChoicesView
            dataset={indiaMecData}
            selectedMethodId={selectedMethodForDetail}
          />
        </TabsContent>

        {/* TAB 4: ADDITIONAL INFO (STERILIZATION, EC, LAM, ARVs) */}
        <TabsContent value="additional" className="mt-4">
          <AdditionalInfoView dataset={indiaMecData} />
        </TabsContent>
      </Tabs>

      {/* Clinical Notes Modal / Drawer */}
      <ClinicalNotesDrawer
        dataset={indiaMecData}
        selectedNoteCode={selectedNoteCode}
        isOpen={isNoteDrawerOpen}
        onClose={() => setIsNoteDrawerOpen(false)}
      />
    </div>
  );
}
