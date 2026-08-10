"use client";

import Image from "next/image";

import { Search, Calculator, Code, Bot, Headphones, Stethoscope, HeartPulse, Wind, Brain, Activity, Baby, Eye, ArrowRight, Sparkles, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toolsRegistry } from "@/tools/registry";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const CATEGORIES = [
  { name: "Calculators", icon: Calculator, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20", href: "/categories/calculators", examples: "BMI, Age, Date Diff" },
  { name: "Developer", icon: Code, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20", href: "/categories/developer", examples: "JSON Formatter, Base64" },
  { name: "Everyday", icon: Bot, color: "text-indigo-500", bg: "bg-indigo-500/10", border: "border-indigo-500/20", href: "/categories/everyday", examples: "QR Generator, Timers" },
  { name: "Audio", icon: Headphones, color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20", href: "/categories/audio", examples: "Spectrum Analyzer" },
  { name: "Obstetrics", icon: Stethoscope, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20", href: "/categories/obstetrics", examples: "EDD, Bishop Score" },
  { name: "Cardiology", icon: HeartPulse, color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20", href: "/categories/cardiology", examples: "ASCVD Risk, MAP" },
  { name: "Pulmonology", icon: Wind, color: "text-cyan-500", bg: "bg-cyan-500/10", border: "border-cyan-500/20", href: "/categories/pulmonology", examples: "ABG Analyzer" },
  { name: "Neurology", icon: Brain, color: "text-pink-500", bg: "bg-pink-500/10", border: "border-pink-500/20", href: "/categories/neurology", examples: "Glasgow Coma Scale" },
  { name: "Oncology", icon: Activity, color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20", href: "/categories/oncology", examples: "BSA, TNM Staging" },
  { name: "Pediatrics", icon: Baby, color: "text-teal-500", bg: "bg-teal-500/10", border: "border-teal-500/20", href: "/categories/pediatrics", examples: "Immunization Sched" },
  { name: "Ophthalmology", icon: Eye, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20", href: "/categories/ophthalmology", examples: "Ishihara Color Test" },
];

import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { siteConfig } from "@/config/site";

const DEFAULT_TRENDING = [
  ...toolsRegistry.filter((t) => t.metadata.category === "obstetrics").slice(0, 2),
  ...toolsRegistry.filter((t) => t.metadata.category !== "obstetrics").slice(0, 3), // Keep 5 tools + 1 request card = 6 items
];

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [trendingTools, setTrendingTools] = useState<typeof DEFAULT_TRENDING>(DEFAULT_TRENDING);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const filteredTools = searchQuery.trim() === "" ? [] : toolsRegistry.filter(t =>
    t.metadata.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.metadata.description.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);

    // Fetch dynamic trending tools from Firestore
    const fetchTrending = async () => {
      try {
        const q = query(collection(db, "toolStats"), orderBy("views", "desc"), limit(5));
        const querySnapshot = await getDocs(q);

        const fetchedSlugs: string[] = [];
        querySnapshot.forEach((doc) => {
          fetchedSlugs.push(doc.id);
        });

        if (fetchedSlugs.length > 0) {
          // Map slugs to toolsRegistry
          const dynamicTrending = fetchedSlugs
            .map(slug => toolsRegistry.find(t => t.metadata.slug === slug))
            .filter((t): t is NonNullable<typeof t> => t !== undefined);

          // If we got some tools, update state. Append from default to fill 5 spots if needed.
          if (dynamicTrending.length > 0) {
            const combined = [...dynamicTrending];
            for (const t of DEFAULT_TRENDING) {
              if (combined.length >= 5) break;
              if (!combined.find(x => x.metadata.slug === t.metadata.slug)) {
                combined.push(t);
              }
            }
            setTrendingTools(combined.slice(0, 5));
          }
        }
      } catch (err) {
        console.warn("Failed to fetch trending tools", err);
      }
    };

    fetchTrending();
  }, []);

  if (!mounted) return <div className="min-h-screen" />;

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Ultra-Minimalist Hero */}
      <section className="relative w-full min-h-[75vh] flex flex-col items-center justify-center overflow-hidden">
        {/* Animated Macro Fiber Background */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{
              scale: [1.1, 1.25, 1.1],
              rotate: [0, 4, -4, 0],
              x: ["0%", "3%", "-3%", "0%"],
              y: ["0%", "-3%", "3%", "0%"]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 opacity-90"
          >
            <Image
              src={siteConfig.assets.heroBg}
              alt="Clinikkit Fiber Art Background"
              fill
              priority
              className="object-cover"
            />
          </motion.div>
          {/* Subtle gradient overlay to fade smoothly into the content below, leaving the top fully visible */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        </div>

        <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center">

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-8 font-heading animate-in fade-in slide-in-from-bottom-6 duration-1000 leading-none flex justify-center items-center">
            <span className="text-foreground">
              {siteConfig.hero.titlePrefix.slice(0, -1)}
              <span className="underline decoration-primary decoration-4 underline-offset-8">{siteConfig.hero.titlePrefix.slice(-1)}</span>
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent font-mono ml-[2px]">
              <span className="underline decoration-primary decoration-4 underline-offset-8">{siteConfig.hero.titleHighlight.slice(0, 1)}</span>
              {siteConfig.hero.titleHighlight.slice(1)}
            </span>
          </h1>

          <div className="w-full max-w-3xl relative mt-4 animate-in fade-in zoom-in-95 duration-1000 delay-300">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-accent/30 blur-2xl rounded-full opacity-50" />
            <div className="relative flex items-center bg-background/90 backdrop-blur-2xl rounded-full border border-primary/20 shadow-2xl overflow-hidden focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10 transition-all group z-20">
              <Search className="absolute left-6 text-muted-foreground h-6 w-6 group-focus-within:text-primary transition-colors" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                placeholder="Search all tools..."
                className="w-full pl-16 pr-6 h-16 md:h-20 text-lg md:text-2xl bg-transparent border-0 focus-visible:ring-0 shadow-none rounded-full placeholder:text-muted-foreground/50"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 h-10 w-10 md:h-12 md:w-12 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="w-5 h-5 opacity-50" />
                </Button>
              )}
            </div>

            {/* Search Results Dropdown */}
            {isSearchFocused && searchQuery.trim() !== "" && (
              <div className="absolute top-full left-0 right-0 mt-4 bg-background/95 backdrop-blur-xl border border-primary/10 shadow-2xl rounded-2xl overflow-hidden z-50 flex flex-col text-left animate-in fade-in slide-in-from-top-4 duration-200">
                {filteredTools.length > 0 ? (
                  <div className="py-2">
                    <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-muted/30">
                      Search Results
                    </div>
                    {filteredTools.map((tool) => (
                      <Link
                        key={tool.metadata.slug}
                        href={`/tools/${tool.metadata.category}/${tool.metadata.slug}`}
                        className="flex items-start gap-4 p-4 hover:bg-muted/50 transition-colors border-b last:border-0 border-border/50"
                      >
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                          <Search className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">{tool.metadata.name}</div>
                          <div className="text-sm text-muted-foreground line-clamp-1">{tool.metadata.description}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>No tools found for &quot;{searchQuery}&quot;</p>
                    <p className="text-sm mt-1">Try searching for a category like &quot;Calculators&quot; or &quot;Developer&quot;</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Categories Showcase with Examples */}
      <section className="relative z-10 container mx-auto px-4 py-20 border-t bg-muted/5 backdrop-blur-3xl">
        <div className="mb-12">
          <h2 id="categories" className="text-2xl md:text-3xl font-bold font-heading tracking-tight">Toolkit Categories</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((category) => (
            <Link key={category.name} href={category.href} className="group outline-none block">
              <Card className={`h-full bg-card/50 backdrop-blur-md border ${category.border} hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 overflow-hidden relative`}>
                <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full ${category.bg} opacity-50 blur-xl group-hover:scale-150 transition-transform duration-700`} />
                <CardContent className="p-5 flex items-start gap-4 h-full relative z-10">
                  <div className={`shrink-0 w-12 h-12 rounded-xl ${category.bg} flex items-center justify-center shadow-sm`}>
                    <category.icon className={`h-6 w-6 ${category.color}`} />
                  </div>
                  <div className="flex flex-col flex-1">
                    <h3 className="text-lg font-bold font-heading group-hover:text-primary transition-colors">{category.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      e.g., {category.examples}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Tools Minimal */}
      <section className="relative z-10 container mx-auto px-4 py-20 mb-12">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl md:text-3xl font-bold font-heading tracking-tight">Trending Now</h2>
          <Link href="/categories/calculators" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
            See All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trendingTools.map((tool) => (
            <Link key={tool.metadata.name} href={`/tools/${tool.metadata.category}/${tool.metadata.slug}`} className="group outline-none">
              <Card className="bg-card/40 backdrop-blur-sm hover:bg-card hover:border-primary/40 transition-all duration-300 h-full flex flex-col hover:shadow-xl hover:-translate-y-1 border border-border/50">
                <CardHeader className="p-5">
                  <div className="flex justify-between items-start gap-4">
                    <CardTitle className="text-lg font-heading group-hover:text-primary transition-colors line-clamp-1">
                      {tool.metadata.name}
                    </CardTitle>
                    <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-primary -translate-x-2 group-hover:translate-x-0 transition-all duration-300 shrink-0 mt-1" />
                  </div>
                  <CardDescription className="line-clamp-2 text-xs mt-1">{tool.metadata.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
