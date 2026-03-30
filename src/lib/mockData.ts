import { format, subDays } from 'date-fns';
import type { TimeEntry, Profile } from '@/types';
import { generateId } from '@/lib/utils';

/**
 * Perfil de usuario mock para desarrollo.
 */
export const MOCK_PROFILE: Profile = {
  id: 'mock-user-001',
  full_name: 'Elías García',
  avatar_url: undefined,
  created_at: '2025-01-15T10:00:00Z',
  updated_at: '2025-03-28T10:00:00Z',
};

/**
 * Usuario mock para autenticación.
 */
export const MOCK_USER = {
  id: 'mock-user-001',
  email: 'elias@example.com',
  created_at: '2025-01-15T10:00:00Z',
};

/**
 * Genera entradas de tiempo mock para los últimos N días.
 */
export function generateMockEntries(days: number = 30): TimeEntry[] {
  const entries: TimeEntry[] = [];
  const today = new Date();

  for (let i = 1; i <= days; i++) {
    const date = subDays(today, i);
    const dayOfWeek = date.getDay();

    // Saltar fines de semana
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;

    const dateStr = format(date, 'yyyy-MM-dd');

    // Hora de entrada entre 8:00 y 9:30
    const entryHour = 8 + Math.random() * 1.5;
    const entryMinutes = Math.floor((entryHour % 1) * 60);
    const clockIn = new Date(date);
    clockIn.setHours(Math.floor(entryHour), entryMinutes, 0, 0);

    // Hora de salida entre 17:00 y 19:00
    const exitHour = 17 + Math.random() * 2;
    const exitMinutes = Math.floor((exitHour % 1) * 60);
    const clockOut = new Date(date);
    clockOut.setHours(Math.floor(exitHour), exitMinutes, 0, 0);

    // Pausa de comida (30-60 min entre 13:00 y 14:00)
    const pauseStart = new Date(date);
    pauseStart.setHours(13, Math.floor(Math.random() * 30), 0, 0);
    const pauseDuration = 30 + Math.floor(Math.random() * 30); // 30-60 min
    const pauseEnd = new Date(pauseStart.getTime() + pauseDuration * 60 * 1000);

    // Calcular horas trabajadas
    const totalSeconds = (clockOut.getTime() - clockIn.getTime()) / 1000;
    const pauseSeconds = pauseDuration * 60;
    const workedHours = Math.round(((totalSeconds - pauseSeconds) / 3600) * 100) / 100;

    // Posible pausa adicional de descanso
    const hasBreak = Math.random() > 0.6;
    const breakPause = hasBreak ? {
      id: generateId(),
      time_entry_id: '',
      start_time: new Date(date.setHours(16, 0, 0, 0)).toISOString(),
      end_time: new Date(date.setHours(16, 15, 0, 0)).toISOString(),
      type: 'break' as const,
      duration: 15,
      created_at: clockIn.toISOString(),
      updated_at: clockIn.toISOString(),
    } : null;

    const entryId = generateId();
    const pauses = [
      {
        id: generateId(),
        time_entry_id: entryId,
        start_time: pauseStart.toISOString(),
        end_time: pauseEnd.toISOString(),
        type: 'meal' as const,
        duration: pauseDuration,
        created_at: clockIn.toISOString(),
        updated_at: clockIn.toISOString(),
      },
    ];

    if (breakPause) {
      breakPause.time_entry_id = entryId;
      pauses.push(breakPause);
    }

    entries.push({
      id: entryId,
      user_id: MOCK_USER.id,
      date: dateStr,
      clock_in: clockIn.toISOString(),
      clock_out: clockOut.toISOString(),
      total_hours: hasBreak ? Math.round((workedHours - 0.25) * 100) / 100 : workedHours,
      status: 'completed',
      edited_manually: Math.random() > 0.9,
      notes: Math.random() > 0.7 ? 'Día productivo' : undefined,
      pauses,
      created_at: clockIn.toISOString(),
      updated_at: clockOut.toISOString(),
    });
  }

  return entries.sort((a, b) => b.date.localeCompare(a.date));
}
