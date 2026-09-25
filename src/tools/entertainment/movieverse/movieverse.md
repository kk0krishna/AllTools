# MOVIEVERSE V3 — AI PRODUCT & ENGINEERING DIRECTION

You are working on an existing MovieVerse application inside the Clinikkit platform.

Do NOT treat this as a simple UI polish task.

The objective is to transform MovieVerse from a basic "Tinder for movies" into an immersive, intelligent, social **personal cinema discovery system**.

The existing implementation already has:

* Firebase authentication
* Firestore user preferences
* TMDB integration
* Movie discovery
* Swipe-like interaction
* Like / dislike / watched / watchlist states
* Watchlist
* Friend matching
* Framer Motion
* Full-screen MovieVerse experience

Preserve working functionality unless there is a strong technical reason to change it.

---

# 1. CORE PRODUCT VISION

MovieVerse should feel like:

> "A personal cinematic universe that learns what kind of movies I enjoy."

NOT:

> "A website containing movie posters."

NOT:

> "A clone of Netflix."

NOT:

> "Just Tinder for movies."

The experience should reduce decision fatigue while increasing curiosity.

The user should feel:

* "This app understands my taste."
* "I want to see what it recommends next."
* "I discovered something I wouldn't have found myself."
* "It knows WHY this movie might appeal to me."
* "I can use it with friends to decide what to watch."

---

# 2. DESIGN PRINCIPLE

Prioritize:

1. Discovery
2. Personalization
3. Serendipity
4. Emotional engagement
5. Social interaction
6. Visual immersion
7. Speed and simplicity

Avoid:

* Dense dashboards
* IMDb-style information overload
* Huge grids as the primary discovery experience
* Too many controls
* Generic cards
* Excessive text
* UI that feels like an admin panel
* Feature bloat

MovieVerse should feel closer to entering a cinematic world than browsing a database.

---

# 3. NEW INFORMATION ARCHITECTURE

Consider these major experiences:

## DISCOVER

The primary experience.

User receives one movie at a time.

But the movie should communicate:

* What it is
* Why it might fit the user
* Mood
* Genre
* Taste compatibility
* Connections to movies they already liked

---

## UNIVERSE

A visual representation of the user's movie taste.

Concept:

Movies are connected through:

* Genre
* Theme
* Director
* Actor
* Mood
* Style
* Similarity
* User's own interactions

The user should be able to explore outward from a movie.

Example:

Interstellar
→ Arrival
→ Annihilation
→ Ex Machina
→ Blade Runner 2049

This should feel like exploring a cinematic constellation rather than navigating a list.

---

## TONIGHT

A dedicated "What should we watch tonight?" experience.

The user can specify:

* Mood
* Runtime
* Solo / couple / group
* Genre preference
* Familiar vs adventurous
* Energy level

Then MovieVerse generates a small number of highly relevant choices.

Avoid showing 100 recommendations.

The goal is to eliminate decision paralysis.

---

## MATCH

Expand the existing two-person watchlist intersection.

Support:

* Two-person matching
* Group movie nights
* Shared taste analysis
* Shared mood
* Taste differences
* Random final selection

The final experience should be:

> "Stop scrolling. MovieVerse picked one."

---

## TASTE

Create a personal cinema profile.

Possible components:

* Taste DNA
* Favorite genres
* Favorite themes
* Favorite moods
* Favorite directors
* Favorite actors
* Viewing history
* Taste evolution
* Discovery statistics

---

# 4. REDESIGN THE PRIMARY MOVIE CARD

The current card should become much more cinematic.

Use:

* Full-screen or near-full-screen backdrop
* Poster/card foreground
* Strong gradient
* Dynamic lighting
* Glassmorphism only where useful
* Motion
* Large typography
* Minimal metadata

Possible structure:

MOVIE BACKDROP

```
    87% MATCH

    DUNE

    2021 · 2h 35m
    Sci-Fi · Adventure

    🧠 Cerebral
    🌌 Epic
    🔥 Intense

    "Because you loved Interstellar
     and Arrival."
```

Actions:

```
    NOPE
    SEEN
    SAVE
    LOVE
```

Do not expose every piece of TMDB metadata.

Reveal information progressively.

---

# 5. "WHY THIS MOVIE?"

Every personalized recommendation should ideally explain itself.

Examples:

"Because you loved Interstellar."

"Because you repeatedly choose psychological thrillers."

"You seem to enjoy movies with ambiguous endings."

"This is outside your normal genre — but shares three themes with movies you loved."

"You're exploring more experimental cinema lately."

The explanation should be generated from actual available user/movie data.

Do NOT invent reasons that aren't supported by the data.

---

# 6. INTRODUCE MOVIE MOODS

Genre is not enough.

Create mood-based discovery.

Examples:

* 🌀 Make me think
* 😂 Make me laugh
* 😭 Break my heart
* 🔥 Give me adrenaline
* ❤️ Date night
* 🌌 Escape reality
* 🕵️ Solve a mystery
* 😌 Easy watch
* 😱 Scare me
* 🎭 Something emotional
* 🎲 Surprise me

Mood selection should feel visual and cinematic.

---

# 7. THREE DISCOVERY MODES

Give the recommendation engine three modes.

## KNOW ME

High personalization.

Show movies closely aligned with known preferences.

## EXPLORE

Show adjacent recommendations.

Introduce new genres/themes while remaining reasonably compatible.

## SURPRISE ME

Prioritize novelty and serendipity.

A user should occasionally receive something outside their normal behavior.

The algorithm should intentionally balance:

PERSONALIZATION + NOVELTY

rather than maximizing similarity alone.

---

# 8. EXPAND USER PREFERENCES

The existing four states are useful:

* likes
* dislikes
* watched
* wantToWatch

Keep them.

But gradually introduce richer signals.

Potential reactions:

* Emotional
* Funny
* Mind-bending
* Beautiful
* Intense
* Romantic
* Dark
* Inspiring
* Weird

Do not force users to select these every time.

Use them as optional micro-feedback.

---

# 9. BUILD A TASTE DNA SYSTEM

Create a derived representation of the user's taste.

Possible dimensions:

Genre:

* Sci-Fi
* Thriller
* Comedy
* Drama
* Horror
* Romance
* etc.

Tone:

* Dark
* Emotional
* Funny
* Intense
* Relaxed

Style:

* Cerebral
* Visual
* Experimental
* Mainstream
* Character-driven

Pacing:

* Slow burn
* Moderate
* Fast

Do not fabricate scores.

Only display confidence or percentages when they are actually calculated from sufficient data.

If there isn't enough data, say:

"Still learning your taste."

---

# 10. TASTE EVOLUTION

MovieVerse should learn over time.

Example:

"You used to mostly choose action."

"Recently you've been exploring psychological thrillers."

"Your taste is becoming more experimental."

This should be based on actual historical interactions.

Never claim a trend unless the underlying data supports it.

---

# 11. MOVIE RABBIT HOLES

When a user likes a movie, allow them to explore connected movies.

Example:

MOVIE

↓

Similar movies

↓

Same director

↓

Same actor

↓

Same theme

↓

Same mood

↓

Movies loved by people with similar taste

The goal is to create endless discovery without an endless feed.

---

# 12. MOVIE NIGHT MODE

Build a dedicated group experience.

Flow:

CREATE MOVIE NIGHT

↓

Invite people

↓

Collect preferences

↓

Calculate shared compatibility

↓

Apply constraints:

* runtime
* mood
* genre
* watched history
* disliked movies

↓

Generate a shortlist

↓

Allow "PICK FOR US"

↓

Reveal ONE movie.

The final screen should feel like an event.

Example:

# TONIGHT'S MOVIE

## THE GRAND BUDAPEST HOTEL

94% group compatibility

Everyone has compatible taste signals.

[ START MOVIE NIGHT ]

Do not claim "94%" unless the application actually calculates this.

---

# 13. TASTE CLASH

Add a playful social mode.

Compare two people's movie preferences.

Show:

YOU

Sci-Fi      █████████
Thriller    ████████
Comedy      ████

FRIEND

Sci-Fi      ████
Thriller    ███████
Comedy      █████████

Then surface:

"Movies you loved that they haven't seen."

"Movies they love that you haven't explored."

"Your shared cinematic territory."

Do not turn this into a ranking of people.

---

# 14. CINEMA PASSPORT

Create a beautiful shareable profile.

Possible content:

MOVIEVERSE CINEMA PASSPORT

Movies explored
Movies loved
Favorite genres
Favorite themes
Current obsession
Taste profile

Example:

"THE EXPLORER"

"Drawn toward cerebral stories,
atmospheric worlds and unexpected endings."

The personality label must be generated from actual behavior or clearly presented as playful rather than factual.

---

# 15. BLIND PICK

Create a discovery mode where the movie is initially hidden.

Show:

YOUR TASTE MATCH

87%

MOOD

Mind-bending

RUNTIME

2h 12m

Then:

[ REVEAL ]

Reveal the movie with cinematic animation.

This should feel like opening a mystery box.

---

# 16. SERENDIPITY ENGINE

Do not optimize exclusively for "movies similar to things the user already likes."

Introduce controlled randomness.

Candidate ranking should conceptually consider:

personal relevance
+
novelty
+
diversity
+
context
+
recent behavior
+
user-selected mood
------------------

already interacted movies

The exact algorithm can evolve later.

Build the architecture so it can improve over time.

---

# 17. GESTURE SYSTEM

Implement proper Framer Motion gestures.

Horizontal:

LEFT → dislike

RIGHT → like

Vertical:

UP → watchlist

DOWN → watched

However:

Do not rely exclusively on gestures.

Buttons must remain available for accessibility and discoverability.

While dragging, show contextual feedback.

Example:

Dragging right:

❤️ LOVE IT

Dragging left:

✕

NOT FOR ME

Dragging upward:

🔖 WATCHLIST

---

# 18. MICRO-ANIMATIONS

Animations should communicate meaning.

Examples:

Like:

* card accelerates right
* heart particles
* next card enters

Dislike:

* card exits left

Watchlist:

* bookmark animation

Watched:

* check animation

Match:

* cards merge into one

Reveal:

* poster expands from blur

Avoid constant decorative animation.

Motion should reinforce interaction.

---

# 19. EMPTY STATES

Never show generic empty states.

Instead of:

"Your watchlist is empty."

Use:

# Your cinema shelf is empty.

"Let's find the first movie."

[ DISCOVER ]

Similarly:

No matches:

"Your tastes haven't crossed paths yet."

Then offer:

[ FIND A COMPROMISE ]

---

# 20. PERFORMANCE

This is critical.

Do not sacrifice speed for visual effects.

Use:

* lazy image loading where appropriate
* optimized TMDB image sizes
* prefetching next movie
* caching
* request deduplication
* minimal Firestore writes
* optimistic interactions
* graceful loading states

The next movie should ideally already be loading before the user finishes interacting with the current movie.

---

# 21. FIRESTORE ARCHITECTURE

Do not destroy the existing schema unnecessarily.

Existing preference categories should remain compatible.

Gradually evolve toward something like:

user_movie_preferences/{userId}

{
likes: [],
dislikes: [],
watched: [],
wantToWatch: [],

reactions: {},

tasteProfile: {},

recentInteractions: [],

discoveryMode: "know-me"
}

Keep sensitive/private information private.

Do not expose unnecessary user information through Match.

---

# 22. RECOMMENDATION ENGINE ARCHITECTURE

Separate recommendation logic from UI.

Create a dedicated layer.

Conceptually:

getCandidateMovies()

↓

removePreviouslyInteracted()

↓

calculateTasteRelevance()

↓

calculateNovelty()

↓

calculateDiversity()

↓

applyMoodFilter()

↓

applyContext()

↓

rankCandidates()

↓

returnFeed()

Do not place all recommendation logic directly inside the React component.

The UI should consume recommendation results.

---

# 23. IMPORTANT ENGINEERING RULE

Do not rewrite everything just because the new design is different.

First inspect the existing implementation.

Identify:

* what works
* what is fragile
* what should be extracted
* what can be reused
* what should be redesigned

Then implement incrementally.

Avoid breaking:

* Firebase auth
* Firestore persistence
* TMDB requests
* existing user data
* navigation
* Clinikkit integration

---

# 24. RESPONSIVE DESIGN

Mobile is not a smaller desktop.

Design mobile first.

Important:

* thumb-friendly controls
* swipe gestures
* safe areas
* no accidental navigation
* readable typography
* fast image loading
* portrait-first discovery

Desktop can use the extra space for:

* cinematic background
* contextual information
* connected movie visualization
* richer social interfaces

---

# 25. ACCESSIBILITY

Maintain:

* keyboard navigation
* visible focus
* semantic buttons
* screen-reader labels
* sufficient contrast
* reduced-motion support

Do not make swipe gestures the only interaction mechanism.

---

# 26. VISUAL DIRECTION

Target:

"premium cinematic operating system"

Not:

"generic SaaS dashboard."

Visual characteristics:

* cinematic black
* deep gradients
* large imagery
* restrained glass
* subtle grain/noise
* dramatic typography
* soft lighting
* large spacing
* intentional animation

Avoid excessive neon.

Avoid making everything glassmorphism.

Avoid excessive rounded cards.

Every visual element should have a purpose.

---

# 27. NAVIGATION CONCEPT

Possible primary navigation:

DISCOVER
UNIVERSE
TONIGHT
MATCH
TASTE

Do not necessarily implement all of these immediately.

Prioritize the experiences that improve discovery.

---

# 28. PRODUCT PERSONALITY

MovieVerse should speak like a knowledgeable movie companion.

Examples:

"Interesting choice."

"You're entering unfamiliar territory."

"Three movies you loved point toward this."

"I think we found your kind of weird."

"Your taste has changed."

"Tonight's shortlist is ready."

Avoid:

* fake certainty
* annoying AI chatter
* excessive emojis
* generic marketing language

---

# 29. DON'T OVERBUILD AI YET

Do not immediately introduce an expensive LLM dependency.

First build a strong deterministic recommendation foundation using:

* TMDB metadata
* genres
* keywords
* ratings
* cast
* directors
* user interactions
* similarity
* recency
* diversity

Later, an LLM can improve:

* natural-language explanations
* taste summaries
* movie-night conversation
* personalized descriptions

AI should enhance the recommendation engine rather than compensate for weak underlying data.

---

# 30. IMPLEMENTATION PRIORITY

Work in phases.

## PHASE 1 — CINEMATIC DISCOVERY

Implement:

* redesigned movie card
* backdrop experience
* real swipe gestures
* action feedback
* prefetch next movie
* "Why this movie?"
* mood selection

Do not implement everything at once.

## PHASE 2 — INTELLIGENCE

Implement:

* Taste DNA
* recommendation abstraction
* Know Me / Explore / Surprise
* richer preference signals
* taste evolution

## PHASE 3 — UNIVERSE

Implement:

* movie connections
* rabbit holes
* visual exploration
* connected recommendations

## PHASE 4 — SOCIAL

Implement:

* improved Match
* Movie Night
* group matching
* Taste Clash
* Pick For Us

## PHASE 5 — IDENTITY

Implement:

* Cinema Passport
* shareable taste cards
* personal cinema profile

---

# 31. IMPORTANT: DON'T JUST CODE THE DESCRIPTION

Before changing the UI:

1. Inspect the existing MovieVerse code.
2. Identify the current architecture.
3. Identify reusable components.
4. Identify bugs and state-management problems.
5. Identify performance bottlenecks.
6. Propose the implementation plan.
7. Then implement.

When implementing, preserve existing functionality unless explicitly replacing it.

After every major change:

* run TypeScript checks
* run lint
* verify build
* test authentication
* test Firestore reads/writes
* test TMDB failures
* test empty states
* test mobile viewport
* test desktop viewport

---

# 32. SUCCESS CRITERIA

MovieVerse V3 is successful if a new user can:

1. Enter the app immediately.
2. Understand what MovieVerse does in seconds.
3. Discover a movie without browsing lists.
4. Understand why that movie was recommended.
5. Interact with one gesture.
6. Feel the recommendation engine learning.
7. Find something unexpected.
8. Build a personal cinematic identity.
9. Invite a friend.
10. Decide what to watch together without endless scrolling.

The most important metric conceptually is not:

