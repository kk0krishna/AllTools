import { useState, useEffect, useMemo } from "react";
import { Routine, RoutineEvent, Occurrence, UserSettings } from "./types";
import { getNextOccurrences, playNotificationSound, sendNotification } from "./utils";

const defaultSettings: UserSettings = {
  volume: 1,
  vibrate: true,
  soundPreset: 'digital',
  alarmDuration: 30, // seconds
  snoozeDuration: 15, // minutes
  timeFormat: '12h',
  gradualVolume: false,
  theme: 'system'
};

export function useTempoRoutines() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [lastNotifiedId, setLastNotifiedId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [globalPauseUntil, setGlobalPauseUntil] = useState<number | null>(null);
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);

  const requestPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    try {
      const perm = await Notification.requestPermission();
      setPermission(perm);
    } catch (error) {
      console.warn('Notification permission request was not available', error);
    }
  };

  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem("tempo_routines");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setRoutines(parsed.routines || []);
        if (parsed.globalPauseUntil && parsed.globalPauseUntil > Date.now()) {
          setGlobalPauseUntil(parsed.globalPauseUntil);
        }
        if (parsed.settings) {
          setSettings({ ...defaultSettings, ...parsed.settings });
        }
      } catch (e) {
        console.error("Failed to parse saved routines", e);
      }
    }
    
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 10000);
    
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("tempo_routines", JSON.stringify({
        routines,
        globalPauseUntil,
        settings
      }));
    }
  }, [routines, globalPauseUntil, settings, isClient]);

  const pauseAll = (hours: number) => {
    setGlobalPauseUntil(currentTime.getTime() + hours * 3600000);
  };

  const resumeAll = () => {
    setGlobalPauseUntil(null);
  };

  const addRoutine = (routine: Routine) => {
    setRoutines([...routines, routine]);
  };

  const toggleRoutine = (id: string) => {
    setRoutines(routines.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };
  
  const editRoutine = (id: string, updated: Partial<Routine>) => {
    setRoutines(routines.map(r => r.id === id ? { ...r, ...updated } : r));
  };
  
  const deleteRoutine = (id: string) => {
    setRoutines(routines.filter(r => r.id !== id));
  };

  const handleAction = (routineId: string, action: 'done' | 'snooze' | 'skip', time: Date, note?: string) => {
    setRoutines(routines.map(r => {
      if (r.id !== routineId) return r;
      
      const rSettings = { ...settings, ...r.settings };
      const newEvent: RoutineEvent = {
        time: time.getTime(),
        action,
        snoozeUntil: action === 'snooze' ? currentTime.getTime() + rSettings.snoozeDuration * 60000 : undefined,
        note
      };
      const newEvents = [...r.events, newEvent].slice(-100);
      return { ...r, events: newEvents };
    }));
  };

  const exportData = () => {
    const dataStr = JSON.stringify(routines, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tempo-backup-${new Date().toISOString().slice(0,10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importData = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        if (Array.isArray(imported)) {
          setRoutines(imported);
        }
      } catch (err) {
        alert("Invalid backup file");
      }
    };
    reader.readAsText(file);
  };

  const nextOccurrences = useMemo(() => {
    const all: Occurrence[] = [];
    routines.forEach(r => {
      all.push(...getNextOccurrences(r, currentTime, 3));
    });
    return all.sort((a, b) => a.time.getTime() - b.time.getTime()).slice(0, 5);
  }, [routines, currentTime]);

  const activeRoutine = nextOccurrences.length > 0 && nextOccurrences[0].time.getTime() - currentTime.getTime() < 5 * 60000 
    ? nextOccurrences[0] 
    : null;

  const isGloballyPaused = globalPauseUntil !== null && globalPauseUntil > currentTime.getTime();

  useEffect(() => {
    if (activeRoutine && !isGloballyPaused) {
      const occurrenceId = `${activeRoutine.routineId}-${activeRoutine.time.getTime()}`;
      if (lastNotifiedId !== occurrenceId) {
        const r = routines.find(x => x.id === activeRoutine.routineId);
        const rSettings = r ? { ...settings, ...r.settings } : settings;
        
        playNotificationSound(rSettings);
        if (rSettings.vibrate && 'vibrate' in navigator) navigator.vibrate([250, 100, 250, 100, 350]);
        sendNotification("Tempo Routine", `Time for: ${activeRoutine.routineName}`, rSettings.vibrate);
        setLastNotifiedId(occurrenceId);
      }
    }
  }, [activeRoutine, lastNotifiedId, isGloballyPaused, routines, settings]);

  const allHistory = useMemo(() => {
    return routines.flatMap(r => r.events.map(e => ({ ...e, routineName: r.name, routineId: r.id })))
      .sort((a, b) => b.time - a.time);
  }, [routines]);

  const stats = useMemo(() => {
    let done = 0;
    let snoozed = 0;
    let skipped = 0;
    allHistory.forEach(h => {
      if (h.action === 'done') done++;
      if (h.action === 'snooze') snoozed++;
      if (h.action === 'skip') skipped++;
    });
    const total = done + skipped; // Snoozes don't end the task cycle
    const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;
    return { done, snoozed, skipped, completionRate, total };
  }, [allHistory]);

  const dismissOverdue = () => {
    // Find all occurrences that are in the past
    const overdue = nextOccurrences.filter(occ => occ.time.getTime() < currentTime.getTime());
    if (overdue.length === 0) return;
    
    setRoutines(prev => prev.map(r => {
      const overdueForRoutine = overdue.filter(o => o.routineId === r.id);
      if (overdueForRoutine.length === 0) return r;
      
      const newEvents = [...r.events];
      overdueForRoutine.forEach(occ => {
        newEvents.push({
          time: occ.time.getTime(),
          action: 'skip',
          note: 'Auto-dismissed'
        });
      });
      return { ...r, events: newEvents.slice(-100) };
    }));
  };

  return {
    routines,
    isClient,
    currentTime,
    permission,
    requestPermission,
    addRoutine,
    toggleRoutine,
    deleteRoutine,
    editRoutine,
    handleAction,
    nextOccurrences,
    activeRoutine,
    allHistory,
    stats,
    isGloballyPaused,
    globalPauseUntil,
    pauseAll,
    resumeAll,
    exportData,
    importData,
    settings,
    setSettings,
    dismissOverdue,
  };
}
