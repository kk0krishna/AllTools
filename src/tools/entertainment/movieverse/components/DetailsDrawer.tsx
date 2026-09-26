import React, { useEffect, useState } from "react";
import { motion, useAnimation, PanInfo } from "framer-motion";
import { X, Star, Bookmark, Eye, Popcorn, Heart, Sparkles, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Movie, ScoredMovie, UserPreferences, GENRE_MAP, GENRE_MOOD_MAP } from "../lib/types";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE = "https://api.themoviedb.org/3";
const IMG_BG = "https://image.tmdb.org/t/p/w780";
const IMG_SM = "https://image.tmdb.org/t/p/w342";

function isScoredMovie(m: Movie | ScoredMovie): m is ScoredMovie {
  return 'tasteMatch' in m;
}

interface DetailsDrawerProps {
  movie: Movie | ScoredMovie;
  prefs: UserPreferences;
  mediaType: "movie" | "tv";
  onClose: () => void;
  onSave: () => void;
  onWatched: () => void;
  onLove?: () => void;
}

interface MovieDetails {
  runtime?: number;
  number_of_seasons?: number;
  genres?: { id: number; name: string }[];
  credits?: { cast: { id: number; name: string; character: string; profile_path: string | null }[] };
  similar?: { results: Movie[] };
}

