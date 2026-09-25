import React from "react";
import { User } from "firebase/auth";
import { Movie, UserPreferences, InteractionState } from "../lib/types";
import { Button } from "@/components/ui/button";
import { X, Search } from "lucide-react";

const IMG_SM = "https://image.tmdb.org/t/p/w500";

interface MovieShelfProps {
  prefs: UserPreferences;
  onRemove: (mediaType: string, id: number) => void;
  onDetails: (movie: any) => void;
}

// Module level cache to speed up shelf switching
const shelfCache: Record<string, any> = {};

export function MovieShelf({ prefs, onRemove, onDetails }: MovieShelfProps) {
  const [tab, setTab] = React.useState<"interested" | "loved" | "watched">("interested");
  const [movies, setMovies] = React.useState<Movie[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchShelf = async () => {
      setLoading(true);
      const items = Object.entries(prefs.interactions || {})
        .filter(([_, state]) => state === tab)
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
      const results = await Promise.all(
        ids.map(async (item) => {
          if (shelfCache[item.key]) return shelfCache[item.key];
          try {
            const r = await fetch(`https://api.themoviedb.org/3/${item.mediaType}/${item.id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`);
            const data = await r.json();
            const movie = { ...data, media_type: item.mediaType };
            shelfCache[item.key] = movie;
            return movie;
          } catch(e) {
            return null;
          }
        })
      );
      setMovies(results.filter(Boolean));
      setLoading(false);
    };

    fetchShelf();
  }, [tab, prefs.interactions]);

  return (
    <div className="p-5 sm:p-8 max-w-5xl mx-auto pb-32">
      <h2 className="text-2xl font-black tracking-tight mb-4">Your Cinema Shelf</h2>
      
      <div className="flex gap-2 p-1.5 bg-black/40 border border-white/10 rounded-2xl mb-8 overflow-x-auto">
        <button onClick={() => setTab("interested")} className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${tab === "interested" ? "bg-white text-black shadow-lg" : "text-white/60 hover:text-white"}`}>For Later</button>
        <button onClick={() => setTab("loved")} className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${tab === "loved" ? "bg-pink-500 text-white shadow-lg" : "text-white/60 hover:text-white hover:text-pink-400"}`}>Loved</button>
        <button onClick={() => setTab("watched")} className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${tab === "watched" ? "bg-blue-500 text-white shadow-lg" : "text-white/60 hover:text-white hover:text-blue-400"}`}>Watched</button>
      </div>

      {loading ? (
        <div className="text-center py-20"><div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto" /></div>
      ) : movies.length > 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 sm:gap-5">
          {movies.map(movie => (
            <div key={`${movie.media_type}:${movie.id}`} className="relative group cursor-pointer" onClick={() => onDetails(movie)}>
              <div className="aspect-[2/3] bg-zinc-900 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg border border-white/5 group-hover:border-white/20 transition-all group-hover:-translate-y-1">
                <img src={`${IMG_SM}${movie.poster_path}`} alt="" className="w-full h-full object-cover" />
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); onRemove(movie.media_type, movie.id); }} 
                className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-xl"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/5">
          <p className="text-white/40 mb-4">Nothing here yet.</p>
        </div>
      )}
    </div>
  );
}
