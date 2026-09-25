import React from "react";
import { User } from "firebase/auth";
import { Movie, UserPreferences, UserProfile } from "../lib/types";
import { MatchEngine } from "../lib/matchEngine";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Share, Users, X } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface MatchPanelProps {
  user: User | null;
  profile: UserProfile | null;
  prefs: UserPreferences;
  onGoToOnboard: () => void;
  onDetails: (movie: Movie) => void;
}

export function MatchPanel({ user, profile, prefs, onGoToOnboard, onDetails }: MatchPanelProps) {
  const [matchCode, setMatchCode] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [friendCode, setFriendCode] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  
  const [matchResult, setMatchResult] = React.useState<{ movie: Movie, reason: string } | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (user) {
      // Use existing code from localStorage if available to persist across sessions
      const cached = localStorage.getItem(`matchCode_${user.uid}`);
      if (cached) {
        setMatchCode(cached);
      } else {
        const code = MatchEngine.generateMatchCode(user.uid);
        MatchEngine.linkMatchCode(code, user.uid);
        localStorage.setItem(`matchCode_${user.uid}`, code);
        setMatchCode(code);
      }
    }
  }, [user]);

  const handleMatch = async () => {
    if (!friendCode.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const code = friendCode.trim().toUpperCase();
      const friendUid = await MatchEngine.resolveMatchCode(code);
      if (!friendUid) {
        setError("Invalid match code. Try again.");
        setLoading(false);
        return;
      }

      const friendDoc = await getDoc(doc(db, "user_movie_preferences", friendUid));
      if (!friendDoc.exists()) {
        setError("Could not find their Taste DNA.");
        setLoading(false);
        return;
      }

      const friendPrefs = friendDoc.data() as UserPreferences;
      
      const pick = await MatchEngine.pickForUs(prefs, friendPrefs, "movie");
      if (pick) {
        setMatchResult(pick);
      } else {
        setError("You don't have any shared movies yet! Both of you need to swipe more.");
      }
    } catch(e) {
      console.error(e);
      setError("Something went wrong.");
    }
    setLoading(false);
  };

  return (
    <div className="p-5 sm:p-8 max-w-lg mx-auto pb-32">
      <h2 className="text-2xl font-black mb-2">Movie Night</h2>
      <p className="text-white/40 mb-8 text-sm">Find something you both want to watch.</p>

      {!user ? (
        <div className="bg-white/5 p-6 rounded-3xl mb-8 text-center border border-white/10 shadow-xl">
          <p className="text-sm font-bold text-white/80 mb-2">Sign in to match</p>
          <p className="text-xs text-white/40 mb-6 leading-relaxed max-w-[250px] mx-auto">You are currently exploring as a guest. Match with friends by signing in and saving your Taste Passport.</p>
          <Button onClick={onGoToOnboard} className="bg-white text-black font-bold rounded-xl px-8 shadow-lg">Sign In</Button>
        </div>
      ) : (
        <>
          <div className="bg-gradient-to-br from-white/10 to-white/5 p-5 rounded-3xl mb-8 text-left border border-white/10 shadow-xl relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
            <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] mb-4">Your Connect Pass</p>
            <div className="flex items-center justify-between bg-black/60 backdrop-blur-md rounded-2xl p-4 border border-white/10 mb-4 shadow-inner">
              <div className="min-w-0 flex-1 mr-4">
                {profile?.name && <p className="text-sm font-bold text-white/90 mb-1">{profile.name}</p>}
                <p className="text-lg font-mono text-pink-400 truncate tracking-widest">{matchCode || "..."}</p>
              </div>
              <Button size="icon" className="text-white shrink-0 bg-white/20 hover:bg-white/30 rounded-xl w-10 h-10 shadow-lg" onClick={() => navigator.clipboard.writeText(matchCode || "")}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            
            <Button 
              className="w-full bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl"
              onClick={async () => {
                const url = `${typeof window !== "undefined" ? window.location.origin + window.location.pathname : ""}#match=${matchCode}`;
                try {
                  if (navigator.share) await navigator.share({ title: "Match on MovieVerse", url });
                  else throw new Error();
                } catch {
                  navigator.clipboard.writeText(url);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }
              }}
            >
              <Share className="w-4 h-4 mr-2" /> {copied ? "Copied!" : "Share Match Link"}
            </Button>
          </div>

          <div className="flex gap-2 mb-4">
            <Input placeholder="Paste friend's code (e.g. MV-XXXX)..." value={friendCode} onChange={e => setFriendCode(e.target.value)} className="bg-black/40 border-white/10 rounded-xl text-white placeholder:text-white/20 h-12 uppercase" />
            <Button onClick={handleMatch} disabled={loading || !friendCode.trim()} className="rounded-xl px-6 bg-white text-black font-bold h-12">
              {loading ? "..." : "Match"}
            </Button>
          </div>
          {error && <p className="text-red-400 text-sm text-center font-semibold">{error}</p>}
        </>
      )}

      {/* Tonight's Pick Overlay */}
      {matchResult && (
        <div className="fixed inset-0 z-[10000] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
          <Button variant="ghost" size="icon" onClick={() => setMatchResult(null)} className="absolute top-6 right-6 text-white/50 hover:text-white bg-white/5 rounded-full">
            <X className="w-6 h-6" />
          </Button>
          <div className="w-20 h-20 bg-pink-500/20 rounded-full flex items-center justify-center mb-6 border border-pink-500/30">
            <Users className="w-10 h-10 text-pink-400" />
          </div>
          <h2 className="text-3xl font-black mb-2">Tonight&apos;s Pick</h2>
          <p className="text-pink-400 text-sm font-bold mb-8 uppercase tracking-widest">{matchResult.reason}</p>
          
          <div onClick={() => onDetails(matchResult.movie)} className="w-full max-w-sm aspect-[2/3] bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl relative cursor-pointer border border-white/10 hover:border-white/30 transition-all hover:scale-105">
            <img src={`https://image.tmdb.org/t/p/w500${matchResult.movie.poster_path}`} className="w-full h-full object-cover" alt="" />
            <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black to-transparent">
              <h3 className="text-2xl font-black">{matchResult.movie.title || matchResult.movie.name}</h3>
              <p className="text-white/60 text-sm mt-1">{matchResult.movie.release_date?.substring(0,4)} · ⭐ {Math.round(matchResult.movie.vote_average * 10)}%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
