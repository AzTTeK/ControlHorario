import { useState, useMemo } from 'react';
import { useTimeEntries } from '@/contexts/TimeTrackingContext';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, startOfWeek, endOfWeek } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Clock, Trash2, Edit3, ArchiveRestore, Coffee, Utensils, CalendarDays, TrendingUp } from 'lucide-react';
import { cn, formatHoursDecimal } from '@/lib/utils';
import { PAUSE_TYPE_LABELS } from '@/types';

export function HistoryPage() {
  const { entries, deleteEntry } = useTimeEntries();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);

  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const entryDates = useMemo(() => {
    const map = new Map<string, number>();
    for (const entry of entries) {
      const hours = map.get(entry.date) ?? 0;
      map.set(entry.date, hours + (entry.total_hours ?? 0));
    }
    return map;
  }, [entries]);

  const filteredEntries = useMemo(() => {
    if (!selectedDate) return entries.slice(0, 15);
    return entries.filter((e) => e.date === selectedDate);
  }, [entries, selectedDate]);

  const prevMonth = () => setCurrentMonth((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  const handleDelete = (id: string) => {
    deleteEntry(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-6 lg:space-y-8 animate-fade-in pb-10">
      
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/50 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-text-primary flex items-center gap-2">
            <ArchiveRestore className="w-6 h-6 text-primary-500" />
            Historial de Jornadas
          </h2>
          <p className="text-sm font-normal text-text-tertiary mt-1">
            Consulta y gestiona tus registros anteriores
          </p>
        </div>
        {selectedDate && (
          <button
            onClick={() => setSelectedDate(null)}
            className="text-[13px] font-normal tracking-wide uppercase text-primary-600 hover:text-primary-700 hover:bg-primary-50 px-4 py-2 rounded-button transition-colors active:scale-95"
          >
            Ver Todo Historico
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* === CALENDAR === */}
        <div className="lg:col-span-4 sticky top-24">
          <div className="card p-5">
            
            {/* Nav */}
            <div className="flex items-center justify-between mb-5 bg-surface-hover rounded-xl p-1.5 border border-border/50">
              <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-surface text-text-secondary shadow-sm transition-all focus:ring-2 focus:ring-primary-500">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <h3 className="text-sm font-medium text-text-primary capitalize tracking-wide">
                {format(currentMonth, 'MMMM yyyy', { locale: es })}
              </h3>
              <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-surface text-text-secondary shadow-sm transition-all focus:ring-2 focus:ring-primary-500">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Days Head */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day) => (
                <div key={day} className="text-center text-[10px] font-normal text-text-tertiary uppercase pb-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day) => {
                const dateStr = format(day, 'yyyy-MM-dd');
                const hasEntry = entryDates.has(dateStr);
                const hours = entryDates.get(dateStr) ?? 0;
                const isCurrentMonth = isSameMonth(day, currentMonth);
                const isSelected = selectedDate === dateStr;
                const today = isToday(day);

                return (
                  <button
                    key={dateStr}
                    onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                    className={cn(
                      'relative aspect-square flex flex-col items-center justify-center rounded-lg text-xs font-normal transition-all duration-200 outline-none',
                      isCurrentMonth ? 'text-text-primary' : 'text-text-tertiary opacity-30',
                      isSelected && 'bg-primary border-transparent text-white shadow-md ring-2 ring-primary-500 ring-offset-2',
                      today && !isSelected && 'bg-primary-50 text-primary-700 ring-1 ring-primary-200 inset-ring',
                      !isSelected && isCurrentMonth && 'hover:bg-surface-hover hover:ring-1 hover:ring-border'
                    )}
                  >
                    <span>{format(day, 'd')}</span>
                    
                    {hasEntry && !isSelected && (
                      <div className="absolute bottom-[2px] flex gap-[2px]">
                        <div className="w-[4px] h-[4px] rounded-full bg-primary-400" />
                        {hours >= 8 && <div className="w-[4px] h-[4px] rounded-full bg-success" />}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* === LIST / DETAILS === */}
        <div className="lg:col-span-8 space-y-4">
          
          {filteredEntries.length === 0 ? (
            <div className="card p-12 text-center border-dashed border-2 flex flex-col justify-center items-center h-full">
              <CalendarDays className="w-12 h-12 text-text-tertiary/50 mx-auto mb-4" />
              <h3 className="font-normal text-text-primary text-lg">No hay registros</h3>
              <p className="text-sm font-normal text-text-secondary mt-1">
                {selectedDate ? `No se encontraron jornadas el día ${format(parseISO(selectedDate), "d 'de' MMMM", { locale: es })}.` : 'Aún no has registrado ninguna jornada.'}
              </p>
            </div>
          ) : (
            filteredEntries.map((entry) => {
              return (
              <div
                key={entry.id}
                className="card animate-fade-in group hover:border-primary-200 transition-colors p-0 overflow-hidden"
              >
                
                {/* Header Row */}
                <div className="p-4 px-5 sm:p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 bg-surface">
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "flex shrink-0 w-12 h-12 rounded-xl items-center justify-center border mt-1",
                      entry.status === 'completed' ? "bg-success-light/20 border-success-light/50 text-success-dark" : "bg-primary-50 border-primary-100 text-primary-600"
                    )}>
                      <Clock className="w-6 h-6" />
                    </div>
                    
                    <div className="flex flex-col pt-1">
                      <p className="text-base font-medium text-text-primary capitalize tracking-tight leading-none mb-2">
                        {format(parseISO(entry.date), "EEEE d 'de' MMMM", { locale: es })}
                      </p>
                      
                      <div className="flex items-center gap-3">
                         <div className="bg-surface-hover border border-border rounded-md px-2 py-0.5 text-[13px] font-normal text-text-secondary tabular-nums">
                            {entry.clock_in ? new Date(entry.clock_in).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                            <span className="mx-1 text-text-tertiary">➝</span>
                            {entry.clock_out ? new Date(entry.clock_out).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : 'En curso'}
                         </div>
                         
                         {entry.edited_manually && (
                           <span className="text-[10px] font-normal uppercase tracking-wide bg-warning-light/50 border border-warning-light text-warning-dark px-1.5 py-0.5 rounded-md">
                             Editado
                           </span>
                         )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center sm:items-end justify-between sm:flex-col gap-2">
                     <span className="text-2xl font-normal text-text-primary tabular-nums tracking-tighter self-end relative">
                        {entry.total_hours ? formatHoursDecimal(entry.total_hours) : '--'}
                     </span>
                  </div>
                </div>

                {/* Sub row - Pauses and Actions */}
                <div className="bg-surface-hover/30 px-5 py-3 border-t border-border/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  
                  {/* Pauses List */}
                   <div className="flex flex-wrap gap-2 items-center flex-1">
                      {/* Real Work Widget */}
                      <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-md px-2.5 py-1.5 shadow-sm shadow-emerald-500/5">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>Tiempo Real:</span>
                        <span className="font-normal tabular-nums ml-0.5">
                          {entry.total_hours ? formatHoursDecimal(entry.total_hours) : '--'}
                        </span>
                      </div>

                      {/* Separator if pauses exist */}
                      {entry.pauses && entry.pauses.length > 0 && (
                        <div className="h-4 w-px bg-border/60 mx-1 hidden sm:block"></div>
                      )}

                     {entry.pauses && entry.pauses.length > 0 ? (
                       entry.pauses.map((pause) => (
                         <div
                           key={pause.id}
                           className="flex items-center gap-1.5 text-[11px] font-normal uppercase tracking-wide bg-surface border border-border/70 rounded-md px-2.5 py-1.5 shadow-sm"
                         >
                           {pause.type === 'meal' ? (
                             <Utensils className="w-3.5 h-3.5 text-warning" />
                           ) : (
                             <Coffee className="w-3.5 h-3.5 text-warning" />
                           )}
                           <span className="text-text-secondary">
                             {PAUSE_TYPE_LABELS[pause.type]}
                           </span>
                           <span className="text-text-tertiary font-medium ml-1">
                             {pause.duration !== null && pause.duration !== undefined ? (
                               pause.duration < 1 ? '< 1m' : `${pause.duration}m`
                             ) : (
                               pause.end_time ? '0m' : 'En curso'
                             )}
                           </span>
                         </div>
                       ))
                     ) : (
                       <span className="text-xs font-normal text-text-tertiary">Sin pausas registradas</span>
                     )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center shrink-0 w-full sm:w-auto justify-end">
                    {deleteConfirmId === entry.id ? (
                      <div className="flex items-center gap-2 animate-fade-in bg-danger-light/20 p-1.5 rounded-lg border border-danger-light/50">
                        <span className="text-[11px] font-normal text-danger uppercase tracking-wide px-1">¿Borrar?</span>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="btn btn-secondary h-7 px-2.5 text-xs ring-0"
                        >
                          No
                        </button>
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="btn bg-danger text-white hover:bg-danger-dark h-7 px-2.5 text-xs shadow-sm ring-0"
                        >
                          Sí
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <button className="p-2 rounded-md hover:bg-surface border border-transparent hover:border-border text-text-tertiary hover:text-text-primary transition-all">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(entry.id)}
                          className="p-2 rounded-md hover:bg-danger-light/20 border border-transparent hover:border-danger-light/50 text-text-tertiary hover:text-danger transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>
        
      </div>
    </div>
  );
}
