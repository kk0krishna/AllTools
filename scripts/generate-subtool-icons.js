const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const toolsIconsDir = path.join(process.cwd(), 'public', 'tools-icons');

// 1. Send to PC SVG
const sendToPcSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F172A"/>
      <stop offset="50%" stop-color="#1E1B4B"/>
      <stop offset="100%" stop-color="#090D16"/>
    </linearGradient>
    <linearGradient id="blueBeam" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38BDF8"/>
      <stop offset="50%" stop-color="#818CF8"/>
      <stop offset="100%" stop-color="#C084FC"/>
    </linearGradient>
    <linearGradient id="pcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E293B"/>
      <stop offset="100%" stop-color="#0F172A"/>
    </linearGradient>
    <linearGradient id="phoneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#334155"/>
      <stop offset="100%" stop-color="#1E293B"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="16" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <!-- Squircle Base -->
  <rect x="16" y="16" width="480" height="480" rx="108" fill="url(#bgGrad)" stroke="#38BDF8" stroke-opacity="0.3" stroke-width="4"/>
  
  <!-- Ambient Core Glow -->
  <circle cx="256" cy="256" r="140" fill="#6366F1" opacity="0.15" filter="url(#glow)"/>

  <!-- PC / Monitor (Left) -->
  <g transform="translate(68, 140)">
    <!-- Monitor Body -->
    <rect x="0" y="0" width="190" height="135" rx="16" fill="url(#pcGrad)" stroke="#475569" stroke-width="4"/>
    <!-- Screen Inner -->
    <rect x="12" y="12" width="166" height="111" rx="8" fill="#020617"/>
    <!-- Screen Accent / Code lines -->
    <rect x="26" y="28" width="70" height="8" rx="4" fill="#38BDF8" opacity="0.8"/>
    <rect x="26" y="44" width="100" height="6" rx="3" fill="#64748B" opacity="0.6"/>
    <rect x="26" y="58" width="55" height="6" rx="3" fill="#64748B" opacity="0.6"/>
    <!-- Stand -->
    <path d="M75 135 L115 135 L125 175 L65 175 Z" fill="#1E293B" stroke="#475569" stroke-width="3"/>
    <rect x="45" y="172" width="100" height="10" rx="5" fill="#334155"/>
  </g>

  <!-- Mobile Phone (Right) -->
  <g transform="translate(310, 165)">
    <!-- Phone Body -->
    <rect x="0" y="0" width="125" height="215" rx="24" fill="url(#phoneGrad)" stroke="#64748B" stroke-width="4"/>
    <!-- Phone Screen -->
    <rect x="8" y="12" width="109" height="191" rx="16" fill="#020617"/>
    <!-- Camera pill -->
    <rect x="42" y="18" width="41" height="6" rx="3" fill="#1E293B"/>
    <!-- Screen card -->
    <rect x="20" y="45" width="85" height="55" rx="8" fill="#4F46E5" opacity="0.3"/>
    <circle cx="45" cy="72" r="14" fill="#818CF8" opacity="0.8"/>
    <rect x="68" y="66" width="30" height="5" rx="2.5" fill="#E2E8F0"/>
    <rect x="68" y="75" width="20" height="4" rx="2" fill="#94A3B8"/>
    <!-- Home Bar -->
    <rect x="45" y="192" width="35" height="4" rx="2" fill="#475569"/>
  </g>

  <!-- Wireless Transfer Bridge / Beam (Center) -->
  <g filter="url(#glow)">
    <path d="M 230 220 Q 280 180 330 220" fill="none" stroke="url(#blueBeam)" stroke-width="8" stroke-linecap="round"/>
    <path d="M 220 250 Q 280 205 340 250" fill="none" stroke="url(#blueBeam)" stroke-width="8" stroke-linecap="round" stroke-dasharray="14 10"/>
    <path d="M 230 280 Q 280 230 330 280" fill="none" stroke="url(#blueBeam)" stroke-width="8" stroke-linecap="round"/>
    <!-- Transfer Particles -->
    <circle cx="280" cy="215" r="7" fill="#38BDF8"/>
    <circle cx="260" cy="245" r="5" fill="#A855F7"/>
    <circle cx="300" cy="255" r="6" fill="#38BDF8"/>
  </g>

  <!-- Instant Wireless Lightning Icon (Top Center) -->
  <g transform="translate(236, 68)">
    <circle cx="20" cy="20" r="32" fill="#38BDF8" opacity="0.2" filter="url(#glow)"/>
    <path d="M 22 2 L 8 22 L 20 22 L 16 38 L 34 16 L 22 16 Z" fill="#38BDF8"/>
  </g>
