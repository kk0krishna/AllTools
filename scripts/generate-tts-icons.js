const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const targetDir = path.join(process.cwd(), 'public', 'tools-icons', 'text-to-speech');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#180828"/>
      <stop offset="50%" stop-color="#2D0B3F"/>
      <stop offset="100%" stop-color="#0F051D"/>
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F43F5E"/>
      <stop offset="50%" stop-color="#EC4899"/>
      <stop offset="100%" stop-color="#A855F7"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="20" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <!-- Squircle Base -->
  <rect x="16" y="16" width="480" height="480" rx="108" fill="url(#bgGrad)" stroke="#EC4899" stroke-opacity="0.35" stroke-width="4"/>

  <!-- Ambient Glow -->
  <circle cx="256" cy="256" r="150" fill="#EC4899" opacity="0.2" filter="url(#glow)"/>

  <!-- Sound Waves (Left) -->
  <path d="M130 200 A 70 70 0 0 0 130 312" fill="none" stroke="#EC4899" stroke-width="16" stroke-linecap="round" opacity="0.6"/>
  <path d="M95 160 A 120 120 0 0 0 95 352" fill="none" stroke="#F43F5E" stroke-width="16" stroke-linecap="round" opacity="0.4"/>

  <!-- Sound Waves (Right) -->
  <path d="M382 200 A 70 70 0 0 1 382 312" fill="none" stroke="#EC4899" stroke-width="16" stroke-linecap="round" opacity="0.6"/>
  <path d="M417 160 A 120 120 0 0 1 417 352" fill="none" stroke="#A855F7" stroke-width="16" stroke-linecap="round" opacity="0.4"/>

  <!-- Central Studio Microphone -->
  <g transform="translate(256, 235)">
    <!-- Mic Body -->
    <rect x="-42" y="-85" width="84" height="145" rx="42" fill="url(#accentGrad)" filter="url(#glow)"/>
    <rect x="-42" y="-85" width="84" height="145" rx="42" fill="url(#accentGrad)"/>
    
    <!-- Mic Grille detail -->
    <line x1="-32" y1="-40" x2="32" y2="-40" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" opacity="0.7"/>
    <line x1="-36" y1="-15" x2="36" y2="-15" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" opacity="0.7"/>
    <line x1="-32" y1="10" x2="32" y2="10" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" opacity="0.7"/>

    <!-- Mic Cradle Ring -->
    <path d="-64 0 A 64 64 0 0 0 64 0" fill="none" stroke="#FFFFFF" stroke-width="12" stroke-linecap="round" opacity="0.9"/>
    <!-- Mic Stand Stem -->
    <line x1="0" y1="64" x2="0" y2="115" stroke="#FFFFFF" stroke-width="12" stroke-linecap="round" opacity="0.9"/>
    <!-- Mic Base -->
    <line x1="-50" y1="115" x2="50" y2="115" stroke="#FFFFFF" stroke-width="14" stroke-linecap="round" opacity="0.9"/>
  </g>
</svg>
`;

async function run() {
  const buf = Buffer.from(svg);
  await sharp(buf).resize(192, 192).png().toFile(path.join(targetDir, 'icon-192x192.png'));
  await sharp(buf).resize(512, 512).png().toFile(path.join(targetDir, 'icon-512x512.png'));
  console.log('Successfully generated text-to-speech PNG icons!');
}

run().catch(console.error);
