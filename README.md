<div align="center">
  <img src="./public/logo.svg" alt="CliniKKit Logo" width="80" height="80" style="border-radius: 12px; margin-bottom: 20px;" />
  
  # CliniKKit — Clinical Tools & Medical Utilities
  
  **A free, fast, privacy-conscious collection of browser-based clinical calculators, medical utilities and practical tools for students and healthcare professionals.**

  [![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![Firebase](https://img.shields.io/badge/Firebase-Hosting-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
  
  <img src="./public/images/opengraph-image.png" alt="CliniKKit Promo" style="border-radius: 12px; margin-top: 20px; max-width: 100%; box-shadow: 0 10px 30px rgba(0,0,0,0.1);" />
</div>

## ✨ Features

- ⚡ **Blazing Fast**: Uses Next.js `output: export` to compile the entire site into pure static HTML, CSS, and JS. Zero server delays.
- 📱 **Progressive Web App (PWA)**: Installable on iOS/Android. Every single tool features its own unique custom app icon and name when added to the home screen!
- 🔍 **Perfect SEO**: Dynamic routing automatically injects Metadata (Title, Description, Keywords, OpenGraph) generated dynamically at build time for every single tool.
- 🧩 **Modular Tool Architecture**: A highly scalable registry pattern. Adding a new tool takes only a few minutes and keeps the codebase incredibly organized.
- 🎨 **Beautiful UI**: Built with `shadcn/ui` and Tailwind CSS. Modern, dark-mode ready, premium styling out of the box.
- 🆓 **100% Free Hosting**: Designed from the ground up to be fully compatible with Firebase Hosting's Free Tier (Spark Plan).

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Deployment**: [Firebase Hosting (Static Export)](https://firebase.google.com/docs/hosting)

---

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### Local Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/kk0krishna/AllTools.git
   cd AllTools
   ```

2. **Install the dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the app running locally.

---

## ➕ Adding a New Tool

To ensure the codebase scales well to hundreds of tools, we use a modular registry pattern. Follow these simple steps to add a new tool:

1. **Create the Tool Folder**:
   Create a new folder in `src/tools/<category>/<tool-slug>/`. *(For example: `src/tools/finance/gst-calculator/`)*.

2. **Create the Component (`index.tsx`)**:
   Build your interactive React component here using `shadcn/ui` and standard React hooks.

3. **Create the Metadata (`metadata.tsx`)**:
   Define the tool's SEO metadata and documentation content:
   ```tsx
   import { ToolEntry } from "@/tools/registry";
   import { GSTCalculator } from "./index";

   export const gstCalculatorEntry: ToolEntry = {
     metadata: {
       name: "GST Calculator",
       description: "Calculate GST instantly...",
       category: "finance",
       slug: "gst-calculator",
       keywords: ["gst", "tax calculator"],
     },
     component: GSTCalculator,
     content: () => (
       <>
         <h2>How to calculate GST</h2>
         <p>Documentation goes here...</p>
       </>
     ),
   };
   ```

4. **Register the Tool**:
   Open `src/tools/registry.ts` and add your new `ToolEntry` to the `toolsRegistry` array. Next.js will automatically generate the static route, sitemap, and SEO tags on the next build!

---

## ☁️ Deployment (Firebase Hosting)

Because this project uses Next.js Static Export, it is perfectly compatible with the **free tier (Spark Plan)** of Firebase Hosting.

1. **Install Firebase CLI and Login:**
   ```bash
   npm install -g firebase-tools
   firebase login
   ```

2. **Build the static site:**
   ```bash
   npm run build
   ```
   *(This compiles all pages and assets into the `out/` directory).*

3. **Deploy to Firebase:**
   ```bash
   firebase deploy --only hosting
   ```

## 🧰 Available Tools


### Audio
- [**Audio Spectrum Analyzer & Lossless Track Verifier**](https://clinikkit.web.app/tools/audio/audio-spectrum-analyzer): Verify if your audio tracks are truly lossless (FLAC/WAV) or fake transcoded 320 kbps MP3s. Full-track FFT spectrograms, dynamic range audits, and frequency cutoff analysis rendered 100% locally in your browser with zero file uploads.

### Calculators
- [**Advanced Clinical BMI Calculator**](https://clinikkit.web.app/tools/calculators/bmi-calculator): Calculate your Body Mass Index (BMI) with WHO classifications, discover your Ideal Body Weight, and explore personalized clinical insights.
- [**Age Calculator**](https://clinikkit.web.app/tools/calculators/age-calculator): Calculate your exact age in years, months, and days from your date of birth.

### Cardiology
- [**Jones Criteria for ARF**](https://clinikkit.web.app/tools/cardiology/jones-criteria): Diagnose Acute Rheumatic Fever (ARF) based on major and minor criteria.
- [**NYHA Heart Failure Classification**](https://clinikkit.web.app/tools/cardiology/nyha-heart-failure): Stratify the severity of heart failure based on functional capacity.

### Developer
- [**Favicon Generator**](https://clinikkit.web.app/tools/developer/favicon-generator): Generate a complete favicon package for your website from an image, text, or emoji. Includes ICO, PNG, and web manifest.
- [**JSON Formatter**](https://clinikkit.web.app/tools/developer/json-formatter): Format, validate, beautify, and minify your JSON data instantly.
- [**YouTube Transcript Downloader**](https://clinikkit.web.app/tools/developer/youtube-transcript): Extract, search, read, and download full text transcripts from any accessible YouTube video in TXT, Markdown, JSON, CSV, SRT, and VTT formats.

### Entertainment
- [**MovieVerse Suggestor**](https://clinikkit.web.app/tools/entertainment/movieverse): Discover movies and web series. Save your likes, dislikes, and watchlists.

### Everyday
- [**Barcode Generator**](https://clinikkit.web.app/tools/everyday/barcode-generator): Generate high-quality barcodes for products, inventory, and more.
- [**Instant QR Code Generator**](https://clinikkit.web.app/tools/everyday/qr-code-generator): Generate high-quality QR codes for URLs, text, or contacts instantly.
- [**PDF Compressor**](https://clinikkit.web.app/tools/everyday/pdf-compressor): Compress PDFs to specific size limits by optimizing and rasterizing pages.
- [**Upload Ready: Image Requirements Solver**](https://clinikkit.web.app/tools/everyday/image-converter): Precise KB compression, dimension resizing, and format conversion.

### Neurology
- [**Glasgow Coma Scale (GCS)**](https://clinikkit.web.app/tools/neurology/glasgow-coma-scale): Assess level of consciousness in trauma and acute medical patients.

### Obstetrics
- [**Instant Gestational Age (GA) Calculator**](https://clinikkit.web.app/tools/obstetrics/gestational-age-calculator): Rapid clinical calculator to determine exact gestational age in weeks and days on today's date or any target clinic visit/surgery date from LMP, EDD, or ultrasound scan.
- [**Interactive Gestational Timeline & Protocol Guide**](https://clinikkit.web.app/tools/obstetrics/pregnancy-timeline): Week-by-week clinical milestone tracker detailing required ultrasound scans, laboratory screening tests, vaccinations, and patient counselling guidelines from Week 4 to 42.
- [**Modified Bishop Score**](https://clinikkit.web.app/tools/obstetrics/bishop-score): Assess cervical favorability and probability of successful induction of labor.
- [**Preeclampsia Risk Assessment**](https://clinikkit.web.app/tools/obstetrics/preeclampsia-risk): ACOG Practice Bulletin 222-based preeclampsia risk stratification with low-dose aspirin recommendation for high-risk patients.
- [**Pregnancy Dating & Due Date Engine**](https://clinikkit.web.app/tools/obstetrics/pregnancy-calculator): Advanced obstetric calculator for estimating due date (EDD), gestational age (GA), viability milestones, and trimester progress by LMP, ultrasound scan, IVF transfer, or conception date.
- [**Reverse Due Date & Conception Estimator**](https://clinikkit.web.app/tools/obstetrics/edd-reverse-calculator): Reverse obstetric calculator to determine exact conception window, ovulation date, LMP, and IVF embryo transfer schedule from any target Estimated Due Date (EDD).

### Oncology
- [**Gleason Score**](https://clinikkit.web.app/tools/oncology/gleason-score): Determine the histologic grade and prognostic group for prostate cancer.

### Ophthalmology
- [**Ishihara Color Blindness Test**](https://clinikkit.web.app/tools/ophthalmology/ishihara-test): Screen for red-green color deficiency.

### Pediatrics
- [**Immunization Schedule Calculator**](https://clinikkit.web.app/tools/pediatrics/immunization-schedule): View standard CDC childhood immunizations due based on age.

### Psychology
- [**Feelings Wheel**](https://clinikkit.web.app/tools/psychology/emotion-compass): Navigate your feelings with an interactive emotion wheel. Identify what you are really feeling and connect with yourself.

### Pulmonology
- [**ABG Analyzer**](https://clinikkit.web.app/tools/pulmonology/abg-analyzer): Interpret Arterial Blood Gas (ABG) results to determine primary acid-base disorders and compensation.
- [**Light's Criteria**](https://clinikkit.web.app/tools/pulmonology/lights-criteria): Differentiate between exudative and transudative pleural effusions using fluid and serum markers.
- [**mMRC Dyspnea Scale**](https://clinikkit.web.app/tools/pulmonology/mmrc-dyspnea-scale): Assess the baseline functional severity of breathlessness (dyspnea) in respiratory diseases like COPD.
- [**Pack Years Calculator**](https://clinikkit.web.app/tools/pulmonology/pack-years-calculator): Quantify cumulative smoking history to assess lung disease and cancer risk.

---

## 👨‍💻 Developer & Maintainer

**Krishna KK**
- **GitHub**: [@kk0krishna](https://github.com/kk0krishna)
- **Project Link**: [https://github.com/kk0krishna/AllTools](https://github.com/kk0krishna/AllTools)

CliniKKit was developed by Krishna KK with a passion for delivering fast, high-performance applications. Designed as a reliable alternative to online tools that often feature intrusive ads, paywalls, or slow server-side processing, this platform reflects a commitment to clean engineering and clinical precision.

Contributions, issues, and feature requests are always welcome! Feel free to check the [issues page](https://github.com/kk0krishna/AllTools/issues) if you want to contribute.

---

## 📝 License

This project is open-source and free to use.
