import { useState, useEffect, useRef } from "react";
import { User } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UserPreferences, InteractionState } from "../lib/types";

const GUEST_PREFS_KEY = "movieverse_guest_prefs";

export function useMoviePreferences(user: User | null) {
  const [prefs, setPrefs] = useState<UserPreferences>({ interactions: {} });
  const [loading, setLoading] = useState(true);
  const writeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingWritesRef = useRef<Record<string, InteractionState>>({});

  useEffect(() => {
    let cancelled = false;

    // Guest mode: load from localStorage
    if (!user || user.isAnonymous) {
      try {
        const stored = localStorage.getItem(GUEST_PREFS_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.interactions) {
            if (!cancelled) setPrefs(parsed as UserPreferences);
          }
        }
      } catch (e) {
        console.warn("Failed to load guest prefs from localStorage", e);
      }
      setLoading(false);
      return;
    }

    // Authenticated mode: load from Firestore
    const load = async () => {
      try {
        const d = await getDoc(doc(db, "user_movie_preferences", user.uid));
        if (cancelled) return;
        if (d.exists()) {
          const data = d.data();
          if (data.interactions) {
            setPrefs(data as UserPreferences);
          } else {
            // Migrate legacy V1 arrays to V2 interactions map
            const interactions: Record<string, InteractionState> = {};
            const migrate = (arr: number[], state: InteractionState) => {
              if (Array.isArray(arr)) {
                arr.forEach(id => { interactions[`movie:${id}`] = state; });
              }
            };
            migrate(data.likes, "loved");
            migrate(data.dislikes, "disliked");
            migrate(data.watched, "watched");
            migrate(data.wantToWatch, "interested");
            migrate(data.skipped, "skipped");
            
            const newPrefs = { interactions };
            setPrefs(newPrefs);
            await setDoc(doc(db, "user_movie_preferences", user.uid), newPrefs); // Overwrite legacy
          }
        }
      } catch (e) {
        console.error("Failed to load prefs", e);
      }
      if (!cancelled) setLoading(false);
    };
    load();

    return () => { cancelled = true; };
  }, [user]);

  const updateInteraction = async (mediaType: string, id: number, state: InteractionState) => {
    const key = `${mediaType}:${id}`;
    
    // Optimistic UI update
    setPrefs(prev => {
      const updated = {
        ...prev,
        interactions: { ...prev.interactions, [key]: state }
      };

      // Guest mode: persist to localStorage immediately
      if (!user || user.isAnonymous) {
        try {
          localStorage.setItem(GUEST_PREFS_KEY, JSON.stringify(updated));
        } catch (e) {
          console.warn("Failed to save guest prefs", e);
        }
      }

      return updated;
    });

    // Authenticated: debounced batch write to Firestore
    if (user && !user.isAnonymous) {
      pendingWritesRef.current[key] = state;
      
      if (writeTimeoutRef.current) clearTimeout(writeTimeoutRef.current);
      writeTimeoutRef.current = setTimeout(async () => {
        const batch = { ...pendingWritesRef.current };
        pendingWritesRef.current = {};
        
        try {
          await setDoc(doc(db, "user_movie_preferences", user.uid), {
            interactions: batch
          }, { merge: true });
        } catch (e) {
          console.error("Batch update failed", e);
        }
      }, 800); // 800ms debounce — batches rapid swipes together
    }
  };

  const clearData = async () => {
    setPrefs({ interactions: {} });
    if (user && !user.isAnonymous) {
      await setDoc(doc(db, "user_movie_preferences", user.uid), { interactions: {} });
    }
    try {
      localStorage.removeItem(GUEST_PREFS_KEY);
    } catch (e) {}
  };

  return { prefs, setPrefs, updateInteraction, clearData, loading };
}
