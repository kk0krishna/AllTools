export interface Movie {
  id: number;
  title: string;
  name?: string;
  overview: string;
  backdrop_path: string;
  poster_path: string;
  media_type: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  release_date?: string;
  first_air_date?: string;
  genre_ids?: number[];
  runtime?: number;
}

export type InteractionState = "unseen" | "skipped" | "interested" | "watched" | "loved" | "disliked";

export interface UserPreferences {
  interactions: Record<string, InteractionState>; // Keyed by `${media_type}:${id}`
}

export interface UserProfile {
  name: string;
  favoriteGenres: number[];
  createdAt: string;
  genreAffinities?: Record<number, number>;
}

export type DiscoveryMode = "know-me" | "explore" | "surprise";

export interface ScoredMovie extends Movie {
  tasteMatch: number;     // 0–100 percentage
  whyReason: string;      // Data-driven explanation
  moodTags: string[];     // e.g. ["🧠 Mind-bending", "🌌 Epic"]
}

export interface LastAction {
  movieId: number;
  previousPrefs: UserPreferences;
  action: "skip" | "dislike" | "save" | "love" | "watched";
}

export const GENRE_MAP: Record<number, string> = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
  99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
  27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Sci-Fi",
  53: "Thriller", 10752: "War", 37: "Western"
};

export const GENRE_LIST = Object.entries(GENRE_MAP).map(([id, name]) => ({ id: Number(id), name }));

// Maps genre IDs to cinematic mood tags for the card UI
export const GENRE_MOOD_MAP: Record<number, string> = {
  878: "🧠 Mind-bending", 9648: "🕵️ Mysterious", 53: "🔥 Intense",
  28: "💥 Action-packed", 27: "😱 Terrifying", 18: "🎭 Emotional",
  35: "😂 Hilarious", 10749: "💕 Romantic", 14: "✨ Fantastical",
  12: "🌍 Adventurous", 80: "🔫 Gritty", 16: "🎨 Animated",
  99: "📽️ Documentary", 10751: "👨‍👩‍👧‍👦 Family", 36: "📜 Historical",
  10402: "🎵 Musical", 10752: "⚔️ War", 37: "🤠 Western"
};

export const DISCOVERY_MODES: { id: DiscoveryMode; emoji: string; label: string; description: string; novelty: number }[] = [
  { id: "know-me", emoji: "🎯", label: "Know Me", description: "High personalization", novelty: 0.0 },
  { id: "explore", emoji: "🧭", label: "Explore", description: "Adjacent discoveries", novelty: 0.35 },
  { id: "surprise", emoji: "🎲", label: "Surprise", description: "Expect the unexpected", novelty: 0.8 },
];

export interface MoodProfile {
  id: string;
  emoji: string;
  label: string;
  genres: number[];
  keywords?: string[];
  minRating: number;
  minVotes: number;
  novelty: number;
}

export const MOODS: MoodProfile[] = [
  { id: "think", emoji: "🌀", label: "Make me think", genres: [878, 9648, 18], minRating: 7.0, minVotes: 500, novelty: 0.25 },
  { id: "laugh", emoji: "😂", label: "Make me laugh", genres: [35], minRating: 6.5, minVotes: 300, novelty: 0.15 },
  { id: "cry", emoji: "😭", label: "Break my heart", genres: [18, 10749], minRating: 7.0, minVotes: 400, novelty: 0.2 },
  { id: "adrenaline", emoji: "🔥", label: "Adrenaline rush", genres: [28, 53], minRating: 6.5, minVotes: 500, novelty: 0.20 },
  { id: "escape", emoji: "🌌", label: "Escape reality", genres: [14, 878, 12], minRating: 6.8, minVotes: 500, novelty: 0.35 },
  { id: "mystery", emoji: "🕵️", label: "Solve a mystery", genres: [9648, 80], minRating: 7.0, minVotes: 400, novelty: 0.2 },
  { id: "scare", emoji: "😱", label: "Scare me", genres: [27], minRating: 6.0, minVotes: 300, novelty: 0.3 },
  { id: "chill", emoji: "😌", label: "Easy watch", genres: [35, 10751, 16], minRating: 6.5, minVotes: 200, novelty: 0.10 },
  { id: "date", emoji: "❤️", label: "Date night", genres: [10749, 35, 18], minRating: 6.8, minVotes: 400, novelty: 0.15 },
  { id: "surprise", emoji: "🎲", label: "Surprise me", genres: [], minRating: 6.0, minVotes: 100, novelty: 0.8 },
];
