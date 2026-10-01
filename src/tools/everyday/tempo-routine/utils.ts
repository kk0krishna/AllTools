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

export const getNextOccurrences = (routine: Routine, now: Date, limit: number = 5): Occurrence[] => {
  if (!routine.enabled) return [];
  
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
      if (nextTime > now) {
        const eventWithinWindow = routine.events.find(
          e => Math.abs(e.time - nextTime.getTime()) < 5 * 60000
        );

        if (!eventWithinWindow || eventWithinWindow.action === 'snooze') {
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
    if (!audioCtx) initAudio();
    if (!audioCtx || settings.volume === 0) return;
    
    // Check if state is suspended (iOS restriction if not resumed on interaction)
    if (audioCtx.state === 'suspended') {
       audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = settings.soundPreset === 'bells' ? "square" : 
               (settings.soundPreset === 'chime' ? "triangle" : 
               (settings.soundPreset === 'radar' ? "sawtooth" : "sine"));
    
    const duration = settings.alarmDuration;
    
    if (settings.soundPreset === 'digital') {
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.1);
    } else if (settings.soundPreset === 'chime') {
      osc.frequency.setValueAtTime(600, audioCtx.currentTime);
      osc.frequency.linearRampToValueAtTime(400, audioCtx.currentTime + duration);
    } else if (settings.soundPreset === 'radar') {
      osc.frequency.setValueAtTime(400, audioCtx.currentTime);
      osc.frequency.linearRampToValueAtTime(800, audioCtx.currentTime + 0.2);
      osc.frequency.linearRampToValueAtTime(400, audioCtx.currentTime + 0.4);
    } else if (settings.soundPreset === 'soft') {
      osc.frequency.setValueAtTime(300, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(250, audioCtx.currentTime + duration);
    } else {
      osc.frequency.setValueAtTime(1000, audioCtx.currentTime);
    }
    
    if (settings.gradualVolume) {
      gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(settings.volume, audioCtx.currentTime + (duration / 2));
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
    } else {
      gain.gain.setValueAtTime(settings.volume, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
    }

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    console.warn("AudioContext not supported or blocked");
  }
};

export const sendNotification = (title: string, body: string, vibrate: boolean) => {
  if (Notification.permission === "granted") {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.showNotification(title, {
          body,
          icon: '/bghome.png',
          vibrate: vibrate ? [200, 100, 200] : undefined,
          tag: 'tempo-routine',
          requireInteraction: true
        } as any);
      });
    } else {
      new Notification(title, { body, icon: '/bghome.png' });
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
