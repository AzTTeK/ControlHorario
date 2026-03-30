import { useState } from 'react';
import { useTimeTracking } from '@/contexts/TimeTrackingContext';
import { Coffee, Utensils, Clock, Loader2, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PauseType } from '@/types';

const PAUSE_OPTIONS: { type: PauseType; label: string; icon: typeof Coffee }[] = [
  { type: 'meal', label: 'Comida', icon: Utensils },
  { type: 'break', label: 'Descanso', icon: Coffee },
  { type: 'other', label: 'Otra', icon: Clock },
];

export function PauseControls() {
  const { status, startPause, endPause } = useTimeTracking();
  const [loading, setLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  if (status === 'idle') return null;

  const handleStartPause = async (type: PauseType) => {
    setLoading(true);
    try {
      await startPause(type);
      setShowOptions(false);
    } finally {
      setLoading(false);
    }
  };

  const handleEndPause = async () => {
    setLoading(true);
    try {
      await endPause();
    } finally {
      setLoading(false);
    }
  };

  if (status === 'paused') {
    return (
      <button
        onClick={handleEndPause}
        disabled={loading}
        className="btn flex w-full gap-2 h-14 text-base font-normal bg-primary text-white hover:bg-primary-600 shadow-sm transition-all animate-fade-in"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
        Reanudar Trabajo
      </button>
    );
  }

  return (
    <div>
      {showOptions ? (
        <div className="space-y-3 animate-fade-in card p-4 border border-border/50 shadow-sm bg-surface-hover/30">
          <p className="text-[11px] font-normal text-text-tertiary uppercase tracking-wider text-center">
            Selecciona el tipo de pausa
          </p>
          <div className="grid grid-cols-3 gap-2">
            {PAUSE_OPTIONS.map(({ type, label, icon: Icon }) => (
              <button
                key={type}
                onClick={() => handleStartPause(type)}
                disabled={loading}
                className={cn(
                  "flex flex-col items-center gap-1.5 p-3 rounded-button border border-border bg-surface",
                  "hover:bg-warning-light/30 hover:border-warning-light hover:text-warning-dark transition-all",
                  "disabled:opacity-50 disabled:pointer-events-none active:scale-95 shadow-sm"
                )}
              >
                <Icon className="w-5 h-5 text-warning" />
                <span className="text-[11px] font-normal text-text-secondary">
                  {label}
                </span>
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowOptions(false)}
            className="w-full text-[11px] font-normal text-text-tertiary hover:text-text-primary py-1 transition-colors"
          >
            Cancelar
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowOptions(true)}
          className="btn flex w-full gap-2 h-14 text-base font-normal text-warning-dark bg-warning-light/20 border-2 border-warning-light hover:bg-warning-light/40 transition-all shadow-sm active:scale-[0.98]"
        >
          <Coffee className="w-5 h-5" />
          Tomar Pausa
        </button>
      )}
    </div>
  );
}
