import React from "react";
import Link from "next/link";
import { Stethoscope, Zap, Award, BookOpen, ChevronRight, ShieldAlert, ClipboardList } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ToolEntry } from "@/tools/registry";

interface ObstetricsCategoryDashboardProps {
  tools: ToolEntry[];
}

export function ObstetricsCategoryDashboard({ tools }: ObstetricsCategoryDashboardProps) {
  const getTool = (slug: string) => tools.find((t) => t.metadata.slug === slug);

  const gaCalc      = getTool("gestational-age-calculator");
  const pregCalc    = getTool("pregnancy-calculator");
  const revCalc     = getTool("edd-reverse-calculator");
  const timeline    = getTool("pregnancy-timeline");
  const bishop      = getTool("bishop-score");
  const preeclampsia = getTool("preeclampsia-risk");

  // Tier-2 items: compact row cards
  const tier2Items = [
    { tool: revCalc,      icon: <Zap className="w-4 h-4" />, color: "purple", sub: "Conception & FET scheduling." },
    { tool: timeline,     icon: <BookOpen className="w-4 h-4" />, color: "blue", sub: "Clinical scan schedule & vaccines." },
    { tool: bishop,       icon: <ClipboardList className="w-4 h-4" />, color: "indigo", sub: "Cervical ripening & induction readiness." },
    { tool: preeclampsia, icon: <ShieldAlert className="w-4 h-4" />, color: "red", sub: "ACOG PB-222 risk & aspirin guidance." },
  ] as const;

  const colorMap: Record<string, string> = {
    purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:border-purple-500 border-purple-500/30",
    blue:   "bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:border-blue-500 border-blue-500/30",
    indigo: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:border-indigo-500 border-indigo-500/30",
    red:    "bg-red-500/10 text-red-600 dark:text-red-400 hover:border-red-500 border-red-500/30",
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Header bar */}
      <div className="flex items-center justify-between bg-emerald-600 text-white px-4 py-2.5 rounded-xl">
        <div className="flex items-center gap-2">
          <Stethoscope className="w-5 h-5" />
          <span className="font-black text-sm sm:text-base tracking-tight">Obstetric Clinical Suite (OCS)</span>
        </div>
        <span className="bg-white/20 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full">
          ⚡ Ward-Round Ready
        </span>
      </div>

      {/* Tier 1 – two hero cards always visible */}
      <div className="grid sm:grid-cols-2 gap-3">
        {gaCalc && (
          <Link href={`/tools/obstetrics/${gaCalc.metadata.slug}`} className="group block h-full">
            <Card className="h-full border-2 border-emerald-500/50 hover:border-emerald-500 bg-gradient-to-br from-card to-emerald-500/5 p-4 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-bl-lg">#1 Essential</div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400">{gaCalc.metadata.name}</h3>
                  <p className="text-xs text-muted-foreground font-medium">Instant gestational-age math for ward-rounds.</p>
                </div>
              </div>
              <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold h-9 text-xs flex items-center justify-center gap-1">
                Open <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </Card>
          </Link>
        )}
        {pregCalc && (
          <Link href={`/tools/obstetrics/${pregCalc.metadata.slug}`} className="group block h-full">
            <Card className="h-full border-2 border-teal-500/50 hover:border-teal-500 bg-gradient-to-br from-card to-teal-500/5 p-4 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-teal-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-bl-lg">#2 Essential</div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="p-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-foreground group-hover:text-teal-600 dark:group-hover:text-teal-400">{pregCalc.metadata.name}</h3>
                  <p className="text-xs text-muted-foreground font-medium">EDD & IVF dating in one place.</p>
                </div>
              </div>
              <Button size="sm" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-extrabold h-9 text-xs flex items-center justify-center gap-1">
                Open <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </Card>
          </Link>
        )}
      </div>

      {/* Collapsed section: Tier-2 tools + pocket references */}
      <details className="border rounded-2xl overflow-hidden bg-card">
        <summary className="bg-muted/30 hover:bg-muted/50 px-4 py-3 flex items-center gap-2 cursor-pointer font-extrabold text-xs text-foreground select-none outline-none">
          <Award className="w-4 h-4 text-primary shrink-0" />
          <span>More Tools & Pocket References — Bishop Score, Preeclampsia, EDD Reverse, Timeline (tap)</span>
        </summary>

        <div className="p-4 space-y-4">
          {/* Tier-2 compact rows */}
          <div className="grid sm:grid-cols-2 gap-2">
            {tier2Items.map(({ tool, icon, color, sub }) =>
              tool ? (
                <Link key={tool.metadata.slug} href={`/tools/obstetrics/${tool.metadata.slug}`} className="group block">
                  <Card className={`border p-3 flex items-center justify-between bg-card ${colorMap[color]}`}>
                    <div className="flex items-center gap-2.5">
                      <div className={`p-1.5 rounded-lg ${colorMap[color].split(" ").filter(c => c.startsWith("bg-") || c.startsWith("text-")).join(" ")}`}>
                        {icon}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-foreground">{tool.metadata.name}</h4>
                        <p className="text-[11px] text-muted-foreground">{sub}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 ml-2" />
                  </Card>
                </Link>
              ) : null
            )}
          </div>

          {/* Pocket reference cards */}
          <div className="grid md:grid-cols-3 gap-3">
            <div className="bg-card p-3 rounded-xl border text-xs">
              <h4 className="font-extrabold text-primary uppercase text-[11px] mb-1">Trimesters</h4>
              <ul className="text-muted-foreground space-y-0.5">
                <li>• <strong className="text-foreground">1st:</strong> 0-13w6d</li>
                <li>• <strong className="text-foreground">2nd:</strong> 14-27w6d</li>
                <li>• <strong className="text-foreground">3rd:</strong> 28-40w0d</li>
              </ul>
            </div>
            <div className="bg-card p-3 rounded-xl border text-xs">
              <h4 className="font-extrabold text-emerald-600 uppercase text-[11px] mb-1">ACOG Redating Rules</h4>
              <ul className="text-muted-foreground space-y-0.5">
                <li>• <strong className="text-foreground">1st (≤13w6d):</strong> US &gt;7d → redate</li>
                <li>• <strong className="text-foreground">2nd (14-21w6d):</strong> US &gt;10-14d → redate</li>
                <li>• <strong className="text-foreground">IVF:</strong> Transfer date fixed</li>
              </ul>
            </div>
            <div className="bg-card p-3 rounded-xl border text-xs">
              <h4 className="font-extrabold text-purple-600 uppercase text-[11px] mb-1">Term Nomenclature</h4>
              <ul className="text-muted-foreground space-y-0.5">
                <li>• <strong className="text-foreground">Preterm:</strong> &lt;37w0d</li>
                <li>• <strong className="text-foreground">Early-Term:</strong> 37-38w6d</li>
                <li>• <strong className="text-foreground">Full-Term:</strong> 39-40w6d</li>
                <li>• <strong className="text-foreground">Post-Term:</strong> ≥42w0d</li>
              </ul>
            </div>
          </div>
        </div>
      </details>
    </div>
  );
}