# 🎧 ToolVerse Audio Spectrum Analyzer & Acoustic Forensics Suite

> **The ultimate in-browser acoustic diagnostics engine.** Verify whether audio tracks are genuine studio masters, CD lossless rips (`.flac` / `.wav`), or deceptive lossy transcodes (upconverted `.mp3` / `.aac`). Built with 100% client-side WebAudio API processing—files are analyzed locally on the user's machine and never touch a backend server.

---

## 🌟 Executive Overview & Value Proposition

In the digital music ecosystem, file extensions and ID3 bitrate tags are frequently forged or misleading. A **transcode** occurs when a low-quality lossy audio file (such as a 128 kbps MP3 ripped from a streaming video) is re-encoded and saved into a lossless container (`.flac` or `.wav`) or a 320 kbps MP3. While the file size inflates tenfold, the acoustic information stripped by the original lossy compression algorithm is lost forever.

The **ToolVerse Audio Spectrum Analyzer** replaces traditional desktop software (like *Spek*, *Adobe Audition*, or *XLD*) by bringing an audiophile-grade forensic laboratory directly into the web browser:
1. **Real-Time FFT Spectrogram Rendering**: Visualizes audio energy across time (X-axis) and frequency (Y-axis) up to the theoretical Nyquist ceiling (22.05 kHz for 44.1 kHz audio, or 48 kHz for 96 kHz studio masters).
2. **Automated Cutoff Ceiling Detection**: Analyzes decibel energy distribution across the upper frequency bins to calculate the exact frequency where sound energy drops off.
3. **Dynamic Range (DR) Auditing**: Computes Peak dBFS and Root-Mean-Square (RMS) dBFS across the waveform to assign a standardized Dynamic Range score (`DR1` to `DR14+`) and flag digital clipping or brickwall limiting.
4. **Rip Software Signature Detection**: Parses embedded Vorbis comments and ID3 headers to identify the exact encoder used during extraction (e.g., `libFLAC 1.4.3`, `LAME 3.99r`, or `Exact Audio Copy`).
5. **Zero Latency & Total Privacy**: No server uploads, no queues, and zero bandwidth consumption.

---

## 🏛️ Modular Architecture & Component Map

The application is structured using a clean, maintainable, atomic design pattern. Each component is responsible for a single aspect of the forensic analysis workflow:

```
src/tools/audio/audio-spectrum-analyzer/
├── README.md                 # Developer documentation & acoustic forensics architecture guide
├── index.tsx                 # Application orchestrator, drag-and-drop upload, and multi-track session tab switcher
├── metadata.tsx              # SEO configuration, schema metadata, and 11 interactive FAQ / Knowledge Base accordions
├── analyzer.ts               # Core WebAudio FFT math engine, Nyquist cutoff algorithm, DR scoring, and ID3 parser
└── components/
    ├── UploadSection.tsx     # Hero landing area with drag-and-drop zone, palette selector, and demo track loader
    ├── ResultHero.tsx        # Luxury certificate header displaying format verdict, confidence score, and Grade (A+ to F)
    ├── SpectrogramView.tsx   # High-performance 2D canvas renderer mapping FFT decibel energy to selectable color palettes
    ├── AudioPlayerBar.tsx    # Interactive playback scrubber positioned directly below the spectrogram canvas
    ├── MetricCards.tsx       # 4-card statistical dashboard (Cutoff Ceiling, DR Score, Bitrate, and Peak Health)
    ├── MetadataGrid.tsx      # Responsive metadata sheet showing embedded tags and rip software signatures
    ├── CompareLadder.tsx     # Interactive resolution ladder comparing track ceiling against industry benchmarks
    ├── ArtifactChecklist.tsx # Diagnostic verification sheet documenting why a specific grade was assigned
    └── ShareFooter.tsx       # 3-button export grid for copying text reports, OS native sharing, and PNG image downloads
```

---

## 🔬 Forensic Verification Algorithms Explained

