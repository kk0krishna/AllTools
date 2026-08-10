"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { logEvent } from "firebase/analytics";
import { analytics, db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, doc, setDoc, increment } from "firebase/firestore";

export function useAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname && analytics) {
      const url = pathname + searchParams.toString();
      
      // Log to Firebase Analytics
      logEvent(analytics, "page_view", {
        page_path: url,
        page_location: window.location.href,
        page_title: document.title,
      });

      // General Page Views Logging
      try {
        addDoc(collection(db, "pageViews"), {
          path: pathname,
          url: url,
          timestamp: serverTimestamp(),
          userAgent: navigator.userAgent,
          referrer: document.referrer
        }).catch(err => console.warn("Firestore page view logging failed:", err));
      } catch (err) {
        console.warn("Analytics error", err);
      }

      // Track individual tool views for the Trending section
      if (pathname.startsWith("/tools/")) {
        const parts = pathname.split("/");
        // format: /tools/[category]/[slug]
        if (parts.length >= 4) {
          const toolSlug = parts[3];
          try {
            const toolRef = doc(db, "toolStats", toolSlug);
            setDoc(toolRef, {
              views: increment(1),
              lastVisited: serverTimestamp(),
            }, { merge: true }).catch(err => console.warn("Failed to increment tool stats:", err));
          } catch (err) {
            console.warn("Failed to update tool stats:", err);
          }
        }
      }
    }
  }, [pathname, searchParams]);
}
