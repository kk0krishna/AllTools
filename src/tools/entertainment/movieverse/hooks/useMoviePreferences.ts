import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UserPreferences, InteractionState } from "../lib/types";

export function useMoviePreferences(user: User | null) {
  const [prefs, setPrefs] = useState<UserPreferences>({ interactions: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.isAnonymous) {
      setLoading(false);
      return;
    }
    const load = async () => {
      try {
        const d = await getDoc(doc(db, "user_movie_preferences", user.uid));
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
      setLoading(false);
    };
    load();
  }, [user]);

  const updateInteraction = async (mediaType: string, id: number, state: InteractionState) => {
    const key = `${mediaType}:${id}`;
    
    // Optimistic UI update
    setPrefs(prev => ({
      ...prev,
      interactions: { ...prev.interactions, [key]: state }
    }));

    // Background sync via atomic update
    if (user && !user.isAnonymous) {
      try {
        await setDoc(doc(db, "user_movie_preferences", user.uid), {
          interactions: { [key]: state }
        }, { merge: true });
      } catch (e) {
        console.error("Atomic update failed", e);
      }
    }
  };

  const clearData = async () => {
    setPrefs({ interactions: {} });
    if (user && !user.isAnonymous) {
      await setDoc(doc(db, "user_movie_preferences", user.uid), { interactions: {} });
    }
  };

  return { prefs, setPrefs, updateInteraction, clearData, loading };
}
