const fs = require('fs');
const path = require('path');

const toolsIconsDir = path.join(process.cwd(), 'public', 'tools-icons');

// Remove shared folder if exists
const sharedDir = path.join(toolsIconsDir, 'shared');
if (fs.existsSync(sharedDir)) {
  fs.rmSync(sharedDir, { recursive: true, force: true });
  console.log('Removed invalid shared/ directory.');
}

const toolsData = [
  {
    slug: "age-calculator",
    category: "calculators",
    name: "Age & Chronological Milestone Calculator",
    short_name: "Age Calculator",
    description: "Calculate exact chronological age in years, months, weeks, days, hours, and minutes with upcoming milestone countdowns.",
    theme_color: "#3B82F6"
  },
  {
    slug: "bmi-calculator",
    category: "calculators",
    name: "Clinical BMI & Body Composition Calculator",
    short_name: "BMI Calculator",
    description: "Advanced Body Mass Index calculator with WHO & Asian BMI classification, ideal weight ranges, and body surface area.",
    theme_color: "#10B981"
  },
  {
    slug: "json-formatter",
    category: "developer",
    name: "JSON Formatter, Validator & Visualizer",
    short_name: "JSON Formatter",
    description: "Format, validate, beautify, and inspect complex JSON payloads with collapsible tree views and 100% private client execution.",
    theme_color: "#6366F1"
  },
  {
    slug: "favicon-generator",
    category: "developer",
    name: "Favicon & Web App Manifest Generator",
    short_name: "Favicon Maker",
    description: "Generate complete multi-resolution favicon packages, ICO files, Android Chrome icons, and Web App Manifests in your browser.",
    theme_color: "#F59E0B"
  },
  {
    slug: "youtube-transcript",
    category: "developer",
    name: "YouTube Transcript & Subtitle Downloader",
    short_name: "YT Transcript",
    description: "Extract, search, read, and export transcripts from YouTube videos in TXT, Markdown, JSON, CSV, SRT, and VTT formats.",
    theme_color: "#EF4444"
  },
  {
    slug: "qr-code-generator",
    category: "everyday",
    name: "Instant QR Code Generator & Designer",
    short_name: "QR Generator",
    description: "Create high-contrast, customizable QR codes for links, Wi-Fi passwords, contact cards, and text with instant PNG/SVG download.",
    theme_color: "#0F172A"
  },
  {
    slug: "barcode-generator",
    category: "everyday",
    name: "Universal Barcode Generator",
    short_name: "Barcode Maker",
    description: "Generate crisp retail and inventory barcodes across CODE128, EAN-13, UPC, CODE39, and ITF-14 formats.",
    theme_color: "#0F172A"
  },
  {
    slug: "image-converter",
    category: "everyday",
    name: "Image Format Converter & Optimizer",
    short_name: "Image Converter",
    description: "Convert, compress, and optimize images between PNG, JPEG, WEBP, and AVIF client-side with zero cloud uploads.",
    theme_color: "#3B82F6"
  },
  {
    slug: "pdf-compressor",
    category: "everyday",
    name: "Client-Side PDF Compressor",
    short_name: "PDF Compress",
    description: "Compress and reduce PDF file sizes securely in your browser with multiple quality presets and full document privacy.",
    theme_color: "#EF4444"
  },
  {
    slug: "tempo-routine",
    category: "everyday",
    name: "Tempo: Recurring Routine & Habit Engine",
    short_name: "Tempo Routine",
    description: "Automate recurring routines, hydration reminders, medication intervals, and repeating alarms without setting dozens of manual timers.",
    theme_color: "#0D9488"
  },
  {
    slug: "send-to-pc",
    category: "everyday",
    name: "Send to PC: Wireless File & Clipboard Bridge",
    short_name: "Send to PC",
    description: "Instantly stream camera scans, high-resolution photos, passwords, notes, and links between phone and PC via encrypted P2P WebRTC.",
    theme_color: "#3B82F6"
  },
  {
    slug: "audio-spectrum-analyzer",
    category: "audio",
    name: "Audio Spectrum Analyzer & Lossless Verifier",
    short_name: "Audio Analyzer",
    description: "Inspect audio frequencies, verify true FLAC/WAV lossless fidelity vs transcoded MP3s with live FFT spectrograms in the browser.",
    theme_color: "#8B5CF6"
  },
  {
    slug: "pregnancy-calculator",
    category: "obstetrics",
    name: "Clinical Pregnancy Dating & Due Date Engine",
    short_name: "Pregnancy Calc",
    description: "Calculate expected due date (EDD), gestational age, milestones, and trimesters by LMP, conception date, or ultrasound.",
    theme_color: "#EC4899"
  },
  {
    slug: "pregnancy-timeline",
    category: "obstetrics",
    name: "Gestational Timeline & Trimester Guide",
    short_name: "Pregnancy Guide",
    description: "Interactive week-by-week fetal development timeline with clinical testing milestones, screening windows, and anatomical scans.",
    theme_color: "#F43F5E"
  },
  {
    slug: "edd-reverse-calculator",
    category: "obstetrics",
    name: "Reverse Due Date & Conception Estimator",
    short_name: "Reverse EDD",
    description: "Calculate probable conception date, fertile window, and last menstrual period (LMP) backwards from an expected delivery date.",
    theme_color: "#D946EF"
  },
  {
    slug: "gestational-age-calculator",
    category: "obstetrics",
    name: "Instant Gestational Age (GA) Calculator",
    short_name: "Gestational Age",
    description: "Rapidly compute exact gestational age in weeks and days for clinical obstetric evaluations and sonographic dating.",
    theme_color: "#EC4899"
  },
  {
    slug: "bishop-score",
    category: "obstetrics",
    name: "Modified Bishop Score Calculator",
    short_name: "Bishop Score",
    description: "Clinical pre-labor scoring system evaluating cervical dilation, effacement, station, consistency, and cervical position.",
    theme_color: "#8B5CF6"
  },
  {
    slug: "preeclampsia-risk",
    category: "obstetrics",
    name: "Preeclampsia Risk Stratification Calculator",
    short_name: "Preeclampsia",
    description: "ACOG and NICE guideline-based clinical risk factor assessment tool for preeclampsia screening and aspirin prophylaxis indication.",
    theme_color: "#EF4444"
  },
  {
    slug: "emotion-compass",
    category: "psychology",
    name: "Feelings Wheel & Emotion Compass",
    short_name: "Feelings Wheel",
    description: "Interactive multi-tiered emotion wheel based on psychological frameworks to identify, reflect on, and articulate emotional states.",
    theme_color: "#6366F1"
  },
  {
    slug: "pack-years-calculator",
    category: "pulmonology",
    name: "Smoking Pack-Years Clinical Calculator",
    short_name: "Pack Years",
    description: "Calculate cumulative tobacco exposure in pack-years for lung cancer screening eligibility and COPD risk assessment.",
    theme_color: "#64748B"
  },
  {
    slug: "mmrc-dyspnea-scale",
    category: "pulmonology",
    name: "mMRC Dyspnea Scale Calculator",
    short_name: "mMRC Dyspnea",
    description: "Modified Medical Research Council breathlessness grading scale for COPD severity and functional respiratory assessment.",
    theme_color: "#0284C7"
  },
  {
    slug: "lights-criteria",
    category: "pulmonology",
    name: "Light's Criteria for Pleural Effusion",
    short_name: "Light's Criteria",
    description: "Differentiate exudative from transudative pleural effusions using pleural fluid protein and LDH ratios.",
    theme_color: "#0EA5E9"
  },
  {
    slug: "abg-analyzer",
    category: "pulmonology",
    name: "Arterial Blood Gas (ABG) Clinical Analyzer",
    short_name: "ABG Analyzer",
    description: "Automated acid-base analysis tool interpreting pH, PaCO2, and HCO3 with anion gap and compensation analysis.",
    theme_color: "#DC2626"
  },
  {
    slug: "glasgow-coma-scale",
    category: "neurology",
    name: "Glasgow Coma Scale (GCS) Assessment",
    short_name: "GCS Scale",
    description: "Standardized objective clinical tool to evaluate levels of consciousness based on eye, verbal, and motor responses.",
    theme_color: "#7C3AED"
  },
  {
    slug: "nyha-heart-failure",
    category: "cardiology",
    name: "NYHA Functional Heart Failure Classification",
    short_name: "NYHA Class",
    description: "Stratify heart failure severity (Class I–IV) based on patient symptoms and physical activity limitations.",
    theme_color: "#E11D48"
  },
  {
    slug: "jones-criteria",
    category: "cardiology",
    name: "Jones Criteria for Acute Rheumatic Fever",
    short_name: "Jones Criteria",
    description: "Evidence-based guideline calculator for diagnosing Acute Rheumatic Fever (ARF) with major and minor manifestations.",
    theme_color: "#BE123C"
  },
  {
    slug: "gleason-score",
    category: "oncology",
    name: "Gleason Score Prostate Staging Calculator",
    short_name: "Gleason Score",
    description: "Prostate cancer histological grade group converter mapping primary and secondary Gleason patterns (ISUP Grades 1–5).",
    theme_color: "#475569"
  },
  {
    slug: "immunization-schedule",
    category: "pediatrics",
    name: "Pediatric Immunization Schedule Calculator",
    short_name: "Vaccine Schedule",
    description: "Generate customized childhood vaccine catch-up and routine immunization schedules based on birth date.",
    theme_color: "#059669"
  },
  {
    slug: "ishihara-test",
    category: "ophthalmology",
    name: "Ishihara Color Blindness Screening Test",
    short_name: "Ishihara Test",
    description: "Screen for red-green color vision deficiencies (protanopia and deuteranopia) using standardized Ishihara pseudoisochromatic plates.",
    theme_color: "#16A34A"
  },
  {
    slug: "movieverse",
    category: "entertainment",
    name: "MovieVerse: Discovery & Cinematic Hub",
    short_name: "MovieVerse",
    description: "Discover trending films, track ratings, watch trailers, and explore cinematic recommendations across all genres.",
    theme_color: "#E11D48"
  },
  {
    slug: "text-to-speech",
    category: "audio",
    name: "Instant Text to Natural Voice & Audio Studio",
    short_name: "Voice Studio",
    description: "Transform written text into ultra-natural, lifelike human speech instantly with waveform tracking and downloadable audio files.",
    theme_color: "#EC4899"
  },
  {
    slug: "audio-spectrum-analyzer",
    category: "audio",
    name: "Audio Spectrum Analyzer & Lossless Verifier",
    short_name: "Audio Analyzer",
    description: "Inspect audio frequencies, verify true FLAC/WAV lossless fidelity vs transcoded MP3s with live FFT spectrograms.",
    theme_color: "#8B5CF6"
  }
];

