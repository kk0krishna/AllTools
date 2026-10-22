// Format bytes to human readable string
export function formatBytes(bytes?: number): string {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

// Format transfer speed
export function formatSpeed(bytesPerSec?: number): string {
  if (!bytesPerSec || bytesPerSec <= 0) return "0 B/s";
  if (bytesPerSec >= 1024 * 1024) {
    return (bytesPerSec / (1024 * 1024)).toFixed(1) + " MB/s";
  }
  if (bytesPerSec >= 1024) {
    return (bytesPerSec / 1024).toFixed(0) + " KB/s";
  }
  return Math.round(bytesPerSec) + " B/s";
}

// Format duration
export function formatDuration(seconds?: number): string {
  if (seconds === undefined || !Number.isFinite(seconds) || seconds <= 0) {
    return "< 1s";
  }
  if (seconds >= 60) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins}m ${secs}s`;
  }
  return `${Math.round(seconds)}s`;
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

// Download blob using File System Access API or anchor fallback
export async function downloadBlob(blob: Blob, filename: string): Promise<boolean> {
  if (typeof window === "undefined") return false;

  // 1. Try File System Access API (Desktop Chrome, Edge)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (typeof (window as any).showSaveFilePicker === "function") {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const handle = await (window as any).showSaveFilePicker({
        suggestedName: filename,
      });
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      return true;
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") {
        return false;
      }
      // Fall through to anchor tag
    }
  }

  // 2. Standard HTML5 anchor download
  try {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename || "download";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      try {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch {
        // Safe catch
      }
    }, 2000);
    return true;
  } catch (err) {
    console.warn("Classic download failed, falling back to saveAs:", err);
    try {
      const { saveAs } = await import("file-saver");
      saveAs(blob, filename);
      return true;
    } catch {
      return false;
    }
  }
}

// Native Web Share API (Save to Photos / Files / AirDrop on iOS & Android)
export async function shareFileNative(blob: Blob, filename: string, title?: string): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.share) return false;
  try {
    const file = new File([blob], filename, { type: blob.type || "application/octet-stream" });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: title || filename,
      });
      return true;
    }
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "AbortError") {
      return true;
    }
    console.warn("Native share failed:", err);
  }
  return false;
}

// Detect user agent OS and browser for accurate cross-device identification
export function detectDeviceName(): string {
  if (typeof navigator === "undefined") return "Device";
  const ua = navigator.userAgent;
  let os = "Device";
  if (/iPad|iPhone|iPod/.test(ua)) os = "iPhone / iPad";
  else if (/Macintosh|Mac OS X/.test(ua)) os = "macOS";
  else if (/Windows NT 10.0|Windows NT 11.0/.test(ua)) os = "Windows PC";
  else if (/Windows NT/.test(ua)) os = "Windows PC";
  else if (/Android/.test(ua)) os = "Android";
  else if (/Linux/.test(ua)) os = "Linux";

  let browser = "";
  if (/Edg\//.test(ua)) browser = "Edge";
  else if (/Chrome\//.test(ua) && !/Edg\//.test(ua)) browser = "Chrome";
  else if (/Safari\//.test(ua) && !/Chrome\//.test(ua)) browser = "Safari";
  else if (/Firefox\//.test(ua)) browser = "Firefox";

  return browser ? `${os} (${browser})` : os;
}

// Detect WebRTC connection type, ICE topology, candidate pairs, protocol, and security
export async function detectConnectionType(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  peerConnection: any
): Promise<{
  type: "local-lan" | "p2p-direct" | "relay";
  localIp?: string;
  remoteIp?: string;
  candidateType?: string;
  remoteCandidateType?: string;
  protocol?: string;
  securityCipher?: string;
  iceState?: string;
}> {
  if (!peerConnection || typeof peerConnection.getStats !== "function") {
    return { type: "p2p-direct" };
  }

  try {
    const stats = await peerConnection.getStats();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let selectedPair: any = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let transportReport: any = null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    stats.forEach((report: any) => {
      if (report.type === "transport") {
        transportReport = report;
        if (report.selectedCandidatePairId) {
          selectedPair = stats.get(report.selectedCandidatePairId);
        }
      } else if (
        report.type === "candidate-pair" &&
        (report.selected || report.state === "succeeded" || report.nominated)
      ) {
        if (!selectedPair) selectedPair = report;
      }
    });

    const iceState = peerConnection.iceConnectionState || peerConnection.connectionState || "connected";
    const securityCipher = transportReport?.dtlsCipher || "DTLS 1.3 / AES-GCM-256";

    if (selectedPair) {
      const localCandidate = stats.get(selectedPair.localCandidateId);
      const remoteCandidate = stats.get(selectedPair.remoteCandidateId);

      if (localCandidate && remoteCandidate) {
        const localType = localCandidate.candidateType || "host";
        const remoteType = remoteCandidate.candidateType || "host";
        const localIp = localCandidate.ip || localCandidate.address || "";
        const remoteIp = remoteCandidate.ip || remoteCandidate.address || "";
        const protocol = (localCandidate.protocol || remoteCandidate.protocol || "udp").toUpperCase();

        if (localType === "relay" || remoteType === "relay") {
          return {
            type: "relay",
            localIp,
            remoteIp,
            candidateType: localType,
            remoteCandidateType: remoteType,
            protocol,
            securityCipher,
            iceState,
          };
        }

        const isPrivateIp = (ip: string) =>
          /^10\./.test(ip) ||
          /^192\.168\./.test(ip) ||
          /^172\.(1[6-9]|2\d|3[0-1])\./.test(ip) ||
          /^127\./.test(ip) ||
          /\.local$/i.test(ip) ||
          /^fe80::/i.test(ip);

        if (
          (localType === "host" && remoteType === "host") ||
          (isPrivateIp(localIp) && isPrivateIp(remoteIp))
        ) {
          return {
            type: "local-lan",
            localIp,
            remoteIp,
            candidateType: localType,
            remoteCandidateType: remoteType,
            protocol,
            securityCipher,
            iceState,
          };
        }

        return {
          type: "p2p-direct",
          localIp,
          remoteIp,
          candidateType: localType,
          remoteCandidateType: remoteType,
          protocol,
          securityCipher,
          iceState,
        };
      }
    }

    return {
      type: "p2p-direct",
      securityCipher,
      iceState,
    };
  } catch (err) {
    console.warn("Could not determine WebRTC connection type:", err);
  }

  return { type: "p2p-direct" };
}

