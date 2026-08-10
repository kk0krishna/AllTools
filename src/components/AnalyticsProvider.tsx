"use client";

import { useAnalytics } from "@/hooks/useAnalytics";
import { Suspense } from "react";

function AnalyticsInner() {
  useAnalytics();
  return null;
}

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <AnalyticsInner />
      </Suspense>
      {children}
    </>
  );
}
