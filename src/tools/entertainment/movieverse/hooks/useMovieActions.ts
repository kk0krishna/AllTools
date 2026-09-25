import { useState } from "react";
import { User } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Movie, UserProfile, InteractionState } from "../lib/types";

export function useMovieActions(
  user: User | null, 
  profile: UserProfile | null, 
  setProfile: (p: UserProfile) => void,
  updateInteraction: (mediaType: string, id: number, state: InteractionState) => void
) {
  const advanceCard = (movie: Movie, state: InteractionState) => {
    // 1. Update Taste Vectors
    if (profile && (state === "loved" || state === "disliked" || state === "interested")) {
      const affinities = { ...(profile.genreAffinities || {}) };
      const delta = (state === "loved" || state === "interested") ? 1 : -1;
      movie.genre_ids?.forEach(g => {
        affinities[g] = (affinities[g] || 0) + delta;
      });
      const newProfile = { ...profile, genreAffinities: affinities };
      setProfile(newProfile);
      if (user && !user.isAnonymous) {
        setDoc(doc(db, "user_movie_profiles", user.uid), newProfile, { merge: true });
      }
    }

    // 2. Set State
    updateInteraction(movie.media_type || "movie", movie.id, state);
  };

  return { advanceCard };
}
