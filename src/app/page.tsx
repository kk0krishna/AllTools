"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Search,
  Calculator,
  Code,
  Bot,
  Headphones,
  Stethoscope,
  HeartPulse,
  Wind,
  Brain,
  Activity,
  Baby,
  Eye,
  ArrowRight,
  Heart,
  Film,
  Sparkles,
  Compass,
  X,
  ExternalLink,
  Flame,
  ShieldCheck,
  Zap,
  Lock,
  CheckCircle2,
  Share2
} from "lucide-react";
import { toolsRegistry, ToolEntry } from "@/tools/registry";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Category configuration with harmonious icons and curated accents
const CATEGORIES = [
  {
    name: "Obstetrics",
    icon: Stethoscope,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    glow: "rgba(16, 185, 129, 0.15)",
    href: "/categories/obstetrics",
    examples: "WHO MEC Wheel, India MEC Wheel, Bishop Score",
  },
  {
    name: "Psychology",
    icon: Heart,
    color: "text-violet-500",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    glow: "rgba(139, 92, 246, 0.15)",
    href: "/categories/psychology",
    examples: "Emotion Compass, Feelings Wheel",
  },
  {
    name: "Pulmonology",
    icon: Wind,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    glow: "rgba(6, 182, 212, 0.15)",
    href: "/categories/pulmonology",
    examples: "ABG Analyzer, Acid-Base Matrix",
  },
  {
    name: "Calculators",
    icon: Calculator,
    color: "text-sky-500",
    bg: "bg-sky-500/10",
    border: "border-sky-500/20",
    glow: "rgba(56, 189, 248, 0.15)",
    href: "/categories/calculators",
    examples: "BMI Calculator, Age, Date Difference",
  },
  {
    name: "Cardiology",
    icon: HeartPulse,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    glow: "rgba(244, 63, 94, 0.15)",
    href: "/categories/cardiology",
    examples: "NYHA Heart Failure, Jones Criteria",
  },
  {
    name: "Developer",
    icon: Code,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    glow: "rgba(168, 85, 247, 0.15)",
    href: "/categories/developer",
    examples: "JSON Formatter, Favicon Generator",
  },
  {
    name: "Everyday",
    icon: Bot,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
    glow: "rgba(99, 102, 241, 0.15)",
    href: "/categories/everyday",
    examples: "Send to PC, QR Code, PDF Compressor",
  },
  {
    name: "Audio",
    icon: Headphones,
    color: "text-pink-500",
    bg: "bg-pink-500/10",
    border: "border-pink-500/20",
    glow: "rgba(236, 72, 153, 0.15)",
    href: "/categories/audio",
    examples: "Spectrum Analyzer, Lossless Spectrogram",
  },
  {
    name: "Neurology",
    icon: Brain,
    color: "text-fuchsia-500",
    bg: "bg-fuchsia-500/10",
    border: "border-fuchsia-500/20",
    glow: "rgba(217, 70, 239, 0.15)",
    href: "/categories/neurology",
    examples: "Glasgow Coma Scale",
  },
  {
    name: "Oncology",
    icon: Activity,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    glow: "rgba(245, 158, 11, 0.15)",
    href: "/categories/oncology",
    examples: "Gleason Score, Staging Matrices",
  },
  {
    name: "Pediatrics",
    icon: Baby,
    color: "text-teal-500",
    bg: "bg-teal-500/10",
    border: "border-teal-500/20",
    glow: "rgba(20, 184, 166, 0.15)",
    href: "/categories/pediatrics",
    examples: "Child Immunization Schedule",
  },
  {
    name: "Ophthalmology",
    icon: Eye,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    glow: "rgba(16, 185, 129, 0.15)",
    href: "/categories/ophthalmology",
    examples: "Ishihara Color Blindness Test",
  },
  {
    name: "Entertainment",
    icon: Film,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    glow: "rgba(249, 115, 22, 0.15)",
    href: "/categories/entertainment",
    examples: "Filmiyaar Redirect",
  },
];

