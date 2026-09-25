/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Heart, X, Check, Info, ChevronLeft, ChevronRight, Bookmark, Star } from "lucide-react";
import { ToolComponentProps } from "@/tools/registry";
import { motion, AnimatePresence } from "framer-motion";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p/original";
const POSTER_BASE = "https://image.tmdb.org/t/p/w500";

interface Movie {
  id: number;
  title: string;
  name?: string;
  overview: string;
  backdrop_path: string;
  poster_path: string;
  media_type: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
}

interface UserPreferences {
  likes: number[];
  dislikes: number[];
  watched: number[];
  wantToWatch: number[];
}

const mockMovies: Movie[] = [
  {
    id: 1,
    title: "Inception",
    overview: "Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible: &quot;inception&quot;.",
    backdrop_path: "/8ZTVqvKdQ8emSGUEMjsS4yHAwrp.jpg",
    poster_path: "/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
    media_type: "movie",
    vote_average: 8.8,
    release_date: "2010-07-15",
  },
  {
    id: 2,
    title: "Interstellar",
    overview: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
    backdrop_path: "/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
    poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    media_type: "movie",
    vote_average: 8.6,
    release_date: "2014-11-05",
  },
  {
    id: 3,
    title: "The Dark Knight",
    overview: "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets.",
    backdrop_path: "/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg",
    poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    media_type: "movie",
    vote_average: 9.0,
    release_date: "2008-07-16",
  },
  {
    id: 4,
    title: "Stranger Things",
    name: "Stranger Things",
    overview: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl.",
    backdrop_path: "/56v2KjBlU4XaDp9xxcIGQp8cGIp.jpg",
    poster_path: "/49WJfeN0moxb9IPfGn8xXKSg7bp.jpg",
    media_type: "tv",
    vote_average: 8.6,
    first_air_date: "2016-07-15",
  }
];

