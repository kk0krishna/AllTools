/**
 * Audio synthesis & WAV encoding utilities for pure client-side audio file generation.
 */

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Encodes an AudioBuffer into a standard 16-bit PCM WAV format Blob.
 */
export function audioBufferToWavBlob(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // 1 = PCM
  const bitDepth = 16;
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;
  const numFrames = buffer.length;
  const dataByteLength = numFrames * blockAlign;
  const headerByteLength = 44;
  const totalByteLength = headerByteLength + dataByteLength;

  const arrayBuffer = new ArrayBuffer(totalByteLength);
  const view = new DataView(arrayBuffer);

  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  // RIFF Chunk Descriptor
  writeString(0, "RIFF");
  view.setUint32(4, 36 + dataByteLength, true);
  writeString(8, "WAVE");

  // fmt sub-chunk
  writeString(12, "fmt ");
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, format, true); // AudioFormat
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true); // ByteRate
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);

  // data sub-chunk
  writeString(36, "data");
  view.setUint32(40, dataByteLength, true);

  // Interleave channels & write 16-bit PCM samples
  const channels: Float32Array[] = [];
  for (let c = 0; c < numChannels; c++) {
    channels.push(buffer.getChannelData(c));
  }

  let offset = 44;
  for (let i = 0; i < numFrames; i++) {
    for (let c = 0; c < numChannels; c++) {
      const sample = Math.max(-1, Math.min(1, channels[c][i]));
      // Convert to 16-bit signed integer
      const int16 = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      view.setInt16(offset, int16, true);
      offset += 2;
    }
  }

  return new Blob([arrayBuffer], { type: "audio/wav" });
}

/**
 * Phoneme formant table for acoustic speech modeling
 * (F1, F2, F3 frequencies in Hz for distinct vowel/consonant shapes)
 */
interface FormantProfile {
  f1: number;
  f2: number;
  f3: number;
  noise: number; // fricative noise level (0-1)
  durationMs: number;
}

const PHONEME_MAP: Record<string, FormantProfile> = {
  a: { f1: 730, f2: 1090, f3: 2440, noise: 0.05, durationMs: 140 },
  e: { f1: 530, f2: 1840, f3: 2480, noise: 0.04, durationMs: 130 },
  i: { f1: 270, f2: 2290, f3: 3010, noise: 0.04, durationMs: 120 },
  o: { f1: 570, f2: 840, f3: 2410, noise: 0.05, durationMs: 140 },
  u: { f1: 300, f2: 870, f3: 2240, noise: 0.04, durationMs: 130 },
  s: { f1: 300, f2: 1500, f3: 4500, noise: 0.65, durationMs: 100 },
  t: { f1: 400, f2: 1800, f3: 3500, noise: 0.5, durationMs: 70 },
  k: { f1: 350, f2: 1900, f3: 3000, noise: 0.45, durationMs: 80 },
  p: { f1: 300, f2: 1000, f3: 2200, noise: 0.4, durationMs: 70 },
  m: { f1: 280, f2: 1000, f3: 2200, noise: 0.02, durationMs: 110 },
  n: { f1: 280, f2: 1500, f3: 2500, noise: 0.02, durationMs: 110 },
  r: { f1: 490, f2: 1350, f3: 1690, noise: 0.08, durationMs: 120 },
  l: { f1: 380, f2: 1200, f3: 2700, noise: 0.06, durationMs: 120 },
  f: { f1: 250, f2: 1200, f3: 3800, noise: 0.55, durationMs: 100 },
  v: { f1: 250, f2: 1100, f3: 2500, noise: 0.35, durationMs: 100 },
  d: { f1: 380, f2: 1700, f3: 2600, noise: 0.3, durationMs: 80 },
  b: { f1: 300, f2: 1100, f3: 2300, noise: 0.25, durationMs: 80 },
  g: { f1: 350, f2: 1800, f3: 2600, noise: 0.3, durationMs: 80 },
  w: { f1: 300, f2: 700, f3: 2200, noise: 0.05, durationMs: 110 },
  y: { f1: 280, f2: 2200, f3: 2900, noise: 0.05, durationMs: 110 },
  h: { f1: 600, f2: 1400, f3: 2500, noise: 0.45, durationMs: 90 },
  default: { f1: 500, f2: 1500, f3: 2500, noise: 0.1, durationMs: 100 },
  space: { f1: 0, f2: 0, f3: 0, noise: 0, durationMs: 120 },
  pause: { f1: 0, f2: 0, f3: 0, noise: 0, durationMs: 250 },
};

