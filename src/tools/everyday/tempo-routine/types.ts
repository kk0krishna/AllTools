export interface RoutineEvent {
  time: number; // timestamp
  action: 'done' | 'snooze' | 'skip';
  snoozeUntil?: number; // timestamp
  note?: string;
}

export interface Routine {
  id: string;
  name: string;
  category?: string;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  intervalMinutes: number;
  days: number[]; // 0-6 (Sun-Sat)
  enabled: boolean;
  events: RoutineEvent[]; // History of actions
  settings?: Partial<UserSettings>; // Override global settings
}

export interface Occurrence {
  routineId: string;
  routineName: string;
  time: Date;
  snoozed?: boolean;
}

export interface UserSettings {
  volume: number;
  vibrate: boolean;
  soundPreset: string;
  alarmDuration: number;
  snoozeDuration: number;
  timeFormat: '12h' | '24h';
  gradualVolume: boolean;
  /** Show a focused, full-viewport in-app alert when this routine is due. */
  fullScreenAlert?: boolean;
  theme: 'system' | 'light' | 'dark';
}