"How many movies can we display?"

It is:

> "How quickly can MovieVerse help someone confidently discover something worth watching?"

---

# FINAL CREATIVE DIRECTION

Think beyond:

Tinder + TMDB + Firestore.

Think:

**Spotify Wrapped + Letterboxd + Tinder + a personal recommendation engine + a cinematic exploration game.**

The user should not feel like they are searching a database.

They should feel like they are **exploring their own movie universe.**





Pasted text(2).txt
Document

need out of box design and new thinking and awness # MovieVerse Suggestor

## 🎯 Project Aim

MovieVerse is designed to be an immersive, "Tinder-for-Movies" discovery app that lives within the Clinikkit platform. Unlike static list-based sites like IMDb, MovieVerse's primary goal is to **reduce cognitive overload** and **curate personalized discovery** through gamified UX (swiping) and smart algorithms.

It aims to solve the "what should we watch" problem by letting users quickly triage movies, build their watchlists, and seamlessly cross-reference their choices with friends to find matching movies for a movie night.

---

## 🏗️ Specifications & Features

### 1. The Immersive Experience

- **Full Screen Takeover**: The tool escapes the standard Clinikkit website layout container. Once launched, it functions as a standalone, distraction-free app (`fixed inset-0`) that covers the entire viewport.

- **Cinematic UI**: Uses edge-to-edge backdrop imagery, glassmorphism (`backdrop-blur`), and dark-mode optimization while respecting standard Tailwind theming dynamically.

### 2. Onboarding Flow

- **First-Time Users**: Greeted with a clear value proposition screen.

- **Authentication**: Uses Firebase Google Sign-In. Fallback to `signInWithRedirect` implemented to bypass strict mobile browser popup blockers (like Firefox Android).

### 3. The Discovery Engine (Tinder-Style UX)

- **Single Card Feed**: Instead of overwhelming Netflix-style rows, users are presented with one massive movie card at a time.

- **Instant Triage (Massive Thumb-Friendly Buttons)**:

  - ❌ **Not For Me (Dislike)**

  - 👁️ **Watched (Seen)**

  - 🔖 **Watchlist (Want to Watch)**

  - 💖 **Love It (Like)**

- **Smart Filtering**: Once a user interacts with a movie, it is **instantly banished** from their feed forever. The algorithm filters out `watched`, `dislikes`, `likes`, and `wantToWatch` IDs from all incoming TMDB API requests.

### 4. Movie Match (Social Feature)

- **Cross-Referencing Engine**: Users can copy their unique User ID and share it with a friend.

- **Shared Watchlists**: By entering a friend's ID, the app queries Firestore, fetches the friend's preferences, and calculates the intersection between the two users' `wantToWatch` arrays.

- **Match Grid**: Displays the movies both users want to see, facilitating instant movie night decisions.

### 5. Backend Architecture

- **TMDB API Integration**: Dynamically fetches trending, action, comedy, and personalized recommendations based on the user's latest "Loved" movie (`/movie/{id}/recommendations`).

- **Database (Firestore)**: Persistent storage using a document-based architecture (`user_movie_preferences/{userId}`).

- **Permissions**: Hardened `firestore.rules` ensuring users can only read/write their own document, with an exception allowing read-only access by others specifically for the "Movie Match" feature.

---

## 📈 Progress Till Now

### Completed Milestones

✅ **Initial Scaffold**: Registered `MovieVerse` within the central `toolsRegistry`.

✅ **Database Integration**: Set up Firestore `user_movie_preferences` schema (likes, dislikes, watched, wantToWatch).

✅ **Firebase Security Rules**: Fixed the "Missing or insufficient permissions" error by successfully deploying updated `firestore.rules`.

✅ **Mobile Firefox Fix**: Updated `AuthProvider.tsx` to handle aggressive popup blockers.

✅ **UI Overhaul (V2)**: Transitioned from a basic list-grid to the full-screen, swipe-based Tinder-style interface.

✅ **Smart Filtering Logic**: Implemented the client-side engine that hides previously triaged movies.

✅ **Social Match Feature**: Built the UI and Firestore logic to intersect two users' watchlists.

✅ **Bug Fixes**: Resolved `next/dynamic` build errors in `metadata.tsx` and fixed a missing `Star` lucide-react icon import.

### Next Steps & Future Enhancements

⏳ **Gesture Controls**: Add actual physical swipe gestures (left/right/up/down) using `framer-motion` for mobile users.

⏳ **Enhanced Matching**: Allow matching based on intersecting genres or overlapping "Likes" to generate new mutual recommendations, rather than just shared Watchlist items.

⏳ **Trailers**: Add a "Watch Trailer" button to the movie info panel that plays a YouTube embed directly within the app.

You already have a solid functional MVP. The next leap should not be “add more buttons/features.” It should be to change the mental model from “Tinder for movies” → “an intelligent movie universe that understands your taste.”

Your current implementation is structurally a swipe deck + four-state preference system + watchlist intersection. The biggest opportunity is to make the experience feel alive, explain why something is being shown, and make social discovery much richer.
1. The big idea: MovieVerse = Your Personal Cinema Universe

Don't make the home screen a stack of posters.

Make it feel like the user has entered a living cinematic universe.

Imagine opening MovieVerse:

    “Tonight, your universe contains 1,842 movies.”

    Your taste is pulling you toward:
    🧠 Psychological
    🌃 Neo-noir
    ❤️ Slow-burn romance
    🌀 Mind-bending

    Explore your orbit →

Then the interface visually becomes an orbit / constellation of movies.
https://images.openai.com/static-rsc-4/4nF9vpXunBPDq-321Y40ESLGEY3L_78EUpkboPygu8CnRvQ4VpFwRCJlwTRHRHaUm6fCPDaj8BsvZWaZTHr9OiceqTB2MUBgKSs5SmqujSQTOJGDhypYU4Ow5dKx9czq6i6GTqzvQVmWGKkom_TdBPSTqz7UPb5J73_8NhqBTaW9P_xUhPr2z3BfkmR7l3Xn?purpose=fullsize
Add to Favorites
https://images.openai.com/static-rsc-4/uXMarv1bm519DYCWcaRgpp09sY7x71hDZAW3vrdYKY1lMhn1b0QEA13QMoxcUrTBRfjSTzpopuLe10ke5__CI1wWFDjcgxb-z4MiMH1AUAmI9aPXmseK8dn6EmnFETs2oWrM9Tn-OlR8DQRTpwVHZVAEEdyDUvCaC6O5bpBjsOK5-bHK7wWKNVNbsVEpzQWZ?purpose=fullsize
Add to Favorites
https://images.openai.com/static-rsc-4/snEcAGDoz5aVHPJrdJ38fdmOK01ckvyWhYpVVx7c0Zpy2NkEU2qCHaY4lLtuBdGt11Jf9LbDGx4eVJSa6o1RW0IYLkbIxTONcj22cA-c-QweY6FSRNRAqOUpYX_csXfh-tMBamDfjLoz11MygKNuQa82geJRgUj7YYBkEA3p6p2_vnrRJwLXrvq9Z2UjDtr9?purpose=fullsize
Add to Favorites
https://images.openai.com/static-rsc-4/Nla-LNKAi2M0CVZsZrF9AVqtnV81crr8xY5Fth1V4iInkhkZHo56z05kDJUrbBcK-oCsG1-WzL6118X00_xVw77YId_OgojpoRQTRuYVDeOw3fHgQ7-1u4jMr7UoZ3j4_AtSbFQUT-_jb-aZNOOrFuFtcU4Ia_0i5Pnat3e9ZI8duKqxl6z9RGCr9TegWMBO?purpose=fullsize
Add to Favorites
https://images.openai.com/static-rsc-4/9pfYXfuanTonlLhiw0WWwu3GD0qKTPRGFOq3W94hOh0mPu9kMfFjJAJUj3K3CE-9tFNLDFYxSB1P06vX4EVegU4DL5-mJwhtvw2EsB24jh13lx1LvVk8R4-gEIhOW1dsyzWdGdx4Wq8EcDnCZyp5SEuZaN3MsPy3wsfBMr6UEhYxLpjpV70sWLRIX7Tw3qoC?purpose=fullsize
Add to Favorites

Instead of:

Movie → swipe → movie → swipe

you get:

Taste → explore → react → universe evolves
2. Replace the four buttons with a richer "movie language"

Your existing four states are:

    dislike

    watched

    watchlist

    like

Those are useful internally, but they don't capture why someone likes something.

Your existing preference model is currently only four arrays.

Add micro-reactions.

For example:
❤️ I felt something

    😱 Adrenaline

    😂 Funny

    🧠 Made me think

    😭 Emotional

    🥹 Beautiful

    🔥 Badass

    🌀 Mind-bending

    💀 Dark

    💕 Romantic

Now MovieVerse isn't merely learning:

    "Krishna likes Interstellar."

It learns:

    "Krishna likes films that are emotionally intense + cerebral + visually ambitious."

That's dramatically more useful.
3. The coolest feature: WHY THIS MOVIE?

Every recommendation should be able to answer:
WHY YOU'LL PROBABLY LIKE THIS

For example:

    ✨ Because you loved

    Interstellar
    Arrival
    Dark

    MovieVerse detected:
    🧠 Mind-bending stories
    🌌 Sci-fi
    💭 Existential themes

    Taste match: 87%

This changes MovieVerse from a random recommendation engine into something that feels intelligent.

Your current recommendation engine simply combines recommendations, trending, action and comedy and removes previously interacted movies.

That's a great MVP—but it doesn't yet explain the recommendation.
4. Introduce a Taste DNA

This could become the signature feature.

After perhaps 20–30 interactions:
YOUR MOVIE DNA

             YOUR CINEMA DNA

             🧠  ████████████ 92
        Emotional ███████████  86
           Sci-Fi ██████████   81
          Thriller █████████    76
           Comedy ██████        51
          Romance █████         43

         Story ─────────── Visual
             ●───────────────○

         Mainstream ──────── Cult
             ○───────────────●

Then:

    You don't just like sci-fi.

    You prefer emotionally heavy sci-fi with philosophical themes.

That's a shareable identity.
5. Make the profile into a Cinema Passport

Instead of a boring profile page:
🎬 YOUR CINEMA PASSPORT

KRISHNA'S CINEMA

Films explored      247
Films loved          43
Films watched        128

────────────────────

YOUR GENRES

🧠 Sci-Fi             91%
🌑 Thriller           84%
🎭 Drama              79%
😂 Comedy             42%

────────────────────

YOUR MOVIE PERSONALITY

THE EXPLORER

"Give me something
I've never seen before."

────────────────────

🔥 Current obsession

Mind-bending cinema

Then:

Share Passport

Generate a beautiful social card.

That gives MovieVerse an organic growth loop.
6. Don't make Match just "shared Watchlist"

Your current Match implementation literally intersects:

user.wantToWatch ∩ friend.wantToWatch.

That's useful—but it can become much more interesting.

Create:
🍿 TONIGHT'S MOVIE

Two people connect.

MovieVerse analyses:

YOU                         FRIEND

Sci-Fi       ████████       █████
Comedy       ████           ███████
Thriller     ███████        ████████
Romance      ██             ██████

Then:
YOUR SHARED TASTE

🧠 Thriller
🚀 Sci-Fi
🌀 Mind-bending

And:

    MovieVerse found 17 movies that fit BOTH of you.

But then add a killer feature:
🎲 Pick for us

MovieVerse randomly chooses one from the mutually compatible pool.

No arguing.
7. Add a "Movie Night Mode"

This could become a standalone experience.
MOVIE NIGHT

Who's watching?

You + Alex + Sam + Priya

Each person gets a QR/link.

MovieVerse calculates:

4 PEOPLE
↓
individual preferences
↓
taste intersection
↓
availability
↓
runtime
↓
genre mood
↓
MOVIE

Then:
🎬 TONIGHT'S PICK
The Grand Budapest Hotel

94% group compatibility

❤️ Krishna
❤️ Alex
❤️ Sam
❤️ Priya

Runtime: 1h 39m

Mood: Clever · Whimsical · Fast
[START MOVIE NIGHT]

This is considerably more interesting than two-user watchlist matching.
8. Create Mood Mode

This is one of the biggest UX opportunities.

Instead of asking:

    "What genre?"

Ask:
What do you feel like watching?

Huge visual cards:
https://images.openai.com/static-rsc-4/hjvAap5SPjcbAAPmEYsdA1MZE_Nn_qARRiIlIQwpYVA9mQpLmIV2hw7u2Z65nO7uW-bJ_d_0NoWX5qRUcCxHGYyjfbgiQiCZSUoWAtcxwTORyCb7aCxsU3bseLwcbgnJk62iacG4ydiJNBTPjOnD0mNXgEiG0IFPBK_CbxG6C6KflzOGh0ORKxozOw4kC1zB?purpose=fullsize
Add to Favorites
https://images.openai.com/static-rsc-4/llswmMd_FbhE4jQ5M_sNToKbDlUvKZ_uW5ukATAtEiigA8q4DfhzZBAINZQXaZCph1sAC8fXjaH1YeEOr5cjBN6y5z9W1lhEj871mTX5Rt7mTKvSEOOQAlGVUjAaBas5nxPlPuGolJNWbmkOuBr1z3XIBgdHXCYYkjXpr9ND19Siqehyd2ZrOf0Mv8CjxOhQ?purpose=fullsize
Add to Favorites
https://images.openai.com/static-rsc-4/01dlOQtGXXKsgMDWtUCqdpWYl5IVrv5QE8WtQshFVgLpJjm-MxRdEcM1UG5dYKfo1F8lS-4-TMRSJQEIWs8Drvx7d_2mqjn7nicogcOwvEoQZsEoxhkgxYlmhgjoarjR8y5_amBgwQtD1-IxO9oZMmAg-tqXcJq-gc_G-IFs5ApeS1VlMaMsyh3w1tgvRxFe?purpose=fullsize
Add to Favorites
https://images.openai.com/static-rsc-4/YFn2bhuHctYcB_iOKCEmAeoG-uh_HKktJlR3bYuFbexlbCYPa3A6ziZeyRKqDya1toqWr5Z0Qxl0I6t1fsIg1oL_eUr7kCKBqJhPK-Z7BI9DAv_Qj-LjMChjUefVIRGHXfNKkO04KW1mAEoyVzh0Kgb7g9pMP1d5zJW9pQ1vRz8JWNnSEz_FI3u2b4rthC6r?purpose=fullsize
Add to Favorites
Tonight I want...

🌧️ Something rainy

🧠 Something that melts my brain

😂 I just want to laugh

😭 Destroy me emotionally

🔥 Adrenaline

❤️ Date night

🌌 Escape reality

😴 Easy watching

🕵️ Solve something

Then recommendation isn't:

    "Here's another movie."

It's:

    "You told me you want to escape reality."

9. Introduce Movie Rabbit Holes

This is where the "Verse" name becomes meaningful.

When someone opens a movie:
INTERSTELLAR

             INTERSTELLAR
                   │
       ┌───────────┼───────────┐
       ↓           ↓           ↓
   Similar      Director     Actors
       │           │           │
    Arrival     Nolan       Matthew
       │           │           │
      Dune      Prestige    True Detective

But don't show it as a boring graph.

Make it an interactive cinematic galaxy.

Click a movie → it pulls nearby movies toward you.
"Go deeper"

5 movies connected to this one

Then:

Go deeper again.

That creates discovery without endless scrolling.
10. Add Serendipity

This is critical.

If MovieVerse only learns from explicit likes, it becomes predictable.

You need a:
🎲 SURPRISE ME

algorithm.

Example:

    You normally watch thrillers.

    We found something completely outside your taste.

    Paterson

    Reason:

    "You liked slow-burn emotional films, even though you rarely choose dramas."

This gives the algorithm permission to surprise the user.
11. Make swiping itself cinematic

Your current implementation already uses Framer Motion and AnimatePresence.

Take this much further.
Drag LEFT

Poster flies away.

Overlay:

NOPE
Drag RIGHT

Overlay:

I'M IN ❤️
Drag UP

Overlay:

WATCH TONIGHT 🍿
Drag DOWN

Overlay:

ALREADY SAW IT

But add dynamic feedback.

For example, while dragging:

             ❤️
       ─────────────→

        78% MATCH

