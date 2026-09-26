# MovieVerse Suggestor

MovieVerse is an immersive, Tinder-style gesture-based movie and TV show discovery engine built into CliniKKit. 

## Features
- **Gesture Engine**: Swipe left to dislike, right to love, up to save for later, and down to skip — with progressive visual feedback.
- **Smart Discovery**: A taste-learning funnel algorithm that scores movies using genre affinity vectors, quality signals, popularity, novelty, and TMDB metadata.
- **"Why This Movie?"**: Every card shows a data-driven explanation of why it was recommended — from genre DNA matches to hidden gem detection.
- **Taste Match Score**: Each movie displays a 0–99% taste compatibility score computed from your genre affinity profile.
- **Discovery Modes**: Three algorithmic modes — **Know Me** (high personalization), **Explore** (adjacent genres), **Surprise Me** (high novelty).
- **Mood Discovery**: 10 cinematic moods (Make me think, Scare me, Date night, etc.) that tune the recommendation engine's genre/quality filters.
- **Mood Tags**: Each card shows cinematic mood labels (🧠 Mind-bending, 🔥 Intense, etc.) derived from genre classification.
- **Match Engine**: Create rooms and pair up with friends using invite codes. Real-time Firestore sync shows member contributions.
- **"Pick for Room"**: Cross-references all room members' preferences and picks one movie everyone will enjoy.
- **Movie Shelf**: A beautiful workspace to manage curated lists of Saved, Loved, Watched, Disliked, and Skipped titles.
- **Taste Passport**: Visual genre affinity bars, movie personality label (The Thinker, The Explorer, etc.), and discovery statistics.
- **Feed Prefetching**: Automatically loads more movies when you're 5 cards from the end — the feed never runs dry.
- **Response Caching**: TMDB responses are cached in-memory (5min TTL) to avoid redundant network requests.
- **Guest Mode**: Full local persistence via localStorage — use instantly without signing in.
- **Local-First & Sync**: Guest data persists locally; sign in to sync your Taste Passport securely across devices via Firestore.

## Tech Stack
- React + TailwindCSS + Framer Motion (Gestures & Physics)
- Firebase Firestore (Atomic Dictionary-based Interactions Model + Debounced Batch Writes)
- TMDB API (Movie Data + Response Caching)
