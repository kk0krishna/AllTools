import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UserPreferences, Movie, InteractionState } from "./types";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE = "https://api.themoviedb.org/3";

export class MatchEngine {

  static generateMatchCode(uid: string): string {
    // Generates a 6 character pseudo-random code
    return "MV-" + Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  static async linkMatchCode(code: string, uid: string) {
    try {
      await setDoc(doc(db, "movieverse_match_codes", code), { uid, createdAt: new Date().toISOString() });
    } catch(e) {
      console.error(e);
    }
  }

  static async resolveMatchCode(code: string): Promise<string | null> {
    try {
      const d = await getDoc(doc(db, "movieverse_match_codes", code));
      if (d.exists()) {
        return d.data().uid;
      }
    } catch(e) {
      console.error(e);
    }
    return null;
  }

  static async createGroup(name: string, type: 'partner' | 'family' | 'trip' | 'group', uid: string): Promise<string> {
    const code = "GRP-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    try {
      await setDoc(doc(db, "movieverse_groups", code), {
        name,
        type,
        members: [uid],
        createdBy: uid,
        createdAt: new Date().toISOString()
      });
      return code;
    } catch(e) {
      console.error(e);
      throw e;
    }
  }

  static async joinGroup(code: string, uid: string): Promise<boolean> {
    try {
      const d = await getDoc(doc(db, "movieverse_groups", code));
      if (d.exists()) {
        const data = d.data();
        if (!data.members.includes(uid)) {
          const newMembers = [...data.members, uid];
          await setDoc(doc(db, "movieverse_groups", code), { members: newMembers }, { merge: true });
        }
        return true;
      }
    } catch(e) {
      console.error(e);
    }
    return false;
  }

  static async getGroupDetails(code: string): Promise<any | null> {
    try {
      const d = await getDoc(doc(db, "movieverse_groups", code));
      if (d.exists()) {
        return d.data();
      }
    } catch(e) {
      console.error(e);
    }
    return null;
  }

  static async pickForUs(myPrefs: UserPreferences, friendPrefs: UserPreferences, mediaType: string = "movie"): Promise<{ movie: Movie, reason: string } | null> {
    return this.pickForGroupPrefs([myPrefs, friendPrefs], mediaType);
  }

  static async pickForGroupPrefs(groupPrefs: UserPreferences[], mediaType: string = "movie"): Promise<{ movie: Movie, reason: string } | null> {
    if (groupPrefs.length === 0) return null;
    
    // Find saved items across all members
    const savedSets = groupPrefs.map(prefs => {
      const int = prefs.interactions || {};
      return Object.keys(int).filter(k => k.startsWith(`${mediaType}:`) && int[k] === "interested").map(k => k.split(":")[1]);
    });

    // Find intersection of ALL members
    let overlap = savedSets[0];
    for (let i = 1; i < savedSets.length; i++) {
      overlap = overlap.filter(id => savedSets[i].includes(id));
    }

    if (overlap.length > 0) {
      const pickId = overlap[Math.floor(Math.random() * overlap.length)];
      try {
        const res = await fetch(`${BASE}/${mediaType}/${pickId}?api_key=${API_KEY}`);
        const movie = await res.json();
        return { movie, reason: `Everyone in the group saved this!` };
      } catch (e) {
        console.error(e);
      }
    }

    // Fallback: everyone loved
    const lovedSets = groupPrefs.map(prefs => {
      const int = prefs.interactions || {};
      return Object.keys(int).filter(k => k.startsWith(`${mediaType}:`) && int[k] === "loved").map(k => k.split(":")[1]);
    });

    let lovedOverlap = lovedSets[0];
    for (let i = 1; i < lovedSets.length; i++) {
      lovedOverlap = lovedOverlap.filter(id => lovedSets[i].includes(id));
    }

    if (lovedOverlap.length > 0) {
       const pickId = lovedOverlap[Math.floor(Math.random() * lovedOverlap.length)];
       const res = await fetch(`${BASE}/${mediaType}/${pickId}?api_key=${API_KEY}`);
       const movie = await res.json();
       return { movie, reason: `Everyone in the group loved this!` };
    }

    // Try finding something at least 2 people saved or loved, if group > 2
    if (groupPrefs.length > 2) {
      const allSavedIds = savedSets.flat();
      const savedCounts = allSavedIds.reduce((acc, id) => {
        acc[id] = (acc[id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Sort by popularity in group
      const popularInGroup = Object.entries(savedCounts)
        .filter(([_, count]) => count >= 2)
        .sort((a, b) => b[1] - a[1]);
      
      if (popularInGroup.length > 0) {
        // Pick one of the most popular
        const maxCount = popularInGroup[0][1];
        const topCandidates = popularInGroup.filter(([_, count]) => count === maxCount).map(([id]) => id);
        const pickId = topCandidates[Math.floor(Math.random() * topCandidates.length)];
        
        try {
          const res = await fetch(`${BASE}/${mediaType}/${pickId}?api_key=${API_KEY}`);
          const movie = await res.json();
          return { movie, reason: `${maxCount} members saved this!` };
        } catch (e) {
          console.error(e);
        }
      }
    }

    return null;
  }
}