/**
 * Pure client-side Speech-to-WAV Synthesizer!
 * Generates acoustic vocal formants using Web Audio OfflineAudioContext.
 * Guaranteed 100% offline, zero network requests, zero browser dialog prompts.
 */
export async function synthesizeAcousticWav(
  text: string,
  rate: number = 1.0,
  pitch: number = 1.0
): Promise<Blob> {
  const cleanText = text.trim().toLowerCase();
  if (!cleanText) {
    throw new Error("Text is empty");
  }

  // Parse phoneme sequence from text
  const tokens: { profile: FormantProfile; char: string }[] = [];
  for (let i = 0; i < cleanText.length; i++) {
    const ch = cleanText[i];
    if (ch === " ") {
      tokens.push({ profile: PHONEME_MAP.space, char: ch });
    } else if ([".", ",", "!", "?", ";", ":", "\n"].includes(ch)) {
      tokens.push({ profile: PHONEME_MAP.pause, char: ch });
    } else if (PHONEME_MAP[ch]) {
      tokens.push({ profile: PHONEME_MAP[ch], char: ch });
    } else {
      tokens.push({ profile: PHONEME_MAP.default, char: ch });
    }
  }

  // Calculate total duration
  const speedFactor = Math.max(0.4, Math.min(2.5, rate));
  let totalDurationMs = 0;
  for (const token of tokens) {
    totalDurationMs += token.profile.durationMs / speedFactor;
  }
  totalDurationMs += 200; // Tail room
  const totalDurationSeconds = Math.max(0.5, totalDurationMs / 1000);

  const sampleRate = 44100;
  const totalFrames = Math.ceil(totalDurationSeconds * sampleRate);
  const offlineCtx = new OfflineAudioContext(1, totalFrames, sampleRate);

  // Fundamental voice pitch (F0: ~130 Hz for adult natural voice, scaled by pitch slider)
  const baseF0 = 135 * Math.max(0.5, Math.min(1.8, pitch));

  // Voice source: Rich harmonic oscillator
  const osc = offlineCtx.createOscillator();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(baseF0, 0);

  // Subtle natural pitch inflection / vibrato
  const lfo = offlineCtx.createOscillator();
  lfo.frequency.setValueAtTime(4.5, 0); // 4.5 Hz natural vocal vibrato
  const lfoGain = offlineCtx.createGain();
  lfoGain.gain.setValueAtTime(baseF0 * 0.02, 0); // 2% natural frequency variation
  lfo.connect(osc.frequency);

  // Master voice gain envelope
  const masterGain = offlineCtx.createGain();
  masterGain.gain.setValueAtTime(0, 0);

  // 3-Band Formant Acoustic Filter Bank (F1, F2, F3)
  const f1Filter = offlineCtx.createBiquadFilter();
  f1Filter.type = "bandpass";
  f1Filter.Q.setValueAtTime(4.5, 0);

  const f2Filter = offlineCtx.createBiquadFilter();
  f2Filter.type = "bandpass";
  f2Filter.Q.setValueAtTime(6.0, 0);

  const f3Filter = offlineCtx.createBiquadFilter();
  f3Filter.type = "bandpass";
  f3Filter.Q.setValueAtTime(7.0, 0);

  // Noise generator for breath and fricative consonants (s, t, p, k, f)
  const noiseBufferSize = sampleRate * 2;
  const noiseBuffer = offlineCtx.createBuffer(1, noiseBufferSize, sampleRate);
  const noiseData = noiseBuffer.getChannelData(0);
  for (let i = 0; i < noiseBufferSize; i++) {
    noiseData[i] = Math.random() * 2 - 1;
  }
  const noiseSource = offlineCtx.createBufferSource();
  noiseSource.buffer = noiseBuffer;
  noiseSource.loop = true;

  const noiseFilter = offlineCtx.createBiquadFilter();
  noiseFilter.type = "highpass";
  noiseFilter.frequency.setValueAtTime(2500, 0);

  const noiseGain = offlineCtx.createGain();
  noiseGain.gain.setValueAtTime(0, 0);

  // Connect filter graph
  osc.connect(f1Filter);
  osc.connect(f2Filter);
  osc.connect(f3Filter);

  const formantMixer = offlineCtx.createGain();
  formantMixer.gain.setValueAtTime(0.35, 0);

  f1Filter.connect(formantMixer);
  f2Filter.connect(formantMixer);
  f3Filter.connect(formantMixer);

  noiseSource.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(masterGain);

  formantMixer.connect(masterGain);

  // Warmth saturator / lowpass for radio vocal body
  const bodyFilter = offlineCtx.createBiquadFilter();
  bodyFilter.type = "lowpass";
  bodyFilter.frequency.setValueAtTime(5500, 0);

  masterGain.connect(bodyFilter);
  bodyFilter.connect(offlineCtx.destination);

  // Schedule phonemes and formant transitions
  let currentTime = 0.05;
  for (let i = 0; i < tokens.length; i++) {
    const { profile, char } = tokens[i];
    const duration = (profile.durationMs / 1000) / speedFactor;
    const isSilence = char === " " || [".", ",", "!", "?", ";", ":", "\n"].includes(char);

    if (isSilence) {
      masterGain.gain.setValueAtTime(0, currentTime);
      currentTime += duration;
      continue;
    }

    // Set formant resonance targets with smooth portamento
    const transitionTime = Math.min(0.04, duration * 0.3);
    f1Filter.frequency.exponentialRampToValueAtTime(Math.max(100, profile.f1), currentTime + transitionTime);
    f2Filter.frequency.exponentialRampToValueAtTime(Math.max(400, profile.f2), currentTime + transitionTime);
    f3Filter.frequency.exponentialRampToValueAtTime(Math.max(1200, profile.f3), currentTime + transitionTime);

    // Natural vowel prosody pitch bend
    const pitchJitter = baseF0 * (1 + (Math.sin(i * 0.7) * 0.04));
    osc.frequency.linearRampToValueAtTime(pitchJitter, currentTime + transitionTime);

    // Amplitude envelope
    const attack = Math.min(0.02, duration * 0.2);
    const release = Math.min(0.03, duration * 0.3);
    const vocalGain = (1 - profile.noise) * 0.7;

    masterGain.gain.setValueAtTime(0.01, currentTime);
    masterGain.gain.linearRampToValueAtTime(vocalGain, currentTime + attack);
    masterGain.gain.setValueAtTime(vocalGain, currentTime + duration - release);
    masterGain.gain.linearRampToValueAtTime(0.02, currentTime + duration);

    // Fricative noise level
    if (profile.noise > 0.1) {
      noiseGain.gain.setValueAtTime(profile.noise * 0.6, currentTime);
      noiseGain.gain.setValueAtTime(0, currentTime + duration);
    }

    currentTime += duration;
  }

  // Final release
  masterGain.gain.linearRampToValueAtTime(0, currentTime + 0.05);

  osc.start(0);
  lfo.start(0);
  noiseSource.start(0);

  osc.stop(currentTime + 0.1);
  lfo.stop(currentTime + 0.1);
  noiseSource.stop(currentTime + 0.1);

  const renderedBuffer = await offlineCtx.startRendering();
  return audioBufferToWavBlob(renderedBuffer);
}
