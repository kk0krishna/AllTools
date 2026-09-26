"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ToolComponentProps } from "@/tools/registry";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Heart, Bookmark, Users, Sparkles, LogIn, ChevronLeft, Tv, Film, SkipForward, X, Eye, Popcorn, Undo2 } from "lucide-react";

// MovieVerse Components & Lib
import { Movie, ScoredMovie, UserProfile, MOODS, InteractionState, DiscoveryMode, DISCOVERY_MODES } from "./lib/types";
import { MovieEngine } from "./lib/engine";
import { useMoviePreferences } from "./hooks/useMoviePreferences";
import { useMovieActions } from "./hooks/useMovieActions";
import { SwipeableCard } from "./components/SwipeableCard";
import { DetailsDrawer } from "./components/DetailsDrawer";
import { MovieShelf } from "./components/MovieShelf";
import { MatchPanel } from "./components/MatchPanel";
import { OnboardView, SetupView } from "./components/OnboardFlow";

// Prefetch threshold: when user is this many cards from the end, load more
const PREFETCH_THRESHOLD = 5;

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
  const [feed, setFeed] = useState<ScoredMovie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mediaType, setMediaType] = useState<"movie" | "tv" | "both">("both");
  const [discoveryMode, setDiscoveryMode] = useState<DiscoveryMode>("explore");
  const isFetchingRef = useRef(false);
  const [lastAction, setLastAction] = useState<{ movie: ScoredMovie, index: number } | null>(null);
  
  // Modals
  const [selectedMovieForDetails, setSelectedMovieForDetails] = useState<Movie | null>(null);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [showMoodPicker, setShowMoodPicker] = useState(false);

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Initial Load & Auth routing
  useEffect(() => {
    if (prefsLoading) return;
    if (!user || user.isAnonymous) {
      if (view !== "setup" && view !== "onboard") setView("onboard");
      setLoading(false);
      return;
    }
    let cancelled = false;
    const init = async () => {
      try {
        const pd = await getDoc(doc(db, "user_movie_profiles", user.uid));
        if (cancelled) return;
        if (pd.exists()) {
          setProfile(pd.data() as UserProfile);
          if (view === "onboard" || view === "setup") setView("discover");
        } else {
          setView("setup");
        }
      } catch (e) {
        console.error(e);
      }
      if (!cancelled) setLoading(false);
    };
    init();
    return () => { cancelled = true; };
  }, [user, prefsLoading]);

  // 2. Fetch Feed
  const fetchFeed = useCallback(async (mood: string | null, append: boolean = false) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    if (!append) setLoading(true);
    
    const results = await MovieEngine.fetchCandidates(mood, [], prefs, profile, mediaType, discoveryMode);
    
    if (append) {
      setFeed(prev => {
        // Deduplicate when appending
        const existingKeys = new Set(prev.map(m => `${m.media_type}:${m.id}`));
        const newMovies = results.filter(m => !existingKeys.has(`${m.media_type}:${m.id}`));
        return [...prev, ...newMovies];
      });
    } else {
      setFeed(results);
      setCurrentIndex(0);
      setLastAction(null);
    }
    
    setLoading(false);
    isFetchingRef.current = false;
  }, [prefs, profile, mediaType, discoveryMode]);

  // Initial feed load
  useEffect(() => {
    if (view === "discover" && feed.length === 0 && !loading && !isFetchingRef.current) {
      fetchFeed(selectedMood);
    }
  }, [view, feed.length, loading, selectedMood, fetchFeed]);

  // 3. Prefetch more movies when approaching end of feed
  useEffect(() => {
    if (view !== "discover") return;
    const remaining = feed.length - currentIndex;
    if (remaining <= PREFETCH_THRESHOLD && remaining > 0 && !isFetchingRef.current) {
      fetchFeed(selectedMood, true); // Append mode
    }
  }, [currentIndex, feed.length, view, selectedMood, fetchFeed]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (view !== "discover" || feed.length === 0 || currentIndex >= feed.length) return;
      if (showMoodPicker || selectedMovieForDetails) return;
      
      const current = feed[currentIndex];
      
      if (e.key === "ArrowLeft") handleSwipe(current, "disliked");
      else if (e.key === "ArrowRight") handleSwipe(current, "loved");
      else if (e.key === "ArrowUp") handleSwipe(current, "interested");
      else if (e.key === "ArrowDown") handleSwipe(current, "skipped");
      else if (e.key === "z" && (e.ctrlKey || e.metaKey)) handleUndo();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [view, feed, currentIndex, showMoodPicker, selectedMovieForDetails]);

  const handleSwipe = (movie: ScoredMovie, action: InteractionState) => {
    advanceCard(movie, action);
    setLastAction({ movie, index: currentIndex });
    setCurrentIndex(prev => prev + 1);
  };

  const handleUndo = () => {
    if (!lastAction) return;
    // We update interaction back to 'unseen'. Note this doesn't undo the affinity changes,
    // which would require a more complex history, but it allows them to reswipe.
    updateInteraction(lastAction.movie.media_type, lastAction.movie.id, "unseen");
    setCurrentIndex(lastAction.index);
    setLastAction(null);
  };

  // Setup Complete Handler
  const handleSetupComplete = async (name: string, genres: number[]) => {
    const p: UserProfile = { name, favoriteGenres: genres, createdAt: new Date().toISOString() };
    setProfile(p);
    if (user && !user.isAnonymous) await setDoc(doc(db, "user_movie_profiles", user.uid), p);
    setView("discover");
  };

  // Debounced Search Handler
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    
    if (!query.trim()) { 
      setSearchResults([]); 
      return; 
    }
    
    searchTimeoutRef.current = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${encodeURIComponent(query)}`);
        const data = await res.json();
        setSearchResults((data.results || []).filter((m: any) => m.poster_path && (m.media_type === "movie" || m.media_type === "tv")));
      } catch(e) {}
      setSearchLoading(false);
    }, 400); // 400ms debounce
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

  // Count stats for profile view
  const interactionCounts = Object.values(prefs.interactions);
  const lovedCount = interactionCounts.filter(s => s === "loved").length;
  const watchedCount = interactionCounts.filter(s => s === "watched").length;
  const exploredCount = interactionCounts.length;

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
            <div className="px-5 sm:px-8 py-2 flex items-center justify-between z-40 gap-2">
              <Button onClick={() => setShowMoodPicker(true)} variant="ghost" className="bg-white/5 hover:bg-white/10 rounded-full text-sm font-bold border border-white/10 shrink-0 shadow-lg">
                {selectedMood ? MOODS.find(m => m.id === selectedMood)?.emoji + " " + MOODS.find(m => m.id === selectedMood)?.label : "How are you feeling?"}
              </Button>

              {/* Discovery Mode Toggle */}
              <div className="flex items-center bg-white/5 p-0.5 rounded-full border border-white/10 shadow-inner">
                {DISCOVERY_MODES.map(mode => (
                  <button 
                    key={mode.id}
                    onClick={() => { setDiscoveryMode(mode.id); setFeed([]); }}
                    className={`px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold transition-all flex items-center gap-1 ${
                      discoveryMode === mode.id 
                        ? "bg-white text-black shadow-lg" 
                        : "text-white/40 hover:text-white"
                    }`}
                    title={mode.description}
                  >
                    <span>{mode.emoji}</span>
                    <span className="hidden sm:inline">{mode.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4">
                <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <p className="text-white/30 text-sm font-semibold">Curating your universe…</p>
              </div>
            ) : current ? (
              <div className="w-full max-w-[min(100%,_48vh)] px-4 flex flex-col items-center justify-center h-[calc(100vh-140px)] min-h-[450px] pt-4 pb-32 mx-auto">
                
                {/* Card Counter & Undo */}
                <div className="w-full flex justify-between items-center mb-3 px-2 z-40">
                  <span className="text-xs font-bold text-white/30 tracking-widest">{currentIndex + 1} / {feed.length}</span>
                  {lastAction && (
                    <button onClick={handleUndo} className="flex items-center gap-1 text-xs font-bold text-white/50 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3 py-1 rounded-full border border-white/10">
                      <Undo2 className="w-3 h-3" /> Undo
                    </button>
                  )}
                </div>

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
                            handleSwipe(movie, actionMap[dir]);
                          }}
                        />
                      );
                    })}
                  </AnimatePresence>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center justify-center gap-4 mt-8 w-full z-30">
                  <Button onClick={() => handleSwipe(current, "skipped")} size="icon" className="w-12 h-12 rounded-full bg-white/10 text-white/50 hover:bg-white/20 shadow-lg"><SkipForward className="w-5 h-5" /></Button>
                  <Button onClick={() => handleSwipe(current, "disliked")} size="icon" className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/30 shadow-lg"><X className="w-8 h-8" /></Button>
                  <Button onClick={() => handleSwipe(current, "interested")} size="icon" className="w-16 h-16 rounded-full bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 border border-purple-500/30 shadow-lg"><Bookmark className="w-8 h-8" /></Button>
                  <Button onClick={() => handleSwipe(current, "loved")} size="icon" className="w-12 h-12 rounded-full bg-pink-500/10 text-pink-400 hover:bg-pink-500/20 border border-pink-500/30 shadow-lg"><Heart className="w-5 h-5 fill-current" /></Button>
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
              <Input autoFocus value={searchQuery} onChange={e => handleSearch(e.target.value)} placeholder="Search for a movie or TV show…" className="bg-white/5 border-white/10 text-white rounded-xl h-14 pl-12 text-lg focus:border-pink-500 transition-colors" />
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
                  <div key={key} className="flex gap-4 bg-white/5 rounded-2xl p-3 border border-white/5 items-center hover:bg-white/10 cursor-pointer transition-colors" onClick={() => setSelectedMovieForDetails(movie)}>
                    <div className="w-16 h-24 rounded-xl overflow-hidden bg-zinc-900 shrink-0 shadow-md">
                      <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm truncate">{movie.title || movie.name}</h3>
                      <p className="text-white/40 text-xs mt-1">{movie.release_date?.substring(0,4) || movie.first_air_date?.substring(0,4)} · ⭐ {Math.round(movie.vote_average * 10)}%</p>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" onClick={(e) => { e.stopPropagation(); updateInteraction(movie.media_type || "movie", movie.id, "interested"); }} variant={state === "interested" ? "default" : "outline"} className={`h-7 text-[10px] rounded-full ${state === "interested" ? "bg-purple-500 hover:bg-purple-600 border-transparent text-white" : "border-white/10 text-white/60 hover:text-white"}`}>Save</Button>
                        <Button size="sm" onClick={(e) => { e.stopPropagation(); updateInteraction(movie.media_type || "movie", movie.id, "loved"); }} variant={state === "loved" ? "default" : "outline"} className={`h-7 text-[10px] rounded-full ${state === "loved" ? "bg-pink-500 hover:bg-pink-600 border-transparent text-white" : "border-white/10 text-white/60 hover:text-white"}`}>Love</Button>
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

        {/* PROFILE — Taste Passport */}
        {view === "profile" && (
          <div className="p-5 sm:p-8 max-w-lg mx-auto pb-32">
            <h2 className="text-2xl font-black mb-8">Taste Passport</h2>
            
            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-white/5 rounded-2xl p-4 text-center border border-white/5 shadow-lg">
                <p className="text-2xl font-black text-white">{exploredCount}</p>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider mt-1">Explored</p>
              </div>
              <div className="bg-pink-500/10 rounded-2xl p-4 text-center border border-pink-500/20 shadow-lg shadow-pink-500/5">
                <p className="text-2xl font-black text-pink-400">{lovedCount}</p>
                <p className="text-[10px] font-bold text-pink-400/60 uppercase tracking-wider mt-1">Loved</p>
              </div>
              <div className="bg-blue-500/10 rounded-2xl p-4 text-center border border-blue-500/20 shadow-lg shadow-blue-500/5">
                <p className="text-2xl font-black text-blue-400">{watchedCount}</p>
                <p className="text-[10px] font-bold text-blue-400/60 uppercase tracking-wider mt-1">Watched</p>
              </div>
            </div>

            {/* DNA Signature */}
            <div className="bg-white/5 rounded-3xl p-6 border border-white/10 shadow-xl mb-6">
              <h3 className="font-bold text-white/60 text-xs uppercase tracking-widest mb-4">DNA Signature</h3>
              {profile ? (
                <>
                  <p className="text-xl font-black mb-1">{profile.name}</p>
                  <p className="text-sm text-pink-400 font-mono mb-6">User since {new Date(profile.createdAt).getFullYear()}</p>
                  
                  {/* Genre Affinity Bars */}
                  {profile.genreAffinities && Object.keys(profile.genreAffinities).length > 0 ? (
                    <div className="space-y-3">
                      {Object.entries(profile.genreAffinities)
                        .sort(([,a], [,b]) => b - a)
                        .slice(0, 6)
                        .map(([gId, score]) => {
                          const genreName = ({
                            28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
                            99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
                            27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Sci-Fi",
                            53: "Thriller", 10752: "War", 37: "Western"
                          } as Record<number, string>)[Number(gId)] || `Genre ${gId}`;
                          const maxScore = Math.max(...Object.values(profile.genreAffinities!));
                          const pct = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
                          return (
                            <div key={gId}>
                              <div className="flex justify-between text-xs mb-1">
                                <span className="font-bold text-white/70">{genreName}</span>
                                <span className="font-mono text-white/40">{pct}%</span>
                              </div>
                              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all duration-500" 
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  ) : (
                    <p className="text-white/30 text-sm">Swipe more movies to build your DNA.</p>
                  )}
                </>
              ) : (
                <p className="text-white/40 text-sm">No DNA found.</p>
              )}
            </div>

            {/* Movie Personality */}
            {profile?.genreAffinities && Object.keys(profile.genreAffinities).length >= 5 && (
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl p-6 border border-purple-500/20 shadow-xl mb-6">
                <h3 className="font-bold text-white/60 text-xs uppercase tracking-widest mb-3">Your Movie Personality</h3>
                <p className="text-2xl font-black text-white mb-2">
                  {(() => {
                    const entries = Object.entries(profile.genreAffinities!).sort(([,a],[,b]) => b - a);
                    const topGenre = Number(entries[0]?.[0]);
                    if ([878, 9648].includes(topGenre)) return "THE THINKER";
                    if ([28, 53].includes(topGenre)) return "THE THRILL-SEEKER";
                    if ([35].includes(topGenre)) return "THE ENTERTAINER";
                    if ([18, 10749].includes(topGenre)) return "THE EMPATH";
                    if ([27].includes(topGenre)) return "THE DARK SIDE";
                    if ([14, 12].includes(topGenre)) return "THE EXPLORER";
                    return "THE CINEPHILE";
                  })()}
                </p>
                <p className="text-sm text-white/50 leading-relaxed">
                  {(() => {
                    const entries = Object.entries(profile.genreAffinities!).sort(([,a],[,b]) => b - a);
                    const topGenres = entries.slice(0, 3).map(([gId]) => {
                      const map: Record<number, string> = { 878: "sci-fi", 9648: "mystery", 53: "thrillers", 28: "action", 27: "horror", 18: "drama", 35: "comedy", 10749: "romance", 14: "fantasy", 12: "adventure" };
                      return map[Number(gId)] || "cinema";
                    });
                    return `Drawn toward ${topGenres.slice(0, 2).join(" and ")} with a taste for the unexpected.`;
                  })()}
                </p>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <Button onClick={() => { if(confirm("Clear data?")) { clearData(); setProfile(null); setView("setup"); } }} variant="outline" className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-2xl font-bold transition-colors">Clear My Data</Button>
              <Button onClick={() => { signOut().then(() => setView("onboard")); }} variant="ghost" className="w-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-2xl font-bold transition-colors">Log Out</Button>
            </div>
          </div>
        )}
      </div>

      {/* ─── BOTTOM NAVIGATION ─── */}
      <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/90 to-transparent pointer-events-none z-40" />
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
            onLove={() => updateInteraction(selectedMovieForDetails.media_type || "movie", selectedMovieForDetails.id, "loved")}
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
            <Button variant="ghost" onClick={() => { setSelectedMood(null); setShowMoodPicker(false); setFeed([]); }} className="mt-6 text-white/60 hover:text-white font-bold">Clear Mood</Button>
            <Button variant="ghost" onClick={() => setShowMoodPicker(false)} className="mt-2 text-white/40">Cancel</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