const DEFAULT_TRENDING = [
  ...toolsRegistry.filter((t) => t.metadata.slug === "send-to-pc"),
  ...toolsRegistry.filter((t) => t.metadata.slug === "who-mec-wheel"),
  ...toolsRegistry.filter((t) => t.metadata.slug === "india-mec-wheel"),
  ...toolsRegistry.filter((t) => t.metadata.slug === "emotion-compass"),
  ...toolsRegistry.filter((t) => t.metadata.slug === "abg-analyzer"),
  ...toolsRegistry.filter((t) => t.metadata.slug === "bmi-calculator"),
];

function getToolBadge(slug: string, category: string): { label: string; badgeClass: string } {
  if (slug === "send-to-pc") {
    return {
      label: "Zero Cloud • Local P2P",
      badgeClass: "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    };
  }
  if (slug === "who-mec-wheel") {
    return {
      label: "WHO 5th Edition Standard",
      badgeClass: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    };
  }
  if (slug === "india-mec-wheel") {
    return {
      label: "MoHFW & WHO India Validated",
      badgeClass: "text-sky-600 dark:text-sky-400 bg-sky-500/10 border-sky-500/20",
    };
  }
  if (slug === "emotion-compass" || slug === "feelings-wheel") {
    return {
      label: "Psychology Validated",
      badgeClass: "text-violet-600 dark:text-violet-400 bg-violet-500/10 border-violet-500/20",
    };
  }
  if (slug === "abg-analyzer") {
    return {
      label: "Clinical Pulmonology",
      badgeClass: "text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    };
  }
  if (slug === "bmi-calculator") {
    return {
      label: "WHO & Asia-Pacific",
      badgeClass: "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20",
    };
  }
  if (category === "Obstetrics" || category === "Pulmonology" || category === "Cardiology") {
    return {
      label: "Clinical Standard",
      badgeClass: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    };
  }
  if (category === "Developer") {
    return {
      label: "100% In-Browser",
      badgeClass: "text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20",
    };
  }
  return {
    label: "Interactive Tool",
    badgeClass: "text-muted-foreground bg-muted/60 border-border/60",
  };
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [trendingTools, setTrendingTools] = useState<ToolEntry[]>(DEFAULT_TRENDING);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("all");

  const searchInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setMounted(true);

    // Fetch dynamic trending tools from Firestore
    const fetchTrending = async () => {
      try {
        const q = query(collection(db, "toolStats"), orderBy("views", "desc"), limit(8));
        const querySnapshot = await getDocs(q);

        const fetchedSlugs: string[] = [];
        querySnapshot.forEach((doc) => {
          fetchedSlugs.push(doc.id);
        });

        if (fetchedSlugs.length > 0) {
          const dynamicTools = fetchedSlugs
            .map((slug) => toolsRegistry.find((t) => t.metadata.slug === slug))
            .filter((t): t is ToolEntry => t !== undefined);

          const combined = [...DEFAULT_TRENDING];
          for (const t of dynamicTools) {
            if (combined.length >= 8) break;
            if (!combined.find((x) => x.metadata.slug === t.metadata.slug)) {
              combined.push(t);
            }
          }
          setTrendingTools(combined.slice(0, 8));
        }
      } catch (err) {
        console.warn("Failed to fetch trending tools", err);
      }
    };

    fetchTrending();
  }, []);

  // Keyboard shortcut Ctrl+K / Cmd+K handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredSearchResults =
    searchQuery.trim() === ""
      ? []
      : toolsRegistry
          .filter(
            (t) =>
              t.metadata.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              t.metadata.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
              t.metadata.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
              (t.metadata.keywords && t.metadata.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase())))
          )
          .slice(0, 8);

  const displayedTools =
    activeCategoryFilter === "all"
      ? trendingTools
      : toolsRegistry.filter(
          (t) => t.metadata.category.toLowerCase() === activeCategoryFilter.toLowerCase()
        );

  if (!mounted) return <div className="min-h-screen bg-background" />;

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground transition-colors duration-200">
      {/* ==============================================================
          HERO SECTION: REFINED LUXURY AMBIENCE & ULTRA-CRISP READABILITY
          ============================================================== */}
      <section className="relative w-full flex flex-col items-center justify-center overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24">
        {/* Soft Ambient Light Glows (Zero harsh washout) */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] sm:w-[900px] h-[400px] bg-gradient-to-b from-primary/10 via-sky-500/5 to-transparent blur-[120px] rounded-full" />
          <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-violet-500/5 blur-[100px] rounded-full" />
          <div className="absolute top-1/3 right-1/4 w-[350px] h-[350px] bg-emerald-500/5 blur-[100px] rounded-full" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center max-w-4xl">
          {/* Luminous Top Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary shadow-xs text-xs font-semibold mb-6 animate-in fade-in slide-in-from-top-3 duration-500">
            <Sparkles className="w-3.5 h-3.5" />
            <span>30+ Clinical &amp; Everyday Tools</span>
            <span className="opacity-40">•</span>
            <span>Zero Cloud Storage</span>
          </div>

          {/* Hero Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-4 font-heading leading-[1.1] animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span>Every Tool. </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 dark:from-sky-400 dark:via-blue-400 dark:to-indigo-300">
              Clinical Precision.
            </span>
          </h1>

          <p className="max-w-2xl text-sm sm:text-base md:text-lg text-muted-foreground font-medium mb-8 leading-relaxed animate-in fade-in duration-800 delay-150">
            Interactive medical wheels, clinical calculators, psychology instruments, developer utilities, and high-speed wireless file transfer. 100% client-side privacy.
          </p>

          {/* ==============================================================
              PROMINENT SEARCH & FILTER BAR
              ============================================================== */}
          <div className="w-full max-w-2xl relative animate-in fade-in zoom-in-95 duration-800 delay-200">
            {/* Search Input Container */}
            <div className="relative flex items-center bg-card/80 backdrop-blur-xl rounded-2xl border border-border/80 hover:border-primary/50 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/15 shadow-md transition-all p-1.5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 ml-1">
                <Search className="w-4.5 h-4.5" />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 250)}
                placeholder="Search 30+ tools, calculators, guides..."
                className="w-full pl-3 pr-10 py-2.5 text-sm sm:text-base bg-transparent border-0 outline-none text-foreground placeholder:text-muted-foreground font-medium"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors mr-1"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-[11px] font-mono font-medium text-muted-foreground bg-muted/60 rounded-lg mr-2 select-none border border-border/40">
                  Ctrl K
                </kbd>
              )}
            </div>

            {/* Instant Search Dropdown */}
            {isSearchFocused && searchQuery.trim() !== "" && (
              <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-card/95 backdrop-blur-2xl rounded-2xl border border-border/80 shadow-2xl z-50 flex flex-col gap-1 text-left animate-in fade-in slide-in-from-top-2">
                {filteredSearchResults.length > 0 ? (
                  filteredSearchResults.map((tool) => (
                    <Link
                      key={tool.metadata.slug}
                      href={`/tools/${tool.metadata.category}/${tool.metadata.slug}`}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-primary/10 transition-colors group"
                    >
                      <div className="flex flex-col overflow-hidden pr-2">
                        <span className="font-bold text-xs sm:text-sm text-foreground group-hover:text-primary transition-colors truncate">
                          {tool.metadata.name}
                        </span>
                        <span className="text-[11px] text-muted-foreground line-clamp-1">
                          {tool.metadata.description}
                        </span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary shrink-0" />
                    </Link>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-muted-foreground">
                    No tools found matching &ldquo;{searchQuery}&rdquo;
                  </div>
                )}
              </div>
            )}

            {/* Quick Launch Featured Tool Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
              <span className="text-xs font-semibold text-muted-foreground mr-1 hidden sm:inline flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-500 inline" /> Popular:
              </span>

              <Link
                href="/tools/everyday/send-to-pc"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-card hover:bg-card/90 border border-border/70 hover:border-primary/50 text-foreground text-xs font-semibold transition-all shadow-xs hover:scale-105"
              >
                <Share2 className="w-3.5 h-3.5 text-indigo-500" />
                Send to PC
              </Link>

              <Link
                href="/tools/obstetrics/who-mec-wheel"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-card hover:bg-card/90 border border-border/70 hover:border-primary/50 text-foreground text-xs font-semibold transition-all shadow-xs hover:scale-105"
              >
                <Compass className="w-3.5 h-3.5 text-emerald-500" />
                WHO MEC Wheel
              </Link>

              <Link
                href="/tools/psychology/emotion-compass"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-card hover:bg-card/90 border border-border/70 hover:border-primary/50 text-foreground text-xs font-semibold transition-all shadow-xs hover:scale-105"
              >
                <Heart className="w-3.5 h-3.5 text-violet-500" />
                Emotion Compass
              </Link>

              <Link
                href="/tools/pulmonology/abg-analyzer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-card hover:bg-card/90 border border-border/70 hover:border-primary/50 text-foreground text-xs font-semibold transition-all shadow-xs hover:scale-105"
              >
                <Wind className="w-3.5 h-3.5 text-cyan-500" />
                ABG Analyzer
              </Link>

              <Link
                href="/tools/calculators/bmi-calculator"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-card hover:bg-card/90 border border-border/70 hover:border-primary/50 text-foreground text-xs font-semibold transition-all shadow-xs hover:scale-105"
              >
                <Calculator className="w-3.5 h-3.5 text-sky-500" />
                BMI Calculator
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==============================================================
          VALUE PILLARS: TRUST, PRIVACY & PERFORMANCE
          ============================================================== */}
      <section className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-card/60 backdrop-blur-xl border border-border/60 flex items-start gap-3.5 shadow-xs">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-xs sm:text-sm text-foreground">Zero Cloud Storage</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                All data, files, and notes process directly in your browser memory. Nothing touches a database.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-card/60 backdrop-blur-xl border border-border/60 flex items-start gap-3.5 shadow-xs">
            <div className="h-10 w-10 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-xs sm:text-sm text-foreground">Zero Internet on Wi-Fi</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                Send to PC transfers over your local network switch with 0 MB data charges at gigabit throughput.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-card/60 backdrop-blur-xl border border-border/60 flex items-start gap-3.5 shadow-xs">
            <div className="h-10 w-10 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-xs sm:text-sm text-foreground">Clinically Validated</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                Built strictly to WHO 5th Edition, MoHFW India, and APA Psychological guidelines.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-card/60 backdrop-blur-xl border border-border/60 flex items-start gap-3.5 shadow-xs">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-xs sm:text-sm text-foreground">No Account Required</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                Zero paywalls, zero ads, and zero signups. Instant utility whenever you need it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==============================================================
          FEATURED TOOLS SECTION WITH CATEGORY FILTER TABS
          ============================================================== */}
      <section className="container mx-auto px-4 py-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-primary" />
              <h2 className="text-xl sm:text-2xl font-bold font-heading tracking-tight text-foreground">
                Featured Tools &amp; Utilities
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Interactive clinical wheels, psychology matrices, and daily productivity suites
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-card/60 border border-border/60 backdrop-blur-md">
            {[
              { id: "all", label: "Featured" },
              { id: "obstetrics", label: "Obstetrics" },
              { id: "psychology", label: "Psychology" },
              { id: "pulmonology", label: "Pulmonology" },
              { id: "calculators", label: "Calculators" },
              { id: "everyday", label: "Everyday" },
              { id: "developer", label: "Developer" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategoryFilter(tab.id)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                  activeCategoryFilter === tab.id
                    ? "bg-primary text-primary-foreground shadow-xs font-bold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tools Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {displayedTools.map((tool) => {
            const badge = getToolBadge(tool.metadata.slug, tool.metadata.category);
            return (
              <Link
                key={tool.metadata.slug}
                href={`/tools/${tool.metadata.category}/${tool.metadata.slug}`}
                className="group block outline-none"
              >
                <div className="h-full p-5 rounded-3xl bg-card/60 hover:bg-card border border-border/70 hover:border-primary/50 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                        {tool.metadata.category}
                      </span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground/60 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                    </div>

                    <h3 className="text-base font-bold font-heading text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {tool.metadata.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
                      {tool.metadata.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-border/40 text-[11px] font-semibold">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${badge.badgeClass}`}>
                      {badge.label}
                    </span>
                    <span className="text-primary font-bold group-hover:underline flex items-center gap-1">
                      Launch <ArrowRight className="w-3 h-3 inline" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ==============================================================
          TOOLKIT CATEGORIES (13 SPECIALTIES)
          ============================================================== */}
      <section className="container mx-auto px-4 py-12 border-t border-border/60">
        <div className="mb-8">
          <h2 id="categories" className="text-xl sm:text-2xl font-bold font-heading tracking-tight text-foreground">
            Explore by Category
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Curated medical specialties, developer utilities, and productivity instruments
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {CATEGORIES.map((category) => (
            <Link key={category.name} href={category.href} className="group block outline-none">
              <div className="h-full p-4 rounded-2xl bg-card/50 hover:bg-card border border-border/60 hover:border-primary/40 shadow-xs hover:shadow-sm transition-all duration-200 flex items-start gap-3.5">
                <div
                  className={`shrink-0 w-10 h-10 rounded-xl ${category.bg} border ${category.border} flex items-center justify-center group-hover:scale-105 transition-transform`}
                >
                  <category.icon className={`h-5 w-5 ${category.color}`} />
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs sm:text-sm font-bold font-heading text-foreground group-hover:text-primary transition-colors truncate">
                      {category.name}
                    </h3>
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1 line-clamp-1">
                    {category.examples}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ==============================================================
          SEO SECTION FOR GOOGLE INDEXING & ACCESSIBILITY
          ============================================================== */}
      <section className="container mx-auto px-4 py-12 mb-8 border-t border-border/60">
        <div className="max-w-4xl mx-auto space-y-4 text-xs sm:text-sm text-muted-foreground leading-relaxed">
          <h2 className="text-lg sm:text-xl font-bold font-heading text-foreground">
            About Clinikkit: Professional Medical Calculators &amp; Browser Utilities
          </h2>
          <p>
            Clinikkit is a comprehensive, privacy-first platform offering free online tools designed specifically for healthcare professionals, clinical trainees, developers, and everyday users. Our mission is to provide lightning-fast, secure, and accurate web utilities directly in your browser.
          </p>
          <p>
            Our platform features an extensive library of specialized utilities. For healthcare practitioners, we offer clinical-grade calculators including the <strong>WHO MEC Wheel</strong>, <strong>India Adapted MEC Wheel</strong>, <strong>ABG Analyzer</strong>, <strong>BMI Calculator</strong>, <strong>Child Immunization Schedule</strong>, comprehensive <strong>Obstetrics Tools</strong>, and the <strong>Ishihara Color Blindness Test</strong>. For daily productivity and file sharing, <strong>Send to PC</strong> provides high-speed wireless peer-to-peer file transfer without data charges on local Wi-Fi.
          </p>
          <p>
            Built with modern web technologies, Clinikkit ensures that your data remains secure while delivering a seamless, premium user experience across all devices—all without requiring software installation or account creation.
          </p>
        </div>
      </section>
    </div>
  );
}
