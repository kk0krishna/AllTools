import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useTransform, PanInfo, useMotionValueEvent } from "framer-motion";
import { Sparkles, Info, Star } from "lucide-react";
import { Movie, ScoredMovie, GENRE_MAP } from "../lib/types";

const IMG_BG = "https://image.tmdb.org/t/p/w780";
const IMG_POSTER = "https://image.tmdb.org/t/p/w500";

interface SwipeableCardProps {
  movie: Movie | ScoredMovie;
  whyText: string | null;
  onInfoClick: () => void;
  onSwipe: (direction: "left" | "right" | "up" | "down") => void;
  isTop: boolean;
  isBackground: boolean;
}

function isScoredMovie(m: Movie | ScoredMovie): m is ScoredMovie {
  return 'tasteMatch' in m;
}

export function SwipeableCard({
  movie, whyText, onInfoClick, onSwipe, isTop, isBackground
}: SwipeableCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotate = useTransform(x, [-200, 200], [-12, 12]);
  
  // Progressively stronger directional labels
  const likeOpacity = useTransform(x, [20, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-20, -100], [0, 1]);
  const saveOpacity = useTransform(y, [-20, -100], [0, 1]);
  const skipOpacity = useTransform(y, [20, 100], [0, 1]);

  // Micro-feedback text for drag threshold
  const [dragFeedback, setDragFeedback] = useState("");

  useMotionValueEvent(x, "change", (latest) => {
    if (!isTop) return;
    if (latest > 100) setDragFeedback("Yep. This is your type.");
    else if (latest > 40) setDragFeedback("You're probably going to like this.");
    else if (latest < -100) setDragFeedback("Never seeing this.");
    else if (latest < -40) setDragFeedback("Not your vibe.");
    else if (Math.abs(y.get()) < 40) setDragFeedback("");
  });

  useMotionValueEvent(y, "change", (latest) => {
    if (!isTop || Math.abs(x.get()) > Math.abs(latest)) return;
    if (latest < -100) setDragFeedback("Added to your shelf!");
    else if (latest < -40) setDragFeedback("Save for later?");
    else if (latest > 100) setDragFeedback("Skipping for now.");
    else if (latest > 40) setDragFeedback("Maybe next time.");
    else if (Math.abs(x.get()) < 40) setDragFeedback("");
  });

  function handleDragEnd(_: any, info: PanInfo) {
    const { offset, velocity } = info;
    const isHorizontal = Math.abs(offset.x) > Math.abs(offset.y);

    if (isHorizontal) {
      if (offset.x > 80 || velocity.x > 500) return onSwipe("right");
      if (offset.x < -80 || velocity.x < -500) return onSwipe("left");
    } else {
      if (offset.y < -80 || velocity.y < -500) return onSwipe("up");
      if (offset.y > 80 || velocity.y > 500) return onSwipe("down");
    }
    
    // Reset feedback if snap back
    setDragFeedback("");
  }

  const title = movie.title || movie.name || "";
  const year = movie.release_date?.substring(0, 4) || movie.first_air_date?.substring(0, 4) || "";
  const genres = (movie.genre_ids || []).slice(0, 3).map(id => GENRE_MAP[id]).filter(Boolean);
  const tasteMatch = isScoredMovie(movie) ? movie.tasteMatch : null;
  const moodTags = isScoredMovie(movie) ? movie.moodTags : [];

  // Determine match badge color based on percentage
  const matchColor = tasteMatch 
    ? tasteMatch >= 85 ? "from-emerald-400 to-green-500" 
    : tasteMatch >= 70 ? "from-yellow-400 to-amber-500" 
    : "from-blue-400 to-cyan-500"
    : "";

  return (
    <motion.div
      drag={isTop} 
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }} 
      dragElastic={0.9}
      onDragEnd={handleDragEnd} 
      style={{ x, y, rotate }}
      initial={{ scale: 0.95, opacity: 0, y: 20 }} 
      animate={{ scale: 1, opacity: 1, y: 0 }} 
      exit={
        x.get() > 50 ? { x: 500, opacity: 0, rotate: 20 } :
        x.get() < -50 ? { x: -500, opacity: 0, rotate: -20 } :
        y.get() < -50 ? { y: -500, opacity: 0 } :
        y.get() > 50 ? { y: 500, opacity: 0 } :
        { opacity: 0, scale: 0.9 } // fallback
      }
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`absolute inset-0 w-full h-full rounded-3xl overflow-hidden shadow-2xl shadow-black/50 ${isTop ? "cursor-grab active:cursor-grabbing" : ""} touch-none select-none bg-zinc-900`}
    >
      {/* Backdrop image — cinematic full-card background */}
      {movie.backdrop_path && (
        <img 
          src={`${IMG_BG}${movie.backdrop_path}`} 
          alt="" 
          className="absolute inset-0 w-full h-full object-cover" 
          draggable={false} 
          loading={isTop ? "eager" : "lazy"}
          decoding="async"
        />
      )}

      {/* Fallback to poster if no backdrop */}
      {!movie.backdrop_path && movie.poster_path && (
        <img 
          src={`${IMG_POSTER}${movie.poster_path}`} 
          alt="" 
          className="absolute inset-0 w-full h-full object-cover" 
          aria-hidden 
        />
      )}
      
      {/* Cinematic gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/70 to-black/20" />

      {/* Progressive Swipe indicators */}
      {isTop && (
        <>
          <motion.div style={{ opacity: likeOpacity }} className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-30 pt-12">
            <div className="text-4xl sm:text-5xl font-black text-pink-400 border-4 border-pink-400 rounded-2xl px-5 py-2 -rotate-12 bg-pink-400/10 backdrop-blur-sm shadow-2xl">LOVE</div>
            <p className="mt-4 text-pink-400 font-bold text-lg bg-black/40 px-4 py-1 rounded-full backdrop-blur-md">{dragFeedback}</p>
          </motion.div>
          <motion.div style={{ opacity: nopeOpacity }} className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-30 pt-12">
            <div className="text-4xl sm:text-5xl font-black text-red-500 border-4 border-red-500 rounded-2xl px-5 py-2 rotate-12 bg-red-500/10 backdrop-blur-sm shadow-2xl">NOPE</div>
            <p className="mt-4 text-red-400 font-bold text-lg bg-black/40 px-4 py-1 rounded-full backdrop-blur-md">{dragFeedback}</p>
          </motion.div>
          <motion.div style={{ opacity: saveOpacity }} className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-30 pt-12">
            <div className="text-4xl sm:text-5xl font-black text-purple-400 border-4 border-purple-400 rounded-2xl px-5 py-2 bg-purple-400/10 backdrop-blur-sm shadow-2xl">SAVE</div>
            <p className="mt-4 text-purple-400 font-bold text-lg bg-black/40 px-4 py-1 rounded-full backdrop-blur-md">{dragFeedback}</p>
          </motion.div>
          <motion.div style={{ opacity: skipOpacity }} className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-30 pt-12">
            <div className="text-4xl sm:text-5xl font-black text-white/80 border-4 border-white/80 rounded-2xl px-5 py-2 bg-white/10 backdrop-blur-sm shadow-2xl">SKIP</div>
            <p className="mt-4 text-white font-bold text-lg bg-black/40 px-4 py-1 rounded-full backdrop-blur-md">{dragFeedback}</p>
          </motion.div>
        </>
      )}

      {/* Content overlay */}
      {isTop && (
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 z-20 pointer-events-auto">
          
          {/* Taste Match Badge */}
          {tasteMatch && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ delay: 0.2 }}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r ${matchColor} text-black text-xs font-black mb-2 shadow-lg`}
            >
              <Sparkles className="w-3 h-3" /> {tasteMatch}% Match
            </motion.div>
          )}

          {/* Why text */}
          {whyText && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-[10px] text-white/70 font-bold mb-2 flex items-center gap-1 uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-yellow-400" /> {whyText}
            </motion.p>
          )}

          {/* Title */}
          <h2 className="text-2xl sm:text-3xl font-black leading-none tracking-tight mb-3 drop-shadow-lg">{title}</h2>
          
          {/* Metadata chips */}
          <div className="flex items-center gap-2 text-xs text-white/70 font-semibold mb-2 flex-wrap">
            <span className="flex items-center gap-1 text-yellow-400 bg-white/5 border border-white/10 px-2 py-1 rounded-full backdrop-blur-md">
              <Star className="w-3 h-3 fill-current" /> {Math.round(movie.vote_average * 10)}%
            </span>
            {year && <span className="bg-white/5 border border-white/10 px-2 py-1 rounded-full backdrop-blur-md">{year}</span>}
            {genres.map(g => <span key={g} className="bg-white/5 border border-white/10 px-2 py-1 rounded-full backdrop-blur-md">{g}</span>)}
          </div>

          {/* Mood tags */}
          {moodTags.length > 0 && (
            <div className="flex items-center gap-2 text-xs mb-4 flex-wrap">
              {moodTags.map(tag => (
                <span key={tag} className="bg-white/10 px-2.5 py-1 rounded-full backdrop-blur-md text-white font-semibold">{tag}</span>
              ))}
            </div>
          )}

          <button 
            onPointerDownCapture={(e) => e.stopPropagation()} 
            onClick={(e) => { e.stopPropagation(); onInfoClick(); }} 
            className="w-full text-xs text-white hover:text-white font-bold flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 px-4 py-3 rounded-xl backdrop-blur-md transition-colors"
          >
            <Info className="w-4 h-4" /> View Details & Trailer
          </button>
        </div>
      )}
    </motion.div>
  );
}
