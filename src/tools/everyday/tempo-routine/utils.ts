import { Routine, Occurrence, UserSettings } from "./types";

export const DAYS_OF_WEEK = ["S", "M", "T", "W", "T", "F", "S"];

export const CATEGORIES = ["Health", "Productivity", "Hygiene", "Fitness", "Other"];

export const PRESETS = [
  { name: "💧 Drink Water", category: "Health", interval: 120, start: "08:00", end: "20:00" },
  { name: "🧘 Stretch", category: "Fitness", interval: 60, start: "09:00", end: "18:00" },
  { name: "👁️ Eye Drops", category: "Health", interval: 180, start: "09:00", end: "21:00" },
  { name: "☕ Study Break", category: "Productivity", interval: 50, start: "09:00", end: "22:00" },
  { name: "⚡ 1 Min Quick Task", category: "Productivity", interval: 1, start: "00:00", end: "23:59" },
  { name: "⏱️ 5 Min Pacing", category: "Productivity", interval: 5, start: "00:00", end: "23:59" },
  { name: "⏳ Pomodoro", category: "Productivity", interval: 30, start: "09:00", end: "18:00" },
  { name: "🔔 Hourly Chime", category: "Other", interval: 60, start: "08:00", end: "20:00" },
  { name: "🌸 Mindfulness", category: "Health", interval: 90, start: "08:00", end: "22:00" }
];

export const parseTime = (timeStr: string): { h: number; m: number } => {
  const [h, m] = timeStr.split(":").map(Number);
  return { h, m };
};

export const formatInterval = (mins: number) => {
  const h = Math.floor(mins / 60);
  const m = Math.floor(mins % 60);
  const s = Math.round((mins * 60) % 60);
  return [h ? `${h}h` : null, m ? `${m}m` : null, s ? `${s}s` : null].filter(Boolean).join(' ') || '0s';
};

export const getNextOccurrences = (routine: Routine, now: Date, limit: number = 5): Occurrence[] => {
  if (!routine.enabled || !Number.isFinite(routine.intervalMinutes) || routine.intervalMinutes <= 0) return [];
  
  const occurrences: Occurrence[] = [];
  
  const activeSnooze = routine.events.find(
    e => e.action === 'snooze' && e.snoozeUntil && e.snoozeUntil > now.getTime()
  );
  
  if (activeSnooze && activeSnooze.snoozeUntil) {
    occurrences.push({
      routineId: routine.id,
      routineName: routine.name,
      time: new Date(activeSnooze.snoozeUntil),
      snoozed: true
    });
  }

  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const testDate = new Date(now);
    testDate.setDate(testDate.getDate() + dayOffset);
    
    if (!routine.days.includes(testDate.getDay())) {
      continue;
    }
    
    const { h: startH, m: startM } = parseTime(routine.startTime);
    const { h: endH, m: endM } = parseTime(routine.endTime);
    
    const start = new Date(testDate);
    start.setHours(startH, startM, 0, 0);
    
    const end = new Date(testDate);
    end.setHours(endH, endM, 0, 0);
    
    if (end < start) {
      end.setDate(end.getDate() + 1);
    }

    let nextTime = new Date(start);
    while (nextTime <= end) {
      // Keep a due occurrence visible for five minutes so a reminder can
      // become actionable after its scheduled instant instead of vanishing.
      if (nextTime > now || now.getTime() - nextTime.getTime() < 5 * 60000) {
        const eventWithinWindow = routine.events.find(
          e => Math.abs(e.time - nextTime.getTime()) < 5 * 60000
        );

        if (!eventWithinWindow) {
          const isDuplicateOfSnooze = activeSnooze && Math.abs(activeSnooze.time - nextTime.getTime()) < 5 * 60000;
          if (!isDuplicateOfSnooze) {
            occurrences.push({
              routineId: routine.id,
              routineName: routine.name,
              time: new Date(nextTime)
            });
          }
        }
        if (occurrences.length >= limit) return occurrences;
      }
      nextTime = new Date(nextTime.getTime() + routine.intervalMinutes * 60000);
    }
  }
  
  return occurrences;
};

let audioCtx: AudioContext | null = null;
const activeOscillators = new Set<OscillatorNode>();