At 40% drag:

    "You're probably going to like this."

At 80%:

    "Yep. This is your type."

12. Make the card itself much richer

Your current card essentially presents poster + title + rating + year + expandable overview.

Instead:

┌──────────────────────────┐
│                          │
│        POSTER            │
│                          │
│   ✨ 87% TASTE MATCH     │
│                          │
│                          │
│  ─────────────────────   │
│                          │
│  DUNE                    │
│  2021 · 2h 35m · Sci-Fi  │
│                          │
│  🧠 Mind-bending         │
│  🌌 Epic                 │
│  🔥 Intense              │
│                          │
│  "Because you loved      │
│   Interstellar..."       │
└──────────────────────────┘

And the background uses the movie's backdrop with a huge blur.

You already have both poster and backdrop paths in your model.

Use the backdrop as the atmosphere, not just the poster.
13. Add a hidden "AI Director"

This could be your most differentiated feature.

Give the recommendation system a personality.
🎥 YOUR PERSONAL MOVIE DIRECTOR

    "I've figured you out."

    You tend to like:

    complex stories

    but you lose interest when:

    the pacing is slow.

    So I'm going to avoid recommending 3-hour slow dramas unless they're exceptionally aligned.

Then after several interactions:

    "I noticed something."

    You keep liking movies with unreliable narrators.

    Want me to hunt for more?

[HELL YES]

This creates the feeling that the app is learning, not merely storing arrays.
14. Build a Taste Timeline

This could be surprisingly addictive.

YOUR MOVIE JOURNEY

September

❤️ Interstellar
❤️ Arrival
🔖 Annihilation

         ↓

MovieVerse noticed:

"Your taste is becoming
more experimental."

         ↓

September 25

❤️ Primer
❤️ Coherence

Then:

    Your taste evolved.

That's much more personal than a conventional watchlist.
15. "Taste Clash" with friends

Instead of only finding similarities:
⚔️ TASTE CLASH

YOU                FRIEND

Sci-Fi   ████████   ███
Comedy   ███        ████████
Drama    ███████    ████
Horror   ██         █████████

Then:
Movies YOU loved that they'll probably hate

and
Movies THEY love that you haven't seen

This makes social interaction much more fun.
16. Add "Blind Pick"

This is a beautiful UX experiment.

The user sees:

┌─────────────────────────┐
│                         │
│       ???               │
│                         │
│     TRUST US            │
│                         │
│   Your taste says       │
│   you should watch      │
│   something tonight.    │
│                         │
│     [ REVEAL ]          │
└─────────────────────────┘

They don't initially see the poster/title.

They only see:

    87% compatible

Tap:
REVEAL

Movie dramatically appears.

This turns recommendation into an event.
17. "One Movie. One Question."

After watching something:

Instead of asking users to manually rate it:

    Did this movie hit?

🔥 Absolutely

🙂 Pretty good

😐 Meh

🤢 Never again

Then:

    What made you feel that way?

Optional chips:

Story Acting Ending Visuals Music Pacing

Now your algorithm gets far better training data.
18. Build a recommendation engine around taste vectors

Eventually stop thinking only in terms of arrays.

Instead:

USER VECTOR

genre:
  sci-fi      0.92
  thriller    0.84
  comedy      0.41

tone:
  dark        0.88
  emotional   0.76
  funny       0.35

style:
  cerebral    0.91
  visual      0.87
  experimental 0.79

pace:
  fast        0.68
  slow        0.41

Then each movie gets a corresponding feature representation.

Recommendation becomes something like:

user taste
      ↓
candidate movies
      ↓
similarity
      ↓
novelty bonus
      ↓
serendipity bonus
      ↓
already-seen penalty
      ↓
context/mood
      ↓
FINAL FEED

That's when MovieVerse starts becoming genuinely intelligent.
19. Give the algorithm three modes

A simple but powerful UX:
🎯 KNOW ME

High personalization.

    "Show me exactly what I'll probably love."

🧭 EXPLORE

Controlled novelty.

    "Show me things adjacent to my taste."

🎲 SURPRISE ME

High novelty.

    "Ignore my usual habits."

This is much better than having one invisible recommendation algorithm.
20. Make the home screen adapt

Instead of permanently having:

Discover | My Lists | Match

your navigation could become:

      ✨        🌌        🍿        👥
    Discover   Universe  Tonight   Friends

And the Discover screen could dynamically change:

GOOD EVENING, KRISHNA

Your cinematic mood
──────────────────

🌀 Something mind-bending

🔥 Something intense

❤️ Something emotional

🎲 Surprise me


────────────────────────

YOUR UNIVERSE

You have 43 loved movies
and 17 unexplored paths.

[ EXPLORE ]

21. The most important architectural change

I would not immediately start adding all of these features.

Build MovieVerse around five layers:

                  MOVIEVERSE
                      │
       ┌──────────────┼──────────────┐
       ↓              ↓              ↓
    DISCOVER        TASTE          SOCIAL
       │              │              │
     swipe         Taste DNA       Match
       │              │              │
     mood           profile       Movie Night
       │              │              │
     rabbit         evolution     group taste
       │              │
       └──────────────┼──────────────
                      ↓
                RECOMMENDATION
                   ENGINE
                      │
            ┌─────────┼─────────┐
            ↓         ↓         ↓
          SAFE     EXPLORE    SURPRISE

22. My proposed MovieVerse V3

If I were redesigning the project from the code you currently have, I'd make the next version:
MOVIEVERSE — Your Personal Cinema Universe

Core loop

    Mood → Discover → React → Learn → Explore → Connect

Home

What are we watching tonight?

↓

Mood selection

↓

Personalized cinematic deck

↓

Swipe / gesture

↓

Micro-reaction

↓

Taste engine updates

↓

New recommendations
Discovery

One beautiful movie at a time

But every movie answers:

Why this?

What will I feel?

What is it connected to?
Universe

Interactive movie constellation.

Your movies → your genres → your directors → your themes
Taste

Cinema DNA

Taste evolution

Favourite themes

Movie personality
Tonight

Movie Night

1–8 friends

↓

Compatibility

↓

Mood

↓

Runtime

↓

Available platforms

↓

One final movie
Social

Match

Taste Clash

Friend recommendations

Shared lists

Cinema Passport
23. One particularly crazy idea: "What if you were a movie?"

After enough interactions:
YOUR CINEMA PROFILE

    If your taste were a movie...

🎬 YOUR FILM

Genre: Psychological Sci-Fi
Tone: Dark / Emotional
Pace: Slow burn
Visual style: Atmospheric
Ending: Ambiguous

Then generate a fictional movie poster:

    THE WAY YOU THINK

Directed by: Your Taste
Runtime: 2h 17m
Genre: Sci-Fi / Psychological

And:
Find movies that feel like you

That could become an incredibly shareable feature.
What I'd prioritize technically

You already have the foundation: Firebase authentication/database, TMDB, the swipe deck, Framer Motion, preference persistence, and Match.

I'd build in this order:
Phase	Feature	Impact
V3.1	Real swipe gestures	🔥🔥🔥
	Cinematic backdrop/card redesign	🔥🔥🔥
	Mood discovery	🔥🔥🔥
	"Why this movie?"	🔥🔥🔥
V3.2	Taste DNA	🔥🔥🔥🔥
	Taste vectors	🔥🔥🔥🔥
	Explore / Know Me / Surprise	🔥🔥🔥🔥
V3.3	Movie Universe	🔥🔥🔥🔥
	Rabbit holes	🔥🔥🔥
V3.4	Movie Night	🔥🔥🔥🔥🔥
	Multi-person matching	🔥🔥🔥🔥
V3.5	Cinema Passport	🔥🔥🔥🔥
	Shareable taste cards	🔥🔥🔥🔥
V4	AI Director	🔥🔥🔥🔥🔥
The key shift

Don't compete with IMDb by making a prettier IMDb.

Don't compete with Netflix by making a smaller Netflix.

Make MovieVerse the place where people discover what they didn't know they wanted to watch.

The word “Verse” gives you permission to build an actual world around the user's taste rather than another movie database.

make instructions or suggestions like thing for ai

Absolutely. If your goal is to give another AI coding agent instructions so it can redesign and upgrade MovieVerse, I’d give it a high-level product/engineering brief, not a list of tiny UI changes.

You can paste the following directly into an AI coding agent.
MovieVerse V3 — AI Product & Engineering Direction
MOVIEVERSE V3 — AI PRODUCT & ENGINEERING DIRECTION

You are working on an existing MovieVerse application inside the Clinikkit platform.

Do NOT treat this as a simple UI polish task.

The objective is to transform MovieVerse from a basic "Tinder for movies" into an immersive, intelligent, social personal cinema discovery system.

The existing implementation already has:

    Firebase authentication

    Firestore user preferences

    TMDB integration

    Movie discovery

    Swipe-like interaction

    Like / dislike / watched / watchlist states

    Watchlist

    Friend matching

    Framer Motion

    Full-screen MovieVerse experience

Preserve working functionality unless there is a strong technical reason to change it.
1. CORE PRODUCT VISION

MovieVerse should feel like:

    "A personal cinematic universe that learns what kind of movies I enjoy."

NOT:

    "A website containing movie posters."

NOT:

    "A clone of Netflix."

NOT:

    "Just Tinder for movies."

The experience should reduce decision fatigue while increasing curiosity.

The user should feel:

    "This app understands my taste."

    "I want to see what it recommends next."

    "I discovered something I wouldn't have found myself."

    "It knows WHY this movie might appeal to me."

    "I can use it with friends to decide what to watch."

2. DESIGN PRINCIPLE

Prioritize:

    Discovery

    Personalization

    Serendipity

    Emotional engagement

    Social interaction

    Visual immersion

    Speed and simplicity

Avoid:

    Dense dashboards

    IMDb-style information overload

    Huge grids as the primary discovery experience

    Too many controls

    Generic cards

    Excessive text

    UI that feels like an admin panel

    Feature bloat

MovieVerse should feel closer to entering a cinematic world than browsing a database.
3. NEW INFORMATION ARCHITECTURE

Consider these major experiences:
DISCOVER

The primary experience.

User receives one movie at a time.

But the movie should communicate:

    What it is

    Why it might fit the user

    Mood

    Genre

    Taste compatibility

    Connections to movies they already liked

UNIVERSE

A visual representation of the user's movie taste.

Concept:

Movies are connected through:

    Genre

    Theme

    Director

    Actor

    Mood

    Style

    Similarity

    User's own interactions

The user should be able to explore outward from a movie.

Example:

Interstellar
→ Arrival
→ Annihilation
→ Ex Machina
→ Blade Runner 2049

This should feel like exploring a cinematic constellation rather than navigating a list.
TONIGHT

A dedicated "What should we watch tonight?" experience.

The user can specify:

    Mood

    Runtime

    Solo / couple / group

    Genre preference

    Familiar vs adventurous

    Energy level

Then MovieVerse generates a small number of highly relevant choices.

Avoid showing 100 recommendations.

The goal is to eliminate decision paralysis.
MATCH

Expand the existing two-person watchlist intersection.

Support:

    Two-person matching

    Group movie nights

    Shared taste analysis

    Shared mood

    Taste differences

    Random final selection

The final experience should be:

    "Stop scrolling. MovieVerse picked one."

TASTE

Create a personal cinema profile.

Possible components:

    Taste DNA

    Favorite genres

    Favorite themes

    Favorite moods

    Favorite directors

    Favorite actors

    Viewing history

    Taste evolution

    Discovery statistics

4. REDESIGN THE PRIMARY MOVIE CARD

The current card should become much more cinematic.

Use:

    Full-screen or near-full-screen backdrop

    Poster/card foreground

    Strong gradient

    Dynamic lighting

    Glassmorphism only where useful

    Motion

    Large typography

    Minimal metadata

Possible structure:

MOVIE BACKDROP

    87% MATCH

    DUNE

    2021 · 2h 35m
    Sci-Fi · Adventure

    🧠 Cerebral
    🌌 Epic
    🔥 Intense

    "Because you loved Interstellar
     and Arrival."

Actions:

    NOPE
    SEEN
    SAVE
    LOVE

Do not expose every piece of TMDB metadata.

Reveal information progressively.
5. "WHY THIS MOVIE?"

Every personalized recommendation should ideally explain itself.

Examples:

"Because you loved Interstellar."

"Because you repeatedly choose psychological thrillers."

"You seem to enjoy movies with ambiguous endings."

"This is outside your normal genre — but shares three themes with movies you loved."

"You're exploring more experimental cinema lately."

The explanation should be generated from actual available user/movie data.

Do NOT invent reasons that aren't supported by the data.
6. INTRODUCE MOVIE MOODS

Genre is not enough.

Create mood-based discovery.

Examples:

    🌀 Make me think

    😂 Make me laugh

    😭 Break my heart

    🔥 Give me adrenaline

    ❤️ Date night

    🌌 Escape reality

    🕵️ Solve a mystery

    😌 Easy watch

    😱 Scare me

    🎭 Something emotional

    🎲 Surprise me

Mood selection should feel visual and cinematic.
7. THREE DISCOVERY MODES

Give the recommendation engine three modes.
KNOW ME

High personalization.

Show movies closely aligned with known preferences.
EXPLORE

Show adjacent recommendations.

Introduce new genres/themes while remaining reasonably compatible.
SURPRISE ME

Prioritize novelty and serendipity.

A user should occasionally receive something outside their normal behavior.

The algorithm should intentionally balance:

PERSONALIZATION + NOVELTY

rather than maximizing similarity alone.
8. EXPAND USER PREFERENCES

The existing four states are useful:

    likes

    dislikes

    watched

    wantToWatch

Keep them.

But gradually introduce richer signals.

Potential reactions:

    Emotional

    Funny

    Mind-bending

    Beautiful

    Intense

    Romantic

    Dark

    Inspiring

    Weird

Do not force users to select these every time.

Use them as optional micro-feedback.
9. BUILD A TASTE DNA SYSTEM

Create a derived representation of the user's taste.

Possible dimensions:

Genre:

    Sci-Fi

    Thriller

    Comedy

    Drama

    Horror

    Romance

    etc.

Tone:

    Dark

    Emotional

    Funny

    Intense

    Relaxed

Style:

    Cerebral

    Visual

    Experimental

    Mainstream

    Character-driven

Pacing:

    Slow burn

    Moderate

    Fast

Do not fabricate scores.

Only display confidence or percentages when they are actually calculated from sufficient data.

If there isn't enough data, say:

"Still learning your taste."
10. TASTE EVOLUTION

MovieVerse should learn over time.

Example:

"You used to mostly choose action."

"Recently you've been exploring psychological thrillers."

"Your taste is becoming more experimental."

This should be based on actual historical interactions.

Never claim a trend unless the underlying data supports it.
11. MOVIE RABBIT HOLES

When a user likes a movie, allow them to explore connected movies.

Example:

MOVIE

↓

Similar movies

↓

Same director

↓

Same actor

↓

Same theme

↓

Same mood

↓

Movies loved by people with similar taste

The goal is to create endless discovery without an endless feed.
12. MOVIE NIGHT MODE

Build a dedicated group experience.

Flow:

CREATE MOVIE NIGHT

↓

Invite people

↓

Collect preferences

↓

Calculate shared compatibility

↓

Apply constraints:

    runtime

    mood

    genre

    watched history

    disliked movies

↓

Generate a shortlist

↓

Allow "PICK FOR US"

↓

Reveal ONE movie.

The final screen should feel like an event.

Example:
TONIGHT'S MOVIE
THE GRAND BUDAPEST HOTEL

94% group compatibility

Everyone has compatible taste signals.

[ START MOVIE NIGHT ]

Do not claim "94%" unless the application actually calculates this.
13. TASTE CLASH

Add a playful social mode.

Compare two people's movie preferences.

Show:

YOU

Sci-Fi █████████
Thriller ████████
Comedy ████

FRIEND

Sci-Fi ████
Thriller ███████
Comedy █████████

Then surface:

"Movies you loved that they haven't seen."

"Movies they love that you haven't explored."

"Your shared cinematic territory."

Do not turn this into a ranking of people.
14. CINEMA PASSPORT

Create a beautiful shareable profile.

Possible content:

