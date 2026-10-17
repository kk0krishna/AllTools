"use client";

import React, { useState } from "react";
import { MecDataset } from "./types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./Tabs";
import { CheckCircle2, AlertCircle, Clock, ShieldCheck, Pill, Syringe, HeartHandshake, Baby, Sparkles, Download, FileText } from "lucide-react";

interface AdditionalInfoViewProps {
  dataset: MecDataset;
}

export function AdditionalInfoView({ dataset }: AdditionalInfoViewProps) {
  // LAM interactive state
  const [lamCriteria, setLamCriteria] = useState({
    amenorrheic: false,
    exclusiveBreastfeeding: false,
    under6Months: false
  });

  const isLamEffective =
    lamCriteria.amenorrheic && lamCriteria.exclusiveBreastfeeding && lamCriteria.under6Months;

  return (
    <div className="space-y-4">
      {/* Official Guidelines & Reference Document Download Banner */}
      <div className="p-4 rounded-2xl border border-primary/20 bg-primary/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
            <ShieldCheck className="w-4 h-4" />
            <span>Official Authoritative Source Guidelines</span>
          </div>
          <h4 className="text-sm font-bold text-foreground">
            {dataset.wheelId === "india-mec-2022"
              ? "MoHFW & WHO India Medical Eligibility Criteria Reference Manual"
              : "WHO Medical Eligibility Criteria for Contraceptive Use (5th Edition)"}
          </h4>
          <p className="text-xs text-muted-foreground">
            {dataset.wheelId === "india-mec-2022"
              ? "Comprehensive clinical manual including Centchroman (Chhaya), Antara (DMPA), PPIUCD protocols, and sterilization guidelines."
              : "Complete evidence-based global standards published by the World Health Organization Department of Reproductive Health and Research."}
          </p>
        </div>
        <a
          href={dataset.wheelId === "india-mec-2022" ? "/docs/india-adapted-mec-reference-guide.pdf" : "/docs/who-mec-wheel-5th-edition.pdf"}
          download={dataset.wheelId === "india-mec-2022" ? "India-Adapted-WHO-MEC-Reference-Guide.pdf" : "WHO-MEC-Wheel-5th-Edition-Official.pdf"}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shrink-0 shadow-sm"
        >
          <Download className="w-4 h-4" />
          <span>Download Reference PDF</span>
        </a>
      </div>
      <Tabs defaultValue="emergency" className="w-full">
        <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full h-auto p-1 bg-muted/60">
          <TabsTrigger value="emergency" className="text-xs py-2">
            Emergency Contraception
          </TabsTrigger>
          <TabsTrigger value="safe-list" className="text-xs py-2">
            All-Methods Safe List
          </TabsTrigger>
          {dataset.sterilizationGuidelines && (
            <TabsTrigger value="sterilization" className="text-xs py-2">
              Sterilization (A/C/D/S)
            </TabsTrigger>
          )}
          {dataset.antiretroviralInteractions && (
            <TabsTrigger value="arv" className="text-xs py-2">
              HIV & ARV Matrix
            </TabsTrigger>
          )}
          <TabsTrigger value="lam" className="text-xs py-2">
            LAM Criteria
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: EMERGENCY CONTRACEPTION */}
        <TabsContent value="emergency" className="mt-4 space-y-4">
          <Card className="border border-border/70 shadow-sm bg-card">
            <CardHeader className="p-4 sm:p-5 border-b border-border/50">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg font-bold">
                  Emergency Contraception (EC) Clinical Matrix
                </CardTitle>
              </div>
              <CardDescription className="text-xs sm:text-sm">
                Recommendations for post-coital emergency prevention of unintended pregnancy within 5 days of unprotected intercourse.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-4 sm:p-5 space-y-4">
              {/* Highlight callout on Cu-IUD */}
              <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 space-y-1.5">
                <span className="font-bold text-sm text-primary flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Copper IUD / IUCD: The Gold Standard in Emergency Contraception
                </span>
                <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                  The copper IUD can be inserted within <strong>5 days (120 hours)</strong> of unprotected intercourse and provides <strong>&gt;99% efficacy</strong> (failure rate &lt; 0.1%). It also provides continuous reversible contraception for up to <strong>10–12 years</strong> thereafter.
                </p>
              </div>

              {/* EC Table */}
              {dataset.emergencyContraception && (
                <div className="overflow-x-auto border border-border/60 rounded-xl">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-muted/50 uppercase font-mono text-[11px] text-muted-foreground border-b border-border/60">
                      <tr>
                        <th className="p-3">Condition / Characteristic</th>
                        <th className="p-3 text-center">Cu-IUD</th>
                        {dataset.emergencyContraception.conditions[0]?.coc && (
                          <th className="p-3 text-center">COC (Yuzpe)</th>
                        )}
                        <th className="p-3 text-center">LNG (1.5 mg)</th>
                        {dataset.emergencyContraception.conditions[0]?.upa && (
                          <th className="p-3 text-center">UPA (30 mg)</th>
                        )}
                        <th className="p-3">Clinical Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {dataset.emergencyContraception.conditions.map((item, idx) => (
                        <tr key={idx} className="hover:bg-muted/20 transition-colors">
                          <td className="p-3 font-semibold text-foreground">{item.condition}</td>
                          <td className="p-3 text-center font-mono font-bold text-primary">
                            <span className="px-2 py-0.5 rounded bg-primary/15">{item.cuIud}</span>
                          </td>
                          {item.coc && (
                            <td className="p-3 text-center font-mono font-semibold">
                              <span className="px-2 py-0.5 rounded bg-muted">{item.coc}</span>
                            </td>
                          )}
                          <td className="p-3 text-center font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            <span className="px-2 py-0.5 rounded bg-emerald-500/15">{item.lng}</span>
                          </td>
                          {item.upa && (
                            <td className="p-3 text-center font-mono font-bold text-blue-600 dark:text-blue-400">
                              <span className="px-2 py-0.5 rounded bg-blue-500/15">{item.upa}</span>
                            </td>
                          )}
                          <td className="p-3 text-muted-foreground text-[11px]">
                            {item.notes || "&mdash;"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Guidelines Notes */}
              {dataset.emergencyContraception?.guidanceNotes && (
                <div className="space-y-1.5 pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Clinical Protocols & Timing Windows:
                  </span>
                  <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
                    {dataset.emergencyContraception.guidanceNotes.map((g, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {g}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: SAFE LIST FOR ALL METHODS */}
        <TabsContent value="safe-list" className="mt-4 space-y-4">
          <Card className="border border-border/70 shadow-sm bg-card">
            <CardHeader className="p-4 sm:p-5 border-b border-border/50">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <CardTitle className="text-lg font-bold">
                  Conditions That Are Category 1 & 2 For ALL Methods
                </CardTitle>
              </div>
              <CardDescription className="text-xs sm:text-sm">
                There are many common medical and physiological conditions where ANY contraceptive method can be safely prescribed.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-4 sm:p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-card border border-border/70 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary block">
                    Reproductive Conditions
                  </span>
                  <ul className="text-xs text-muted-foreground space-y-1.5 list-disc pl-4">
                    {dataset.safeConditions.reproductive.map((cond, i) => (
                      <li key={i} className="leading-relaxed">
                        {cond}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-card border border-border/70 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary block">
                    Medical Conditions
                  </span>
                  <ul className="text-xs text-muted-foreground space-y-1.5 list-disc pl-4">
                    {dataset.safeConditions.medical.map((cond, i) => (
                      <li key={i} className="leading-relaxed">
                        {cond}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-card border border-border/70 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary block">
                    Other Characteristics
                  </span>
                  <ul className="text-xs text-muted-foreground space-y-1.5 list-disc pl-4">
                    {dataset.safeConditions.other.map((cond, i) => (
                      <li key={i} className="leading-relaxed">
                        {cond}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: STERILIZATION GUIDELINES (INDIA & WHO) */}
        {dataset.sterilizationGuidelines && (
          <TabsContent value="sterilization" className="mt-4 space-y-4">
            <Card className="border border-border/70 shadow-sm bg-card">
              <CardHeader className="p-4 sm:p-5 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <HeartHandshake className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg font-bold">
                    Sterilization Eligibility Criteria: A, C, D, S Classification
                  </CardTitle>
                </div>
                <CardDescription className="text-xs sm:text-sm">
                  National standards for voluntary surgical contraception (Female Tubectomy & Male Non-Scalpel Vasectomy).
                </CardDescription>
              </CardHeader>

              <CardContent className="p-4 sm:p-5 space-y-6">
                {/* Female Sterilization */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    Female Sterilization (Minilaparotomy / Laparoscopic Tubal Ligation)
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {dataset.sterilizationGuidelines.female.map((item) => {
                      const colors = {
                        A: "border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400",
                        C: "border-blue-500/30 bg-blue-500/5 text-blue-700 dark:text-blue-400",
                        D: "border-amber-500/30 bg-amber-500/5 text-amber-700 dark:text-amber-400",
                        S: "border-purple-500/30 bg-purple-500/5 text-purple-700 dark:text-purple-400"
                      }[item.category];

                      return (
                        <div key={item.category} className={`p-3.5 rounded-xl border ${colors} space-y-2`}>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 font-mono font-bold rounded bg-background text-sm">
                              Category {item.category}
                            </span>
                            <span className="text-xs font-semibold">{item.meaning.split(":")[0]}</span>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {item.meaning}
                          </p>
                          <ul className="text-xs text-foreground space-y-1 list-disc pl-4 pt-1">
                            {item.conditions.map((c, i) => (
                              <li key={i}>{c}</li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Male Sterilization */}
                <div className="space-y-3 pt-4 border-t border-border/50">
                  <h4 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    Male Sterilization (Non-Scalpel Vasectomy - NSV)
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {dataset.sterilizationGuidelines.male.map((item) => {
                      const colors = {
                        A: "border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400",
                        C: "border-blue-500/30 bg-blue-500/5 text-blue-700 dark:text-blue-400",
                        D: "border-amber-500/30 bg-amber-500/5 text-amber-700 dark:text-amber-400",
                        S: "border-purple-500/30 bg-purple-500/5 text-purple-700 dark:text-purple-400"
                      }[item.category];

                      return (
                        <div key={item.category} className={`p-3.5 rounded-xl border ${colors} space-y-2`}>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 font-mono font-bold rounded bg-background text-sm">
                              Category {item.category}
                            </span>
                            <span className="text-xs font-semibold">{item.meaning.split(":")[0]}</span>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {item.meaning}
                          </p>
                          <ul className="text-xs text-foreground space-y-1 list-disc pl-4 pt-1">
                            {item.conditions.map((c, i) => (
                              <li key={i}>{c}</li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-3 bg-muted/40 rounded-xl text-xs text-muted-foreground space-y-1">
                    <strong>Critical Vasectomy Follow-up Rule:</strong> Vasectomy is not immediately effective. Sperm remain stored in the ampulla. The client must use alternative contraceptive protection (e.g. condoms) for <strong>3 months</strong> or until semen analysis confirms azoospermia (zero sperm).
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* TAB 4: ARV MATRIX */}
        {dataset.antiretroviralInteractions && (
          <TabsContent value="arv" className="mt-4 space-y-4">
            <Card className="border border-border/70 shadow-sm bg-card">
              <CardHeader className="p-4 sm:p-5 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <Pill className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg font-bold">
                    Antiretroviral (ARV) Medications & Contraceptive Interactions
                  </CardTitle>
                </div>
                <CardDescription className="text-xs sm:text-sm">
                  Interaction matrix between antiretroviral drug classes and hormonal / non-hormonal contraceptive methods.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-4 sm:p-5 space-y-4">
                <div className="overflow-x-auto border border-border/60 rounded-xl">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-muted/50 uppercase font-mono text-[11px] text-muted-foreground border-b border-border/60">
                      <tr>
                        <th className="p-3">Drug Class & Abbreviations</th>
                        <th className="p-3 text-center">CHC</th>
                        <th className="p-3 text-center">POP</th>
                        <th className="p-3 text-center">DMPA</th>
                        <th className="p-3 text-center">Implants</th>
                        <th className="p-3 text-center">LNG-IUD</th>
                        <th className="p-3 text-center">Cu-IUD</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {dataset.antiretroviralInteractions.map((arv, idx) => (
                        <tr key={idx} className="hover:bg-muted/20 transition-colors">
                          <td className="p-3">
                            <span className="font-bold text-foreground block">{arv.drugClass}</span>
                            <span className="text-[11px] text-primary font-mono block">{arv.abbreviation}</span>
                            <span className="text-[11px] text-muted-foreground">{arv.drugs.join(", ")}</span>
                          </td>
                          <td className="p-3 text-center font-mono font-bold">{arv.chcScore}</td>
                          <td className="p-3 text-center font-mono font-bold">{arv.popScore}</td>
                          <td className="p-3 text-center font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            {arv.dmpaScore}
                          </td>
                          <td className="p-3 text-center font-mono font-bold">{arv.implantsScore}</td>
                          <td className="p-3 text-center font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            {arv.lngIudScore}
                          </td>
                          <td className="p-3 text-center font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            {arv.cuIudScore}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* TAB 5: LAM CRITERIA */}
        <TabsContent value="lam" className="mt-4 space-y-4">
          <Card className="border border-border/70 shadow-sm bg-card">
            <CardHeader className="p-4 sm:p-5 border-b border-border/50">
              <div className="flex items-center gap-2">
                <Baby className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg font-bold">
                  Lactational Amenorrhea Method (LAM) Interactive Validator
                </CardTitle>
              </div>
              <CardDescription className="text-xs sm:text-sm">
                A highly effective temporary family planning method based on the physiological effect of breastfeeding on ovarian ovulation.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-4 sm:p-5 space-y-5">
              <div className="p-4 rounded-xl bg-muted/30 border border-border/60 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-foreground block">
                  ALL THREE of the following criteria MUST be met:
                </span>

                <div className="space-y-2.5">
                  <label className="flex items-center gap-3 p-3 rounded-lg border border-border/60 bg-background cursor-pointer hover:bg-muted/40 transition-colors">
                    <input
                      type="checkbox"
                      checked={lamCriteria.amenorrheic}
                      onChange={(e) =>
                        setLamCriteria((p) => ({ ...p, amenorrheic: e.target.checked }))
                      }
                      className="w-4 h-4 rounded text-primary"
                    />
                    <div className="text-xs sm:text-sm">
                      <strong className="text-foreground">1. Amenorrhoeic:</strong>{" "}
                      <span className="text-muted-foreground">
                        Mother has had no monthly menstrual bleeding since 56 days (8 weeks) postpartum.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-lg border border-border/60 bg-background cursor-pointer hover:bg-muted/40 transition-colors">
                    <input
                      type="checkbox"
                      checked={lamCriteria.exclusiveBreastfeeding}
                      onChange={(e) =>
                        setLamCriteria((p) => ({
                          ...p,
                          exclusiveBreastfeeding: e.target.checked
                        }))
                      }
                      className="w-4 h-4 rounded text-primary"
                    />
                    <div className="text-xs sm:text-sm">
                      <strong className="text-foreground">2. Fully or Nearly Fully Breastfeeding:</strong>{" "}
                      <span className="text-muted-foreground">
                        Breastfeeding exclusively day and night on demand (at least 8-10 times in 24 hours, including night feeds). No other foods or fluids given.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-lg border border-border/60 bg-background cursor-pointer hover:bg-muted/40 transition-colors">
                    <input
                      type="checkbox"
                      checked={lamCriteria.under6Months}
                      onChange={(e) =>
                        setLamCriteria((p) => ({ ...p, under6Months: e.target.checked }))
                      }
                      className="w-4 h-4 rounded text-primary"
                    />
                    <div className="text-xs sm:text-sm">
                      <strong className="text-foreground">3. Infant Under 6 Months:</strong>{" "}
                      <span className="text-muted-foreground">The baby is less than 6 months of age.</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Validation Result Box */}
              <div
                className={`p-4 rounded-xl border flex items-start gap-3 transition-colors ${
                  isLamEffective
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300"
                    : "bg-amber-500/10 border-amber-500/30 text-amber-800 dark:text-amber-300"
                }`}
              >
                {isLamEffective ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1 text-xs sm:text-sm">
                  <strong>
                    {isLamEffective
                      ? "LAM is Active & 98% Effective"
                      : "LAM Protection is Not Guaranteed"}
                  </strong>
                  <p className="leading-relaxed">
                    {isLamEffective
                      ? "The mother is fully protected against pregnancy (>98% efficacy). As soon as any of these three conditions changes (menses return, complementary feeding starts, or baby reaches 6 months), she must immediately start an additional contraceptive method."
                      : "Because one or more criteria are not met, the risk of ovulation and unintended pregnancy is increased. An effective ongoing contraceptive method (such as Centchroman, POPs, DMPA, Cu-IUCD, or Implants) should be initiated."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
