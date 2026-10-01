export interface RoutineEvent {
  time: number; // timestamp
  action: 'done' | 'snooze' | 'skip';
  snoozeUntil?: number; // timestamp
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
}

export interface Occurrence {
  routineId: string;
  routineName: string;
  time: Date;
  snoozed?: boolean;
}
