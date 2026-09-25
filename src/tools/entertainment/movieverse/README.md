# MovieVerse Suggestor

MovieVerse is an immersive, Tinder-style gesture-based movie and TV show discovery engine built into CliniKKit. 

## Features
- **Gesture Engine**: Swipe left to dislike, right to love, up to save for later, and down to skip.
- **Smart Discovery**: A taste-learning funnel algorithm that prioritizes un-seen movies based on your rating thresholds, preferred genres, and TMDB quality metrics.
- **Match Engine**: Pair up with a friend using a secure Connect Code (`MV-XXXX-YY`) to instantly find intersecting movies you both want to watch for movie night.
- **Movie Shelf**: A beautiful workspace to manage your curated lists of Saved, Loved, and Watched titles.
- **Local-First & Sync**: Use it instantly as a Guest with entirely local memory, or sign in to sync your Taste Passport securely across devices.

## Tech Stack
- React + TailwindCSS + Framer Motion (Gestures & Physics)
- Firebase Firestore (Atomic Dictionary-based Interactions Model)
- TMDB API (Movie Data & Caching)
