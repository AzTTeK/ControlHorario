import { useTimeTracking } from '@/contexts/TimeTrackingContext';
import { formatDuration } from '@/lib/utils';
import { Timer, Briefcase, Coffee } from 'lucide-react';

export function CurrentStatus() {
  const { status, todayWorkedSeconds, todayPausedSeconds } = useTimeTracking();

  return (
    <div className="card p-5 border-t-4 border-t-primary border-border drop-shadow-sm flex flex-col items-center">
      
      {/* Visual Indicator of Global State */}
      <div className="flex flex-col items-center mb-6 mt-2">
        <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-surface-hover mb-3 ring-4 ring-surface-hover/50">
           {status === 'idle' && <Briefcase className="w-6 h-6 text-text-tertiary" />}
           {status === 'working' && (
             <>
               <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-20 animate-ping"></span>
               <Timer className="w-7 h-7 text-success relative" />
             </>
           )}
           {status === 'paused' && <Coffee className="w-6 h-6 text-warning" />}
        </div>
        
        <h2 className="text-xl font-normal tracking-tight text-text-primary">
           {status === 'working' ? 'Trabajando' : status === 'paused' ? 'En Pausa' : 'Inactivo'}
        </h2>
        <p className="text-sm font-normal text-text-tertiary mt-1">
           {status === 'idle' ? 'Pulsa Iniciar para comenzar' : 
            status === 'working' ? 'Jornada contada correctamente' : 'El tiempo no está contando'}
        </p>
      </div>

      <div className="w-full h-px bg-border/60 mb-5"></div>

      {/* Trackers */}
      <div className="grid grid-cols-2 gap-3 w-full">
        {/* Worked Time */}
        <div className="bg-surface-hover/50 rounded-lg p-3 flex flex-col items-center border border-border/50">
          <span className="text-[10px] font-normal text-text-tertiary uppercase tracking-wider mb-1">
            Trabajado
          </span>
          <span className="text-2xl font-normal text-text-primary tabular-nums tracking-tight">
            {formatDuration(todayWorkedSeconds)}
          </span>
        </div>

        {/* Paused Time */}
        <div className="bg-surface-hover/50 rounded-lg p-3 flex flex-col items-center border border-border/50">
          <span className="text-[10px] font-normal text-text-tertiary uppercase tracking-wider mb-1">
            En Pausa
          </span>
          <span className="text-xl font-normal text-text-secondary tabular-nums mt-auto">
            {formatDuration(todayPausedSeconds)}
          </span>
        </div>
      </div>
    </div>
  );
}