</svg>
`;

// 2. YouTube Transcript SVG
const youtubeTranscriptSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="ytBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#180407"/>
      <stop offset="50%" stop-color="#2D0A11"/>
      <stop offset="100%" stop-color="#0F0305"/>
    </linearGradient>
    <linearGradient id="redGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#EF4444"/>
      <stop offset="100%" stop-color="#B91C1C"/>
    </linearGradient>
    <linearGradient id="paperGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#F1F5F9"/>
    </linearGradient>
    <filter id="ytGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="16" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <!-- Squircle Base -->
  <rect x="16" y="16" width="480" height="480" rx="108" fill="url(#ytBg)" stroke="#EF4444" stroke-opacity="0.3" stroke-width="4"/>
  
  <!-- Red Ambient Glow -->
  <circle cx="256" cy="256" r="140" fill="#EF4444" opacity="0.18" filter="url(#ytGlow)"/>

  <!-- Transcript Document Card (Center Left) -->
  <g transform="translate(100, 100)">
    <!-- Document shadow & body -->
    <rect x="0" y="0" width="240" height="312" rx="20" fill="url(#paperGrad)" filter="url(#ytGlow)"/>
    <!-- Document Header lines -->
    <rect x="28" y="35" width="120" height="14" rx="7" fill="#0F172A"/>
    <rect x="28" y="60" width="70" height="8" rx="4" fill="#94A3B8"/>

    <!-- Text / Transcript Lines with timestamps -->
    <rect x="28" y="100" width="38" height="10" rx="5" fill="#EF4444"/>
    <rect x="76" y="100" width="136" height="10" rx="5" fill="#334155"/>

    <rect x="28" y="128" width="38" height="10" rx="5" fill="#EF4444"/>
    <rect x="76" y="128" width="120" height="10" rx="5" fill="#334155"/>

    <rect x="28" y="156" width="38" height="10" rx="5" fill="#EF4444"/>
    <rect x="76" y="156" width="144" height="10" rx="5" fill="#334155"/>

    <rect x="28" y="184" width="38" height="10" rx="5" fill="#EF4444"/>
    <rect x="76" y="184" width="95" height="10" rx="5" fill="#334155"/>

    <rect x="28" y="212" width="38" height="10" rx="5" fill="#EF4444"/>
    <rect x="76" y="212" width="130" height="10" rx="5" fill="#334155"/>

    <!-- CC Subtitle Badge -->
    <rect x="28" y="250" width="56" height="28" rx="8" fill="#1E293B"/>
    <text x="56" y="269" font-family="system-ui, sans-serif" font-size="14" font-weight="900" fill="#FFFFFF" text-anchor="middle">CC</text>
  </g>

  <!-- Red YouTube Play Button (Floating Overlap Bottom-Right) -->
  <g transform="translate(240, 240)" filter="url(#ytGlow)">
    <rect x="0" y="0" width="190" height="135" rx="34" fill="url(#redGrad)"/>
    <!-- White Play Triangle -->
    <path d="M75 42 L130 68 L75 94 Z" fill="#FFFFFF"/>
  </g>
</svg>
`;

