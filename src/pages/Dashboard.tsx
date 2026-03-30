import { useMemo } from 'react';
import { Clock, Calendar, TrendingUp, History } from 'lucide-react';
import { useTimeEntries } from '@/contexts/TimeTrackingContext';
import { getWeeklyStats, getMonthlyStats } from '@/lib/calculations';
import { formatHoursDecimal } from '@/lib/utils';
import { CurrentStatus } from '@/components/time-tracking/CurrentStatus';
import { TimeClockControls } from '@/components/time-tracking/TimeClockControls';
import { PauseControls } from '@/components/time-tracking/PauseControls';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { WeeklyChart, MiniBarChart } from '@/components/dashboard/WeeklyChart';

export function DashboardPage() {
  const { entries } = useTimeEntries();

  const weeklyStats = useMemo(() => getWeeklyStats(entries), [entries]);
  const monthlyStats = useMemo(() => getMonthlyStats(entries), [entries]);

  const miniChartData = weeklyStats.dailyBreakdown.map((d) => d.totalWorked);

  return (
    <div className="space-y-6 lg:space-y-8 animate-fade-in pb-10">
      
      {/* 3 COLUMN STATS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <StatsCard
          title="Horas Semana"
          value={formatHoursDecimal(weeklyStats.totalHours)}
          subtitle={`${weeklyStats.daysWorked} días trabajados`}
          icon={<Clock className="w-5 h-5" />}
          iconBgColor="bg-primary-100"
          iconTextColor="text-primary-600"
        >
          <MiniBarChart data={miniChartData} color="var(--color-primary-500)" />
        </StatsCard>

        <StatsCard
          title="Horas Mes"
          value={formatHoursDecimal(monthlyStats.totalHours)}
          subtitle={`${monthlyStats.daysWorked} días trabajados`}
          icon={<Calendar className="w-5 h-5" />}
          iconBgColor="bg-violet-100"
          iconTextColor="text-violet-600"
        >
          <MiniBarChart data={monthlyStats.weeklyBreakdown.map((w) => w.hours)} color="#8B5CF6" />
        </StatsCard>

        <StatsCard
          title="Promedio Mensual"
          value={`${monthlyStats.averageDaily.toFixed(1)}h`}
          subtitle="Media de horas por día"
          icon={<TrendingUp className="w-5 h-5" />}
          iconBgColor="bg-emerald-100"
          iconTextColor="text-emerald-600"
        />
      </div>

      {/* CORE CONTENT MIX (2 Cols on large screens) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* Left Column (Main controls) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <CurrentStatus />
          
          <div className="card p-5 bg-surface-hover/20">
             <h3 className="text-[11px] uppercase tracking-wider font-medium text-text-tertiary mb-4">
                Acciones Rápidas
             </h3>
             <div className="flex flex-col gap-3">
               <TimeClockControls />
               <PauseControls />
             </div>
          </div>
        </div>

        {/* Right Column (Data/Logs) */}
        <div className="lg:col-span-8 flex flex-col gap-6 lg:gap-8">
          
          {/* Chart Wrapper */}
          <div className="card p-0 overflow-hidden">
            <WeeklyChart data={weeklyStats.dailyBreakdown} />
          </div>

          {/* Recent list */}
          <div className="card p-0 overflow-hidden">
            <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between">
              <h3 className="text-sm font-medium text-text-primary flex items-center gap-2">
                <History className="w-4 h-4 text-text-tertiary" />
                Registros Recientes
              </h3>
            </div>
            
            <div className="divide-y divide-border/30">
              {entries.slice(0, 5).map((entry) => (
                <div key={entry.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 px-5 hover:bg-surface-hover transition-colors">
                  <div className="flex flex-col gap-1 mb-2 sm:mb-0">
                    <span className="text-sm font-normal text-text-primary capitalize">
                      {new Date(entry.date).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                    <span className="text-xs font-normal text-text-tertiary flex items-center gap-2">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-success"></span>
                      Jornada completada
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm tabular-nums">
                    <div className="flex bg-surface border border-border rounded-md px-2.5 py-1 text-text-secondary font-normal">
                      {entry.clock_in ? new Date(entry.clock_in).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                      <span className="mx-1.5 text-text-tertiary">→</span>
                      {entry.clock_out ? new Date(entry.clock_out).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                    </div>
                    
                    <span className="font-normal text-text-primary min-w-[3.5rem] text-right">
                      {entry.total_hours ? `${entry.total_hours.toFixed(1)}h` : '--'}
                    </span>
                  </div>
                </div>
              ))}
              
              {entries.length === 0 && (
                <div className="p-8 pb-10 text-center flex flex-col items-center text-text-tertiary">
                   <Clock className="w-8 h-8 opacity-20 mb-3" />
                   <p className="text-sm font-normal">No hay jornadas registradas aún</p>
                </div>
              )}
            </div>
            
            <div className="bg-surface-hover/30 p-3 text-center border-t border-border/50">
               <span className="text-xs font-normal text-primary-600 hover:text-primary-700 cursor-pointer">
                 Ver todo el historial &rarr;
               </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
