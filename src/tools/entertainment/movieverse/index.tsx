"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ToolComponentProps } from "@/tools/registry";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Heart, Bookmark, Users, Sparkles, LogIn, ChevronLeft, Tv, Film, SkipForward, X, Eye, Popcorn } from "lucide-react";

// MovieVerse Components & Lib
import { Movie, UserProfile, MOODS, InteractionState } from "./lib/types";
import { MovieEngine } from "./lib/engine";
import { useMoviePreferences } from "./hooks/useMoviePreferences";
import { useMovieActions } from "./hooks/useMovieActions";
import { SwipeableCard } from "./components/SwipeableCard";
import { DetailsDrawer } from "./components/DetailsDrawer";
import { MovieShelf } from "./components/MovieShelf";
import { MatchPanel } from "./components/MatchPanel";
import { OnboardView, SetupView } from "./components/OnboardFlow";

export default function MovieVerse({}: ToolComponentProps) {
  const { user, signInWithGoogle, signInWithRedirectFlow, signOut } = useAuth();
  const router = useRouter();

  type ViewType = "onboard" | "setup" | "discover" | "search" | "lists" | "match" | "profile";
  const [view, setView] = useState<ViewType>("discover");

  // Global State
  const { prefs, updateInteraction, clearData, loading: prefsLoading } = useMoviePreferences(user);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  
  const { advanceCard } = useMovieActions(user, profile, setProfile, updateInteraction);

  // Feed State
  const [feed, setFeed] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mediaType, setMediaType] = useState<"movie" | "tv" | "both">("both");
  
  // Modals
  const [selectedMovieForDetails, setSelectedMovieForDetails] = useState<Movie | null>(null);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [showMoodPicker, setShowMoodPicker] = useState(false);

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // 1. Initial Load & Auth routing
  useEffect(() => {
    if (prefsLoading) return;
    if (!user || user.isAnonymous) {
      if (view !== "setup" && view !== "onboard") setView("onboard");
      setLoading(false);
      return;
    }
    const init = async () => {
      try {
        const pd = await getDoc(doc(db, "user_movie_profiles", user.uid));
        if (pd.exists()) {
          setProfile(pd.data() as UserProfile);
          if (view === "onboard" || view === "setup") setView("discover");
        } else {
          setView("setup");
        }
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    init();
  }, [user, prefsLoading]);

  // 2. Fetch Feed
  const fetchFeed = useCallback(async (mood: string | null) => {
    setLoading(true);
    const results = await MovieEngine.fetchCandidates(mood, [], prefs, profile, mediaType);
    setFeed(results);
    setCurrentIndex(0);
    setLoading(false);
  }, [prefs, profile, mediaType]);

  useEffect(() => {
    if (view === "discover" && feed.length === 0 && !loading) {
      fetchFeed(selectedMood);
    }
  }, [view, feed.length, loading, selectedMood, fetchFeed]);

  // Setup Complete Handler
  const handleSetupComplete = async (name: string, genres: number[]) => {
    const p: UserProfile = { name, favoriteGenres: genres, createdAt: new Date().toISOString() };
    setProfile(p);
    if (user && !user.isAnonymous) await setDoc(doc(db, "user_movie_profiles", user.uid), p);
    setView("discover");
  };

  // Search Handler
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) { setSearchResults([]); return; }
    setSearchLoading(true);
    try {
      const res = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${encodeURIComponent(query)}`);
      const data = await res.json();
      setSearchResults((data.results || []).filter((m: any) => m.poster_path && (m.media_type === "movie" || m.media_type === "tv")));
    } catch(e) {}
    setSearchLoading(false);
  };

  if (loading || prefsLoading) {
    return <div className="fixed inset-0 bg-[#0a0a0a] flex items-center justify-center z-[9999]"><div className="w-10 h-10 border-4 border-white/20 border-t-pink-500 rounded-full animate-spin" /></div>;
  }

  if (view === "onboard") return <OnboardView onSignIn={signInWithGoogle} onSignInGuest={() => setView("setup")} onSignInAlt={signInWithRedirectFlow} onBack={() => router.back()} />;
  if (view === "setup") return <SetupView onComplete={handleSetupComplete} />;

  const current = feed[currentIndex];
  const next1 = feed[currentIndex + 1];
  const next2 = feed[currentIndex + 2];
  const visibleCards = [current, next1, next2].filter(Boolean);

  return (
    <div className="fixed inset-0 z-[9999] bg-[#0a0a0a] text-white flex flex-col overflow-hidden font-sans selection:bg-pink-500/30">
      
      {/* ─── HEADER ─── */}
      <div className="flex items-center justify-between p-5 sm:p-8 z-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg shadow-red-600/20">
            <Popcorn className="w-5 h-5 text-white" />
          </div>
          <span className="font-black text-xl tracking-tight hidden sm:block">MovieVerse</span>
        </div>

        {view === "discover" && (
          <div className="flex items-center bg-white/5 p-1 rounded-2xl border border-white/10 shadow-inner">
            <button onClick={() => { setMediaType("movie"); setFeed([]); }} className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${mediaType === "movie" ? "bg-white text-black shadow-lg" : "text-white/50 hover:text-white"}`}><Film className="w-4 h-4"/> Movie</button>
            <button onClick={() => { setMediaType("tv"); setFeed([]); }} className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${mediaType === "tv" ? "bg-white text-black shadow-lg" : "text-white/50 hover:text-white"}`}><Tv className="w-4 h-4"/> TV</button>
            <button onClick={() => { setMediaType("both"); setFeed([]); }} className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${mediaType === "both" ? "bg-white text-black shadow-lg" : "text-white/50 hover:text-white"}`}>Both</button>
          </div>
        )}

        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => setView("search")} className={`rounded-full ${view === "search" ? "bg-white/10" : ""}`}><Search className="w-5 h-5" /></Button>
          <Button variant="ghost" size="icon" onClick={() => setView("profile")} className={`rounded-full ${view === "profile" ? "bg-white/10" : ""}`}><div className="w-6 h-6 rounded-full bg-gradient-to-tr from-pink-500 to-yellow-500 border-2 border-white/20" /></Button>
        </div>
      </div>

      {/* ─── MAIN CONTENT ─── */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden relative">
        
        {/* DISCOVER */}
        {view === "discover" && (
          <div className="absolute inset-0 flex flex-col">
            <div className="px-5 sm:px-8 py-2 flex items-center justify-between z-40">
              <Button onClick={() => setShowMoodPicker(true)} variant="ghost" className="bg-white/5 hover:bg-white/10 rounded-full text-sm font-bold border border-white/10">
                {selectedMood ? MOODS.find(m => m.id === selectedMood)?.emoji + " " + MOODS.find(m => m.id === selectedMood)?.label : "How are you feeling?"}
              </Button>
            </div>

            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4">
                <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <p className="text-white/30 text-sm font-semibold">Curating your universe…</p>
              </div>
            ) : current ? (
              <div className="w-full max-w-[min(100%,_48vh)] px-4 flex flex-col items-center justify-center h-[calc(100vh-140px)] min-h-[450px] pt-4 pb-32 mx-auto">
                <div className="relative w-full aspect-[2/3] perspective-[1000px]">
                  <AnimatePresence>
                    {visibleCards.slice().reverse().map((movie, index, arr) => {
                      const isTop = movie.id === current.id;
                      const isBackground = !isTop;
                      return (
                        <SwipeableCard 
                          key={`${movie.media_type}-${movie.id}`}
                          movie={movie}
                          isTop={isTop}
                          isBackground={isBackground}
                          whyText={isTop ? MovieEngine.generateWhyTag(movie, profile) : null}
                          onInfoClick={() => setSelectedMovieForDetails(movie)}
                          onSwipe={(dir) => {
                            const actionMap: Record<string, InteractionState> = { left: "disliked", right: "loved", up: "interested", down: "skipped" };
                            advanceCard(movie, actionMap[dir]);
                            setCurrentIndex(prev => prev + 1);
                          }}
                        />
                      );
                    })}
                  </AnimatePresence>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center justify-center gap-4 mt-8 w-full z-30">
                  <Button onClick={() => { advanceCard(current, "skipped"); setCurrentIndex(prev=>prev+1); }} size="icon" className="w-12 h-12 rounded-full bg-white/10 text-white/50 hover:bg-white/20"><SkipForward className="w-5 h-5" /></Button>
                  <Button onClick={() => { advanceCard(current, "disliked"); setCurrentIndex(prev=>prev+1); }} size="icon" className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/30"><X className="w-8 h-8" /></Button>
                  <Button onClick={() => { advanceCard(current, "interested"); setCurrentIndex(prev=>prev+1); }} size="icon" className="w-16 h-16 rounded-full bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 border border-purple-500/30"><Bookmark className="w-8 h-8" /></Button>
                  <Button onClick={() => { advanceCard(current, "loved"); setCurrentIndex(prev=>prev+1); }} size="icon" className="w-12 h-12 rounded-full bg-pink-500/10 text-pink-400 hover:bg-pink-500/20 border border-pink-500/30"><Heart className="w-5 h-5 fill-current" /></Button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
                <Sparkles className="w-10 h-10 text-white/20 mb-6" />
                <h3 className="text-2xl font-black mb-3">You&apos;ve cleared this lane.</h3>
                <Button onClick={() => { setFeed([]); fetchFeed(null); }} className="rounded-full bg-white text-black font-bold">Explore the vault</Button>
              </div>
            )}
          </div>
        )}

        {/* SEARCH */}
        {view === "search" && (
          <div className="p-5 sm:p-8 max-w-4xl mx-auto pb-32">
            <div className="relative mb-8 max-w-lg mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <Input autoFocus value={searchQuery} onChange={e => handleSearch(e.target.value)} placeholder="Search for a movie or TV show…" className="bg-white/5 border-white/10 text-white rounded-xl h-14 pl-12 text-lg" />
            </div>
            
            {searchLoading ? <div className="text-center py-12"><div className="w-10 h-10 border-4 border-white/10 border-t-white rounded-full animate-spin mx-auto shadow-xl" /></div> : null}
            
            {!searchQuery && !searchLoading && (
              <div className="text-center py-24 px-4">
                <div className="w-24 h-24 bg-gradient-to-b from-white/10 to-white/5 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl border border-white/10"><Search className="w-10 h-10 text-white/30" /></div>
                <h3 className="text-3xl font-black mb-3">Find anything</h3>
                <p className="text-white/40 max-w-sm mx-auto mb-8">Search for specific movies or TV shows to add directly to your Shelf.</p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-8">
              {searchResults.map(movie => {
                const key = `${movie.media_type}:${movie.id}`;
                const state = prefs.interactions[key];
                return (
                  <div key={key} className="flex gap-4 bg-white/5 rounded-2xl p-3 border border-white/5 items-center hover:bg-white/10 cursor-pointer" onClick={() => setSelectedMovieForDetails(movie)}>
                    <div className="w-16 h-24 rounded-xl overflow-hidden bg-zinc-900 shrink-0 shadow-md">
                      <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm truncate">{movie.title || movie.name}</h3>
                      <p className="text-white/40 text-xs mt-1">{movie.release_date?.substring(0,4)} · ⭐ {Math.round(movie.vote_average * 10)}%</p>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" onClick={(e) => { e.stopPropagation(); updateInteraction(movie.media_type || "movie", movie.id, "interested"); }} variant={state === "interested" ? "default" : "outline"} className={`h-7 text-[10px] rounded-full ${state === "interested" ? "bg-purple-500 hover:bg-purple-600" : "border-white/10 text-white/60"}`}>Save</Button>
                        <Button size="sm" onClick={(e) => { e.stopPropagation(); updateInteraction(movie.media_type || "movie", movie.id, "loved"); }} variant={state === "loved" ? "default" : "outline"} className={`h-7 text-[10px] rounded-full ${state === "loved" ? "bg-pink-500 hover:bg-pink-600" : "border-white/10 text-white/60"}`}>Love</Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SHELF */}
        {view === "lists" && (
          <MovieShelf prefs={prefs} onRemove={(mediaType, id) => updateInteraction(mediaType, id, "unseen")} onDetails={setSelectedMovieForDetails} />
        )}

        {/* MATCH */}
        {view === "match" && (
          <MatchPanel user={user} profile={profile} prefs={prefs} onGoToOnboard={() => setView("onboard")} onDetails={setSelectedMovieForDetails} />
        )}

        {/* PROFILE */}
        {view === "profile" && (
          <div className="p-5 sm:p-8 max-w-lg mx-auto pb-32">
            <h2 className="text-2xl font-black mb-8">Taste Passport</h2>
            <div className="bg-white/5 rounded-3xl p-6 border border-white/10 shadow-xl mb-8">
              <h3 className="font-bold text-white/60 text-xs uppercase tracking-widest mb-4">DNA Signature</h3>
              {profile ? (
                <>
                  <p className="text-xl font-black mb-1">{profile.name}</p>
                  <p className="text-sm text-pink-400 font-mono mb-6">User since {new Date(profile.createdAt).getFullYear()}</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(profile.genreAffinities || {})
                      .sort(([,a], [,b]) => b - a).slice(0, 5)
                      .map(([gId, score]) => (
                        <span key={gId} className="px-3 py-1.5 bg-black/40 border border-white/10 rounded-lg text-xs font-bold text-white/70">
                          {MOODS.flatMap(m => m.genres).includes(Number(gId)) ? "★ " : ""}{score}pts
                        </span>
                      ))}
                  </div>
                </>
              ) : (
                <p className="text-white/40 text-sm">No DNA found.</p>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <Button onClick={() => { if(confirm("Clear data?")) { clearData(); setProfile(null); setView("setup"); } }} variant="outline" className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-2xl font-bold">Clear My Data</Button>
              <Button onClick={() => { signOut().then(() => setView("onboard")); }} variant="ghost" className="w-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-2xl font-bold">Log Out</Button>
            </div>
          </div>
        )}
      </div>

      {/* ─── BOTTOM NAVIGATION ─── */}
      <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-none z-40" />
      <div className="absolute bottom-6 inset-x-0 flex justify-center z-50 pointer-events-auto px-4">
        <div className="flex items-center gap-1 bg-black/60 backdrop-blur-xl p-1.5 rounded-full border border-white/10 shadow-2xl">
          <Button onClick={() => setView("discover")} variant="ghost" className={`rounded-full px-6 py-6 transition-all ${view === "discover" ? "bg-white text-black shadow-lg scale-105" : "text-white/50 hover:text-white hover:bg-white/10"}`}>
            <Sparkles className="w-5 h-5" /> <span className={`ml-2 font-bold ${view !== "discover" ? "hidden sm:inline" : ""}`}>Discover</span>
          </Button>
          <Button onClick={() => setView("lists")} variant="ghost" className={`rounded-full px-6 py-6 transition-all ${view === "lists" ? "bg-white text-black shadow-lg scale-105" : "text-white/50 hover:text-white hover:bg-white/10"}`}>
            <Bookmark className="w-5 h-5" /> <span className={`ml-2 font-bold ${view !== "lists" ? "hidden sm:inline" : ""}`}>Shelf</span>
          </Button>
          <Button onClick={() => setView("match")} variant="ghost" className={`rounded-full px-6 py-6 transition-all ${view === "match" ? "bg-pink-500 text-white shadow-lg shadow-pink-500/25 scale-105" : "text-white/50 hover:text-pink-400 hover:bg-pink-500/10"}`}>
            <Users className="w-5 h-5" /> <span className={`ml-2 font-bold ${view !== "match" ? "hidden sm:inline" : ""}`}>Match</span>
          </Button>
        </div>
      </div>

      {/* Details Drawer */}
      <AnimatePresence>
        {selectedMovieForDetails && (
          <DetailsDrawer
            movie={selectedMovieForDetails}
            prefs={prefs}
            mediaType={(selectedMovieForDetails.media_type as "movie" | "tv") || "movie"}
            onClose={() => setSelectedMovieForDetails(null)}
            onSave={() => updateInteraction(selectedMovieForDetails.media_type || "movie", selectedMovieForDetails.id, "interested")}
            onWatched={() => updateInteraction(selectedMovieForDetails.media_type || "movie", selectedMovieForDetails.id, "watched")}
          />
        )}
      </AnimatePresence>
      
      {/* Mood Picker */}
      <AnimatePresence>
        {showMoodPicker && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[10000] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center">
            <h2 className="text-3xl font-black mb-8">What&apos;s the vibe?</h2>
            <div className="grid grid-cols-2 gap-3 max-w-sm w-full">
              {MOODS.map(mood => (
                <button key={mood.id} onClick={() => { setSelectedMood(mood.id); setShowMoodPicker(false); setFeed([]); }}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 p-4 rounded-2xl flex flex-col items-center gap-2 transition-all hover:scale-105"
                >
                  <span className="text-3xl">{mood.emoji}</span>
                  <span className="text-sm font-bold">{mood.label}</span>
                </button>
              ))}
            </div>
            <Button variant="ghost" onClick={() => setShowMoodPicker(false)} className="mt-8 text-white/40">Cancel</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