MOVIEVERSE CINEMA PASSPORT

Movies explored
Movies loved
Favorite genres
Favorite themes
Current obsession
Taste profile

Example:

"THE EXPLORER"

"Drawn toward cerebral stories,
atmospheric worlds and unexpected endings."

The personality label must be generated from actual behavior or clearly presented as playful rather than factual.
15. BLIND PICK

Create a discovery mode where the movie is initially hidden.

Show:

YOUR TASTE MATCH

87%

MOOD

Mind-bending

RUNTIME

2h 12m

Then:

[ REVEAL ]

Reveal the movie with cinematic animation.

This should feel like opening a mystery box.
16. SERENDIPITY ENGINE

Do not optimize exclusively for "movies similar to things the user already likes."

Introduce controlled randomness.

Candidate ranking should conceptually consider:

already interacted movies

The exact algorithm can evolve later.

Build the architecture so it can improve over time.
17. GESTURE SYSTEM

Implement proper Framer Motion gestures.

Horizontal:

LEFT → dislike

RIGHT → like

Vertical:

UP → watchlist

DOWN → watched

However:

Do not rely exclusively on gestures.

Buttons must remain available for accessibility and discoverability.

While dragging, show contextual feedback.

Example:

Dragging right:

❤️ LOVE IT

Dragging left:

✕

NOT FOR ME

Dragging upward:

🔖 WATCHLIST
18. MICRO-ANIMATIONS

Animations should communicate meaning.

Examples:

Like:

    card accelerates right

    heart particles

    next card enters

Dislike:

    card exits left

Watchlist:

    bookmark animation

Watched:

    check animation

Match:

    cards merge into one

Reveal:

    poster expands from blur

Avoid constant decorative animation.

Motion should reinforce interaction.
19. EMPTY STATES

Never show generic empty states.

Instead of:

"Your watchlist is empty."

Use:
Your cinema shelf is empty.

"Let's find the first movie."

[ DISCOVER ]

Similarly:

No matches:

"Your tastes haven't crossed paths yet."

Then offer:

[ FIND A COMPROMISE ]
20. PERFORMANCE

This is critical.

Do not sacrifice speed for visual effects.

Use:

    lazy image loading where appropriate

    optimized TMDB image sizes

    prefetching next movie

    caching

    request deduplication

    minimal Firestore writes

    optimistic interactions

    graceful loading states

The next movie should ideally already be loading before the user finishes interacting with the current movie.
21. FIRESTORE ARCHITECTURE

Do not destroy the existing schema unnecessarily.

Existing preference categories should remain compatible.

Gradually evolve toward something like:

user_movie_preferences/{userId}

{
likes: [],
dislikes: [],
watched: [],
wantToWatch: [],

reactions: {},

tasteProfile: {},

recentInteractions: [],

discoveryMode: "know-me"
}

Keep sensitive/private information private.

Do not expose unnecessary user information through Match.
22. RECOMMENDATION ENGINE ARCHITECTURE

Separate recommendation logic from UI.

Create a dedicated layer.

Conceptually:

getCandidateMovies()

↓

removePreviouslyInteracted()

↓

calculateTasteRelevance()

↓

calculateNovelty()

↓

calculateDiversity()

↓

applyMoodFilter()

↓

applyContext()

↓

rankCandidates()

↓

returnFeed()

Do not place all recommendation logic directly inside the React component.

The UI should consume recommendation results.
23. IMPORTANT ENGINEERING RULE

Do not rewrite everything just because the new design is different.

First inspect the existing implementation.

Identify:

    what works

    what is fragile

    what should be extracted

    what can be reused

    what should be redesigned

Then implement incrementally.

Avoid breaking:

    Firebase auth

    Firestore persistence

    TMDB requests

    existing user data

    navigation

    Clinikkit integration

24. RESPONSIVE DESIGN

Mobile is not a smaller desktop.

Design mobile first.

Important:

    thumb-friendly controls

    swipe gestures

    safe areas

    no accidental navigation

    readable typography

    fast image loading

    portrait-first discovery

Desktop can use the extra space for:

    cinematic background

    contextual information

    connected movie visualization

    richer social interfaces

25. ACCESSIBILITY

Maintain:

    keyboard navigation

    visible focus

    semantic buttons

    screen-reader labels

    sufficient contrast

    reduced-motion support

Do not make swipe gestures the only interaction mechanism.
26. VISUAL DIRECTION

Target:

"premium cinematic operating system"

Not:

"generic SaaS dashboard."

Visual characteristics:

    cinematic black

    deep gradients

    large imagery

    restrained glass

    subtle grain/noise

    dramatic typography

    soft lighting

    large spacing

    intentional animation

Avoid excessive neon.

Avoid making everything glassmorphism.

Avoid excessive rounded cards.

Every visual element should have a purpose.
27. NAVIGATION CONCEPT

Possible primary navigation:

DISCOVER
UNIVERSE
TONIGHT
MATCH
TASTE

Do not necessarily implement all of these immediately.

Prioritize the experiences that improve discovery.
28. PRODUCT PERSONALITY

MovieVerse should speak like a knowledgeable movie companion.

Examples:

"Interesting choice."

"You're entering unfamiliar territory."

"Three movies you loved point toward this."

"I think we found your kind of weird."

"Your taste has changed."

"Tonight's shortlist is ready."

Avoid:

    fake certainty

    annoying AI chatter

    excessive emojis

    generic marketing language

29. DON'T OVERBUILD AI YET

Do not immediately introduce an expensive LLM dependency.

First build a strong deterministic recommendation foundation using:

    TMDB metadata

    genres

    keywords

    ratings

    cast

    directors

    user interactions

    similarity

    recency

    diversity

Later, an LLM can improve:

    natural-language explanations

    taste summaries

    movie-night conversation

    personalized descriptions

AI should enhance the recommendation engine rather than compensate for weak underlying data.
30. IMPLEMENTATION PRIORITY

Work in phases.
PHASE 1 — CINEMATIC DISCOVERY

Implement:

    redesigned movie card

    backdrop experience

    real swipe gestures

    action feedback

    prefetch next movie

    "Why this movie?"

    mood selection

Do not implement everything at once.
PHASE 2 — INTELLIGENCE

Implement:

    Taste DNA

    recommendation abstraction

    Know Me / Explore / Surprise

    richer preference signals

    taste evolution

PHASE 3 — UNIVERSE

Implement:

    movie connections

    rabbit holes

    visual exploration

    connected recommendations

PHASE 4 — SOCIAL

Implement:

    improved Match

    Movie Night

    group matching

    Taste Clash

    Pick For Us

PHASE 5 — IDENTITY

Implement:

    Cinema Passport

    shareable taste cards

    personal cinema profile

31. IMPORTANT: DON'T JUST CODE THE DESCRIPTION

Before changing the UI:

    Inspect the existing MovieVerse code.

    Identify the current architecture.

    Identify reusable components.

    Identify bugs and state-management problems.

    Identify performance bottlenecks.

    Propose the implementation plan.

    Then implement.

When implementing, preserve existing functionality unless explicitly replacing it.

After every major change:

    run TypeScript checks

    run lint

    verify build

    test authentication

    test Firestore reads/writes

    test TMDB failures

    test empty states

    test mobile viewport

    test desktop viewport

32. SUCCESS CRITERIA

MovieVerse V3 is successful if a new user can:

    Enter the app immediately.

    Understand what MovieVerse does in seconds.

    Discover a movie without browsing lists.

    Understand why that movie was recommended.

    Interact with one gesture.

    Feel the recommendation engine learning.

    Find something unexpected.

    Build a personal cinematic identity.

    Invite a friend.

    Decide what to watch together without endless scrolling.

The most important metric conceptually is not:

"How many movies can we display?"

It is:

    "How quickly can MovieVerse help someone confidently discover something worth watching?"

FINAL CREATIVE DIRECTION

Think beyond:

Tinder + TMDB + Firestore.

Think:

Spotify Wrapped + Letterboxd + Tinder + a personal recommendation engine + a cinematic exploration game.

The user should not feel like they are searching a database.

They should feel like they are exploring their own movie universe.

This is the kind of prompt I'd use with a coding AI because it gives it product direction + UX principles + architecture + implementation order, while still leaving it room to make good engineering decisions. Your current code already has the core persistence, feed filtering, and social-match foundation to build this on.

If you want, I can also turn this into an even more aggressive “AI coding agent master prompt” that tells the AI to
inspect the whole repo,
redesign MovieVerse,
create the components,
modify the Firestore schema safely,
implement the recommendation engine, and
test everything step-by-step.

/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Heart, X, Bookmark, Users, Sparkles, LogIn,
  ChevronLeft, Info, Copy, Star, Eye, Shuffle,
  ThumbsUp, ThumbsDown, Popcorn, Search,
  SkipForward, SlidersHorizontal, ChevronDown
} from "lucide-react";
import { ToolComponentProps } from "@/tools/registry";
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { useRouter } from "next/navigation";

// ─── Constants ───────────────────────────────────────────────────
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE   = "https://api.themoviedb.org/3";
const IMG_BG = "https://image.tmdb.org/t/p/w1280"; // Reduced from original for faster load
const IMG_SM = "https://image.tmdb.org/t/p/w500";

// ─── Types ───────────────────────────────────────────────────────
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
  genre_ids?: number[];
  runtime?: number;
}

interface UserPreferences {
  likes: number[];
  dislikes: number[];
  watched: number[];
  wantToWatch: number[];
  skipped: number[];
}

interface UserProfile {
  name: string;
  favoriteGenres: number[];
  createdAt: string;
}

// ─── Genre map (TMDB IDs) ───────────────────────────────────────
const GENRE_MAP: Record<number, string> = {
  28:"Action",12:"Adventure",16:"Animation",35:"Comedy",80:"Crime",
  99:"Documentary",18:"Drama",10751:"Family",14:"Fantasy",36:"History",
  27:"Horror",10402:"Music",9648:"Mystery",10749:"Romance",878:"Sci-Fi",
  53:"Thriller",10752:"War",37:"Western"
};

const GENRE_LIST = Object.entries(GENRE_MAP).map(([id, name]) => ({ id: Number(id), name }));

// ─── Mood presets ────────────────────────────────────────────────
const MOODS = [
  { id: "think",       emoji: "🌀", label: "Make me think",      genres: [878, 9648, 18] },
  { id: "laugh",       emoji: "😂", label: "Make me laugh",      genres: [35] },
  { id: "cry",         emoji: "😭", label: "Break my heart",     genres: [18, 10749] },
  { id: "adrenaline",  emoji: "🔥", label: "Adrenaline rush",    genres: [28, 53] },
  { id: "escape",      emoji: "🌌", label: "Escape reality",     genres: [14, 878, 12] },
  { id: "mystery",     emoji: "🕵️", label: "Solve a mystery",    genres: [9648, 80] },
  { id: "scare",       emoji: "😱", label: "Scare me",           genres: [27] },
  { id: "chill",       emoji: "😌", label: "Easy watch",         genres: [35, 10751, 16] },
  { id: "date",        emoji: "❤️", label: "Date night",         genres: [10749, 35, 18] },
  { id: "surprise",    emoji: "🎲", label: "Surprise me",        genres: [] },
];

/*
 * ═══════════════════════════════════════════════════════════════════
 * PSYCHOLOGY OF ACTIONS
 * ═══════════════════════════════════════════════════════════════════
 *
 * The 5 possible user states for any movie:
 *
 *  SKIP     → "I don't know this movie / not now"
 *              Signal: NEUTRAL. Does NOT poison recommendations.
 *              Movie may reappear later in a different session.
 *
 *  NOT FOR ME → "I know this movie and I'm not interested"
 *              Signal: NEGATIVE. Filters recommendations away from this.
 *              Movie never appears again.
 *
 *  INTERESTED → "I want to watch this"
 *              Signal: POSITIVE. Added to watchlist.
 *              Drives "similar" recommendations.
 *
 *  LOVE IT  → "I've seen this and I loved it"
 *              Signal: STRONG POSITIVE. Core taste signal.
 *              Heavily drives recommendation engine.
 *
 *  ALREADY WATCHED → "I've seen this"
 *              Opens a sub-prompt: Did you like it? (👍/👎)
 *              This gives us a rated-watch signal.
 *
 * The key insight: SKIP ≠ DISLIKE.
 * "I don't recognize this" should never be treated as rejection.
 */

// ─── "Why this movie?" generator ─────────────────────────────────
function whyThisMovie(movie: Movie, prefs: UserPreferences, feedIndex: number): string | null {
  if (feedIndex < 5 && prefs.likes.length > 0) return "Based on movies you loved";
  if (movie.vote_average >= 8) return "Highly rated across the board";
  return null;
}

