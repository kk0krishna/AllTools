import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X, Star, Bookmark, Eye, Popcorn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Movie, UserPreferences } from "../lib/types";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE = "https://api.themoviedb.org/3";

interface DetailsDrawerProps {
  movie: Movie;
  prefs: UserPreferences;
  mediaType: "movie" | "tv";
  onClose: () => void;
  onSave: () => void;
  onWatched: () => void;
}

export function DetailsDrawer({ movie, prefs, mediaType, onClose, onSave, onWatched }: DetailsDrawerProps) {
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!API_KEY) return;
    setLoading(true);
    fetch(`${BASE}/${mediaType}/${movie.id}/videos?api_key=${API_KEY}`)
      .then(r => r.json())
      .then(data => {
        const videos = data.results || [];
        const trailer = videos.find((v: any) => v.type === "Trailer" && v.site === "YouTube") || videos.find((v: any) => v.site === "YouTube");
        if (trailer) setTrailerKey(trailer.key);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [movie.id]);

  return (
    <motion.div 
      initial={{ y: "100%" }} 
      animate={{ y: 0 }} 
      exit={{ y: "100%" }} 
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed inset-x-0 bottom-0 top-14 z-[10000] bg-[#0a0a0a] overflow-y-auto"
    >
      <div className="relative aspect-video w-full bg-black">
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mb-4" />
          </div>
        ) : trailerKey ? (
          <iframe 
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&modestbranding=1&rel=0`} 
            className="absolute inset-0 w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Popcorn className="w-12 h-12 text-white/20 mb-4" />
            <p className="text-white/40 text-sm">No trailer available</p>
          </div>
        )}
        
        <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/80 backdrop-blur-md rounded-full flex items-center justify-center transition-colors z-10">
          <X className="w-5 h-5 text-white" />
        </button>
      </div>
      
      <div className="p-6">
        <h2 className="text-3xl font-black mb-2">{movie.title || movie.name}</h2>
        <div className="flex items-center gap-3 text-sm text-white/60 mb-6 font-semibold">
          <span className="flex items-center gap-1 text-yellow-400"><Star className="w-4 h-4 fill-current" /> {Math.round(movie.vote_average * 10)}%</span>
          <span>{movie.release_date?.substring(0,4) || movie.first_air_date?.substring(0,4)}</span>
        </div>
        
        <h3 className="text-lg font-bold mb-2">Synopsis</h3>
        <p className="text-white/60 leading-relaxed mb-8">{movie.overview}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Button onClick={onSave} disabled={prefs.interactions[`${mediaType}:${movie.id}`] === "interested"} className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold rounded-xl h-14">
            <Bookmark className="w-5 h-5 mr-2" /> {prefs.interactions[`${mediaType}:${movie.id}`] === "interested" ? "Saved" : "Save to Shelf"}
          </Button>
          <Button onClick={onWatched} disabled={prefs.interactions[`${mediaType}:${movie.id}`] === "watched"} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl h-14">
            <Eye className="w-5 h-5 mr-2" /> {prefs.interactions[`${mediaType}:${movie.id}`] === "watched" ? "Watched" : "Mark Watched"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