export function DetailsDrawer({ movie, prefs, mediaType, onClose, onSave, onWatched, onLove }: DetailsDrawerProps) {
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState<MovieDetails | null>(null);
  const [showTrailer, setShowTrailer] = useState(false);
  
  const controls = useAnimation();

  useEffect(() => {
    if (!API_KEY) { setLoading(false); return; }
    const controller = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      try {
        const [videosRes, detailsRes] = await Promise.all([
          fetch(`${BASE}/${mediaType}/${movie.id}/videos?api_key=${API_KEY}`, { signal: controller.signal }),
          fetch(`${BASE}/${mediaType}/${movie.id}?api_key=${API_KEY}&append_to_response=credits,similar`, { signal: controller.signal })
        ]);

        const videosData = await videosRes.json();
        const detailsData = await detailsRes.json();

        if (!controller.signal.aborted) {
          const videos = videosData.results || [];
          const trailer = videos.find((v: any) => v.type === "Trailer" && v.site === "YouTube") 
                       || videos.find((v: any) => v.site === "YouTube");
          if (trailer) setTrailerKey(trailer.key);
          setDetails(detailsData);
        }
      } catch (e) {
        if ((e as any)?.name !== 'AbortError') console.error(e);
      }
      if (!controller.signal.aborted) setLoading(false);
    };

    fetchData();
    return () => controller.abort();
  }, [movie.id, mediaType]);

  const handleDragEnd = async (_: any, info: PanInfo) => {
    if (info.offset.y > 150 || info.velocity.y > 500) {
      await controls.start({ y: "100%", transition: { duration: 0.2 } });
      onClose();
    } else {
      controls.start({ y: 0, transition: { type: "spring", stiffness: 400, damping: 40 } });
    }
  };

  const title = movie.title || movie.name || "";
  const year = movie.release_date?.substring(0, 4) || movie.first_air_date?.substring(0, 4) || "";
  const interactionKey = `${mediaType}:${movie.id}`;
  const currentState = prefs.interactions[interactionKey];
  const tasteMatch = isScoredMovie(movie) ? movie.tasteMatch : null;
  const moodTags = isScoredMovie(movie) 
    ? movie.moodTags 
    : (movie.genre_ids || []).map(g => GENRE_MOOD_MAP[g]).filter(Boolean).slice(0, 3);
  const genres = details?.genres?.map(g => g.name) || (movie.genre_ids || []).map(g => GENRE_MAP[g]).filter(Boolean);
  const runtime = details?.runtime 
    ? `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m`
    : details?.number_of_seasons
      ? `${details.number_of_seasons} Season${details.number_of_seasons > 1 ? 's' : ''}`
      : null;
  const cast = details?.credits?.cast?.filter(c => c.profile_path).slice(0, 8) || [];
  const similar = details?.similar?.results?.filter(m => m.poster_path).slice(0, 8) || [];

  const matchColor = tasteMatch 
    ? tasteMatch >= 85 ? "from-emerald-400 to-green-500" 
    : tasteMatch >= 70 ? "from-yellow-400 to-amber-500" 
    : "from-blue-400 to-cyan-500"
    : "";

  return (
    <motion.div 
      initial={{ y: "100%" }} 
      animate={controls}
      onAnimationComplete={(def) => { if (def === undefined) controls.start({ y: 0 }) }}
      exit={{ y: "100%", transition: { duration: 0.2 } }} 
      transition={{ type: "spring", stiffness: 350, damping: 35 }}
      drag="y"
      dragConstraints={{ top: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      className="fixed inset-x-0 bottom-0 top-0 sm:top-10 z-[10000] bg-[#0a0a0a] overflow-y-auto sm:rounded-t-3xl shadow-[0_-20px_50px_rgba(0,0,0,0.5)] border-t border-white/10"
    >
      {/* Drag Handle for mobile/desktop */}
      <div className="absolute top-0 inset-x-0 h-10 flex justify-center items-start pt-3 z-50 pointer-events-none">
        <div className="w-12 h-1.5 bg-white/30 rounded-full backdrop-blur-md" />
      </div>

      {/* Hero Section — Backdrop or Trailer */}
      <div className="relative aspect-video w-full bg-black">
        {showTrailer && trailerKey ? (
          <iframe 
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&modestbranding=1&rel=0`} 
            className="absolute inset-0 w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <>
            {movie.backdrop_path ? (
              <img src={`${IMG_BG}${movie.backdrop_path}`} alt="" className="absolute inset-0 w-full h-full object-cover" />
            ) : movie.poster_path ? (
              <img src={`${IMG_BG}${movie.poster_path}`} alt="" className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
                <Popcorn className="w-16 h-16 text-white/10" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-black/20" />
            
            {/* Play trailer button overlaid on backdrop */}
            {trailerKey && (
              <button 
                onClick={(e) => { e.stopPropagation(); setShowTrailer(true); }}
                className="absolute inset-0 flex items-center justify-center group pointer-events-auto"
              >
                <div className="w-16 h-16 bg-white/20 group-hover:bg-white/30 backdrop-blur-xl rounded-full flex items-center justify-center transition-all group-hover:scale-110 shadow-2xl border border-white/20">
                  <svg className="w-7 h-7 text-white ml-1 drop-shadow-md" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </div>
              </button>
            )}
            
            {loading && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              </div>
            )}
          </>
        )}
        
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 w-10 h-10 bg-black/40 hover:bg-black/60 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center transition-all z-50 pointer-events-auto hover:scale-110"
        >
          <ChevronDown className="w-5 h-5 text-white" />
        </button>
      </div>
      
      {/* Content */}
      <div className="p-6 sm:p-10 max-w-4xl mx-auto -mt-6 relative z-10 pointer-events-auto">
        {/* Taste Match + Mood Tags */}
        <div className="flex items-center gap-2 flex-wrap mb-4">
          {tasteMatch && (
            <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r ${matchColor} text-black text-xs font-black shadow-lg`}>
              <Sparkles className="w-3.5 h-3.5" /> {tasteMatch}% Match
            </span>
          )}
          {moodTags.map(tag => (
            <span key={tag} className="bg-white/10 border border-white/10 px-3 py-1.5 rounded-full text-xs text-white font-bold backdrop-blur-md">{tag}</span>
          ))}
        </div>

        {/* Title */}
        <h2 className="text-4xl sm:text-5xl font-black mb-4 leading-tight tracking-tight drop-shadow-lg">{title}</h2>
        
        {/* Metadata Row */}
        <div className="flex items-center gap-3 text-sm text-white/60 mb-8 font-bold flex-wrap">
          <span className="flex items-center gap-1 text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded-md"><Star className="w-4 h-4 fill-current" /> {Math.round(movie.vote_average * 10)}%</span>
          {year && <span>{year}</span>}
          {runtime && <span>{runtime}</span>}
          <div className="w-1 h-1 bg-white/30 rounded-full hidden sm:block" />
          {genres.slice(0, 4).map(g => <span key={g} className="bg-white/5 border border-white/10 px-2.5 py-1 rounded-md">{g}</span>)}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-10">
          <div>
            {/* Synopsis */}
            {movie.overview && (
              <div className="mb-10">
                <h3 className="text-sm font-black text-white/40 uppercase tracking-widest mb-3">Synopsis</h3>
                <p className="text-white/70 leading-relaxed text-base sm:text-lg font-medium">{movie.overview}</p>
              </div>
            )}
            
            {/* Cast */}
            {cast.length > 0 && (
              <div className="mb-10">
                <h3 className="text-sm font-black text-white/40 uppercase tracking-widest mb-4">Top Cast</h3>
                <div className="flex gap-4 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden -mx-6 px-6 sm:mx-0 sm:px-0">
                  {cast.map(person => (
                    <div key={person.id} className="shrink-0 text-center w-16 sm:w-20">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-zinc-900 mx-auto mb-2 overflow-hidden border border-white/10 shadow-lg">
                        <img src={`https://image.tmdb.org/t/p/w185${person.profile_path}`} alt="" className="w-full h-full object-cover" />
                      </div>
                      <p className="text-xs font-bold text-white/90 truncate">{person.name}</p>
                      <p className="text-[10px] font-semibold text-white/40 truncate">{person.character}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            {/* Action Buttons Panel */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-5 mb-8 backdrop-blur-xl">
              <h3 className="text-sm font-black text-white/40 uppercase tracking-widest mb-4 text-center">Actions</h3>
              <div className="flex flex-col gap-3">
                <Button 
                  onClick={onSave} 
                  disabled={currentState === "interested"} 
                  className={`font-bold rounded-xl h-12 text-sm w-full transition-all ${currentState === "interested" ? "bg-purple-600/30 text-white/50 border border-purple-500/20" : "bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/20"}`}
                >
                  <Bookmark className={`w-4 h-4 mr-2 ${currentState === "interested" ? "fill-current" : ""}`} /> {currentState === "interested" ? "Saved to Shelf" : "Save to Shelf"}
                </Button>
                {onLove && (
                  <Button 
                    onClick={onLove} 
                    disabled={currentState === "loved"} 
                    className={`font-bold rounded-xl h-12 text-sm w-full transition-all ${currentState === "loved" ? "bg-pink-600/30 text-white/50 border border-pink-500/20" : "bg-pink-600 hover:bg-pink-500 text-white shadow-lg shadow-pink-500/20"}`}
                  >
                    <Heart className={`w-4 h-4 mr-2 ${currentState === "loved" ? "fill-current" : ""}`} /> {currentState === "loved" ? "Loved" : "Love"}
                  </Button>
                )}
                <Button 
                  onClick={onWatched} 
                  disabled={["watched", "loved", "disliked"].includes(currentState)} 
                  className={`font-bold rounded-xl h-12 text-sm w-full transition-all ${["watched", "loved", "disliked"].includes(currentState) ? "bg-blue-600/30 text-white/50 border border-blue-500/20" : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20"}`}
                >
                  <Eye className={`w-4 h-4 mr-2 ${["watched", "loved", "disliked"].includes(currentState) ? "text-blue-400" : ""}`} /> {["watched", "loved", "disliked"].includes(currentState) ? "Watched" : "Mark Watched"}
                </Button>
              </div>
            </div>

            {/* Similar Movies (Sidebar on desktop) */}
            {similar.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-black text-white/40 uppercase tracking-widest mb-4">More like this</h3>
                <div className="grid grid-cols-2 gap-3">
                  {similar.slice(0, 4).map(sm => (
                    <div key={sm.id} className="group relative rounded-xl overflow-hidden aspect-[2/3] bg-zinc-900 shadow-lg border border-white/10">
                      <img src={`${IMG_SM}${sm.poster_path}`} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
                      <div className="absolute bottom-2 inset-x-2">
                        <p className="text-[10px] font-bold text-white truncate leading-tight mb-0.5">{sm.title || sm.name}</p>
                        <p className="text-[9px] font-bold text-yellow-400 flex items-center"><Star className="w-2.5 h-2.5 fill-current mr-0.5" /> {Math.round(sm.vote_average * 10)}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