export default function MovieVerse({ }: ToolComponentProps) {
  const { user, signInWithGoogle } = useAuth();
  const [trending, setTrending] = useState<Movie[]>([]);
  const [action, setAction] = useState<Movie[]>([]);
  const [comedy, setComedy] = useState<Movie[]>([]);
  const [heroMovie, setHeroMovie] = useState<Movie | null>(null);
  
  const [preferences, setPreferences] = useState<UserPreferences>({
    likes: [],
    dislikes: [],
    watched: [],
    wantToWatch: [],
  });

  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  async function loadPreferences() {
    if (!user) return;
    try {
      const docRef = doc(db, "user_movie_preferences", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPreferences(docSnap.data() as UserPreferences);
      } else {
        await setDoc(docRef, preferences);
      }
    } catch (e) {
      console.error("Error loading preferences:", e);
    }
  }

  async function fetchMovies() {
    setLoading(true);
    if (!API_KEY) {
      setTrending(mockMovies);
      setAction(mockMovies.slice().reverse());
      setComedy([mockMovies[1], mockMovies[3], mockMovies[0]]);
      setHeroMovie(mockMovies[0]);
      setLoading(false);
      return;
    }

    try {
      const [trendingRes, actionRes, comedyRes] = await Promise.all([
        fetch(`${BASE_URL}/trending/all/day?api_key=${API_KEY}`),
        fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=28`),
        fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=35`),
      ]);
      const trendingData = await trendingRes.json();
      const actionData = await actionRes.json();
      const comedyData = await comedyRes.json();

      setTrending(trendingData.results || mockMovies);
      setAction(actionData.results || []);
      setComedy(comedyData.results || []);
      if (trendingData.results && trendingData.results.length > 0) {
        setHeroMovie(trendingData.results[0]);
      } else {
        setHeroMovie(mockMovies[0]);
      }
    } catch (error) {
      console.error("Failed to fetch movies:", error);
      setTrending(mockMovies);
      setHeroMovie(mockMovies[0]);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    if (user) {
      loadPreferences();
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPreferences({ likes: [], dislikes: [], watched: [], wantToWatch: [] });
    }
  }, [user]);

  async function updatePreference(listType: keyof UserPreferences, movieId: number, add: boolean) {
    if (!user) {
      signInWithGoogle();
      return;
    }

    const currentList = preferences[listType] || [];
    let newList;
    if (add) {
      if (currentList.includes(movieId)) return;
      newList = [...currentList, movieId];
    } else {
      newList = currentList.filter(id => id !== movieId);
    }

    const newPreferences = { ...preferences, [listType]: newList };
    setPreferences(newPreferences);

    try {
      const docRef = doc(db, "user_movie_preferences", user.uid);
      await setDoc(docRef, newPreferences, { merge: true });
    } catch (e) {
      console.error("Error updating preferences:", e);
    }
  };



  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full bg-[#0a0a0a] text-white">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-4xl font-black tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-purple-600"
        >
          MOVIEVERSE
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-[#0a0a0a] text-white overflow-x-hidden font-sans pb-20 selection:bg-red-600/30 selection:text-white">
      {/* Hero Section */}
      <AnimatePresence>
        {heroMovie && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="relative w-full h-[75vh] md:h-[85vh] overflow-hidden"
          >
            <motion.div 
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 10, ease: "easeOut" }}
              className="absolute inset-0 w-full h-full"
            >
              <img 
                src={API_KEY ? `${IMAGE_BASE}${heroMovie.backdrop_path}` : heroMovie.backdrop_path}
                alt={heroMovie.title || heroMovie.name || "Movie Poster"}
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
            </motion.div>
            
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="absolute bottom-0 left-0 p-6 md:p-12 lg:p-24 w-full md:w-2/3 lg:w-1/2 z-10 flex flex-col gap-6"
            >
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white drop-shadow-2xl">
                {heroMovie.title || heroMovie.name}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-300 font-semibold uppercase tracking-wider">
                <span className="flex items-center gap-1 text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded">
                  <Star className="w-4 h-4 fill-current" /> {Math.round(heroMovie.vote_average * 10)}%
                </span>
                <span>{heroMovie.release_date?.substring(0, 4) || heroMovie.first_air_date?.substring(0, 4)}</span>
                <span className="border border-gray-600 px-2 py-1 rounded">{heroMovie.media_type || "movie"}</span>
              </div>
              <p className="text-gray-300 text-sm md:text-lg line-clamp-3 leading-relaxed drop-shadow-md max-w-2xl">
                {heroMovie.overview}
              </p>
              <div className="flex items-center gap-4 mt-2">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    onClick={() => setSelectedMovie(heroMovie)} 
                    className="bg-white text-black hover:bg-gray-200 font-bold rounded-full px-8 py-6 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                  >
                    <Info className="w-5 h-5 mr-2" /> More Info
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    onClick={() => updatePreference("wantToWatch", heroMovie.id, !preferences.wantToWatch.includes(heroMovie.id))}
                    variant="outline" 
                    className={`rounded-full px-8 py-6 backdrop-blur-md border-gray-500 text-white ${preferences.wantToWatch.includes(heroMovie.id) ? 'bg-purple-600/40 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 'bg-black/40 hover:bg-white/10'}`}
                  >
                    <Bookmark className={`w-5 h-5 mr-2 ${preferences.wantToWatch.includes(heroMovie.id) ? 'fill-current' : ''}`} /> 
                    {preferences.wantToWatch.includes(heroMovie.id) ? 'In Watchlist' : 'Watchlist'}
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-12 mt-8 md:-mt-20 relative z-20 px-6 md:px-12">
        <MovieRow title="Trending in the Verse" movies={trending} onSelect={setSelectedMovie} />
        {action.length > 0 && <MovieRow title="Adrenaline Rush" movies={action} onSelect={setSelectedMovie} />}
        {comedy.length > 0 && <MovieRow title="Laugh Out Loud" movies={comedy} onSelect={setSelectedMovie} />}
      </div>

      {/* Movie Details Modal */}
      <AnimatePresence>
        {selectedMovie && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-[#111] border border-white/10 w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl relative max-h-[95vh] flex flex-col"
            >
              <button 
                onClick={() => setSelectedMovie(null)}
                className="absolute top-4 right-4 z-50 bg-black/60 hover:bg-white/20 backdrop-blur-md text-white rounded-full p-2 transition-all"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="relative h-[40vh] shrink-0">
                <img 
                  src={API_KEY ? `${IMAGE_BASE}${selectedMovie.backdrop_path}` : selectedMovie.backdrop_path}
                  alt={selectedMovie.title || selectedMovie.name || "Movie Poster"}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-[#111]/60 to-transparent" />
              </div>
              
              <div className="p-6 md:p-10 relative -mt-24 z-10 flex flex-col md:flex-row gap-8 overflow-y-auto">
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex-shrink-0 w-40 md:w-56 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-xl overflow-hidden border border-white/10 bg-slate-900 mx-auto md:mx-0"
                >
                  {selectedMovie.poster_path ? (
                    <img 
                      src={API_KEY ? `${POSTER_BASE}${selectedMovie.poster_path}` : selectedMovie.poster_path} 
                      alt="Poster" 
                      className="w-full h-auto object-cover"
                    />
                  ) : (
                    <div className="w-full h-72 flex items-center justify-center text-slate-500">No Image</div>
                  )}
                </motion.div>
                
                <motion.div 
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex-grow flex flex-col"
                >
                  <h2 className="text-3xl md:text-5xl font-black mb-3 text-white">{selectedMovie.title || selectedMovie.name}</h2>
                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-8 font-medium">
                    <span className="flex items-center gap-1 text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded">
                      <Star className="w-4 h-4 fill-current" /> {Math.round(selectedMovie.vote_average * 10)}%
                    </span>
                    <span>{selectedMovie.release_date || selectedMovie.first_air_date}</span>
                    <span className="uppercase border border-white/20 px-2 py-0.5 rounded-sm tracking-wider text-xs">{selectedMovie.media_type || "Movie"}</span>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-4 mb-8">
                    <ActionBtn 
                      active={preferences.likes.includes(selectedMovie.id)} 
                      icon={<Heart className={`w-5 h-5 ${preferences.likes.includes(selectedMovie.id) ? 'fill-current' : ''}`} />} 
                      label="Love It" 
                      onClick={() => updatePreference("likes", selectedMovie.id, !preferences.likes.includes(selectedMovie.id))} 
                      color="pink"
                    />
                    <ActionBtn 
                      active={preferences.dislikes.includes(selectedMovie.id)} 
                      icon={<X className="w-5 h-5" />} 
                      label="Not For Me" 
                      onClick={() => updatePreference("dislikes", selectedMovie.id, !preferences.dislikes.includes(selectedMovie.id))} 
                      color="red"
                    />
                    <ActionBtn 
                      active={preferences.watched.includes(selectedMovie.id)} 
                      icon={<Check className={`w-5 h-5 ${preferences.watched.includes(selectedMovie.id) ? 'text-white' : ''}`} />} 
                      label="Watched" 
                      onClick={() => updatePreference("watched", selectedMovie.id, !preferences.watched.includes(selectedMovie.id))} 
                      color="green"
                    />
                    <ActionBtn 
                      active={preferences.wantToWatch.includes(selectedMovie.id)} 
                      icon={<Bookmark className={`w-5 h-5 ${preferences.wantToWatch.includes(selectedMovie.id) ? 'fill-current' : ''}`} />} 
                      label="Watchlist" 
                      onClick={() => updatePreference("wantToWatch", selectedMovie.id, !preferences.wantToWatch.includes(selectedMovie.id))} 
                      color="purple"
                    />
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                      <Info className="w-5 h-5 text-gray-400" /> Storyline
                    </h3>
                    <p className="text-gray-400 leading-relaxed text-sm md:text-base font-medium">
                      {selectedMovie.overview}
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MovieRow({ title, movies, onSelect }: { title: string, movies: Movie[], onSelect: (m: Movie) => void }) {
  const rowRef = useRef<HTMLDivElement>(null);
  
  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth * 0.75 : scrollLeft + clientWidth * 0.75;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col gap-4 group/row">
      <h2 className="text-2xl md:text-3xl font-bold text-white/90 group-hover/row:text-white transition-colors px-4 md:px-0">
        {title}
      </h2>
      <div className="relative group/scroll">
        <button 
          onClick={() => scroll('left')}
          className="absolute left-0 top-0 bottom-0 z-40 w-16 bg-gradient-to-r from-[#0a0a0a] to-transparent text-white flex items-center justify-start pl-2 opacity-0 group-hover/scroll:opacity-100 transition-opacity"
        >
          <div className="bg-black/50 p-2 rounded-full backdrop-blur-sm hover:bg-white/20 transition-colors">
            <ChevronLeft className="w-8 h-8" />
          </div>
        </button>
        
        <div 
          ref={rowRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide py-6 px-4 md:px-0 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map((movie, idx) => (
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={movie.id} 
              className="relative flex-none w-[150px] md:w-[220px] snap-start cursor-pointer origin-bottom"
              onClick={() => onSelect(movie)}
              whileHover={{ scale: 1.08, zIndex: 50, y: -10 }}
            >
              <div className="aspect-[2/3] rounded-xl overflow-hidden bg-slate-800 shadow-lg border border-white/5 group-hover/row:border-white/10 transition-colors">
                {movie.poster_path ? (
                  <img 
                    src={API_KEY ? `${POSTER_BASE}${movie.poster_path}` : movie.poster_path}
                    alt={movie.title || movie.name || "Movie Poster"}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500 font-medium p-4 text-center">
                    {movie.title || movie.name}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-4">
                  <p className="text-white font-bold text-sm truncate">{movie.title || movie.name}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <button 
          onClick={() => scroll('right')}
          className="absolute right-0 top-0 bottom-0 z-40 w-16 bg-gradient-to-l from-[#0a0a0a] to-transparent text-white flex items-center justify-end pr-2 opacity-0 group-hover/scroll:opacity-100 transition-opacity"
        >
          <div className="bg-black/50 p-2 rounded-full backdrop-blur-sm hover:bg-white/20 transition-colors">
            <ChevronRight className="w-8 h-8" />
          </div>
        </button>
      </div>
    </div>
  );
}

function ActionBtn({ active, icon, label, onClick, color }: { active: boolean, icon: React.ReactNode, label: string, onClick: () => void, color: "pink" | "red" | "green" | "purple" }) {
  const baseClass = "flex items-center gap-2 px-5 py-2.5 rounded-full font-bold transition-all duration-300 text-sm border shadow-sm";
  
  const colors = {
    pink: { active: "bg-pink-500 border-pink-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.5)]", inactive: "hover:border-pink-500 hover:text-pink-400" },
    red: { active: "bg-red-500 border-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]", inactive: "hover:border-red-500 hover:text-red-400" },
    green: { active: "bg-green-500 border-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.5)]", inactive: "hover:border-green-500 hover:text-green-400" },
    purple: { active: "bg-purple-500 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]", inactive: "hover:border-purple-500 hover:text-purple-400" },
  };

  const activeClass = colors[color].active;
  const inactiveClass = `bg-white/5 border-white/10 text-gray-300 ${colors[color].inactive} hover:bg-white/10`;

  return (
    <motion.button 
      whileHover={{ scale: 1.05 }} 
      whileTap={{ scale: 0.95 }}
      onClick={onClick} 
      className={`${baseClass} ${active ? activeClass : inactiveClass}`}
    >
      {icon}
      {label}
    </motion.button>
  );
}
