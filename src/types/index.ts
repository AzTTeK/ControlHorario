// ===== Enums =====
export type EntryStatus = 'active' | 'paused' | 'completed';
export type PauseType = 'meal' | 'break' | 'other';

// ===== Interfaces del Modelo de Datos =====

export interface Profile {
  id: string;
  full_name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface TimeEntry {
  id: string;
  user_id: string;
  date: string;
  clock_in: string;
  clock_out: string | null;
  total_hours: number | null;
  status: EntryStatus;
  edited_manually: boolean;
  notes?: string;
  pauses?: Pause[];
  created_at: string;
  updated_at: string;
}

export interface Pause {
  id: string;
  time_entry_id: string;
  start_time: string;
  end_time: string | null;
  type: PauseType;
  duration: number | null;
  created_at: string;
  updated_at: string;
}

// ===== Interfaces de Estadísticas =====

export interface DailyStats {
  date: string;
  totalWorked: number;
  totalPaused: number;
  entries: number;
}

export interface WeeklyStats {
  totalHours: number;
  averageDaily: number;
  daysWorked: number;
  dailyBreakdown: DailyStats[];
}

export interface MonthlyStats {
  totalHours: number;
  averageDaily: number;
  daysWorked: number;
  weeklyBreakdown: { week: number; hours: number }[];
}

// ===== Interfaces de Autenticación =====

export interface AuthUser {
  id: string;
  email?: string;
  created_at?: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
}

// ===== Interfaces de Time Tracking =====

export interface TimeTrackingContextType {
  currentEntry: TimeEntry | null;
  currentPause: Pause | null;
  status: 'idle' | 'working' | 'paused';
  todayWorkedSeconds: number;
  todayPausedSeconds: number;
  clockIn: () => Promise<void>;
  clockOut: () => Promise<void>;
  startPause: (type: PauseType) => Promise<void>;
  endPause: () => Promise<void>;
}

// ===== Tipos de Pausa traducidos =====

export const PAUSE_TYPE_LABELS: Record<PauseType, string> = {
  meal: 'Comida',
  break: 'Descanso',
  other: 'Otra',
};

// ===== Status labels =====

export const STATUS_LABELS: Record<EntryStatus, string> = {
  active: 'En trabajo',
  paused: 'En pausa',
  completed: 'Completada',
};

export const STATUS_COLORS: Record<EntryStatus, string> = {
  active: 'var(--color-success)',
  paused: 'var(--color-warning)',
  completed: 'var(--color-primary)',
};
