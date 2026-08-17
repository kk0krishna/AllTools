# Favicon Generator — Developer Documentation

A comprehensive browser-based Favicon generation tool built for **ToolVerse**. This tool empowers developers to quickly create complete favicon packages (ICO + PNG sizes + Web App Manifests) from images, text, and emojis, all natively within the browser using Canvas APIs and JSZip.

---

## 🏗️ Architecture & Component Overview

This tool is structured into three primary modules within `src/tools/developer/favicon-generator/`:

```
favicon-generator/
├── index.tsx       # Core logic, UI tabs, canvas rendering, and ZIP/ICO packing
├── metadata.tsx    # ToolVerse registry entry, SEO metadata, and FAQs
└── README.md       # Developer documentation (this file)
```

---

## ⚙️ Core Logic (`index.tsx`)

### 1. State Management
* **`activeTab`:** Manages which generator mode is currently active (`image`, `text`, `emoji`).
* **Image Mode:** Tracks uploaded `imageSrc` using `FileReader`.
* **Text Mode:** Tracks `text`, `fontFamily`, `fontVariant`, `fontSize`, `textColor`, `bgColor`, and `bgShape`.
* **Emoji Mode:** Integrates `emoji-picker-react` to allow rich emoji selection and tracks the selected `emoji`.

### 2. Canvas Previews (`drawPreview`)
* Uses a `useRef<HTMLCanvasElement>` to render a live, high-fidelity 150x150 preview of the favicon.
* Triggered automatically via a `useEffect` whenever any input state changes.
* Calculates responsive font sizes for Text/Emoji scaling based on the defined settings.

### 3. ZIP & ICO Generation (`handleDownload`)
* **Blob Generation (`generateImageBlob`)**: Renders the custom canvas states across different dimensions (16, 32, 48, 180, 192, 512) and extracts PNG blobs.
* **ICO Packing (`createIcoBlob`)**: Generates a raw `.ico` binary sequence embedding the 16x16, 32x32, and 48x48 PNG layers into a single valid ICO blob.
* **ZIP Packing**: Uses `jszip` to bundle all icons, `.ico` file, `site.webmanifest`, and a `readme.txt` into a downloadable package using `file-saver`.

---

## 🎨 UI & UX Features

* **Emoji Picker:** Uses `emoji-picker-react` for a searchable, complete emoji dictionary directly embedded in the UI.
* **Live Updates:** Any change in typography, color, or shape instantly redraws on the simulated browser tab preview.
* **Glassmorphism & Shadcn UI:** Fully styled using Tailwind and `@/components/ui/` for consistency.

---

## 🛠️ How to Maintain or Extend This Tool

### Adding New Background Shapes
1. Extend the `Shape` type definition: `type Shape = "square" | "circle" | "rounded" | "hexagon";`
2. Add the path-drawing logic for the new shape into both `drawPreview` and `generateImageBlob` using native `ctx.moveTo()`/`ctx.lineTo()`.
3. Add the new option to the `<select>` in the UI.

### Changing the Default Web Manifest
Locate the `manifest` object inside `handleDownload` and update the properties such as `theme_color` or add new fields as needed.

### Testing Locally
Run the development server and test exporting packages:
```bash
npm run dev
# Navigate to http://localhost:3000/tools/developer/favicon-generator
```