// ═══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════
export default function MovieVerse({}: ToolComponentProps) {
  const { user, signInWithGoogle } = useAuth();
  const router = useRouter();

  type ViewType = "onboard" | "setup" | "discover" | "search" | "lists" | "match";
  const [view, setView] = useState<ViewType>("discover");

  // Feed state
  const [feed, setFeed] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showOverview, setShowOverview] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [showMoodPicker, setShowMoodPicker] = useState(false);
  const [showWatchedPrompt, setShowWatchedPrompt] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filterGenres, setFilterGenres] = useState<number[]>([]);

  // Search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // User data
  const [prefs, setPrefs] = useState<UserPreferences>({
    likes: [], dislikes: [], watched: [], wantToWatch: [], skipped: [],
  });
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [setupName, setSetupName] = useState("");
  const [setupGenres, setSetupGenres] = useState<number[]>([]);

  // Match / Lists
  const [watchlistMovies, setWatchlistMovies] = useState<Movie[]>([]);
  const [friendId, setFriendId] = useState("");
  const [friendProfile, setFriendProfile] = useState<UserProfile | null>(null);
  const [matchResults, setMatchResults] = useState<Movie[] | null>(null);
  const [matchLoading, setMatchLoading] = useState(false);
  const [pickedMovie, setPickedMovie] = useState<Movie | null>(null);

  // ─── Auth + prefs load ──────────────────────────────────────────
  useEffect(() => {
    if (user) {
      (async () => {
        try {
          const prefSnap = await getDoc(doc(db, "user_movie_preferences", user.uid));
          if (prefSnap.exists()) {
            const data = prefSnap.data();
            setPrefs({
              likes: data.likes || [],
              dislikes: data.dislikes || [],
              watched: data.watched || [],
              wantToWatch: data.wantToWatch || [],
              skipped: data.skipped || [],
            });
          }

          const profileSnap = await getDoc(doc(db, "user_movie_profiles", user.uid));
          if (profileSnap.exists()) {
            setProfile(profileSnap.data() as UserProfile);
            setView("discover");
          } else {
            // First time → setup
            setView("setup");
          }
        } catch (e) {
          console.error(e);
          setView("discover");
        }
      })();
    } else {
      setView("onboard");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // ─── Feed fetcher ───────────────────────────────────────────────
  const fetchFeed = useCallback(async (moodId?: string | null, genreFilter?: number[]) => {
    if (!API_KEY) return;
    setLoading(true);

    const mood = MOODS.find(m => m.id === moodId);
    const moodGenres = mood?.genres || [];
    const activeGenres = genreFilter && genreFilter.length > 0 ? genreFilter : moodGenres;

    try {
      const fetches: Promise<any>[] = [
        fetch(${BASE}/trending/movie/day?api_key=${API_KEY}&language=en-US).then(r => r.json()),
      ];

      if (activeGenres.length > 0) {
        fetches.push(
          fetch(${BASE}/discover/movie?api_key=${API_KEY}&with_genres=${activeGenres.join(",")}&sort_by=popularity.desc&vote_count.gte=300&with_original_language=en).then(r => r.json())
        );
      } else {
        // Use profile genres if available
        const profileGenres = profile?.favoriteGenres || [];
        if (profileGenres.length > 0) {
          fetches.push(
            fetch(${BASE}/discover/movie?api_key=${API_KEY}&with_genres=${profileGenres.slice(0,3).join(",")}&sort_by=popularity.desc&with_original_language=en).then(r => r.json())
          );
        }
        fetches.push(
          fetch(${BASE}/discover/movie?api_key=${API_KEY}&with_genres=28&sort_by=popularity.desc&with_original_language=en).then(r => r.json()),
          fetch(${BASE}/discover/movie?api_key=${API_KEY}&with_genres=35&sort_by=popularity.desc&with_original_language=en).then(r => r.json()),
        );
      }

      // Personalized recs
      if (prefs.likes.length > 0) {
        const lastLiked = prefs.likes[prefs.likes.length - 1];
        fetches.push(
          fetch(${BASE}/movie/${lastLiked}/recommendations?api_key=${API_KEY}&language=en-US)
            .then(r => r.json()).catch(() => ({ results: [] }))
        );
      }

      const results = await Promise.all(fetches);
      let combined: Movie[] = [];
      for (const r of results) if (r.results) combined.push(...r.results);

      // Deduplicate
      combined = combined.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);

      // Filter out permanently interacted (NOT skipped — skipped can reappear)
      const permanent = new Set([...prefs.watched, ...prefs.dislikes, ...prefs.likes, ...prefs.wantToWatch]);
      combined = combined.filter(m => !permanent.has(m.id) && m.poster_path);

      // Shuffle for surprise mode
      if (moodId === "surprise") {
        for (let i = combined.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [combined[i], combined[j]] = [combined[j], combined[i]];
        }
      }

      setFeed(combined);
      setCurrentIndex(0);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, [prefs.likes, prefs.watched, prefs.dislikes, prefs.wantToWatch, profile?.favoriteGenres]);

  useEffect(() => {
    if (user && view === "discover" && feed.length === 0) {
      fetchFeed(selectedMood, filterGenres);
    }
  }, [user, view, feed.length, fetchFeed, selectedMood, filterGenres]);

  // Prefetch next backdrop
  useEffect(() => {
    const next = feed[currentIndex + 1];
    if (next?.backdrop_path && API_KEY) {
      const img = new Image();
      img.src = ${IMG_BG}${next.backdrop_path};
    }
  }, [currentIndex, feed]);

  // ─── Watchlist loader ───────────────────────────────────────────
  useEffect(() => {
    if (view === "lists" && API_KEY && prefs.wantToWatch.length > 0) {
      (async () => {
        const ids = prefs.wantToWatch.slice(-20).reverse();
        const results = await Promise.all(
          ids.map(id => fetch(${BASE}/movie/${id}?api_key=${API_KEY}).then(r => r.json()).catch(() => null))
        );
        setWatchlistMovies(results.filter(Boolean));
      })();
    } else if (view === "lists") setWatchlistMovies([]);
  }, [view, prefs.wantToWatch]);

  // ─── Save prefs to Firestore ────────────────────────────────────
  async function savePrefs(newPrefs: UserPreferences) {
    setPrefs(newPrefs);
    if (!user) return;
    try {
      await setDoc(doc(db, "user_movie_preferences", user.uid), newPrefs, { merge: true });
    } catch (e) { console.error(e); }
  }

  // ─── Action handlers ────────────────────────────────────────────
  function advanceCard() {
    setCurrentIndex(prev => prev + 1);
    setShowOverview(false);
    setShowWatchedPrompt(false);
  }

  async function handleSkip() {
    const movie = feed[currentIndex];
    if (!movie) return;
    // Skip is neutral — movie can reappear. Just advance.
    const newSkipped = [...prefs.skipped, movie.id];
    await savePrefs({ ...prefs, skipped: newSkipped });
    advanceCard();
  }

  async function handleNotInterested() {
    const movie = feed[currentIndex];
    if (!movie) return;
    await savePrefs({ ...prefs, dislikes: [...prefs.dislikes, movie.id] });
    advanceCard();
  }

  async function handleInterested() {
    const movie = feed[currentIndex];
    if (!movie) return;
    await savePrefs({ ...prefs, wantToWatch: [...prefs.wantToWatch, movie.id] });
    advanceCard();
  }

  async function handleLoveIt() {
    const movie = feed[currentIndex];
    if (!movie) return;
    await savePrefs({ ...prefs, likes: [...prefs.likes, movie.id] });
    advanceCard();
  }

  function handleWatchedTap() {
    setShowWatchedPrompt(true);
  }

  async function handleWatchedRating(liked: boolean) {
    const movie = feed[currentIndex];
    if (!movie) return;
    const newPrefs = {
      ...prefs,
      watched: [...prefs.watched, movie.id],
      ...(liked ? { likes: [...prefs.likes, movie.id] } : { dislikes: [...prefs.dislikes, movie.id] }),
    };
    await savePrefs(newPrefs);
    advanceCard();
  }

  // ─── Setup / Profile ────────────────────────────────────────────
  async function completeSetup() {
    if (!user || !setupName.trim()) return;
    const profileData: UserProfile = {
      name: setupName.trim(),
      favoriteGenres: setupGenres,
      createdAt: new Date().toISOString(),
    };
    try {
      await setDoc(doc(db, "user_movie_profiles", user.uid), profileData);
      await setDoc(doc(db, "user_movie_preferences", user.uid), prefs, { merge: true });
      setProfile(profileData);
      setView("discover");
    } catch (e) { console.error(e); }
  }

  // ─── Search ─────────────────────────────────────────────────────
  async function handleSearch(query: string) {
    setSearchQuery(query);
    if (!query.trim() || !API_KEY) { setSearchResults([]); return; }
    setSearchLoading(true);
    try {
      const res = await fetch(${BASE}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)});
      const data = await res.json();
      setSearchResults((data.results || []).filter((m: Movie) => m.poster_path && (m.media_type === "movie" || m.media_type === "tv")));
    } catch (e) { console.error(e); }
    setSearchLoading(false);
  }

  async function addFromSearch(movie: Movie, type: keyof UserPreferences) {
    if (type === "skipped") return;
    const newPrefs = { ...prefs, [type]: [...prefs[type], movie.id] };
    await savePrefs(newPrefs);
  }

  // ─── Mood select ────────────────────────────────────────────────
  function selectMood(moodId: string) {
    setSelectedMood(moodId);
    setShowMoodPicker(false);
    setFeed([]);
    setCurrentIndex(0);
    fetchFeed(moodId, filterGenres);
  }

  // ─── Filter apply ──────────────────────────────────────────────
  function applyFilters(genres: number[]) {
    setFilterGenres(genres);
    setShowFilters(false);
    setFeed([]);
    setCurrentIndex(0);
    fetchFeed(selectedMood, genres);
  }

  // ─── Match handler ──────────────────────────────────────────────
  async function handleMatch() {
    if (!friendId.trim() || !API_KEY) return;
    setMatchLoading(true);
    setPickedMovie(null);
    setFriendProfile(null);
    try {
      const [prefSnap, profileSnap] = await Promise.all([
        getDoc(doc(db, "user_movie_preferences", friendId.trim())),
        getDoc(doc(db, "user_movie_profiles", friendId.trim())),
      ]);

      if (profileSnap.exists()) setFriendProfile(profileSnap.data() as UserProfile);

      if (prefSnap.exists()) {
        const friendPrefs = prefSnap.data() as UserPreferences;
        const myPool = new Set([...prefs.wantToWatch, ...prefs.likes]);
        const friendPool = new Set([...(friendPrefs.wantToWatch || []), ...(friendPrefs.likes || [])]);
        const sharedIds = [...myPool].filter(id => friendPool.has(id));

        const results = await Promise.all(
          sharedIds.slice(0, 20).map(id =>
            fetch(${BASE}/movie/${id}?api_key=${API_KEY}).then(r => r.json()).catch(() => null)
          )
        );
        setMatchResults(results.filter(Boolean));
      } else {
        setMatchResults([]);
      }
    } catch (e) { console.error(e); }
    setMatchLoading(false);
  }

  function pickForUs() {
    if (!matchResults || matchResults.length === 0) return;
    setPickedMovie(matchResults[Math.floor(Math.random() * matchResults.length)]);
  }

  // ═══════════════════════════════════════════════════════════════
  // ONBOARDING (not signed in)
  // ═══════════════════════════════════════════════════════════════
  if (view === "onboard") {
    return (
      <div className="fixed inset-0 z-[100] bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-6 text-center overflow-y-auto">
        <div className="max-w-md w-full flex flex-col items-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="w-28 h-28 bg-gradient-to-br from-red-600 to-purple-700 rounded-3xl flex items-center justify-center mb-10 shadow-2xl shadow-red-600/30"
          >
            <Popcorn className="w-14 h-14 text-white" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-5xl font-black mb-3 tracking-tight">MovieVerse</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-white/50 mb-14 text-lg leading-relaxed max-w-sm">
            Swipe through cinema. Teach it your taste. Match with friends for the perfect movie night.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="w-full flex flex-col gap-4">
            <Button size="lg" onClick={signInWithGoogle} className="w-full rounded-2xl py-7 text-lg font-bold bg-white text-black hover:bg-white/90 shadow-xl">
              <LogIn className="w-5 h-5 mr-3" /> Sign in to start
            </Button>
            <Button variant="ghost" onClick={() => router.back()} className="text-white/40 hover:text-white/70">
              <ChevronLeft className="w-4 h-4 mr-1" /> Back to Clinikkit
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // SETUP (first time — collect name + genre prefs)
  // ═══════════════════════════════════════════════════════════════
  if (view === "setup") {
    return (
      <div className="fixed inset-0 z-[100] bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-6 overflow-y-auto">
        <div className="max-w-md w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <h1 className="text-4xl font-black mb-3 tracking-tight">Welcome to MovieVerse</h1>
            <p className="text-white/40 text-sm">Tell us a little about yourself so we can find your kind of movies.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8">
            <label className="text-xs font-bold text-white/30 uppercase tracking-wider mb-3 block">What should we call you?</label>
            <Input
              value={setupName}
              onChange={e => setSetupName(e.target.value)}
              placeholder="Your name"
              className="bg-white/5 border-white/10 text-white rounded-xl h-14 text-lg placeholder:text-white/20"
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-10">
            <label className="text-xs font-bold text-white/30 uppercase tracking-wider mb-3 block">Pick genres you enjoy</label>
            <div className="flex flex-wrap gap-2">
              {GENRE_LIST.map(g => {
                const selected = setupGenres.includes(g.id);
                return (
                  <button
                    key={g.id}
                    onClick={() => setSetupGenres(prev => selected ? prev.filter(x => x !== g.id) : [...prev, g.id])}
                    className={px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
                      selected ? "bg-white text-black border-white" : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10"
                    }}
                  >
                    {g.name}
                  </button>
                );
              })}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="flex flex-col gap-3">
            <Button
              onClick={completeSetup}
              disabled={!setupName.trim()}
              className="w-full rounded-2xl py-7 text-lg font-bold bg-white text-black hover:bg-white/90 disabled:opacity-30"
            >
              Start discovering
            </Button>
            <Button variant="ghost" onClick={() => { setProfile({ name: "Explorer", favoriteGenres: [], createdAt: new Date().toISOString() }); setView("discover"); }} className="text-white/30 text-sm">
              Skip for now
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  const current = feed[currentIndex];

  // ─── List management ────────────────────────────────────────────
  async function removeFromWatchlist(movieId: number) {
    const newWantToWatch = prefs.wantToWatch.filter(id => id !== movieId);
    await savePrefs({ ...prefs, wantToWatch: newWantToWatch });
  }

  // ═══════════════════════════════════════════════════════════════
  // MAIN APP SHELL
  // ═══════════════════════════════════════════════════════════════
  return (
    <div className="fixed inset-0 z-[100] bg-[#0a0a0a] text-white flex flex-col overflow-hidden">

      {/* ── Top Bar ─────────────────────────────────────────────── */}
      <div className="h-14 flex items-center justify-between px-4 shrink-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
        <Button variant="ghost" size="icon" className="text-white/60 hover:text-white" onClick={() => router.back()}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h1 className="font-black text-sm tracking-[0.25em] text-white/80 uppercase">MovieVerse</h1>
        <Button variant="ghost" size="icon" className="text-white/60 hover:text-white" onClick={() => setView(view === "search" ? "discover" : "search")}>
          <Search className="w-5 h-5" />
        </Button>
      </div>

      {/* ── Content ─────────────────────────────────────────────── */}
      <div className="flex-1 relative overflow-y-auto pb-24">

        {/* ═══ DISCOVER ═══ */}
        {view === "discover" && (
          <div className="h-full flex flex-col items-center justify-center relative">

            {/* Mood + Filter bar */}
            <div className="absolute top-4 inset-x-0 flex justify-center gap-2 z-30 px-4">
              <button
                onClick={() => setShowMoodPicker(true)}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/15 backdrop-blur-md text-white/80 text-xs font-semibold px-4 py-2 rounded-full border border-white/10 transition-all"
              >
                {selectedMood ? <><span>{MOODS.find(m=>m.id===selectedMood)?.emoji}</span> {MOODS.find(m=>m.id===selectedMood)?.label}</> : <><Sparkles className="w-3.5 h-3.5" /> Mood</>}
              </button>
              <button
                onClick={() => setShowFilters(true)}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/15 backdrop-blur-md text-white/80 text-xs font-semibold px-4 py-2 rounded-full border border-white/10 transition-all"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" /> Filters {filterGenres.length > 0 && <span className="bg-white/20 text-[10px] px-1.5 rounded-full">{filterGenres.length}</span>}
              </button>
            </div>

            {/* Mood Picker */}
            <AnimatePresence>
              {showMoodPicker && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-6">
                  <h2 className="text-3xl font-black mb-2">How do you feel?</h2>
                  <p className="text-white/40 mb-10 text-sm">Pick a mood to shape your feed.</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-lg">
                    {MOODS.map(mood => (
                      <motion.button key={mood.id} whileTap={{ scale: 0.95 }} onClick={() => selectMood(mood.id)}
                        className={flex items-center gap-3 p-4 rounded-2xl border text-left transition-all ${selectedMood === mood.id ? "bg-white/15 border-white/30" : "bg-white/5 border-white/10 hover:bg-white/10"}}
                      >
                        <span className="text-2xl">{mood.emoji}</span>
                        <span className="text-sm font-semibold text-white/80">{mood.label}</span>
                      </motion.button>
                    ))}
                  </div>
                  <Button variant="ghost" className="mt-8 text-white/40" onClick={() => { setShowMoodPicker(false); setSelectedMood(null); setFeed([]); fetchFeed(null, filterGenres); }}>
                    Clear mood
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Filter Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-6">
                  <h2 className="text-3xl font-black mb-2">Filter by genre</h2>
                  <p className="text-white/40 mb-8 text-sm">Select genres to narrow your feed.</p>
                  <div className="flex flex-wrap gap-2 max-w-lg justify-center mb-10">
                    {GENRE_LIST.map(g => {
                      const sel = filterGenres.includes(g.id);
                      return (
                        <button key={g.id} onClick={() => setFilterGenres(prev => sel ? prev.filter(x => x !== g.id) : [...prev, g.id])}
                          className={px-4 py-2 rounded-full text-sm font-semibold transition-all border ${sel ? "bg-white text-black border-white" : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10"}}
                        >
                          {g.name}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex gap-3">
                    <Button variant="ghost" className="text-white/40" onClick={() => { setFilterGenres([]); setShowFilters(false); setFeed([]); fetchFeed(selectedMood, []); }}>Clear all</Button>
                    <Button onClick={() => applyFilters(filterGenres)} className="rounded-full bg-white text-black hover:bg-white/90 px-8">Apply</Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {loading ? (
              <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <p className="text-white/30 text-sm">Curating your feed…</p>
              </div>
            ) : current ? (
              <div className="w-full max-w-md px-4 flex flex-col items-center justify-center h-full pt-14">

                {/* Swipeable Card */}
                <SwipeableCard
                  key={current.id}
                  movie={current}
                  whyText={whyThisMovie(current, prefs, currentIndex)}
                  showOverview={showOverview}
                  toggleOverview={() => setShowOverview(!showOverview)}
                  onSwipe={(dir) => {
                    if (dir === "left") handleNotInterested();
                    else if (dir === "right") handleLoveIt();
                    else if (dir === "up") handleInterested();
                    else if (dir === "down") handleSkip();
                  }}
                />

                {/* Watched sub-prompt */}
                <AnimatePresence>
                  {showWatchedPrompt && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-4 mt-4 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                      <span className="text-sm text-white/60 font-semibold">Did you like it?</span>
                      <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleWatchedRating(true)} className="w-12 h-12 rounded-full bg-green-500/20 border border-green-500/40 text-green-400 flex items-center justify-center">
                        <ThumbsUp className="w-5 h-5" />
                      </motion.button>
                      <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleWatchedRating(false)} className="w-12 h-12 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center">
                        <ThumbsDown className="w-5 h-5" />
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Action Buttons — 5 options with labels */}
                {!showWatchedPrompt && (
                  <div className="flex items-end justify-center gap-3 sm:gap-4 mt-6 w-full">
                    <ActionCircle onClick={handleSkip} color="gray" size="sm" icon={<SkipForward className="w-5 h-5" />} label="Skip" />
                    <ActionCircle onClick={handleNotInterested} color="red" size="lg" icon={<X className="w-7 h-7" />} label="Not for me" />
                    <ActionCircle onClick={handleWatchedTap} color="blue" size="sm" icon={<Eye className="w-5 h-5" />} label="Watched" />
                    <ActionCircle onClick={handleInterested} color="purple" size="lg" icon={<Bookmark className="w-7 h-7" />} label="Interested" />
                    <ActionCircle onClick={handleLoveIt} color="pink" size="sm" icon={<Heart className="w-5 h-5 fill-current" />} label="Love it" />
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center px-8 max-w-md">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-white/20" />
                </div>
                <h3 className="text-2xl font-black mb-3">You&apos;ve explored them all.</h3>
                <p className="text-white/40 mb-8 text-sm">We&apos;re searching deeper into cinema for you.</p>
                <Button onClick={() => { setFeed([]); fetchFeed(selectedMood, filterGenres); }} className="rounded-full bg-white text-black hover:bg-white/90 px-8">Refresh Feed</Button>
              </div>
            )}
          </div>
        )}

        {/* ═══ SEARCH ═══ */}
        {view === "search" && (
          <div className="p-4 sm:p-8 max-w-3xl mx-auto">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <Input
                  autoFocus
                  value={searchQuery}
                  onChange={e => handleSearch(e.target.value)}
                  placeholder="Search for a movie or TV show…"
                  className="bg-white/5 border-white/10 text-white rounded-xl h-14 pl-12 text-lg placeholder:text-white/20"
                />
              </div>
            </div>

            {searchLoading && <div className="text-center py-8"><div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto" /></div>}

            <div className="space-y-3">
              {searchResults.map(movie => {
                const isLiked = prefs.likes.includes(movie.id);
                const isWatchlist = prefs.wantToWatch.includes(movie.id);
                const isWatched = prefs.watched.includes(movie.id);
                return (
                  <div key={movie.id} className="flex gap-4 bg-white/5 rounded-2xl p-3 border border-white/5 items-center">
                    <div className="w-16 h-24 rounded-xl overflow-hidden bg-white/5 shrink-0">
                      <img src={${IMG_SM}${movie.poster_path}} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm truncate">{movie.title || movie.name}</h3>
                      <p className="text-white/40 text-xs mt-1">{movie.release_date?.substring(0,4) || movie.first_air_date?.substring(0,4)} · ⭐ {Math.round(movie.vote_average * 10)}%</p>
                      <div className="flex gap-2 mt-3">
                        <button onClick={() => addFromSearch(movie, "wantToWatch")} disabled={isWatchlist} className={text-[10px] font-bold px-3 py-1.5 rounded-full border transition-all ${isWatchlist ? "bg-purple-500/20 border-purple-500/40 text-purple-400" : "border-white/10 text-white/50 hover:bg-white/10"}}>
                          {isWatchlist ? "✓ Saved" : "Save"}
                        </button>
                        <button onClick={() => addFromSearch(movie, "likes")} disabled={isLiked} className={text-[10px] font-bold px-3 py-1.5 rounded-full border transition-all ${isLiked ? "bg-pink-500/20 border-pink-500/40 text-pink-400" : "border-white/10 text-white/50 hover:bg-white/10"}}>
                          {isLiked ? "♥ Loved" : "Love"}
                        </button>
                        <button onClick={() => addFromSearch(movie, "watched")} disabled={isWatched} className={text-[10px] font-bold px-3 py-1.5 rounded-full border transition-all ${isWatched ? "bg-blue-500/20 border-blue-500/40 text-blue-400" : "border-white/10 text-white/50 hover:bg-white/10"}}>
                          {isWatched ? "✓ Seen" : "Seen"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {searchQuery && !searchLoading && searchResults.length === 0 && (
              <div className="text-center py-16 text-white/30">
                <Search className="w-10 h-10 mx-auto mb-4 opacity-30" />
                <p>No results for &ldquo;{searchQuery}&rdquo;</p>
              </div>
            )}
          </div>
        )}

        {/* ═══ MY LISTS ═══ */}
        {view === "lists" && (
          <div className="p-5 sm:p-8 max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black tracking-tight">Your Cinema Shelf</h2>
              <div className="flex gap-4 text-xs text-white/30 font-bold">
                <span>❤️ {prefs.likes.length} loved</span>
                <span>👁️ {prefs.watched.length} seen</span>
              </div>
            </div>
            {watchlistMovies.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {watchlistMovies.map(movie => (
                  <div key={movie.id} className="relative aspect-[2/3] rounded-xl overflow-hidden bg-white/5 group cursor-pointer">
                    <img src={${IMG_SM}${movie.poster_path}} alt={movie.title} className="w-full h-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                      <p className="text-white text-xs font-bold truncate pr-6">{movie.title}</p>
                      <button 
                        onClick={(e) => { e.stopPropagation(); removeFromWatchlist(movie.id); }}
                        className="absolute top-2 right-2 w-6 h-6 bg-black/50 hover:bg-red-500/80 rounded-full flex items-center justify-center backdrop-blur-md transition-colors"
                      >
                        <X className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-24">
                <Bookmark className="w-12 h-12 text-white/10 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white/60 mb-2">Your cinema shelf is empty.</h3>
                <p className="text-white/30 text-sm mb-6">Let&apos;s find the first movie.</p>
                <Button onClick={() => setView("discover")} className="rounded-full bg-white text-black hover:bg-white/90">Discover</Button>
              </div>
            )}
          </div>
        )}

        {/* ═══ MATCH ═══ */}
        {view === "match" && (
          <div className="p-5 sm:p-8 max-w-lg mx-auto flex flex-col items-center">

            {/* Pick reveal overlay */}
            <AnimatePresence>
              {pickedMovie && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center">
                  <p className="text-white/40 text-sm font-bold uppercase tracking-[0.3em] mb-6">Tonight&apos;s Movie</p>
                  <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, type: "spring" }} className="w-48 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl shadow-white/10 mb-8">
                    <img src={${IMG_SM}${pickedMovie.poster_path}} alt={pickedMovie.title} className="w-full h-full object-cover" />
                  </motion.div>
                  <motion.h2 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="text-4xl font-black mb-3">{pickedMovie.title}</motion.h2>
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="text-white/40 text-sm mb-10">
                    {pickedMovie.release_date?.substring(0,4)} · ⭐ {Math.round(pickedMovie.vote_average * 10)}%
                  </motion.p>
                  <div className="flex gap-4">
                    <Button onClick={() => setPickedMovie(null)} variant="outline" className="rounded-full border-white/20 text-white hover:bg-white/10">Pick again</Button>
                    <Button onClick={() => { setPickedMovie(null); setView("discover"); }} className="rounded-full bg-white text-black hover:bg-white/90">Done</Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="w-full bg-white/5 rounded-3xl p-6 sm:p-8 border border-white/10 mb-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-600/20">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-black mb-2">Movie Match</h2>
              <p className="text-white/40 mb-8 text-sm">Find which movies you and a friend both want to watch.</p>

              <div className="bg-white/5 p-4 rounded-2xl mb-6 text-left border border-white/5">
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-wider mb-2">Your Connect Code</p>
                <div className="flex items-center justify-between bg-black/40 rounded-xl p-3">
                  <div className="min-w-0 flex-1 mr-4">
                    {profile?.name && <p className="text-xs font-bold text-white/70 mb-0.5">{profile.name}</p>}
                    <p className="text-xs font-mono text-white/50 truncate tracking-wider">{user?.uid}</p>
                  </div>
                  <Button size="icon" variant="ghost" className="text-white/80 hover:text-white shrink-0 bg-white/10 hover:bg-white/20 rounded-full w-8 h-8" onClick={() => navigator.clipboard.writeText(user?.uid || "")}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-2">
                <Input placeholder="Paste friend's code…" value={friendId} onChange={e => setFriendId(e.target.value)} className="bg-black/40 border-white/10 rounded-xl text-white placeholder:text-white/20" />
                <Button onClick={handleMatch} disabled={matchLoading || !friendId.trim()} className="rounded-xl px-6 bg-white text-black hover:bg-white/90 disabled:opacity-50">{matchLoading ? "…" : "Match"}</Button>
              </div>
            </div>

            {matchResults !== null && (
              <div className="w-full">
                {friendProfile && (
                  <div className="text-center mb-6">
                    <p className="text-sm text-white/50">Matching with <span className="font-bold text-white/80">{friendProfile.name}</span></p>
                  </div>
                )}
                {matchResults.length > 0 ? (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold">{matchResults.length} shared {matchResults.length === 1 ? "movie" : "movies"}</h3>
                      <Button onClick={pickForUs} className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm px-6 shadow-lg">
                        <Shuffle className="w-4 h-4 mr-2" /> Pick for us
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {matchResults.map(movie => (
                        <div key={movie.id} className="aspect-[2/3] rounded-xl overflow-hidden bg-white/5">
                          <img src={${IMG_SM}${movie.poster_path}} alt={movie.title} className="w-full h-full object-cover" loading="lazy" />
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-white/40 text-lg font-semibold mb-2">Your tastes haven&apos;t crossed paths yet.</p>
                    <p className="text-white/20 text-sm">Both of you should swipe more movies and try again.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Bottom Navigation ──────────────────────────────────── */}
      <div className="fixed bottom-0 inset-x-0 h-20 bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-white/5 z-[110] flex items-center justify-around px-4">
        <NavBtn icon={<Sparkles />} label="Discover" active={view === "discover"} onClick={() => setView("discover")} />
        <NavBtn icon={<Search />} label="Search" active={view === "search"} onClick={() => setView("search")} />
        <NavBtn icon={<Bookmark />} label="Shelf" active={view === "lists"} onClick={() => setView("lists")} />
        <NavBtn icon={<Users />} label="Match" active={view === "match"} onClick={() => setView("match")} />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SWIPEABLE CARD
// ═══════════════════════════════════════════════════════════════════
function SwipeableCard({
  movie, whyText, showOverview, toggleOverview, onSwipe,
}: {
  movie: Movie; whyText: string | null; showOverview: boolean; toggleOverview: () => void;
  onSwipe: (direction: "left" | "right" | "up" | "down") => void;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-12, 12]);
  const likeOpacity = useTransform(x, [0, 80], [0, 1]);
  const nopeOpacity = useTransform(x, [-80, 0], [1, 0]);
  const saveOpacity = useTransform(y, [-80, 0], [1, 0]);
  const skipOpacity = useTransform(y, [0, 80], [0, 1]);

  function handleDragEnd(_: any, info: PanInfo) {
    if (info.offset.x > 100) onSwipe("right");
    else if (info.offset.x < -100) onSwipe("left");
    else if (info.offset.y < -100) onSwipe("up");
    else if (info.offset.y > 100) onSwipe("down");
  }

  const title = movie.title || movie.name || "";
  const year = movie.release_date?.substring(0, 4) || movie.first_air_date?.substring(0, 4) || "";
  const genres = (movie.genre_ids || []).slice(0, 3).map(id => GENRE_MAP[id]).filter(Boolean);

  return (
    <motion.div
      drag dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }} dragElastic={0.9}
      onDragEnd={handleDragEnd} style={{ x, y, rotate }}
      initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }}
      className="relative w-full aspect-[2/3] rounded-3xl overflow-hidden shadow-2xl shadow-black/50 cursor-grab active:cursor-grabbing touch-none select-none"
    >
      <img src={API_KEY ? ${IMG_BG}${movie.backdrop_path} : movie.poster_path} alt="" className="absolute inset-0 w-full h-full object-cover" draggable={false} />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" />

      {/* Swipe indicators */}
      <motion.div style={{ opacity: likeOpacity }} className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
        <div className="text-4xl sm:text-5xl font-black text-pink-400 border-4 border-pink-400 rounded-2xl px-5 py-2 -rotate-12 bg-pink-400/10 backdrop-blur-sm">LOVE</div>
      </motion.div>
      <motion.div style={{ opacity: nopeOpacity }} className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
        <div className="text-4xl sm:text-5xl font-black text-red-500 border-4 border-red-500 rounded-2xl px-5 py-2 rotate-12 bg-red-500/10 backdrop-blur-sm">NOPE</div>
      </motion.div>
      <motion.div style={{ opacity: saveOpacity }} className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
        <div className="text-4xl sm:text-5xl font-black text-purple-400 border-4 border-purple-400 rounded-2xl px-5 py-2 bg-purple-400/10 backdrop-blur-sm">SAVE</div>
      </motion.div>
      <motion.div style={{ opacity: skipOpacity }} className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
        <div className="text-4xl sm:text-5xl font-black text-white/60 border-4 border-white/60 rounded-2xl px-5 py-2 bg-white/10 backdrop-blur-sm">SKIP</div>
      </motion.div>

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 z-20 pointer-events-auto">
        {whyText && (
          <p className="text-[10px] text-white/40 font-semibold mb-2 flex items-center gap-1"><Sparkles className="w-3 h-3" /> {whyText}</p>
        )}
        <h2 className="text-2xl sm:text-3xl font-black leading-none tracking-tight mb-2 drop-shadow-lg">{title}</h2>
        <div className="flex items-center gap-2 text-xs text-white/50 font-medium mb-2 flex-wrap">
          <span className="flex items-center gap-1 text-yellow-400"><Star className="w-3 h-3 fill-current" /> {Math.round(movie.vote_average * 10)}%</span>
          {year && <span>{year}</span>}
          {genres.map(g => <span key={g} className="bg-white/10 px-2 py-0.5 rounded-full">{g}</span>)}
        </div>
        <button onClick={(e) => { e.stopPropagation(); toggleOverview(); }} className="text-[10px] text-white/30 hover:text-white/60 font-semibold flex items-center gap-1">
          <Info className="w-3 h-3" /> {showOverview ? "Hide" : "Synopsis"}
        </button>
        <AnimatePresence>
          {showOverview && (
            <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="text-xs text-white/40 mt-2 leading-relaxed overflow-hidden">
              {movie.overview}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// ACTION CIRCLE
// ═══════════════════════════════════════════════════════════════════
function ActionCircle({ onClick, color, size, icon, label }: {
  onClick: () => void; color: "red" | "blue" | "purple" | "pink" | "gray"; size: "sm" | "md" | "lg"; icon: React.ReactNode; label: string;
}) {
  const colors = {
    red: "border-red-500/30 text-red-400",
    blue: "border-blue-500/30 text-blue-400",
    purple: "border-purple-500/30 text-purple-400",
    pink: "border-pink-500/30 text-pink-400",
    gray: "border-white/15 text-white/40",
  };
  const sizes = { sm: "w-12 h-12", md: "w-14 h-14", lg: "w-16 h-16" };

  return (
    <div className="flex flex-col items-center gap-1">
      <motion.button whileTap={{ scale: 0.85 }} onClick={onClick} className={${sizes[size]} rounded-full border-2 ${colors[color]} flex items-center justify-center transition-colors bg-transparent active:bg-white/5}>
        {icon}
      </motion.button>
      <span className="text-[9px] font-bold text-white/25 uppercase tracking-wider whitespace-nowrap">{label}</span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// NAV BUTTON
// ═══════════════════════════════════════════════════════════════════
function NavBtn({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${active ? "text-white" : "text-white/30 hover:text-white/60"}}>
      <div className={p-1.5 rounded-full transition-all ${active ? "bg-white/10" : ""}}>
        {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: "w-5 h-5" })}
      </div>
      <span className="text-[10px] font-bold tracking-wider">{label}</span>
    </button>
  );
}
whats happening is  poste images are not loading fast, and most of movies that are coming are not known to me,  filters , mood nothing is working, list is anyway what imdb gives,  improve gestures, down is currently nothing, make it skip . if saved, then what, what is shown in shelf, shelf items should be editable, , for mathing user id looks scary, make it little good looking,  think more, deep, and work, update md filke  more suggestions

I went deeper than just listing UI tweaks. I turned your current code/problem set into a product + UX + recommendation-engine upgrade brief for an AI coding agent.

It covers:

    ⚡ Much faster poster/card loading

    🎬 Known/familiar movie bias instead of obscure TMDB results

    🧠 Real recommendation scoring and taste learning

    🎭 Mood actually affecting recommendations

    👆 4-direction gestures with proper velocity handling

    ↓ Down = Skip

    ↶ Undo

    🔖 Clear Save → Shelf → Watched → Loved lifecycle

    🗂️ Editable Shelf with tabs/actions/sorting

    🎲 Tonight Mode

    👥 Friendly Match Codes instead of scary Firebase UIDs

    🔗 Shareable friend invitations

    ❤️ Better Movie Match logic

    🧬 Long-term Movie DNA / Taste Profile

    🚀 Optimistic UI, prefetching, batching, race-condition fixes

    📱 Mobile + desktop gesture/accessibility improvements

    🧪 A proper testing checklist

    🤖 A copy-paste AI coding-agent prompt telling the AI how to implement it without blindly rewriting everything

Download the updated Markdown brief

MovieVerse_AI_Product_Upgrade_Brief.md

The biggest conceptual change I'd make is this:

    MovieVerse shouldn't be “IMDb + Tinder.” It should be a movie decision engine.

The goal isn't to show the user more movies. It's to progressively get them to one movie they actually want to watch.
MovieVerse_AI_Product_Upgrade_Brief.mdDocument
You're on the free plan
ChatGPT gets less accurate and may forget details in long conversations. Upgrade to chat longer with better memory.
Try Plus free
New chat


Library/
MovieVerse_AI_Product_Upgrade_Brief.md
MovieVerse — Product / UX / AI Upgrade Brief
Mission

MovieVerse should not feel like IMDb with swiping.

It should feel like a small personal movie concierge that gradually learns:

    "I know what you are in the mood for, and I know what you probably haven't seen."

The core product loop should become:

Discover → React → Learn → Refine → Surprise → Decide → Watch → Remember

The AI/developer should optimize for recognition, relevance, speed, and delight, not for the number of movies displayed.
1. Problems to Fix First
P0 — Movie artwork is too slow
Current issue

The discovery card uses:

const IMG_BG = "https://image.tmdb.org/t/p/w1280";

and the card requests a large backdrop every time.

That is excessive for a mobile card.
Required change

Use responsive TMDB image sizes:

const IMG_BG = "https://image.tmdb.org/t/p/w780";
const IMG_CARD = "https://image.tmdb.org/t/p/w500";
const IMG_POSTER = "https://image.tmdb.org/t/p/w342";
const IMG_THUMB = "https://image.tmdb.org/t/p/w185";

Prefer:

    w780 for the main cinematic card

    w342 or w500 for shelf posters

    w185 for search results

Do not load w1280 unless a full-screen desktop hero genuinely requires it.
Better card-image strategy

Do not wait for the image before rendering the card.

Use:

    poster thumbnail immediately

    blurred poster as placeholder

    backdrop/card image progressively

    next 2 cards preloaded

    only fetch high-resolution artwork for the active card

Example architecture:

<div className="relative overflow-hidden">
  {movie.poster_path && (
    <img
      src={`${IMG_POSTER}${movie.poster_path}`}
      className="absolute inset-0 w-full h-full object-cover blur-xl scale-110"
      aria-hidden
    />
  )}

  <img
    src={`${IMG_BG}${movie.backdrop_path || movie.poster_path}`}
    className="relative w-full h-full object-cover"
    loading="eager"
    decoding="async"
  />
</div>

Preload more intelligently

Do not preload only the immediate next movie.

Preload:

    current

    next

    next + 1

and cancel/deprioritize distant images.

Use a small image cache:

const imageCache = new Set<string>();

function preloadImage(url: string) {
  if (imageCache.has(url)) return;

  const img = new Image();
  img.src = url;
  imageCache.add(url);
}

Important

If backdrop_path is missing, never produce a broken/empty image.

Fallback chain:

backdrop → poster → gradient + title

2. Stop Showing Random/Obscure Movies
Current problem

The current feed is essentially:

trending
+
discover by genre
+
action
+
comedy
+
last liked recommendations

This creates a technically valid but psychologically poor feed.

The user is repeatedly asking:

    "Who even knows these movies?"

That means the algorithm is optimizing for availability, not recognition.
3. Introduce a "Known Movie Quality Gate"

Every movie entering the discovery feed should pass a quality filter.

Minimum starting rules:

function isGoodCandidate(movie: Movie) {
  return (
    movie.poster_path &&
    movie.vote_count >= 500 &&
    movie.vote_average >= 6.5 &&
    movie.popularity >= 20
  );
}

Do not blindly use these exact numbers forever.

Make them tunable:

const DISCOVERY_CONFIG = {
  minVoteCount: 500,
  minRating: 6.5,
  minPopularity: 20,
};

For a mainstream-first experience, start stricter:

vote_count >= 1000
vote_average >= 6.7
popularity >= 30

Then relax the threshold when the user exhausts the mainstream pool.
4. Use a Two-Lane Recommendation System

Do NOT make every movie "safe".

Use:
80% — Familiar

Movies that are:

    popular

    highly rated

    culturally recognizable

    recent or evergreen

    similar to things the user liked

20% — Discovery

Movies that are:

    critically/highly rated

    less obvious

    hidden gems

    older classics

    international

    genre-adjacent

Label discovery movies:

    ✨ Hidden Gem

or

    🎲 Something Different

This gives the user controlled novelty instead of random obscurity.
5. Build a Real Recommendation Score

Do not simply concatenate API responses.

Every candidate should receive a score.

Example:

score =
  popularityScore * 0.25 +
  ratingScore * 0.20 +
  voteConfidence * 0.15 +
  genreMatch * 0.15 +
  tasteSimilarity * 0.20 +
  freshness * 0.05;

Then sort by score.

Later, the system can become:

Personal taste
        ↓
Genre affinity
        ↓
Mood
        ↓
Popularity / recognition
        ↓
Quality
        ↓
Novelty

6. Fix Mood
Current problem

Mood currently just maps to genres.

For example:

"think" → [878, 9648, 18]

That is not really a mood engine.

Also:

with_genres=878,9648,18

can become overly restrictive because the genres are effectively combined.
Better approach

Mood should produce a recommendation profile, not merely a genre filter.

Example:

const MOOD_PROFILES = {
  think: {
    genres: [878, 9648, 18],
    keywords: ["mind-bending", "psychological", "mystery"],
    minRating: 7.0,
    minVotes: 500,
    novelty: 0.25,
  },

  laugh: {
    genres: [35],
    minRating: 6.5,
    minVotes: 300,
    novelty: 0.15,
  },

  adrenaline: {
    genres: [28, 53],
    minRating: 6.7,
    minVotes: 500,
    novelty: 0.20,
  },

  escape: {
    genres: [14, 878, 12],
    novelty: 0.35,
  },

  chill: {
    genres: [35, 10751, 16],
    minRating: 6.5,
    novelty: 0.10,
  }
};

7. Use OR Genre Logic Where Appropriate

Instead of:

with_genres=28,53

consider:

with_genres=28|53

when the intent is:

    Action OR Thriller

Use comma only when the desired behavior is:

    Action AND Thriller

This will make filters feel much less broken.
8. Mood Should Change the UI Too

When the user selects:

    🔥 Adrenaline

the experience should visibly change.

Examples:
Think

🧠 Let's mess with your brain.

Laugh

😂 You need a stupidly good time.

Scare

😈 You asked for this.

Date Night

🍿 Two people. One decision.

Surprise

🎲 Trust the algorithm.

This makes mood feel like a mode rather than a filter button.
9. Add "Why This?"

Current:

if (feedIndex < 5 && prefs.likes.length > 0)
  return "Based on movies you loved";

This is too generic.

Generate explanations from actual signals.

Examples:

Because you loved Interstellar

Because you keep choosing psychological thrillers

Popular with people who liked Inception

You liked 4 movies in this genre

A wildcard outside your usual taste

You haven't seen this yet

The explanation should be short and trustworthy.
10. Make the Card About the Movie, Not the API

Current card feels like a movie database card.

Make it feel like a recommendation.

Instead of only:

TITLE
⭐ 84%
2024
Action
Thriller
Synopsis

use:

✨ BECAUSE YOU LIKED INCEPTION

THE MOVIE

TITLE

8.4 ★   2024   2h 18m

"One sentence that tells me why I should care."

[ More ]

The movie title should dominate.

Metadata should be secondary.
11. Gesture System

The gesture model should be extremely clear.
Four directions

← LEFT
Not for me

→ RIGHT
Love it

↑ UP
Save for later

↓ DOWN
Skip

This creates a simple mental model:

LEFT  = NO
RIGHT = YES
UP    = MAYBE LATER
DOWN  = NOT NOW

Important

DOWN MUST ALWAYS WORK.

Current implementation already calls:

onSwipe("down")

but improve gesture recognition.

Use both:

    offset

    velocity

    dominant axis

Example:

const { offset, velocity } = info;

const horizontal =
  Math.abs(offset.x) > Math.abs(offset.y);

if (horizontal) {
  if (offset.x > 80 || velocity.x > 500) {
    onSwipe("right");
    return;
  }

  if (offset.x < -80 || velocity.x < -500) {
    onSwipe("left");
    return;
  }
}

if (offset.y < -80 || velocity.y < -500) {
  onSwipe("up");
  return;
}

if (offset.y > 80 || velocity.y > 500) {
  onSwipe("down");
}

12. Gesture Feedback Before Release

Do not wait until the card is released.

As the user drags:

← "NOT FOR ME"
→ "LOVE IT"
↑ "SAVE"
↓ "SKIP"

The label should progressively increase in opacity.

Also add subtle haptic feedback if available:

navigator.vibrate?.(10);

Only trigger it once when crossing the action threshold.
13. Add Directional Color / Visual Language

The card itself should communicate the action.

LEFT  → red
RIGHT → pink
UP    → purple
DOWN  → white/gray

Do not overdo the colors.

The movie artwork remains dominant.
14. Add Undo

This is essential.

After every swipe:

↶ Undo

appears briefly.

Example:

Saved to your shelf     ↶ Undo

Allow the last action to be reverted.

Store:

interface LastAction {
  movieId: number;
  previousPrefs: UserPreferences;
  action: "skip" | "dislike" | "save" | "love" | "watched";
}

This dramatically reduces swipe anxiety.
15. Reconsider "Skip"

Skip should mean:

    "Not now."

NOT:

    "Never show me this."

Your existing conceptual distinction is good.

However, don't persist every skip forever.

Instead:

skipped = temporary signal

Potentially expire skips after:

7–30 days

or simply use them to avoid immediate repetition.

This keeps the feed alive.
16. Saved / Interested Needs a Better Lifecycle

Currently:

Interested
→ wantToWatch
→ shelf

But then what?

This needs to become a lifecycle.
Movie lifecycle

DISCOVERED
    ↓
INTERESTED
    ↓
ON SHELF
    ↓
WATCHED
    ↓
LIKED / DISLIKED

A movie can also go:

INTERESTED
→ REMOVE

or:

INTERESTED
→ WATCHED
→ LOVED

17. Redesign Shelf

Do NOT make Shelf one poster grid.

It should be the user's movie dashboard.
Shelf tabs

FOR LATER
LOVED
WATCHED

Optional:

DISLIKED

but keep dislikes hidden by default.
18. Shelf Cards Should Be Editable

Every movie should have a context menu:

⋯

Actions:

Mark watched
Move to Loved
Remove from shelf
Not for me
Undo

For watched:

👍 Loved it
😐 It was okay
👎 Didn't like it

For loved:

Move to watched
Remove from loved

19. Add Shelf Intelligence

At the top:

YOUR CINEMA

12 movies waiting
4 loved
28 watched

Then:

🍿 TONIGHT?

Pick something from your shelf

Button:

🎲 Surprise me

This randomly selects from the user's saved movies.
20. Add "Tonight" Mode

This could become a signature feature.

User presses:

    What should I watch tonight?

Ask only 2–3 quick questions:

How much time?

○ < 90 min
○ ~2 hours
○ Don't care

What energy?

😌 Chill
🔥 Intense
😂 Funny
🧠 Smart
❤️ Emotional

Then:

Tonight's pick

THE MOVIE

Because:
You saved it 12 days ago
+
You loved 3 similar movies

[ Watch Trailer ]
[ That's not it ]
[ Let's watch ]

21. Matching Should NOT Expose Firebase UID

Current:

Your Connect Code
PG.... / Firebase UID

looks technical and unsafe.

Never show the raw Firebase UID as the primary user-facing identifier.

Instead create:

MV-7K4P-92Q

or:

CINEMA-8F2K

Use a random public code stored separately.
22. Better Match UX

Instead of:

Paste friend's code

make it:

🎬 Watch together

Find something you both want to watch.

Your Cinema Code
MV-7K4P-92Q

[ Copy code ]
[ Share invite ]

────────────

Friend's code

[ MV-____-___ ]

[ Find our movies ]

23. Even Better: Share Link

Generate:

movieverse://match/MV-7K4P-92Q

or a normal HTTPS invite:

/movieverse/match/MV-7K4P-92Q

Then:

Share with friend

The friend opens it and the app automatically fills the code.

This is much more natural than copying Firebase IDs.
24. Match Should Become More Than Intersection

Current:

my wantToWatch + likes
INTERSECTION
friend wantToWatch + likes

That is a good start but not enough.

Build a compatibility score per movie.

Example:

YOU
❤️ Loved

FRIEND
🔖 Saved

→ VERY PROMISING

Other combinations:

YOU: Loved
FRIEND: Watched + Loved
→ Already mutually validated

YOU: Saved
FRIEND: Saved
→ Perfect match

25. Match Categories

Instead of one grid:

🔥 BOTH WANT TO WATCH
❤️ BOTH LOVE
🎯 YOU'LL PROBABLY AGREE
🎲 ONE OF YOU MIGHT DISCOVER

This makes the social feature feel intelligent.
26. "Pick For Us" Needs More Drama

Current random selection is too basic.

Instead:

3...
2...
1...

Then reveal the poster.

Show:

TONIGHT'S PICK

The Prestige

You both saved this.

🎬 Decision made.

Optional:

Roll again

Limit roll-again to 2–3 times to preserve the feeling of a decision.
27. Search Should Also Teach the Algorithm

Search is currently mainly a lookup tool.

If a user searches:

Interstellar

and saves it, that should become a strong signal.

If they search and mark:

Loved

increase:

Sci-Fi affinity
Drama affinity
Christopher Nolan affinity
high-rated sci-fi affinity

The recommendation engine should learn from search actions too.
28. Build a Taste Profile

Don't just store arrays.

Eventually maintain:

interface TasteProfile {
  genres: Record<number, number>;
  decades: Record<string, number>;
  ratings: {
    likedAverage: number;
  };
  popularityPreference: number;
  noveltyPreference: number;
  runtimePreference: number;
}

Example:

Action       +7
Sci-Fi       +11
Drama        +4
Comedy       +2

High-rated   +8
Mainstream   +5
Old movies   -2
Long movies  +3

This becomes the actual recommendation engine.
29. Learn From Negative Signals

Not-for-me should not only exclude that movie.

It should optionally reduce similar movies.

For example:

Not For Me:
Fast & Furious 9

Possible weak signal:

Action -0.2
Franchise -0.1

Do NOT make a single dislike destroy an entire genre.

Negative signals should be weaker than positive signals.
30. Avoid Recommendation Loops

Current:

lastLiked → TMDB recommendations

This can become repetitive.

Instead use multiple seeds:

last 5 loved movies
+
top 3 saved movies
+
favorite genres
+
recent mood

Then merge and score.
31. Prevent the Same Movie From Returning

Create a global candidate exclusion set:

const excluded = new Set([
  ...prefs.watched,
  ...prefs.likes,
  ...prefs.dislikes,
  ...prefs.wantToWatch,
]);

For skipped movies, use temporary exclusion.

Also deduplicate across:

    trending

    discover

    recommendations

    search

    genre pools

32. Feed Should Have Pages / Batches

Do not fetch one tiny set and then run out.

Maintain:

current batch
next batch

When the user reaches the final 5 movies:

prefetch next batch

This prevents:

    "You've explored them all."

from appearing prematurely.
33. Feed Composition

A possible first 20 cards:

1  Popular
2  Taste match
3  Popular
4  Taste match
5  Hidden gem
6  Popular
7  Mood match
8  Taste match
9  Popular
10 Wildcard
...

This feels curated.

Do NOT dump 20 TMDB results into the feed.
34. Introduce "Recognition"

A powerful UX feature:

Have you seen this?

For older/popular movies.

Instead of assuming the user knows it, provide:

I know it
Never heard of it

But avoid adding another required button to every card.

Could be available inside:

More

or through a quick gesture/action.
35. Movie Details Drawer

Don't make synopsis the only detail.

Tap:

ⓘ

and open a bottom sheet containing:

Poster
Title
Rating
Year
Runtime

Synopsis

Cast
Director
Genres

Why you're seeing this

Trailer

Similar movies

The main swipe experience stays clean.
36. Trailer UX

Do not immediately navigate away.

Use:

Watch trailer

in a bottom sheet.

When trailer ends:

So... worth watching?

❤️ Love it
🔖 Save
✕ Not for me

That becomes another high-quality taste signal.
37. Add Runtime

Runtime is a surprisingly useful decision factor.

Show:

1h 47m

and allow:

Under 90m
90–120m
2h+

This can become part of:

    Tonight mode

38. Add Release-Era Filter

Allow:

Any era
2020s
2010s
2000s
90s
80s & earlier

But keep it hidden under advanced filters.
39. Don't Make Filters Feel Like a Database

Current filter panel is a list of genres.

Instead organize:

MOOD
😌 Chill
🔥 Intense
😂 Funny
🧠 Smart

GENRE
Action
Comedy
Sci-Fi
...

ERA
New
2010s
2000s
Classics

LENGTH
Short
Normal
Long

Then show:

12 movies match

before applying.
40. Filter Chips Should Be Visible

After applying:

🔥 Adrenaline   Action   <2h

Show active filters directly above the card.

Each chip can be removed.
41. Empty States Should Be Useful

Instead of:

You've explored them all.

say:

You've cleared this lane.

Want to:

[ Open the vault ]
[ Try another mood ]
[ Explore hidden gems ]

The app should never feel dead.
42. Add "The Vault"

When mainstream movies are exhausted:

THE VAULT

You've seen the obvious ones.

Let's go deeper.

Then lower popularity threshold gradually.

This is a much better way to introduce obscure cinema.
43. Make Discovery Progressive

Recommendation stages:

LEVEL 1
Popular + highly rated

LEVEL 2
Taste-adjacent

LEVEL 3
Genre depth

LEVEL 4
Hidden gems

LEVEL 5
Wildcards

The user should earn deeper discovery through interaction.
44. First 10 Swipes Matter Most

During early usage, prioritize learning.

After every action update temporary taste state.

Example:

Swipe 1 → Sci-Fi +
Swipe 2 → Thriller +
Swipe 3 → Comedy -
Swipe 4 → Sci-Fi +
Swipe 5 → Drama +

Then immediately adjust the next batch.

Do not wait for a large dataset.
45. Onboarding Should Be Optional

Current setup asks for:

Name
Genres

Consider a faster onboarding:

What do you want tonight?

Pick 3:
🔥 Adrenaline
😂 Laugh
🧠 Think
❤️ Romance
😱 Scary
🌌 Escape

Then:

Pick 3 movies you already love

This gives much stronger signals than manually choosing genres.
46. "Taste Calibration" Mode

A very strong onboarding idea:

Show 5 famous movies.

Ask:

Seen it?
Loved it?
Not for me?

Use well-known movies to quickly establish taste.

This also solves the current problem of unfamiliar initial recommendations.
47. Recommendation Confidence

Internally calculate:

confidence: 0 → 1

When confidence is low:

We're still learning your taste.

When high:

We know your kind of movie.

Do not expose a fake numerical score.
48. Add "Surprise Me" Properly

Current surprise just shuffles.

That's not a recommendation feature.

Instead Surprise should intentionally pick something:

70% familiar
20% adjacent
10% wildcard

And tell the user:

🎲 Wildcard

This is outside your usual taste,
but you might like it because...

49. Shelf Should Have Sorting

Allow:

Recently saved
Highest rated
Shortest
Newest
Oldest
A–Z

Do not require a giant filter panel.

Use a small sort button.
50. Shelf Item Quick Actions

On mobile, swipe a shelf item:

← Remove
→ Watched

or long press:

Edit

But don't make gestures mandatory; buttons must remain available.
51. Add Batch Management

Users should be able to select several saved movies:

Select
☑ Movie A
☑ Movie B
☑ Movie C

[ Mark watched ]
[ Remove ]

Useful when users import or accumulate many movies.
52. Match Privacy Model

Public information should be limited.

A match-code lookup should expose only:

displayName
avatar
public match preferences

Do not expose:

Firebase UID
email
private profile data

Prefer a dedicated public document:

public_movie_profiles/{matchCode}

that maps internally to the actual UID.
53. Firestore Architecture

Suggested structure:

user_movie_preferences/{uid}

user_movie_profiles/{uid}

public_movie_profiles/{matchCode}

movie_events/{uid}/events/{eventId}

Event example:

{
  movieId: 123,
  action: "love",
  timestamp: serverTimestamp(),
  source: "discover"
}

Events allow future recommendation improvements without destroying historical behavior.
54. Don't Rewrite Preferences as the Only History

Current arrays are useful for current state:

likes
dislikes
watched
wantToWatch
skipped

Keep them.

But also maintain event history.

This allows:

"What did the user used to like?"

and:

"Which recommendation caused this preference?"

55. Add Recommendation Analytics

Track anonymously:

card_impression
swipe_left
swipe_right
swipe_up
swipe_down
details_open
trailer_open
search
save
remove
match_created
match_pick

Useful product metrics:

time_to_first_action
swipes_per_session
save_rate
love_rate
skip_rate
match_rate
shelf_to_watched_rate

Do not collect unnecessary personal data.
56. Performance Architecture

Do not make every swipe trigger a large Firestore write + API chain synchronously.

Prefer:

UI action
↓
instant optimistic UI
↓
advance card immediately
↓
persist in background

Example:

setPrefs(nextPrefs);
advanceCard();

void persistPrefs(nextPrefs);

If persistence fails:

retry quietly

and optionally show:

Syncing…

This makes the app feel dramatically faster.
57. Batch Firestore Writes

If event tracking is introduced, batch writes where sensible.

Avoid:

every swipe = multiple Firestore writes

Especially on mobile networks.
58. Search Debounce

Current search fires on every keystroke.

Implement:

250–400ms debounce

and cancel stale requests.

Otherwise:

I
In
Inc
Ince
Incep
Incept

creates unnecessary TMDB requests.
59. Prevent Race Conditions

Search responses can return out of order.

Use:

const requestId = useRef(0);

async function handleSearch(query: string) {
  const id = ++requestId.current;

  ...

  const data = await fetch(...);

  if (id !== requestId.current) return;

  setSearchResults(...);
}

Do the same for feed requests.
60. Avoid Duplicate Feed Requests

Currently selectMood() calls:

fetchFeed(...)

while state changes can also trigger the effect that calls:

fetchFeed(...)

This can produce duplicate API requests.

Create one source of truth:

state changes
→ effect
→ fetch

or:

explicit user action
→ fetch

but not both.
61. Fix Feed State Model

Instead of:

feed
currentIndex

consider:

feed: Movie[]
cursor: number
isFetchingNextBatch: boolean
hasMore: boolean

Then fetch the next batch before the current one ends.
62. Card Stack

Instead of showing one card only, render:

TOP    current movie
BEHIND next movie
BEHIND next + 1

The next cards can be:

scale(0.96)
translateY(8px)
opacity(0.5)

When the current card leaves:

next card smoothly becomes active

This gives the Tinder-like physicality the product currently lacks.
63. Add Mouse / Trackpad Support

Desktop users should also be able to:

drag left/right/up/down

But additionally provide keyboard shortcuts:

← Not for me
→ Love
↑ Save
↓ Skip
Space = details
Z = undo

Show:

Keyboard shortcuts

only on desktop.
64. Accessibility

Do not make swiping the only interaction.

Every action needs:

    visible button

    keyboard support

    accessible label

    focus state

Example:

aria-label="Save this movie for later"

65. Mobile Safe Areas

The fixed bottom navigation should account for:

padding-bottom: env(safe-area-inset-bottom);

Otherwise iPhone-style devices can overlap the navigation.
66. Avoid Excessive Glassmorphism

Current UI uses glass everywhere.

Keep:

movie artwork = visual focus
glass = controls only

Do not put every component in a translucent card.

The product should feel cinematic, not like a dashboard.
67. Create a Cinematic Transition

When a movie is selected:

card flies away
↓
next card expands
↓
background changes
↓
action confirmation briefly appears

Example:

Saved ✓

then disappears.

Avoid toast notifications that feel like admin software.
68. Action Confirmation

After actions:
Save

🔖 Added to your shelf

Love

❤️ Taste updated

Not for me

Got it. We'll show you less like this.

Skip

Skipped for now

This creates a feeling that the app is learning.
69. Important Recommendation Principle

Do NOT say:

    "Because you liked X"

unless the system actually used X.

Do NOT say:

    "People like you loved this"

unless you have real data supporting it.

Every explanation must correspond to a real signal.
70. "Known vs New" Indicator

A useful internal ranking feature:

Familiarity score

Potential signals:

    TMDB popularity

    vote count

    release age

    franchise

    cast popularity

    current trending status

Then balance:

familiarity
vs
novelty

This directly addresses the current "I don't know these movies" problem.
71. Franchise Awareness

If the user loved:

Dune

don't repeatedly recommend:

Dune Part Two

and nothing else.

Instead recommend:

Dune Part Two
Arrival
Blade Runner 2049
Interstellar
Ex Machina

The system should understand the difference between:

same franchise
same genre
same themes
same audience

72. Avoid Recommending What the User Already Knows

The system needs stronger exclusion.

Exclude:

watched
loved
disliked
saved

but also consider:

movies marked as already watched through search

and potentially:

known titles imported from an external watchlist

later.
73. Import Is a Future Killer Feature

Eventually allow:

Import IMDb list
Import Letterboxd
Import Trakt

Then MovieVerse starts with real taste data.

This can dramatically improve cold-start recommendations.
74. Add "Taste Passport"

A fun profile page:

YOUR MOVIE DNA

🎬 Sci-Fi        ██████████
🔥 Thriller      ████████
😂 Comedy        █████
❤️ Romance       ███

You tend to like:
• High-concept stories
• Strong ratings
• Modern sci-fi
• Psychological tension

Your wildcard:
• Animation

Do not turn this into a rigid personality test.

It should be playful and editable.
75. Better Main Navigation

Current:

Discover
Search
Shelf
Match

Consider:

FOR YOU
SEARCH
SHELF
MOVIE NIGHT

"Movie Night" is more emotionally meaningful than "Match".
76. Home Screen Hierarchy

The main screen should communicate:

Good evening, Krishna

What are we watching?

[ Mood ]

                    MOVIE CARD

← Not for me    ↓ Skip    ↑ Save    Love →

[ 5-second recommendation explanation ]

Do not bury the purpose under controls.
77. Long-Term Product Vision

MovieVerse should eventually answer:

    "What should I watch?"

without asking the user to browse hundreds of posters.

The ideal interaction is:

Open app
↓
See one excellent candidate
↓
React in <2 seconds
↓
Next candidate improves
↓
Save a few
↓
MovieVerse learns
↓
"Tonight" picks one
↓
Friend joins
↓
Both agree
↓
Watch

That is the product.
78. AI Implementation Prompt

Use the following as the instruction to the coding AI:

    You are a senior product designer + UX engineer + recommendation-system engineer.

    Do not merely patch the existing MovieVerse implementation.

    First understand the product loop, then redesign the relevant architecture so that MovieVerse feels like a personalized cinematic concierge rather than a TMDB browser.

    Priorities, in order:

        Fix image loading and perceived performance.

        Make the initial feed recognizable and high quality.

        Make mood and filters actually change recommendation behavior.

        Implement reliable four-direction gestures.

        Make Skip = temporary/not-now.

        Make Save = a meaningful shelf lifecycle.

        Turn Shelf into an editable personal cinema collection.

        Replace exposed Firebase UID with a friendly public Match Code.

        Make Movie Match feel social and exciting.

        Build the foundation for taste learning.

    Preserve working Firebase authentication, Firestore persistence, TMDB integration, and existing Clinikkit integration unless a change is necessary.

    Do not introduce unnecessary libraries.

    Do not replace working architecture just for stylistic reasons.

    Before coding, inspect the existing state flow and identify:

        duplicate API calls

        race conditions

        unnecessary image sizes

        incorrect TMDB filtering semantics

        recommendation-quality problems

        state synchronization issues

        mobile gesture problems

    Then implement the smallest coherent architecture that solves them.

    Do not create fake AI.

    If a feature claims to be personalized, it must be based on an actual stored signal.

    Do not show raw Firebase UIDs to users.

    Do not treat Skip as Dislike.

    Do not make obscure movies the default discovery experience.

    Do not make the user browse huge grids.

    The first 10–20 recommendations should feel deliberately curated.

    Use optimistic UI for swipe actions.

    Preload upcoming cards.

    Use responsive image sizes.

    Add an undo action.

    Add accessible buttons for every gesture.

    Keep the visual hierarchy cinematic and restrained.

    After implementation, test:

        slow 4G

        mobile Firefox

        mobile Chrome

        desktop

        empty Firestore state

        returning user

        no API results

        missing backdrop

        missing poster

        failed TMDB request

        failed Firestore write

        duplicate movie results

        rapid swipes

        diagonal gestures

        downward swipe

        undo

        shelf editing

        match-code lookup

    Finally, explain:

        What was changed.

        Why it was changed.

        What recommendation signals are now used.

        What remains intentionally simple.

        What should be built next.

79. Suggested Development Order
Phase 1 — Make it feel fast

    Responsive TMDB image sizes

    Progressive image loading

    Image fallback

    Preload next 2 cards

    Optimistic swipe actions

    Remove duplicate fetches

    Search debounce

    Feed batching

Phase 2 — Make recommendations good

    Quality gate

    Familiarity score

    Recommendation score

    80/20 familiar/discovery mix

    Correct mood filtering

    Correct genre OR/AND behavior

    Multiple recommendation seeds

    Better "Why this?"

Phase 3 — Make the swipe loop excellent

    Four-direction gesture engine

    Down = Skip

    Velocity detection

    Directional overlays

    Haptic feedback

    Card stack

    Undo

    Keyboard shortcuts

Phase 4 — Make Shelf useful

    For Later

    Loved

    Watched

    Edit actions

    Sort

    Surprise Me

    Tonight mode

    Batch editing

Phase 5 — Make Match social

    Public Match Code

    Share invite

    Match categories

    Compatibility signals

    Dramatic Pick For Us

    Privacy-safe Firestore model

Phase 6 — Make it truly personal

    Event history

    Taste profile

    Positive/negative weighting

    Runtime preference

    Era preference

    Popularity/novelty preference

    Franchise/theme similarity

    Taste Passport

80. North-Star UX Test

After every major change, ask:

    If I open MovieVerse for the first time, can I understand what to do within 3 seconds?

Then:

    After 5 swipes, does the feed feel more relevant?

Then:

    After saving a movie, is it obvious what happens next?

Then:

    Can two friends decide on a movie in under 60 seconds?

If the answer is no, simplify the interface or improve the underlying recommendation logic.
Final Product Principle

MovieVerse should not compete with IMDb on the amount of information it displays.

It should compete on the amount of decision-making it removes.

The product should make the user feel:

    "I don't need to search anymore. Just show me something good."

