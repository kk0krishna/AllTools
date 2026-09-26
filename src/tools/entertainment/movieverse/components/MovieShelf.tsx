import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User } from "firebase/auth";
import { Movie, UserPreferences, InteractionState } from "../lib/types";
import { Button } from "@/components/ui/button";
import { X, Search, Sparkles, Popcorn, Bookmark } from "lucide-react";

const IMG_SM = "https://image.tmdb.org/t/p/w500";

interface MovieShelfProps {
  prefs: UserPreferences;
  onRemove: (mediaType: string, id: number) => void;
  onDetails: (movie: any) => void;
}

// Module level cache to speed up shelf switching
const shelfCache: Record<string, any> = {};

// Concurrency-limited fetch helper — max 5 parallel requests
async function fetchWithConcurrencyLimit<T>(
  items: { key: string; mediaType: string; id: number }[],
  limit: number = 5,
  signal?: AbortSignal
): Promise<Movie[]> {
  const results: Movie[] = [];
  
  for (let i = 0; i < items.length; i += limit) {
    if (signal?.aborted) break;
    
    const batch = items.slice(i, i + limit);
    const batchResults = await Promise.all(
      batch.map(async (item) => {
        if (shelfCache[item.key]) return shelfCache[item.key];
        try {
          const r = await fetch(
            `https://api.themoviedb.org/3/${item.mediaType}/${item.id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
            { signal }
          );
          const data = await r.json();
          const movie = { ...data, media_type: item.mediaType };
          shelfCache[item.key] = movie;
          return movie;
        } catch(e) {
          if ((e as any)?.name === 'AbortError') return null;
          return null;
        }
      })
    );
    results.push(...batchResults.filter(Boolean));
  }
  
  return results;
}

export function MovieShelf({ prefs, onRemove, onDetails }: MovieShelfProps) {
  const [tab, setTab] = React.useState<InteractionState>("interested");
  const [movies, setMovies] = React.useState<Movie[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const controller = new AbortController();

    const fetchShelf = async () => {
      setLoading(true);
      const items = Object.entries(prefs.interactions || {})
        .filter(([_, state]) => {
          if (tab === "watched") return state === "watched" || state === "loved" || state === "disliked";
          return state === tab;
        })
        .map(([key, _]) => {
          const [mediaType, idStr] = key.split(":");
          return { mediaType, id: Number(idStr), key };
        });

      if (items.length === 0) {
        setMovies([]);
        setLoading(false);
        return;
      }

      const ids = items.slice(-20).reverse();
      const results = await fetchWithConcurrencyLimit(ids, 5, controller.signal);
      
      if (!controller.signal.aborted) {
        setMovies(results);
        setLoading(false);
      }
    };

    fetchShelf();
    
    return () => controller.abort();
  }, [tab, prefs.interactions]);

  const tabs: { id: InteractionState; label: string; activeColor: string }[] = [
    { id: "interested", label: "For Later", activeColor: "bg-white text-black" },
    { id: "loved", label: "Loved", activeColor: "bg-pink-500 text-white" },
    { id: "watched", label: "Watched", activeColor: "bg-blue-500 text-white" },
    { id: "disliked", label: "Disliked", activeColor: "bg-red-500 text-white" },
    { id: "skipped", label: "Skipped", activeColor: "bg-zinc-600 text-white" }
  ];

  return (
    <div className="p-5 sm:p-8 max-w-6xl mx-auto pb-32">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shadow-lg">
          <Bookmark className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h2 className="text-3xl font-black tracking-tight">Your Cinema Shelf</h2>
          <p className="text-white/40 text-sm font-semibold">Everything you've curated in your universe.</p>
        </div>
      </div>
      
      {/* Animated Tabs */}
      <div className="flex gap-2 p-1.5 bg-black/40 border border-white/5 rounded-2xl mb-8 overflow-x-auto snap-x [&::-webkit-scrollbar]:hidden backdrop-blur-xl shadow-inner relative z-10">
        {tabs.map((t) => {
          const isActive = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`relative shrink-0 py-2.5 px-5 rounded-xl text-xs sm:text-sm font-bold transition-colors snap-center z-20 ${isActive ? (t.activeColor.includes("text-black") ? "text-black" : "text-white") : "text-white/60 hover:text-white"}`}
            >
              {isActive && (
                <motion.div
                  layoutId="shelf-active-tab"
                  className={`absolute inset-0 rounded-xl ${t.activeColor} shadow-lg`}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  style={{ zIndex: -1 }}
                />
              )}
              {t.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-2 border-white/20 border-t-purple-500 rounded-full animate-spin mx-auto shadow-lg" />
        </div>
      ) : movies.length > 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 sm:gap-6"
        >
          <AnimatePresence>
            {movies.map(movie => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={`${movie.media_type}:${movie.id}`} 
                className="relative group cursor-pointer" 
                onClick={() => onDetails(movie)}
              >
                <div className="aspect-[2/3] bg-zinc-900 rounded-2xl overflow-hidden shadow-xl border border-white/10 group-hover:border-white/30 transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-white/10 relative z-10">
                  <img 
                    src={`${IMG_SM}${movie.poster_path}`} 
                    alt="" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                {/* Delete button */}
                <button 
                  onClick={(e) => { e.stopPropagation(); onRemove(movie.media_type, movie.id); }} 
                  className="absolute -top-3 -right-3 bg-red-500/90 hover:bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-xl z-20 backdrop-blur-md hover:scale-110"
                >
                  <X className="w-4 h-4" />
                </button>
                
                {/* Subtle glow behind card */}
                <div className="absolute inset-0 bg-white/20 blur-xl rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 z-0 scale-90" />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-24 bg-white/[0.02] rounded-3xl border border-white/5 border-dashed"
        >
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Popcorn className="w-8 h-8 text-white/20" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-white/70">Nothing here yet</h3>
          <p className="text-white/40 text-sm">Swipe right on some movies and they'll show up here.</p>
        </motion.div>
      )}
    </div>
  );
}
