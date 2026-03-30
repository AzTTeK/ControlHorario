import { useState } from 'react';
import { useTimeTracking } from '@/contexts/TimeTrackingContext';
import { LogIn, LogOut, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function TimeClockControls() {
  const { status, clockIn, clockOut } = useTimeTracking();
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClockIn = async () => {
    setLoading(true);
    try {
      await clockIn();
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    setLoading(true);
    try {
      await clockOut();
      setShowConfirm(false);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'idle') {
    return (
      <button
        onClick={handleClockIn}
        disabled={loading}
        className={cn(
          "btn flex w-full gap-2 h-14 text-base font-normal text-white bg-primary hover:bg-primary-600 transition-all shadow-sm dark:shadow-[0_0_15px_rgba(191,56,255,0.3)]",
          "hover:shadow-md active:scale-[0.98]"
        )}
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
        Iniciar Jornada
      </button>
    );
  }

  return (
    <div className="space-y-3">
      {/* Confirmación de salida */}
      {showConfirm && (
        <div className="bg-danger-light/20 border border-danger-light/50 rounded-card p-4 animate-fade-in">
          <p className="text-sm text-text-primary font-normal mb-3">
            ¿Confirmas la finalización de tu jornada?
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setShowConfirm(false)}
              className="btn btn-secondary flex-1 h-10 text-xs shadow-sm"
            >
              Cancelar
            </button>
            <button
              onClick={handleClockOut}
              disabled={loading}
              className="btn flex-1 bg-danger hover:bg-danger-dark text-white h-10 text-xs shadow-sm"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Finalizar Turno'}
            </button>
          </div>
        </div>
      )}

      {/* Botón de Salir estándar */}
      {!showConfirm && (
        <button
          onClick={() => setShowConfirm(true)}
          className="btn flex w-full gap-2 h-14 text-base font-normal text-danger border-2 border-danger/20 bg-danger-light/10 hover:bg-danger-light/20 transition-all shadow-sm active:scale-[0.98]"
        >
          <LogOut className="w-5 h-5" />
          Terminar Jornada
        </button>
      )}
    </div>
  );
}
