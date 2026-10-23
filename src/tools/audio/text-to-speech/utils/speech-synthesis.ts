import { VoiceOption, ScriptPreset } from "../types";

const LANGUAGE_NAMES: Record<string, string> = {
  "en-US": "English (United States)",
  "en-GB": "English (United Kingdom)",
  "en-AU": "English (Australia)",
  "en-CA": "English (Canada)",
  "en-IN": "English (India)",
  "es-ES": "Spanish (Spain)",
  "es-MX": "Spanish (Mexico)",
  "es-US": "Spanish (United States)",
  "fr-FR": "French (France)",
  "fr-CA": "French (Canada)",
  "de-DE": "German (Germany)",
  "it-IT": "Italian (Italy)",
  "pt-BR": "Portuguese (Brazil)",
  "pt-PT": "Portuguese (Portugal)",
  "ja-JP": "Japanese (Japan)",
  "ko-KR": "Korean (South Korea)",
  "zh-CN": "Chinese (Mandarin Simplified)",
  "zh-TW": "Chinese (Mandarin Traditional)",
  "hi-IN": "Hindi (India)",
  "ru-RU": "Russian (Russia)",
  "ar-SA": "Arabic (Saudi Arabia)",
  "nl-NL": "Dutch (Netherlands)",
  "tr-TR": "Turkish (Turkey)",
  "pl-PL": "Polish (Poland)",
  "sv-SE": "Swedish (Sweden)",
};

export function getLanguageLabel(code: string): string {
  if (LANGUAGE_NAMES[code]) return LANGUAGE_NAMES[code];
  const prefix = code.split("-")[0];
  const match = Object.keys(LANGUAGE_NAMES).find((k) => k.startsWith(prefix));
  if (match) return `${LANGUAGE_NAMES[match].split(" ")[0]} (${code})`;
  return code;
}

export function parseVoice(voice: SpeechSynthesisVoice): VoiceOption {
  const name = voice.name;
  const lower = name.toLowerCase();

  // Natural / Neural voice detection heuristics
  const isNatural =
    lower.includes("natural") ||
    lower.includes("neural") ||
    lower.includes("online") ||
    lower.includes("enhanced") ||
    lower.includes("premium") ||
    lower.includes("siri") ||
    (lower.includes("google") && !lower.includes("standard"));

  // Provider detection
  let provider: VoiceOption["provider"] = "System";
  if (lower.includes("microsoft")) provider = "Microsoft";
  else if (lower.includes("google")) provider = "Google";
  else if (lower.includes("apple") || lower.includes("siri")) provider = "Apple";

  // Gender heuristics
  let gender: VoiceOption["gender"] = "neutral";
  const femaleNames = [
    "jenny", "aria", "zira", "samantha", "karen", "susan", "victoria", "catherine",
    "serena", "stephanie", "zoe", "clara", "emma", "ava", "mia", "olivia", "female",
    "woman", "girl", "hazel", "sonia", "neerja", "leila", "alice", "audrey",
  ];
  const maleNames = [
    "guy", "david", "mark", "george", "daniel", "oliver", "christopher", "eric",
    "arthur", "male", "man", "boy", "ravi", "alex", "thomas", "fred", "ryan",
    "brian", "steven", "richard", "matthew",
  ];

  if (femaleNames.some((fn) => lower.includes(fn))) {
    gender = "female";
  } else if (maleNames.some((mn) => lower.includes(mn))) {
    gender = "male";
  }

  // Clean display name
  let displayName = name
    .replace(/^microsoft\s+/i, "")
    .replace(/^google\s+/i, "")
    .replace(/^apple\s+/i, "")
    .replace(/\s*\(natural\)/i, " ⭐")
    .replace(/\s*online\s*\(/i, " (")
    .trim();

  return {
    voice,
    name,
    lang: voice.lang,
    langLabel: getLanguageLabel(voice.lang),
    isNatural,
    gender,
    provider,
    displayName,
  };
}

export function sortVoices(voices: VoiceOption[]): VoiceOption[] {
  return [...voices].sort((a, b) => {
    // 1. Natural / Neural voices first
    if (a.isNatural && !b.isNatural) return -1;
    if (!a.isNatural && b.isNatural) return 1;

    // 2. English US/UK prioritization
    const aIsEn = a.lang.startsWith("en");
    const bIsEn = b.lang.startsWith("en");
    if (aIsEn && !bIsEn) return -1;
    if (!aIsEn && bIsEn) return 1;

    // 3. Alphabetical by display name
    return a.displayName.localeCompare(b.displayName);
  });
}

/**
 * Splits continuous text into clean readable sentence chunks
 * with offset tracking for karaoke-style visual highlighting.
 */
export interface SentenceSpan {
  text: string;
  startIndex: number;
  endIndex: number;
}

export function splitIntoSentences(text: string): SentenceSpan[] {
  const spans: SentenceSpan[] = [];
  const regex = /[^.!?\n]+[.!?\n]*/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    const raw = match[0];
    const trimmed = raw.trim();
    if (trimmed.length > 0) {
      const startIndex = match.index + raw.indexOf(trimmed);
      spans.push({
        text: trimmed,
        startIndex,
        endIndex: startIndex + trimmed.length,
      });
    }
  }

  if (spans.length === 0 && text.trim().length > 0) {
    spans.push({
      text: text.trim(),
      startIndex: 0,
      endIndex: text.trim().length,
    });
  }

  return spans;
}

export const SCRIPT_PRESETS: ScriptPreset[] = [
  {
    id: "promo",
    title: "Brand Commercial",
    icon: "Sparkles",
    category: "Commercial",
    text: "Experience the next evolution of sound. Lightning-fast performance, crystal-clear acoustics, and zero-compromise privacy—crafted for creators who demand perfection.",
    suggestedRate: 1.05,
    suggestedPitch: 1.0,
  },
  {
    id: "audiobook",
    title: "Audiobook Narration",
    icon: "BookOpen",
    category: "Storytelling",
    text: "The ancient lighthouse stood steadfast against the roaring midnight tides. As the emerald fog rolled across the jagged cliffs, a faint harmonic melody whispered through the whistling winds.",
    suggestedRate: 0.92,
    suggestedPitch: 0.95,
  },
  {
    id: "meditation",
    title: "Mindful Meditation",
    icon: "Heart",
    category: "Mindfulness",
    text: "Gently close your eyes. Inhale slowly and deeply through your nose, letting peaceful serenity expand across your chest. Hold for a quiet moment, and gently let go.",
    suggestedRate: 0.82,
    suggestedPitch: 0.9,
  },
  {
    id: "tech-keynote",
    title: "Tech Keynote",
    icon: "Zap",
    category: "Product Launch",
    text: "Today, we are thrilled to introduce an entirely reimagined studio architecture. Engineered directly inside modern web browsers with instantaneous response and zero latency.",
    suggestedRate: 1.05,
    suggestedPitch: 1.05,
  },
  {
    id: "news",
    title: "News Broadcast",
    icon: "Globe",
    category: "Broadcast",
    text: "Good evening. Tonight's top global developments: international aerospace engineers have confirmed the successful orbital deployment of next-generation acoustic imaging satellites.",
    suggestedRate: 1.1,
    suggestedPitch: 1.0,
  },
  {
    id: "support",
    title: "Virtual Assistant",
    icon: "Bot",
    category: "Conversational",
    text: "Hello there! Welcome to Clinikkit Studio. I am your automated digital narrator. Feel free to customize my voice speed, pitch, and acoustic settings at any time.",
    suggestedRate: 1.0,
    suggestedPitch: 1.1,
  },
];
