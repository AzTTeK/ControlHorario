import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import type { TimeEntry, Pause, PauseType, TimeTrackingContextType } from '@/types';
import { getTodayISO, getNowISO } from '@/lib/utils';
import { calculateLiveWorkedSeconds, calculateLivePauseSeconds } from '@/lib/calculations';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

const TimeTrackingContext = createContext<TimeTrackingContextType | null>(null);

/**
 * Provider de control de tiempo real con Supabase.
 */
export function TimeTrackingProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [currentEntry, setCurrentEntry] = useState<TimeEntry | null>(null);
  const [currentPause, setCurrentPause] = useState<Pause | null>(null);
  const [todayWorkedSeconds, setTodayWorkedSeconds] = useState(0);
  const [todayPausedSeconds, setTodayPausedSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const status: TimeTrackingContextType['status'] = currentPause
    ? 'paused'
    : currentEntry
      ? 'working'
      : 'idle';

  // 1. Cargar estado activo desde la DB
  useEffect(() => {
    if (!user) return;

    async function fetchActiveSession() {
      // Buscar última entrada no completada
      const { data: entries, error } = await supabase
        .from('time_entries')
        .select(`
          *,
          pauses (*)
        `)
        .eq('user_id', user!.id)
        .neq('status', 'completed')
        .order('clock_in', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error fetching active session:', error);
        return;
      }

      if (entries && entries.length > 0) {
        const entry = entries[0] as TimeEntry;
        setCurrentEntry(entry);
        
        // Ver si hay una pausa activa
        const activePause = entry.pauses?.find(p => !p.end_time);
        if (activePause) {
          setCurrentPause(activePause);
        }
      } else {
        setCurrentEntry(null);
        setCurrentPause(null);
      }
    }

    fetchActiveSession();
  }, [user]);

  // 2. Timer para actualización en tiempo real
  useEffect(() => {
    if (currentEntry) {
      const tick = () => {
        const allPauses = [...(currentEntry.pauses ?? [])];
        if (currentPause && !allPauses.find(p => p.id === currentPause.id)) {
          allPauses.push(currentPause);
        }
        setTodayWorkedSeconds(calculateLiveWorkedSeconds(currentEntry, allPauses));
        setTodayPausedSeconds(calculateLivePauseSeconds(allPauses));
      };

      tick();
      timerRef.current = setInterval(tick, 1000);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    } else {
      setTodayWorkedSeconds(0);
      setTodayPausedSeconds(0);
    }
  }, [currentEntry, currentPause]);

  const clockIn = useCallback(async () => {
    if (!user || currentEntry) return;

    const now = getNowISO();
    const { data, error } = await supabase
      .from('time_entries')
      .insert({
        user_id: user.id,
        date: getTodayISO(),
        clock_in: now,
        status: 'active',
      })
      .select()
      .single();

    if (error) throw error;
    setCurrentEntry({ ...data, pauses: [] } as TimeEntry);
  }, [user, currentEntry]);

  const clockOut = useCallback(async () => {
    if (!currentEntry) return;

    const now = getNowISO();
    
    // 1. Finalizar pausa activa si existe
    if (currentPause) {
      await endPause();
    }

    // 2. Recargar entrada para tener todas las pausas actualizadas
    const { data: latestEntry, error: fetchError } = await supabase
      .from('time_entries')
      .select('*, pauses(*)')
      .eq('id', currentEntry.id)
      .single();

    if (fetchError) throw fetchError;

    // 3. Calcular horas finales
    const totalSeconds = (new Date(now).getTime() - new Date(latestEntry.clock_in).getTime()) / 1000;
    const pauseSeconds = (latestEntry.pauses as Pause[] ?? []).reduce((sum, p) => {
      if (!p.end_time) return sum;
      return sum + (new Date(p.end_time).getTime() - new Date(p.start_time).getTime()) / 1000;
    }, 0);
    
    const workedHours = Math.round(((totalSeconds - pauseSeconds) / 3600) * 100) / 100;

    // 4. Actualizar entrada como completada
    const { error: updateError } = await supabase
      .from('time_entries')
      .update({
        clock_out: now,
        total_hours: workedHours,
        status: 'completed',
        updated_at: now,
      })
      .eq('id', currentEntry.id);

    if (updateError) throw updateError;
    
    setCurrentEntry(null);
    setCurrentPause(null);
  }, [currentEntry, currentPause]);

  const startPause = useCallback(async (type: PauseType) => {
    if (!currentEntry || currentPause) return;

    const now = getNowISO();
    const { data, error } = await supabase
      .from('pauses')
      .insert({
        time_entry_id: currentEntry.id,
        start_time: now,
        type,
      })
      .select()
      .single();

    if (error) throw error;
    
    const newPause = data as Pause;
    setCurrentPause(newPause);
    
    // Actualizar estado de la entrada
    await supabase
      .from('time_entries')
      .update({ status: 'paused', updated_at: now })
      .eq('id', currentEntry.id);

    setCurrentEntry(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        status: 'paused',
        pauses: [...(prev.pauses ?? []), newPause],
      };
    });
  }, [currentEntry, currentPause]);

  const endPause = useCallback(async () => {
    if (!currentEntry || !currentPause) return;

    const now = getNowISO();
    const duration = Math.floor(
      (new Date(now).getTime() - new Date(currentPause.start_time).getTime()) / 60000
    );

    const { data, error } = await supabase
      .from('pauses')
      .update({
        end_time: now,
        duration,
        updated_at: now,
      })
      .eq('id', currentPause.id)
      .select()
      .single();

    if (error) throw error;

    const endedPause = data as Pause;
    
    // Actualizar estado de la entrada a 'active'
    await supabase
      .from('time_entries')
      .update({ status: 'active', updated_at: now })
      .eq('id', currentEntry.id);

    setCurrentEntry(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        status: 'active',
        pauses: (prev.pauses ?? []).map(p => p.id === endedPause.id ? endedPause : p),
      };
    });
    setCurrentPause(null);
  }, [currentEntry, currentPause]);

  const value: TimeTrackingContextType = {
    currentEntry,
    currentPause,
    status,
    todayWorkedSeconds,
    todayPausedSeconds,
    clockIn,
    clockOut,
    startPause,
    endPause,
  };

  return (
    <TimeTrackingContext.Provider value={value}>
      {children}
    </TimeTrackingContext.Provider>
  );
}

export function useTimeTracking(): TimeTrackingContextType {
  const context = useContext(TimeTrackingContext);
  if (!context) {
    throw new Error('useTimeTracking debe usarse dentro de un TimeTrackingProvider');
  }
  return context;
}

/**
 * Hook para historial de entradas de Supabase.
 */
export function useTimeEntries() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEntries = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('time_entries')
      .select('*, pauses(*)')
      .eq('user_id', user.id)
      .order('clock_in', { ascending: false });

    if (error) {
      console.error('Error fetching entries:', error);
    } else {
      setEntries(data as TimeEntry[]);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const deleteEntry = useCallback(async (entryId: string) => {
    const { error } = await supabase
      .from('time_entries')
      .delete()
      .eq('id', entryId);

    if (error) throw error;
    setEntries(prev => prev.filter(e => e.id !== entryId));
  }, []);

  const updateEntry = useCallback(async (entryId: string, data: Partial<TimeEntry>) => {
    const { error } = await supabase
      .from('time_entries')
      .update({ ...data, edited_manually: true, updated_at: new Date().toISOString() })
      .eq('id', entryId);

    if (error) throw error;
    await fetchEntries();
  }, [fetchEntries]);

  return { entries, loading, deleteEntry, updateEntry, refreshEntries: fetchEntries };
}
