# Emotion Compass (Feelings Wheel)

An interactive, responsive feelings wheel designed to help users identify and explore their emotions. Originally based on the Plutchik/Gloria Wilcox models, this tool allows for multi-lingual exploration of core, secondary, and tertiary emotions.

## Features
- **Interactive SVG Wheel**: High-performance D3-based partition visualization.
- **Physics-Based Rotation**: Swipe/drag to spin the wheel with momentum on mobile and desktop.
- **Multilingual Support**: 11+ languages (English, Spanish, French, German, Italian, etc.).
- **URL State Sharing**: Share exact emotional states via a short, base64-encoded URL.
- **Print/PDF Export**: Highly optimized `@media print` layout leveraging flexbox to use 100% of the A4 page space for clinical/therapy handouts.
- **PWA Ready**: Unique standalone icons and dynamic web manifest for iOS/Android home screen installation.

## Layout Configuration
- The wheel scales automatically based on its container.
- For print views, constraints (`max-width: 800px`) are removed to allow the wheel to expand up to `195mm` on standard physical paper sizes, maximizing the visual area.
