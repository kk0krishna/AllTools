// Format bytes to human readable string
export function formatBytes(bytes?: number): string {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

// Trigger mobile haptic vibration safely
export function triggerVibrate(): void {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    try {
      navigator.vibrate([25, 35, 25]);
    } catch {
      // Safe catch
    }
  }
}

// Safe Web Audio API synthesizer for notification chimes
let globalAudioCtx: AudioContext | null = null;

export function playChimeSound(soundEnabled: boolean = true): void {
  if (!soundEnabled || typeof window === "undefined") return;

  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!globalAudioCtx) {
      globalAudioCtx = new AudioCtx();
    }
    const ctx = globalAudioCtx;
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
      if (ctx.state === "suspended") return;
    }

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, now);
    osc.frequency.setValueAtTime(880, now + 0.08);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  } catch {
    // Autoplay restrictions safely caught
  }
}

// Extract target peer ID from scanned QR strings or URLs
export function parseQrSessionId(rawQrData: string): string | null {
  if (!rawQrData) return null;

  // 1. URL search param: ?session=tvpc-123456 or ?peer=tvpc-123456
  try {
    const url = new URL(rawQrData);
    const session = url.searchParams.get("session") || url.searchParams.get("peer");
    if (session) return session;
  } catch {
    // Not a full URL
  }

  // 2. String containing tvpc-XXXXXX
  const match = rawQrData.match(/tvpc-\d{6}/i);
  if (match) return match[0].toLowerCase();

  // 3. Raw 6-digit numeric PIN
  const pinMatch = rawQrData.trim().match(/^\d{6}$/);
  if (pinMatch) return `tvpc-${pinMatch[0]}`;

  return null;
}
