import { Movie, UserPreferences, UserProfile, MOODS } from "./types";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE = "https://api.themoviedb.org/3";

export class MovieEngine {
  
  static async fetchCandidates(
    moodId: string | null,
    genreFilter: number[],
    prefs: UserPreferences,
    profile: UserProfile | null,
    mediaType: "movie" | "tv" | "both" = "movie"
  ): Promise<Movie[]> {
    if (!API_KEY) return [];

    if (mediaType === "both") {
      const [movies, tvs] = await Promise.all([
        this.fetchCandidates(moodId, genreFilter, prefs, profile, "movie"),
        this.fetchCandidates(moodId, genreFilter, prefs, profile, "tv")
      ]);
      const combined = [...movies, ...tvs].sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
      // Interleave/shuffle later in the funnel
      return combined;
    }

    const mood = MOODS.find(m => m.id === moodId);
    const activeGenres = genreFilter.length > 0 ? genreFilter : (mood?.genres || []);
    const minRating = mood?.minRating ?? 6.0;
    const minVotes = mood?.minVotes ?? 300;
    const novelty = mood?.novelty ?? 0.2;

    let fetches: Promise<any>[] = [];

    // Base Discovery
    let discoverUrl = `${BASE}/discover/${mediaType}?api_key=${API_KEY}&vote_count.gte=${minVotes}&vote_average.gte=${minRating}`;
    if (activeGenres.length > 0) discoverUrl += `&with_genres=${activeGenres.join("|")}`;
    
    // Funnel 1: Popular / Familiar
    fetches.push(fetch(`${discoverUrl}&sort_by=popularity.desc&page=1`).then(r => r.json()));
    fetches.push(fetch(`${discoverUrl}&sort_by=popularity.desc&page=2`).then(r => r.json()));
    
    // Funnel 2: High Rating (Quality)
    fetches.push(fetch(`${discoverUrl}&sort_by=vote_average.desc&page=1`).then(r => r.json()));

    // Funnel 3: Taste-based Recommendations (if they have history)
    const lovedIds = Object.keys(prefs.interactions)
      .filter(k => k.startsWith(`${mediaType}:`) && prefs.interactions[k] === "loved")
      .map(k => k.split(":")[1]);

    if (lovedIds.length > 0) {
      // Pick 3 random loved titles to branch from
      const seeds = lovedIds.sort(() => 0.5 - Math.random()).slice(0, 3);
      seeds.forEach(id => {
        fetches.push(fetch(`${BASE}/${mediaType}/${id}/recommendations?api_key=${API_KEY}`).then(r => r.json()).catch(() => ({ results: [] })));
      });
    }

    // Funnel 4: Wildcard (Diversity)
    if (novelty > 0.3) {
      const randomPage = Math.floor(Math.random() * 10) + 1;
      fetches.push(fetch(`${discoverUrl}&sort_by=popularity.desc&page=${randomPage}`).then(r => r.json()));
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

      // 1. Deduplicate
      candidates = candidates.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);

      // 2. Exclusions (remove already interacted)
      candidates = candidates.filter(c => {
        const key = `${c.media_type}:${c.id}`;
        return !prefs.interactions[key]; // Keep only unseen
      });

      // 3. Score Candidates
      const scored = candidates.map(c => {
        let score = 0;
        
        // Quality
        score += c.vote_average * 2;
        
        // Taste Affinity
        if (profile?.genreAffinities && c.genre_ids) {
          c.genre_ids.forEach(g => {
            const affinity = profile.genreAffinities![g] || 0;
            score += affinity * 0.5; // Weight affinity
          });
        }

        // Familiarity vs Novelty
        const isFamiliar = c.popularity > 100;
        if (novelty > 0.5 && !isFamiliar) score += 5; // Reward obscure if novelty is high
        if (novelty <= 0.5 && isFamiliar) score += 5; // Reward familiar if novelty is low

        return { movie: c, score };
      });

      // 4. Sort by score
      scored.sort((a, b) => b.score - a.score);

      // 5. Diversity / Randomization (add slight fuzziness to top candidates so it doesn't get repetitive)
      const topCandidates = scored.slice(0, 40).map(s => ({
        ...s,
        fuzzedScore: s.score + (Math.random() * 10 - 5) // +/- 5 points of fuzz
      })).sort((a, b) => b.fuzzedScore - a.fuzzedScore);

      return topCandidates.map(s => s.movie);

    } catch (e) {
      console.error(e);
      return [];
    }
  }

  // Generate "Why this movie?" tags based on score and profile
  static generateWhyTag(movie: Movie, profile: UserProfile | null): string {
    if (movie.vote_average > 8.0 && movie.vote_count > 2000) return "Critically acclaimed masterpiece";
    if (movie.popularity > 500) return "Global phenomenon right now";
    
    if (profile?.genreAffinities && movie.genre_ids) {
      let topAffinity = 0;
      movie.genre_ids.forEach(g => {
        if ((profile.genreAffinities![g] || 0) > topAffinity) topAffinity = profile.genreAffinities![g];
      });
      if (topAffinity > 2) return "Matches your core Taste DNA";
    }

    if (movie.popularity < 50 && movie.vote_average > 7) return "A hidden gem you haven't seen";
    
    return "Hand-picked for your current mood";
  }
}
