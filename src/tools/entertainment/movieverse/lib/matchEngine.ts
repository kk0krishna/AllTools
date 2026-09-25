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

  static async pickForUs(myPrefs: UserPreferences, friendPrefs: UserPreferences, mediaType: string = "movie"): Promise<{ movie: Movie, reason: string } | null> {
    const myInt = myPrefs.interactions || {};
    const friendInt = friendPrefs.interactions || {};

    const mySaved = Object.keys(myInt).filter(k => k.startsWith(`${mediaType}:`) && myInt[k] === "interested").map(k => k.split(":")[1]);
    const friendSaved = Object.keys(friendInt).filter(k => k.startsWith(`${mediaType}:`) && friendInt[k] === "interested").map(k => k.split(":")[1]);

    const overlap = mySaved.filter(id => friendSaved.includes(id));
    
    if (overlap.length > 0) {
      // Pick top overlap
      const pickId = overlap[Math.floor(Math.random() * overlap.length)];
      try {
        const res = await fetch(`${BASE}/${mediaType}/${pickId}?api_key=${API_KEY}`);
        const movie = await res.json();
        return { movie, reason: "Both of you saved this!" };
      } catch (e) {
        console.error(e);
      }
    }

    // Fallback: both loved
    const myLoved = Object.keys(myInt).filter(k => k.startsWith(`${mediaType}:`) && myInt[k] === "loved").map(k => k.split(":")[1]);
    const friendLoved = Object.keys(friendInt).filter(k => k.startsWith(`${mediaType}:`) && friendInt[k] === "loved").map(k => k.split(":")[1]);
    
    const lovedOverlap = myLoved.filter(id => friendLoved.includes(id));
    if (lovedOverlap.length > 0) {
       const pickId = lovedOverlap[Math.floor(Math.random() * lovedOverlap.length)];
       const res = await fetch(`${BASE}/${mediaType}/${pickId}?api_key=${API_KEY}`);
       const movie = await res.json();
       return { movie, reason: "Both of you loved this!" };
    }

    return null;
  }
}
