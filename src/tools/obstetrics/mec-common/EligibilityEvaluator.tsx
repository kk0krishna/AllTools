"use client";

import React, { useState, useMemo } from "react";
import { MecDataset, MecSectorData, MecMethodDefinition } from "./types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CheckCircle2, AlertTriangle, XCircle, Search, X, Sparkles, Filter, ShieldCheck, HeartHandshake, Stethoscope
} from "lucide-react";

interface EligibilityEvaluatorProps {
  dataset: MecDataset;
  onMethodClick?: (methodId: string) => void;
  onNoteClick?: (noteCode: string) => void;
}

export function EligibilityEvaluator({
  dataset,
  onMethodClick,
  onNoteClick
}: EligibilityEvaluatorProps) {
  const [selectedConditionIds, setSelectedConditionIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("all");
  const [preferenceFilter, setPreferenceFilter] = useState<string>("all");

  // Filter conditions for selection
  const filteredConditions = useMemo(() => {
    return dataset.sectors.filter((sector) => {
      const matchesSearch =
        searchQuery === "" ||
        sector.conditionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sector.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (sector.subCondition && sector.subCondition.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat =
        selectedCategoryFilter === "all" || sector.categoryName === selectedCategoryFilter;

      return matchesSearch && matchesCat;
    });
  }, [dataset.sectors, searchQuery, selectedCategoryFilter]);

  // Unique categories for filtering
  const allCategories = useMemo(() => {
    return Array.from(new Set(dataset.sectors.map((s) => s.categoryName)));
  }, [dataset.sectors]);

  const toggleCondition = (id: string) => {
    setSelectedConditionIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const clearAllConditions = () => {
    setSelectedConditionIds([]);
  };

  // Helper to parse numeric score value for worst-case evaluation
  const parseScoreValue = (scoreStr: string): number => {
    // E.g. "4", "3/4" -> 4; "2-3" -> 3; "1" -> 1
    if (scoreStr.includes("4")) return 4;
    if (scoreStr.includes("3")) return 3;
    if (scoreStr.includes("2")) return 2;
    if (scoreStr.includes("1")) return 1;
    return 1;
  };

  // Multi-Condition Evaluation Matrix calculation
  const evaluationResults = useMemo(() => {
    const selectedSectors = dataset.sectors.filter((s) => selectedConditionIds.includes(s.id));

    return dataset.methods.map((method) => {
      let maxScoreNum = 1;
      let worstScoreRaw = "1";
      const conditionReasons: { condition: string; score: string; notes?: string[]; clarification?: string }[] = [];

      selectedSectors.forEach((sec) => {
        const item = sec.scores.find((sc) => sc.methodId === method.id);
        if (item) {
          const val = parseScoreValue(item.score);
          conditionReasons.push({
            condition: sec.conditionName,
            score: item.score,
            notes: item.notes,
            clarification: item.clarification
          });
          if (val > maxScoreNum) {
            maxScoreNum = val;
            worstScoreRaw = item.score;
          }
        }
      });

      return {
        method,
        compositeScore: maxScoreNum,
        worstScoreRaw: selectedSectors.length > 0 ? worstScoreRaw : "1",
        reasons: conditionReasons
      };
    });
  }, [dataset.methods, dataset.sectors, selectedConditionIds]);

  // Apply preference filter
  const filteredResults = useMemo(() => {
    return evaluationResults.filter(({ method }) => {
      if (preferenceFilter === "all") return true;
      if (preferenceFilter === "non-hormonal") return method.type === "non-hormonal";
      if (preferenceFilter === "larc") return method.id === "cu_iucd" || method.id === "cu_iud" || method.id === "lng_iud" || method.id === "implants";
      if (preferenceFilter === "oral") return method.id === "coc_cic" || method.id === "chc" || method.id === "centchroman" || method.id === "pop";
      if (preferenceFilter === "no-daily-pill") return method.id !== "coc_cic" && method.id !== "chc" && method.id !== "pop";
      return true;
    });
  }, [evaluationResults, preferenceFilter]);

  const safeMethods = filteredResults.filter((r) => r.compositeScore <= 2);
  const cautionMethods = filteredResults.filter((r) => r.compositeScore === 3);
  const contraindicatedMethods = filteredResults.filter((r) => r.compositeScore === 4);

  return (
    <div className="space-y-6">
      {/* Step 1: Patient Conditions Selection */}
      <Card className="border border-border/70 shadow-sm bg-card/90">
        <CardHeader className="p-4 sm:p-5 border-b border-border/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-lg sm:text-xl font-bold flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-primary" />
                Select Patient Medical Conditions & Characteristics
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm mt-0.5">
                Select one or more conditions to compute composite eligibility across all contraceptive methods.
              </CardDescription>
            </div>
            {selectedConditionIds.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllConditions}
                className="text-xs self-start sm:self-auto text-destructive hover:bg-destructive/10"
              >
                Clear Selected ({selectedConditionIds.length})
              </Button>
            )}
          </div>

          {/* Search & Category Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-2 mt-3">
            <div className="relative w-full sm:flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search condition (e.g. smoking, hypertension, migraine, postpartum)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-8 text-sm h-9 bg-background"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="w-full sm:w-auto h-9 text-xs px-3 rounded-md border border-input bg-background font-medium"
            >
              <option value="all">All Categories ({allCategories.length})</option>
              {allCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Selected Conditions Pills */}
          {selectedConditionIds.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-border/40">
              <span className="text-xs font-semibold text-muted-foreground mr-1">Active Profiles:</span>
              {selectedConditionIds.map((id) => {
                const sec = dataset.sectors.find((s) => s.id === id);
                if (!sec) return null;
                return (
                  <Badge
                    key={id}
                    variant="secondary"
                    className="flex items-center gap-1 text-xs py-1 px-2.5 bg-primary/10 text-primary border border-primary/20"
                  >
                    <span>{sec.conditionName}</span>
                    <button
                      type="button"
                      onClick={() => toggleCondition(id)}
                      className="hover:text-destructive transition-colors ml-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                );
              })}
            </div>
          )}
        </CardHeader>

        <CardContent className="p-3 sm:p-4">
          {/* Scrollable Conditions Checklist Grid */}
          <div className="max-h-56 sm:max-h-64 overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {filteredConditions.map((sec) => {
              const isChecked = selectedConditionIds.includes(sec.id);
              return (
                <label
                  key={sec.id}
                  className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                    isChecked
                      ? "bg-primary/10 border-primary text-foreground font-semibold shadow-xs"
                      : "bg-background hover:bg-muted/50 border-border/60 text-muted-foreground"
                  }`}
                >
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={() => toggleCondition(sec.id)}
                    className="mt-0.5"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="block text-foreground truncate">{sec.conditionName}</span>
                    <span className="text-[10px] text-muted-foreground block truncate">
                      {sec.categoryName}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Step 2: Preference Filter Pills */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-card rounded-xl border border-border/60">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
          <Filter className="w-3.5 h-3.5 text-primary" />
          <span>Patient Preferences:</span>
        </div>
        <div className="flex flex-wrap items-center gap-1">
          {[
            { id: "all", label: "All Methods" },
            { id: "non-hormonal", label: "Non-Hormonal Only" },
            { id: "larc", label: "LARC (Implants / IUD)" },
            { id: "oral", label: "Oral Pills" },
            { id: "no-daily-pill", label: "No Daily Pill" }
          ].map((pill) => (
            <button
              key={pill.id}
              type="button"
              onClick={() => setPreferenceFilter(pill.id)}
              className={`text-xs px-2.5 py-1 rounded-full transition-colors ${
                preferenceFilter === pill.id
                  ? "bg-primary text-primary-foreground font-medium shadow-xs"
                  : "bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Step 3: Composite Clinical Recommendations Display */}
      {selectedConditionIds.length === 0 ? (
        <div className="p-8 text-center bg-card rounded-2xl border border-dashed border-border/80">
          <Sparkles className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
          <h4 className="text-base font-semibold text-foreground">No Medical Conditions Selected</h4>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-md mx-auto">
            Select one or more conditions from the panel above to instantly view clinically tailored eligibility recommendations.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Section 1: ELIGIBLE / RECOMMENDED (Category 1 & 2) */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <h3 className="text-base sm:text-lg font-bold text-foreground">
                Eligible & Safe to Use ({safeMethods.length} Methods)
              </h3>
              <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-xs">
                MEC Category 1 & 2
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              These methods can be safely initiated without restriction (advantages outweigh risks).
            </p>

            {safeMethods.length === 0 ? (
              <p className="text-xs text-muted-foreground italic p-3 bg-muted/20 rounded-lg">
                No methods in this filter qualify as Category 1 or 2 under the selected conditions.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {safeMethods.map(({ method, worstScoreRaw, reasons }) => (
                  <div
                    key={method.id}
                    className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => onMethodClick?.(method.id)}
                          className="font-bold text-sm sm:text-base text-foreground hover:text-primary transition-colors text-left"
                        >
                          {method.name}
                        </button>
                        <Badge className="bg-emerald-500 text-white font-mono text-xs font-bold">
                          Cat {worstScoreRaw}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground font-mono">
                        {method.shortName} &bull; Failure rate: {method.typicalFailureRate}
                      </span>
                      {method.indiaBrandNames && method.indiaBrandNames.length > 0 && (
                        <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                          India Brand: {method.indiaBrandNames[0]}
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                        {method.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-emerald-500/20 text-xs flex items-center justify-between">
                      <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                        &check; Clinically Approved for patient profile
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onMethodClick?.(method.id)}
                        className="h-7 text-xs text-primary px-2"
                      >
                        Clinical Details &rarr;
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: CAUTION / SECOND-LINE (Category 3) */}
          {cautionMethods.length > 0 && (
            <div className="space-y-2 pt-3 border-t border-border/50">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h3 className="text-base sm:text-lg font-bold text-foreground">
                  Exercise Clinical Caution ({cautionMethods.length} Methods)
                </h3>
                <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 text-xs">
                  MEC Category 3
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Theoretical or proven risks usually outweigh advantages. Only use if other more appropriate methods are unavailable or unacceptable.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {cautionMethods.map(({ method, worstScoreRaw, reasons }) => (
                  <div
                    key={method.id}
                    className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => onMethodClick?.(method.id)}
                          className="font-bold text-sm sm:text-base text-foreground hover:text-primary transition-colors text-left"
                        >
                          {method.name}
                        </button>
                        <Badge className="bg-amber-500 text-white font-mono text-xs font-bold">
                          Cat {worstScoreRaw}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground font-mono">{method.shortName}</span>

                      {/* Caution triggers */}
                      <div className="mt-2 space-y-1">
                        <span className="text-[11px] font-semibold text-amber-800 dark:text-amber-300 block">
                          Restricting Conditions:
                        </span>
                        {reasons
                          .filter((r) => parseScoreValue(r.score) === 3)
                          .map((r, i) => (
                            <div key={i} className="text-xs text-muted-foreground bg-amber-500/10 p-1.5 rounded">
                              <strong>{r.condition}:</strong> {r.clarification || "Category 3 risk."}
                            </div>
                          ))}
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-amber-500/20 text-xs flex items-center justify-between">
                      <span className="text-amber-700 dark:text-amber-400 font-medium">
                        Requires careful follow-up
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onMethodClick?.(method.id)}
                        className="h-7 text-xs text-primary px-2"
                      >
                        Guidance &rarr;
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 3: CONTRAINDICATED / METHOD NOT TO BE USED (Category 4) */}
          {contraindicatedMethods.length > 0 && (
            <div className="space-y-2 pt-3 border-t border-border/50">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-rose-500" />
                <h3 className="text-base sm:text-lg font-bold text-foreground">
                  Contraindicated - Do Not Use ({contraindicatedMethods.length} Methods)
                </h3>
                <Badge className="bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30 text-xs">
                  MEC Category 4
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Unacceptable health risk; the woman must NOT use this method.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {contraindicatedMethods.map(({ method, worstScoreRaw, reasons }) => (
                  <div
                    key={method.id}
                    className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/5 hover:bg-rose-500/10 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => onMethodClick?.(method.id)}
                          className="font-bold text-sm sm:text-base text-foreground hover:text-primary transition-colors text-left"
                        >
                          {method.name}
                        </button>
                        <Badge className="bg-rose-500 text-white font-mono text-xs font-bold">
                          Cat 4
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground font-mono">{method.shortName}</span>

                      {/* Contraindication triggers */}
                      <div className="mt-2 space-y-1">
                        <span className="text-[11px] font-semibold text-rose-800 dark:text-rose-300 block">
                          Direct Contraindications:
                        </span>
                        {reasons
                          .filter((r) => parseScoreValue(r.score) === 4)
                          .map((r, i) => (
                            <div key={i} className="text-xs text-rose-900 dark:text-rose-200 bg-rose-500/10 p-1.5 rounded">
                              <strong>{r.condition}:</strong> {r.clarification || "Category 4 absolute contraindication."}
                            </div>
                          ))}
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-rose-500/20 text-xs flex items-center justify-between">
                      <span className="text-rose-700 dark:text-rose-400 font-semibold">
                        &times; Method NOT to be prescribed
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onMethodClick?.(method.id)}
                        className="h-7 text-xs text-primary px-2"
                      >
                        Alternatives &rarr;
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