export const stopNotificationSound = () => {
  activeOscillators.forEach((oscillator) => {
    try { oscillator.stop(); } catch { /* Oscillator already stopped. */ }
  });
  activeOscillators.clear();
};

export const initAudio = () => {
  if (typeof window === 'undefined') return;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  // Resume context for iOS Safari on first user interaction
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
};

export const playNotificationSound = (settings: UserSettings) => {
  try {
    stopNotificationSound();
    if (settings.volume === 0 || settings.soundPreset === 'silent') return;

    if (!audioCtx) initAudio();
    if (!audioCtx) return;
    
    if (audioCtx.state === 'suspended') {
       audioCtx.resume();
    }

    const now = audioCtx.currentTime;
    const duration = Math.max(1, Math.min(settings.alarmDuration || 30, 300));
    const presets: Record<string, { notes: number[]; gap: number; tone: OscillatorType; noteLength: number }> = {
      digital: { notes: [880, 660], gap: 0.16, tone: 'sine', noteLength: 0.12 },
      chime: { notes: [659, 784, 988], gap: 0.22, tone: 'sine', noteLength: 0.5 },
      bells: { notes: [784, 988, 1175], gap: 0.3, tone: 'triangle', noteLength: 0.38 },
      radar: { notes: [440, 880], gap: 0.2, tone: 'sawtooth', noteLength: 0.16 },
      soft: { notes: [440, 523], gap: 0.45, tone: 'sine', noteLength: 0.55 },
      ringtone: { notes: [740, 587, 740, 587], gap: 0.13, tone: 'square', noteLength: 0.24 },
      music: { notes: [523, 659, 784, 659, 587, 698, 880, 698], gap: 0.18, tone: 'sine', noteLength: 0.28 },
      rising: { notes: [392, 494, 587, 784], gap: 0.24, tone: 'triangle', noteLength: 0.35 },
    };
    const preset = presets[settings.soundPreset] || presets.digital;
    const cycleLength = preset.notes.length * preset.gap;
    const cycleCount = Math.max(1, Math.ceil(duration / cycleLength));
    for (let cycle = 0; cycle < cycleCount; cycle++) {
      preset.notes.forEach((frequency, noteIndex) => {
        const start = now + cycle * cycleLength + noteIndex * preset.gap;
        if (start >= now + duration) return;
        const stop = Math.min(start + preset.noteLength, now + duration);
        const osc = audioCtx!.createOscillator();
        const gain = audioCtx!.createGain();
        osc.type = preset.tone;
        osc.frequency.setValueAtTime(frequency, start);
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.linearRampToValueAtTime(Math.max(0.005, settings.volume) * (settings.gradualVolume ? 0.45 : 1), start + 0.025);
        gain.gain.exponentialRampToValueAtTime(0.0001, stop);
        osc.connect(gain);
        gain.connect(audioCtx!.destination);
        activeOscillators.add(osc);
        osc.onended = () => activeOscillators.delete(osc);
        osc.start(start);
        osc.stop(stop);
      });
    }
  } catch (e) {
    console.warn("AudioContext not supported or blocked");
  }
};

export const sendNotification = (title: string, body: string, vibrate: boolean) => {
  if (typeof Notification !== 'undefined' && Notification.permission === "granted") {
    try {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then(registration => {
          registration.showNotification(title, {
            body,
            icon: '/bghome.png',
            vibrate: vibrate ? [200, 100, 200] : undefined,
            tag: 'tempo-routine',
            requireInteraction: true
          } as any).catch(() => {
            // Fallback if sw fails
            new Notification(title, { body, icon: '/bghome.png' });
          });
        });
      } else {
        new Notification(title, { body, icon: '/bghome.png' });
      }
    } catch (e) {
      console.error("Failed to show notification", e);
      try {
        new Notification(title, { body, icon: '/bghome.png' });
      } catch (innerE) {
        console.error("Fallback notification also failed", innerE);
      }
    }
  }
};

export const formatCountdown = (targetDate: Date, currentTime: Date) => {
  const diff = targetDate.getTime() - currentTime.getTime();
  if (diff < 0) return "Now";
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  if (hours > 0) return `in ${hours}h ${minutes % 60}m`;
  return `in ${minutes} min`;
};
