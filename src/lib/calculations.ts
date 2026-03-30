import { differenceInSeconds, parseISO, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval, eachDayOfInterval, format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { TimeEntry, Pause, DailyStats, WeeklyStats, MonthlyStats } from '@/types';

/**
 * Calcula los segundos totales de pausa para una entrada.
 * Solo cuenta pausas finalizadas (con end_time).
 */
export function calculatePauseSeconds(pauses: Pause[]): number {
  return pauses
    .filter((p) => p.end_time !== null)
    .reduce((sum, p) => {
      const seconds = differenceInSeconds(parseISO(p.end_time!), parseISO(p.start_time));
      return sum + Math.max(0, seconds);
    }, 0);
}

/**
 * Calcula las horas trabajadas para una entrada de tiempo.
 * Descuenta las pausas finalizadas.
 */
export function calculateWorkedHours(entry: TimeEntry): number {
  if (!entry.clock_out) return 0;

  const totalSeconds = differenceInSeconds(
    parseISO(entry.clock_out),
    parseISO(entry.clock_in)
  );
  const pauseSeconds = calculatePauseSeconds(entry.pauses ?? []);
  const workedSeconds = Math.max(0, totalSeconds - pauseSeconds);

  return workedSeconds / 3600;
}

/**
 * Calcula los segundos trabajados en tiempo real (para timer activo).
 */
export function calculateLiveWorkedSeconds(entry: TimeEntry, pauses: Pause[]): number {
  const now = new Date();
  const clockIn = parseISO(entry.clock_in);
  const totalSeconds = differenceInSeconds(now, clockIn);

  const pauseSeconds = pauses
    .filter((p) => p.end_time !== null)
    .reduce((sum, p) => {
      return sum + differenceInSeconds(parseISO(p.end_time!), parseISO(p.start_time));
    }, 0);

  // Si hay una pausa activa, contar el tiempo de pausa actual
  const activePause = pauses.find((p) => p.end_time === null);
  const activePauseSeconds = activePause
    ? differenceInSeconds(now, parseISO(activePause.start_time))
    : 0;

  return Math.max(0, totalSeconds - pauseSeconds - activePauseSeconds);
}

/**
 * Calcula los segundos en pausa en tiempo real.
 */
export function calculateLivePauseSeconds(pauses: Pause[]): number {
  const now = new Date();

  const completedPauseSeconds = pauses
    .filter((p) => p.end_time !== null)
    .reduce((sum, p) => {
      return sum + differenceInSeconds(parseISO(p.end_time!), parseISO(p.start_time));
    }, 0);

  const activePause = pauses.find((p) => p.end_time === null);
  const activePauseSeconds = activePause
    ? differenceInSeconds(now, parseISO(activePause.start_time))
    : 0;

  return completedPauseSeconds + activePauseSeconds;
}

/**
 * Obtiene estadísticas de un día específico.
 */
export function getDailyStats(entries: TimeEntry[], date: string): DailyStats {
  const dayEntries = entries.filter((e) => e.date === date);
  const totalWorked = dayEntries.reduce((sum, e) => sum + (e.total_hours ?? 0), 0);
  const totalPaused = dayEntries.reduce((sum, e) => {
    const pauseSecs = calculatePauseSeconds(e.pauses ?? []);
    return sum + pauseSecs / 3600;
  }, 0);

  return {
    date,
    totalWorked,
    totalPaused,
    entries: dayEntries.length,
  };
}

/**
 * Obtiene estadísticas semanales.
 */
export function getWeeklyStats(entries: TimeEntry[], referenceDate?: Date): WeeklyStats {
  const ref = referenceDate ?? new Date();
  const weekStart = startOfWeek(ref, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(ref, { weekStartsOn: 1 });

  const weekEntries = entries.filter((e) => {
    const entryDate = parseISO(e.date);
    return isWithinInterval(entryDate, { start: weekStart, end: weekEnd });
  });

  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
  const dailyBreakdown: DailyStats[] = days.map((day) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    return getDailyStats(entries, dateStr);
  });

  const totalHours = weekEntries.reduce((sum, e) => sum + (e.total_hours ?? 0), 0);
  const daysWorked = dailyBreakdown.filter((d) => d.entries > 0).length;

  return {
    totalHours,
    averageDaily: daysWorked > 0 ? totalHours / daysWorked : 0,
    daysWorked,
    dailyBreakdown,
  };
}

/**
 * Obtiene estadísticas mensuales.
 */
export function getMonthlyStats(entries: TimeEntry[], referenceDate?: Date): MonthlyStats {
  const ref = referenceDate ?? new Date();
  const monthStart = startOfMonth(ref);
  const monthEnd = endOfMonth(ref);

  const monthEntries = entries.filter((e) => {
    const entryDate = parseISO(e.date);
    return isWithinInterval(entryDate, { start: monthStart, end: monthEnd });
  });

  const totalHours = monthEntries.reduce((sum, e) => sum + (e.total_hours ?? 0), 0);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const daysWorked = new Set(monthEntries.map((e) => e.date)).size;

  // Agrupar por semana
  const weeklyMap = new Map<number, number>();
  for (const entry of monthEntries) {
    const entryDate = parseISO(entry.date);
    const weekNum = Math.ceil(
      (entryDate.getDate() + monthStart.getDay()) / 7
    );
    weeklyMap.set(weekNum, (weeklyMap.get(weekNum) ?? 0) + (entry.total_hours ?? 0));
  }

  const weeklyBreakdown = Array.from(weeklyMap.entries())
    .map(([week, hours]) => ({ week, hours }))
    .sort((a, b) => a.week - b.week);

  return {
    totalHours,
    averageDaily: daysWorked > 0 ? totalHours / daysWorked : 0,
    daysWorked,
    weeklyBreakdown,
  };
}

/**
 * Nombres cortos de días de la semana en español.
 */
export const DAY_NAMES_SHORT = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

/**
 * Nombres de meses en español.
 */
export const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];
