"use client";

import { useEffect } from "react";
import { ToolComponentProps } from "../../registry";
import Image from "next/image";

export default function MovieVerseRedirect({ metadata }: ToolComponentProps) {
  useEffect(() => {
    window.location.href = "https://filmiyaar.web.app";
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="mb-8 p-4 bg-background border border-border/50 rounded-2xl shadow-sm">
        <Image 
          src="/tools-icons/movieverse/filmiy-logo.svg" 
          alt="FilmiYaar Logo" 
          width={80} 
          height={80} 
          className="rounded-xl"
        />
      </div>
      <h2 className="text-3xl font-bold font-heading mb-4 text-foreground">MovieVerse is now FilmiYaar!</h2>
      <p className="text-lg text-muted-foreground mb-8 max-w-md">
        We have launched as a brand new, dedicated platform. 
        You are being automatically redirected...
      </p>
      <a 
        href="https://filmiyaar.web.app" 
        className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
      >
        Go to FilmiYaar
      </a>
    </div>
  );
}
