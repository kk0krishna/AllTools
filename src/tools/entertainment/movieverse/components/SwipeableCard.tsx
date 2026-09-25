import React from "react";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { Sparkles, Info, Star } from "lucide-react";
import { Movie, GENRE_MAP } from "../lib/types";
import Image from "next/image";

const IMG_BG = "https://image.tmdb.org/t/p/w780";
const IMG_POSTER = "https://image.tmdb.org/t/p/w500";
const IMG_TINY = "https://image.tmdb.org/t/p/w185";

interface SwipeableCardProps {
  movie: Movie;
  whyText: string | null;
  onInfoClick: () => void;
  onSwipe: (direction: "left" | "right" | "up" | "down") => void;
  isTop: boolean;
  isBackground: boolean;
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
  }

  const title = movie.title || movie.name || "";
  const year = movie.release_date?.substring(0, 4) || movie.first_air_date?.substring(0, 4) || "";
  const genres = (movie.genre_ids || []).slice(0, 3).map(id => GENRE_MAP[id]).filter(Boolean);



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
      {/* Base placeholder */}
      {movie.poster_path && (
        <img 
          src={`${IMG_POSTER}${movie.poster_path}`} 
          alt="" 
          className="absolute inset-0 w-full h-full object-cover" 
          aria-hidden 
        />
      )}
      
      {/* High-res image loaded over top */}
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
      
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

      {/* Progressive Swipe indicators */}
      {isTop && (
        <>
          <motion.div style={{ opacity: likeOpacity }} className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
            <div className="text-4xl sm:text-5xl font-black text-pink-400 border-4 border-pink-400 rounded-2xl px-5 py-2 -rotate-12 bg-pink-400/10 backdrop-blur-sm shadow-2xl">LOVE</div>
          </motion.div>
          <motion.div style={{ opacity: nopeOpacity }} className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
            <div className="text-4xl sm:text-5xl font-black text-red-500 border-4 border-red-500 rounded-2xl px-5 py-2 rotate-12 bg-red-500/10 backdrop-blur-sm shadow-2xl">NOPE</div>
          </motion.div>
          <motion.div style={{ opacity: saveOpacity }} className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
            <div className="text-4xl sm:text-5xl font-black text-purple-400 border-4 border-purple-400 rounded-2xl px-5 py-2 bg-purple-400/10 backdrop-blur-sm shadow-2xl">SAVE</div>
          </motion.div>
          <motion.div style={{ opacity: skipOpacity }} className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
            <div className="text-4xl sm:text-5xl font-black text-white/80 border-4 border-white/80 rounded-2xl px-5 py-2 bg-white/10 backdrop-blur-sm shadow-2xl">SKIP</div>
          </motion.div>
        </>
      )}

      {/* Content */}
      {isTop && (
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 z-20 pointer-events-auto">
          {whyText && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] text-white/60 font-bold mb-2 flex items-center gap-1 uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-yellow-400" /> {whyText}
            </motion.p>
          )}
          <h2 className="text-2xl sm:text-3xl font-black leading-none tracking-tight mb-3 drop-shadow-lg">{title}</h2>
          
          <div className="flex items-center gap-2 text-xs text-white/70 font-semibold mb-3 flex-wrap">
            <span className="flex items-center gap-1 text-yellow-400 bg-black/40 px-2 py-1 rounded-full backdrop-blur-md">
              <Star className="w-3 h-3 fill-current" /> {Math.round(movie.vote_average * 10)}%
            </span>
            {year && <span className="bg-black/40 px-2 py-1 rounded-full backdrop-blur-md">{year}</span>}
            {genres.map(g => <span key={g} className="bg-black/40 px-2 py-1 rounded-full backdrop-blur-md">{g}</span>)}
          </div>

          <button onClick={(e) => { e.stopPropagation(); onInfoClick(); }} className="text-[10px] text-white/40 hover:text-white font-bold flex items-center gap-1 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-md transition-colors">
            <Info className="w-3 h-3" /> Details & Trailer
          </button>
        </div>
      )}
    </motion.div>
  );
}
