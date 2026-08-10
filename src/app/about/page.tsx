import { Metadata } from "next";
import { Sparkles, Activity, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `About | ${siteConfig.name}`,
  description: `Learn about ${siteConfig.name}, the ultimate collection of professional-grade tools.`,
};

export default function AboutPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background pt-24 pb-16">
      {/* Background FX */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-50">
        <div className="absolute top-[10%] left-[20%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[20%] right-[10%] w-[50%] h-[50%] rounded-full bg-accent/10 blur-[120px] mix-blend-screen" />
      </div>

      <div className="container relative z-10 max-w-5xl mx-auto px-4 md:px-8">
        <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border backdrop-blur-md text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-6">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            About Us
          </div>
          <h1 className="text-5xl md:text-7xl font-black font-heading tracking-tight mb-6">
            Building the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Ultimate</span> Toolkit.
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {siteConfig.name} was created with a single mission: to provide professionals with lightning-fast, privacy-first, and highly accurate web utilities without the friction of ads, paywalls, or slow load times.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-24 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-150">
          <div className="bg-card/50 backdrop-blur-sm border rounded-3xl p-8 flex flex-col items-center text-center shadow-lg hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-6">
              <Zap className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold font-heading mb-3">Client-Side Speed</h3>
            <p className="text-muted-foreground leading-relaxed">
              Every tool executes directly in your browser. No server round-trips, no loading spinners. Just instant, zero-latency results.
            </p>
          </div>
          <div className="bg-card/50 backdrop-blur-sm border rounded-3xl p-8 flex flex-col items-center text-center shadow-lg hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-6">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold font-heading mb-3">Absolute Privacy</h3>
            <p className="text-muted-foreground leading-relaxed">
              We don&apos;t want your data. Because everything runs locally, your sensitive information and metrics never leave your device.
            </p>
          </div>
          <div className="bg-card/50 backdrop-blur-sm border rounded-3xl p-8 flex flex-col items-center text-center shadow-lg hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 mb-6">
              <Activity className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold font-heading mb-3">Clinical Precision</h3>
            <p className="text-muted-foreground leading-relaxed">
              Our medical and scientific calculators are built to exact specifications, ensuring professionals can rely on them in critical moments.
            </p>
          </div>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-3xl p-10 md:p-16 text-center animate-in fade-in zoom-in-95 duration-1000 delay-300">
          <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 text-primary mb-6 ring-4 ring-primary/20 flex items-center justify-center shadow-[0_0_30px_rgba(0,229,255,0.2)]">
            <span className="font-mono text-2xl font-bold">{siteConfig.nameHighlight}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-6 text-foreground">{siteConfig.about.title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            {siteConfig.about.description}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href={siteConfig.author.github} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="rounded-full px-8 text-base font-bold shadow-[0_0_15px_rgba(0,229,255,0.3)] w-full sm:w-auto font-mono">
                &lt;View GitHub /&gt;
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
