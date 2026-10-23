export interface VoiceOption {
  voice: SpeechSynthesisVoice;
  name: string;
  lang: string;
  langLabel: string;
  isNatural: boolean;
  gender: "female" | "male" | "neutral";
  provider: "Microsoft" | "Google" | "Apple" | "System" | "Other";
  displayName: string;
}

export interface SpeechSettings {
  rate: number;    // 0.5 to 2.0
  pitch: number;   // 0.5 to 1.8
  volume: number;  // 0 to 1
  voiceURI: string;
}

export interface ScriptPreset {
  id: string;
  title: string;
  icon: string;
  category: string;
  text: string;
  suggestedRate?: number;
  suggestedPitch?: number;
}

export interface AudioExportItem {
  id: string;
  name: string;
  blob: Blob;
  url: string;
  format: "wav" | "webm" | "mp3";
  durationSeconds: number;
  sizeBytes: number;
  createdAt: Date;
  textExcerpt: string;
}
