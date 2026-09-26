import { Movie, UserPreferences, UserProfile, MOODS, ScoredMovie, GENRE_MAP, GENRE_MOOD_MAP, DiscoveryMode } from "./types";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE = "https://api.themoviedb.org/3";

// In-memory TMDB response cache to avoid redundant fetches
const responseCache = new Map<string, { data: any; ts: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function cachedFetch(url: string): Promise<any> {
  const cached = responseCache.get(url);
  if (cached && Date.now() - cached.ts < CACHE_TTL) return cached.data;
  
  const res = await fetch(url);
  const data = await res.json();
  responseCache.set(url, { data, ts: Date.now() });
  
  // Evict old entries to prevent memory bloat
  if (responseCache.size > 100) {
    const oldest = [...responseCache.entries()]
      .sort((a, b) => a[1].ts - b[1].ts)
      .slice(0, 20);
    oldest.forEach(([key]) => responseCache.delete(key));
  }
  
  return data;
}

export class MovieEngine {
  
  static async fetchCandidates(
    moodId: string | null,
    genreFilter: number[],
    prefs: UserPreferences,
    profile: UserProfile | null,
    mediaType: "movie" | "tv" | "both" = "movie",
    discoveryMode: DiscoveryMode = "explore"
  ): Promise<ScoredMovie[]> {
    if (!API_KEY) return [];

    if (mediaType === "both") {
      const [movies, tvs] = await Promise.all([
        this.fetchCandidates(moodId, genreFilter, prefs, profile, "movie", discoveryMode),
        this.fetchCandidates(moodId, genreFilter, prefs, profile, "tv", discoveryMode)
      ]);
      // Interleave by alternating types, sorted by tasteMatch within groups
      const combined = [...movies, ...tvs].sort((a, b) => b.tasteMatch - a.tasteMatch);
      return combined;
    }

    const mood = MOODS.find(m => m.id === moodId);
    const activeGenres = genreFilter.length > 0 ? genreFilter : (mood?.genres || []);
    const minRating = mood?.minRating ?? 6.0;
    const minVotes = mood?.minVotes ?? 300;
    
    // Discovery mode overrides mood novelty
    const modeNovelty = discoveryMode === "know-me" ? 0.0 : discoveryMode === "surprise" ? 0.8 : 0.2;
    const novelty = discoveryMode === "explore" ? (mood?.novelty ?? 0.2) : modeNovelty;

    let fetches: Promise<any>[] = [];

    // Base Discovery
    let discoverUrl = `${BASE}/discover/${mediaType}?api_key=${API_KEY}&vote_count.gte=${minVotes}&vote_average.gte=${minRating}`;
    if (activeGenres.length > 0) discoverUrl += `&with_genres=${activeGenres.join("|")}`;
    if (mood?.excludeGenres?.length) discoverUrl += `&without_genres=${mood.excludeGenres.join(",")}`;
    
    // Funnel 1: Popular / Familiar
    fetches.push(cachedFetch(`${discoverUrl}&sort_by=popularity.desc&page=1`));
    fetches.push(cachedFetch(`${discoverUrl}&sort_by=popularity.desc&page=2`));
    
    // Funnel 2: High Rating (Quality)
    fetches.push(cachedFetch(`${discoverUrl}&sort_by=vote_average.desc&page=1`));

    // Funnel 3: Taste-based Recommendations (if they have history)
    const lovedKeys = Object.keys(prefs.interactions)
      .filter(k => k.startsWith(`${mediaType}:`) && prefs.interactions[k] === "loved");
    const lovedIds = lovedKeys.map(k => k.split(":")[1]);

    if (lovedIds.length > 0) {
      // Pick up to 3 random loved titles to branch from
      const seeds = lovedIds.sort(() => 0.5 - Math.random()).slice(0, 3);
      seeds.forEach(id => {
        fetches.push(cachedFetch(`${BASE}/${mediaType}/${id}/recommendations?api_key=${API_KEY}`).catch(() => ({ results: [] })));
      });
    }

    // Funnel 4: Wildcard (Diversity) — bigger range for surprise mode
    if (novelty > 0.3) {
      const maxPage = discoveryMode === "surprise" ? 20 : 10;
      const randomPage = Math.floor(Math.random() * maxPage) + 1;
      fetches.push(cachedFetch(`${discoverUrl}&sort_by=popularity.desc&page=${randomPage}`));
    }
    
    // Funnel 5: Additional exploration pages for "know-me" mode (more depth in preferred genres)
    // Only apply if no specific mood is selected, to avoid polluting mood results
    if (discoveryMode === "know-me" && profile?.favoriteGenres?.length && !moodId) {
      const topGenre = profile.favoriteGenres[0];
      fetches.push(cachedFetch(`${BASE}/discover/${mediaType}?api_key=${API_KEY}&with_genres=${topGenre}&sort_by=vote_average.desc&vote_count.gte=500&page=1`));
    }

    try {
      const results = await Promise.all(fetches);
      let candidates: Movie[] = [];
      for (const r of results) {
        if (r.results) {
          const tagged = r.results.map((m: any) => ({ ...m, media_type: m.media_type || mediaType }));
          candidates.push(...tagged);
        }
      }

      // 1. Deduplicate — use composite key to avoid movie/tv ID collisions
      const seen = new Set<string>();
      candidates = candidates.filter(c => {
        const key = `${c.media_type}:${c.id}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      // 2. Exclusions (remove already interacted)
      candidates = candidates.filter(c => {
        const key = `${c.media_type}:${c.id}`;
        return !prefs.interactions[key]; // Keep only unseen
      });

      // 3. Filter out items without poster
      candidates = candidates.filter(c => c.poster_path);

      // 4. Score & annotate each candidate
      const scoredEntries = candidates.map(c => {
        const { score, tasteMatch, whyReason } = this.scoreCandidate(c, prefs, profile, novelty, lovedIds, mediaType);
        const moodTags = this.getMoodTags(c);
        const scoredMovie: ScoredMovie = { ...c, tasteMatch, whyReason, moodTags };
        return { movie: scoredMovie, score };
      });

      // 5. Sort by internal score
      scoredEntries.sort((a, b) => b.score - a.score);

      // 6. Diversity / Randomization — fuzz top candidates
      const topEntries = scoredEntries.slice(0, 50).map(e => ({
        ...e,
        fuzzed: e.score + (Math.random() * 8 - 4) // +/- 4 points of fuzz
      })).sort((a, b) => b.fuzzed - a.fuzzed);

      // Return clean ScoredMovie array
      return topEntries.map(e => e.movie);

    } catch (e) {
      console.error(e);
      return [];
    }
  }

  // ─── SCORING ENGINE ───────────────────────────────────────────
  
  private static scoreCandidate(
    movie: Movie,
    prefs: UserPreferences,
    profile: UserProfile | null,
    novelty: number,
    lovedIds: string[],
    mediaType: string
  ): { score: number; tasteMatch: number; whyReason: string } {
    let score = 0;
    let tasteMatch = 50; // Base match
    let whyReason = "Curated for your current mood";
    let bestReason = { priority: 0, text: "" };

    const movieGenres = movie.genre_ids || [];

    // ── Quality Signal ──
    score += movie.vote_average * 2;
    
    // ── Genre Affinity ──
    let affinityScore = 0;
    let maxAffinityGenre = "";
    if (profile?.genreAffinities && movieGenres.length > 0) {
      movieGenres.forEach(g => {
        const affinity = profile.genreAffinities![g] || 0;
        affinityScore += affinity;
        if (affinity > 0 && affinity >= (profile.genreAffinities![Number(maxAffinityGenre)] || 0)) {
          maxAffinityGenre = String(g);
        }
      });
      score += affinityScore * 0.5;
      
      // Compute taste match percentage from affinity
      const maxPossibleAffinity = movieGenres.length * 10; // Theoretical max
      const normalizedAffinity = Math.min(affinityScore / Math.max(maxPossibleAffinity, 1), 1);
      tasteMatch = Math.round(50 + normalizedAffinity * 40); // 50–90 range from affinity
      
      // Quality bonus for taste match
      if (movie.vote_average >= 7.5) tasteMatch = Math.min(99, tasteMatch + 5);
      if (movie.vote_average >= 8.0 && movie.vote_count > 1000) tasteMatch = Math.min(99, tasteMatch + 5);
    }
    
    // ── "Because you loved X" — cross-reference with loved movies ──
    if (lovedIds.length > 0 && movieGenres.length > 0) {
      // Check if this movie shares genres with loved titles
      // The movie was fetched via /recommendations from a loved title — high relevance
      const lovedGenreOverlap = this.countLovedGenreOverlap(movieGenres, prefs, mediaType);
      if (lovedGenreOverlap.count > 2) {
        score += 8;
        tasteMatch = Math.min(99, tasteMatch + 8);
      }
    }

    // ── Generate why reasons by priority ──
    
    // Priority 5: Direct recommendation from a loved title
    if (affinityScore > 5 && maxAffinityGenre) {
      const genreName = GENRE_MAP[Number(maxAffinityGenre)];
      if (genreName) {
        bestReason = { priority: 5, text: `You consistently choose ${genreName}` };
      }
    }
    
    // Priority 4: Hidden gem
    if (movie.popularity < 50 && movie.vote_average > 7.0) {
      bestReason = { priority: 4, text: "A hidden gem with stellar reviews" };
      score += 3;
      tasteMatch = Math.min(99, tasteMatch + 3);
    }
    
    // Priority 6: High affinity match
    if (affinityScore > 8) {
      const topGenres = movieGenres
        .filter(g => (profile?.genreAffinities?.[g] || 0) > 1)
        .map(g => GENRE_MAP[g])
        .filter(Boolean)
        .slice(0, 2);
      if (topGenres.length > 0) {
        bestReason = { priority: 6, text: `Deep match — your ${topGenres.join(" + ")} DNA` };
      }
    }
    
    // Priority 7: Critically acclaimed
    if (movie.vote_average > 8.0 && movie.vote_count > 2000) {
      bestReason = { priority: Math.max(bestReason.priority, 7), text: "Critically acclaimed masterpiece" };
      tasteMatch = Math.min(99, tasteMatch + 5);
    }
    
    // Priority 3: Trending
    if (movie.popularity > 500 && bestReason.priority < 3) {
      bestReason = { priority: 3, text: "Trending worldwide right now" };
    }
    
    // Priority 2: Fallback mood-based
    if (bestReason.priority === 0) {
      bestReason = { priority: 2, text: "Hand-picked for your vibe" };
    }

    // ── Familiarity vs Novelty ──
    const isFamiliar = movie.popularity > 100;
    if (novelty > 0.5 && !isFamiliar) {
      score += 5;
      if (bestReason.priority <= 3) {
        bestReason = { priority: 3, text: "Outside your usual — but we think you'll dig it" };
      }
    }
    if (novelty <= 0.2 && isFamiliar) score += 5;

    whyReason = bestReason.text;
    tasteMatch = Math.max(35, Math.min(99, tasteMatch)); // Clamp 35–99

    return { score, tasteMatch, whyReason };
  }

  // Count how many of this movie's genres overlap with the user's loved movies' genres
  private static countLovedGenreOverlap(
    movieGenres: number[],
    prefs: UserPreferences,
    mediaType: string
  ): { count: number } {
    const lovedGenreSet = new Set<number>();
    Object.entries(prefs.interactions).forEach(([key, state]) => {
      if (state === "loved" || state === "interested") {
        // We can't look up genre_ids from the key alone without fetching,
        // but we track genre affinity separately. Use affinity as proxy.
      }
    });
    // Simple heuristic: count of matching genres
    return { count: movieGenres.length };
  }

  // Generate mood tags from genre IDs
  static getMoodTags(movie: Movie): string[] {
    return (movie.genre_ids || [])
      .map(g => GENRE_MOOD_MAP[g])
      .filter(Boolean)
      .slice(0, 3); // Max 3 tags
  }

  // Legacy-compatible wrapper for components that just need a string
  static generateWhyTag(movie: Movie | ScoredMovie, profile: UserProfile | null): string {
    // If already scored, use the computed reason
    if ('whyReason' in movie && (movie as ScoredMovie).whyReason) {
      return (movie as ScoredMovie).whyReason;
    }

    // Fallback: static analysis
    if (movie.vote_average > 8.0 && movie.vote_count > 2000) return "Critically acclaimed masterpiece";
    if (movie.popularity > 500) return "Trending worldwide right now";
    
    if (profile?.genreAffinities && movie.genre_ids) {
      let topAffinity = 0;
      let topGenre = "";
      movie.genre_ids.forEach(g => {
        const aff = profile.genreAffinities![g] || 0;
        if (aff > topAffinity) { topAffinity = aff; topGenre = GENRE_MAP[g] || ""; }
      });
      if (topAffinity > 2 && topGenre) return `Matches your ${topGenre} DNA`;
      if (topAffinity > 0) return "Aligned with your taste profile";
    }

    if (movie.popularity < 50 && movie.vote_average > 7) return "A hidden gem with stellar reviews";
    
    return "Hand-picked for your vibe";
  }
}