for (const tool of toolsData) {
  const dir = path.join(toolsIconsDir, tool.slug);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Exact canonical URL with trailing slash matching next.config.ts trailingSlash: true
  const canonicalUrl = `/tools/${tool.category}/${tool.slug}/`;

  const manifest = {
    name: tool.name,
    short_name: tool.short_name,
    description: tool.description,
    start_url: canonicalUrl,
    scope: canonicalUrl,
    id: canonicalUrl,
    display: "standalone",
    orientation: "any",
    background_color: "#ffffff",
    theme_color: tool.theme_color,
    icons: [
      {
        src: `/tools-icons/${tool.slug}/icon-192x192.png`,
        sizes: "192x192",
        type: "image/png",
        purpose: "any"
      },
      {
        src: `/tools-icons/${tool.slug}/icon-192x192.png`,
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable"
      },
      {
        src: `/tools-icons/${tool.slug}/icon-512x512.png`,
        sizes: "512x512",
        type: "image/png",
        purpose: "any"
      },
      {
        src: `/tools-icons/${tool.slug}/icon-512x512.png`,
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable"
      }
    ]
  };

  const manifestPath = path.join(dir, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  console.log(`Generated manifest for ${tool.slug} -> short_name: "${tool.short_name}"`);
}

console.log(`\nSuccessfully updated manifests for all ${toolsData.length} subtools without generic fallbacks!`);