### 1. Automated Cutoff Ceiling Detection (`analyzer.ts`)
To differentiate a genuine CD rip from an upconverted MP3, the engine scans the Fast Fourier Transform (FFT) frequency bins from the top Nyquist limit (`SampleRate / 2`) downwards:
* The algorithm establishes an acoustic noise floor threshold (-55 dBFS to -65 dBFS).
* It scans backwards from 22,050 Hz down to 10,000 Hz across all time slices in the track.
* **Genuine Lossless (`Grade A+ / A`)**: Significant high-frequency energy extends continuously up to 20.0 kHz – 22.05 kHz with natural acoustic dither fading smoothly at the top edge.
* **True 320 kbps MP3 (`Grade B+ / B`)**: Psychoacoustic encoders enforce a sharp, horizontal brickwall cutoff filter between 19.5 kHz and 20.5 kHz.
* **Low-Bitrate Transcode (`Grade C / D / F`)**: Files originally compressed at 128 kbps or 160 kbps exhibit a hard horizontal ceiling at 15.5 kHz or 16.0 kHz. Even if wrapped in a `.flac` container, the absence of frequencies above 16 kHz triggers a transcode alert.

### 2. Dynamic Range & Clipping Auditing
* **RMS dBFS**: Calculates the true average energy of the entire track using square-root mean calculations across audio PCM samples.
* **Peak dBFS**: Identifies the absolute highest sample transient in the waveform.
* **Clipping Detection**: If continuous sequential samples hit `0.0 dBFS` or `1.0 float`, the track is flagged as `⚠️ CLIPPED / LIMITED`, indicating potential distortion from excessive brickwall mastering ("The Loudness War").
* **DR Score**: Derives an approximate Dynamic Range rating (e.g., `DR11`) by evaluating the crest factor (difference between transient peaks and average RMS loudness).

---

## 🎨 Color Palettes & Visualization Mathematics

The canvas rendering engine transforms normalized decibel values into vibrant RGB color gradients using custom piecewise linear interpolation:
* **🔥 Siren Magma (Default)**: Deep purple noise floor $\rightarrow$ fiery crimson mids $\rightarrow$ brilliant golden-yellow transient peaks. Best for spotting sharp horizontal brickwall lines.
* **⚡ Cyberpunk**: Deep midnight blue $\rightarrow$ electric neon cyan $\rightarrow$ intense magenta highs. High contrast for electronic and synthesized music.
* **💎 Emerald Matrix**: Deep obsidian $\rightarrow$ rich forest green $\rightarrow$ intense lime-green peaks. Inspired by classic analog studio oscilloscopes and hardware spectrum analyzers.
* **🌊 Ocean Abyss**: Deep slate $\rightarrow$ royal blue $\rightarrow$ crystal cyan. Provides a soothing, low-eye-strain view for long mastering sessions.
* **🌓 Monochrome**: Clean grayscale mapping from solid black silence to pure white peaks. Ideal for academic print publications and high-contrast forensic documentation.

---

## ❓ Developer FAQ & Troubleshooting Guide

### Q: Why use client-side WebAudio processing instead of a Python backend (like Librosa or Scipy)?
**A:** Server-side audio processing introduces massive friction: uploading a 150 MB 24-bit FLAC file over standard residential broadband takes minutes, consumes server CPU/RAM, and creates copyright and privacy liabilities. By utilizing browser-native `AudioContext.decodeAudioData()` and typed arrays, decoding and FFT math execute at native WebAssembly speeds in seconds without transferring a single byte over the network.

### Q: Why do some acoustic or classical FLAC tracks show quieter energy above 18 kHz compared to EDM tracks?
**A:** Natural acoustic instruments (solo cello, acoustic guitar, female vocal ballads) produce fewer harmonic overtones above 16 kHz compared to electronic synthesizers, white noise risers, and heavily limited drum cymbals. Absence of bright yellow energy at 20 kHz does *not* mean a track is lossy; as long as there is no sharp, flat horizontal brickwall line across the entire track, a quieter top end simply reflects natural acoustics.

### Q: How do I add a new custom color palette?
**A:** Open `analyzer.ts`, add a new palette literal to the `ColorPalette` type definition, and define its RGB interpolation stops inside the `getPaletteColor(norm, palette)` switch statement. Then register its display badge inside `PALETTES` in `index.tsx`.

---

## 🚀 Getting Started & Local Development

### Prerequisites
* Node.js 18+ and npm / pnpm / yarn
* Next.js 16+ with Tailwind CSS v4

### Running Locally
```bash
# Install dependencies
npm install

# Start local development server
npm run dev
```

Navigate to `http://localhost:3000/tools/audio/audio-spectrum-analyzer` to test drag-and-drop audio forensics locally.

### Production Verification
To verify that all components compile cleanly into static SSG bundles without SSR window reference errors:
```bash
npm run build
```

---
*Built with precision for ToolVerse. 100% Client-Side Acoustic Forensics.*