// 3. Tempo Routine SVG
const tempoRoutineSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="tempoBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#042F2E"/>
      <stop offset="50%" stop-color="#0F172A"/>
      <stop offset="100%" stop-color="#021C1B"/>
    </linearGradient>
    <linearGradient id="tempoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2DD4BF"/>
      <stop offset="50%" stop-color="#06B6D4"/>
      <stop offset="100%" stop-color="#3B82F6"/>
    </linearGradient>
    <filter id="tempoGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="16" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <!-- Squircle Base -->
  <rect x="16" y="16" width="480" height="480" rx="108" fill="url(#tempoBg)" stroke="#2DD4BF" stroke-opacity="0.3" stroke-width="4"/>
  
  <!-- Teal Ambient Glow -->
  <circle cx="256" cy="256" r="140" fill="#06B6D4" opacity="0.18" filter="url(#tempoGlow)"/>

  <!-- Outer Tempo Track Ring -->
  <circle cx="256" cy="256" r="150" fill="none" stroke="#1E293B" stroke-width="20"/>

  <!-- Active Progress Arc -->
  <circle cx="256" cy="256" r="150" fill="none" stroke="url(#tempoGrad)" stroke-width="20" stroke-linecap="round" stroke-dasharray="720 230" transform="rotate(-90 256 256)" filter="url(#tempoGlow)"/>

  <!-- Interval Ticks -->
  <g stroke="#94A3B8" stroke-width="4" stroke-linecap="round" opacity="0.6">
    <line x1="256" y1="120" x2="256" y2="132"/>
    <line x1="392" y1="256" x2="380" y2="256"/>
    <line x1="256" y1="392" x2="256" y2="380"/>
    <line x1="120" y1="256" x2="132" y2="256"/>
  </g>

  <!-- Center Clock & Interval Loop Icon -->
  <g transform="translate(256, 256)">
    <!-- Inner dial -->
    <circle cx="0" cy="0" r="95" fill="#0F172A" stroke="#334155" stroke-width="4"/>

    <!-- Clock hands pointing to next routine interval -->
    <line x1="0" y1="0" x2="0" y2="-45" stroke="#FFFFFF" stroke-width="10" stroke-linecap="round"/>
    <line x1="0" y1="0" x2="38" y2="15" stroke="#2DD4BF" stroke-width="8" stroke-linecap="round"/>
    <circle cx="0" cy="0" r="12" fill="#06B6D4"/>

    <!-- Checkmark Badge on Top-Right -->
    <circle cx="65" cy="-65" r="28" fill="#10B981" stroke="#0F172A" stroke-width="5" filter="url(#tempoGlow)"/>
    <path d="M53 -65 L62 -56 L77 -72" fill="none" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>
`;

async function renderIcons(slug, svgBuffer) {
  const targetDir = path.join(toolsIconsDir, slug);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // 512x512
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(targetDir, 'icon-512x512.png'));

  // 192x192
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(targetDir, 'icon-192x192.png'));

  console.log(`Generated 192 & 512 icons for: ${slug}`);
}

async function main() {
  // 1. Send to PC
  await renderIcons('send-to-pc', Buffer.from(sendToPcSvg));

  // 2. YouTube Transcript
  await renderIcons('youtube-transcript', Buffer.from(youtubeTranscriptSvg));

  // 3. Tempo Routine
  await renderIcons('tempo-routine', Buffer.from(tempoRoutineSvg));

  // 4. MovieVerse (from existing filmiy-logo.svg)
  const movieverseSvgPath = path.join(toolsIconsDir, 'movieverse', 'filmiy-logo.svg');
  if (fs.existsSync(movieverseSvgPath)) {
    const movieverseSvg = fs.readFileSync(movieverseSvgPath);
    await renderIcons('movieverse', movieverseSvg);
  }

  console.log('All missing icons generated successfully!');
}

main().catch(console.error);
