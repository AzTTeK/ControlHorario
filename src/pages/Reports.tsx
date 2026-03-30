import { useState, useMemo, useEffect } from 'react';
import { useTimeEntries } from '@/contexts/TimeTrackingContext';
import { formatHoursDecimal } from '@/lib/utils';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Download, Calendar, TrendingUp, Clock, FileSpreadsheet, BarChart2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type DateRange = '7d' | '30d' | '90d';

export function ReportsPage() {
  const { entries } = useTimeEntries();
  const [dateRange, setDateRange] = useState<DateRange>('30d');

  const rangeDays = { '7d': 7, '30d': 30, '90d': 90 };
  const rangeLabels = { '7d': '7 Días', '30d': '30 Días', '90d': '90 Días' };

  const filteredEntries = useMemo(() => {
    const now = new Date();
    // Normalizar a 00:00 para incluir registros de hoy
    const cutoff = new Date(now.getFullYear(), now.getMonth(), now.getDate() - rangeDays[dateRange]);
    return entries.filter((e) => {
      const entryDate = parseISO(e.date);
      return entryDate >= cutoff;
    });
  }, [entries, dateRange]);

  const totalHours = filteredEntries.reduce((sum, e) => sum + (e.total_hours ?? 0), 0);
  const avgDaily = filteredEntries.length > 0 ? totalHours / new Set(filteredEntries.map((e) => e.date)).size : 0;
  const totalDays = new Set(filteredEntries.map((e) => e.date)).size;
  const totalPauses = filteredEntries.reduce((sum, e) => sum + (e.pauses?.length ?? 0), 0);

  const chartData = useMemo(() => {
    const map = new Map<string, { worked: number; paused: number }>();
    for (const entry of filteredEntries) {
      const existing = map.get(entry.date) ?? { worked: 0, paused: 0 };
      existing.worked += entry.total_hours ?? 0;
      map.set(entry.date, existing);
    }

    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, data]) => ({
        date: format(parseISO(date), 'dd MMM', { locale: es }),
        fullDate: date,
        trabajado: Math.round(data.worked * 100) / 100,
      }));
  }, [filteredEntries]);

  // Generar CSV dinámicamente para usar en un enlace nativo
  const [csvUrl, setCsvUrl] = useState<string>('');
  
  useEffect(() => {
    if (filteredEntries.length === 0) {
      setCsvUrl('');
      return;
    }

    const headers = ['Fecha', 'Hora Entrada', 'Hora Salida', 'Pausas (min)', 'Total Horas', 'Estado'];
    const rows = filteredEntries.map((entry) => {
      const pauseMinutes = entry.pauses?.reduce((s, p) => s + (p.duration ?? 0), 0) ?? 0;
      return [
        entry.date,
        entry.clock_in ? new Date(entry.clock_in).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : '--:--',
        entry.clock_out ? new Date(entry.clock_out).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : '--:--',
        pauseMinutes.toString(),
        entry.total_hours?.toFixed(2) ?? '',
        entry.status,
      ];
    });

    const csvContent = [headers, ...rows].map((r) => r.join(';')).join('\n');
    const blob = new Blob(['\ufeff', csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    setCsvUrl(url);

    // Limpiar el objeto de memoria cuando los datos cambien
    return () => URL.revokeObjectURL(url);
  }, [filteredEntries]);

  const filename = `reporte_horario_${format(new Date(), 'yyyy-MM-dd')}.csv`;

  return (
    <div className="space-y-6 lg:space-y-8 animate-fade-in pb-10">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-border/50 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-text-primary flex items-center gap-2">
            <BarChart2 className="w-6 h-6 text-primary-500" />
            Reportes y Análisis
          </h2>
          <p className="text-sm font-normal text-text-tertiary mt-1">
            Visualiza y exporta las métricas de tu actividad
          </p>
        </div>
        
        <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-3 w-full md:w-auto">
          {/* Range Selector */}
          <div className="flex p-1 bg-surface-hover border border-border rounded-lg shadow-sm">
            {(Object.keys(rangeLabels) as DateRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={cn(
                  'flex-1 xs:flex-none px-4 py-1.5 justify-center rounded-md text-[13px] font-normal transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary',
                  dateRange === range
                    ? 'bg-surface text-primary border-border shadow-sm'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface/50 transparent'
                )}
              >
                {rangeLabels[range]}
              </button>
            ))}
          </div>

          {csvUrl ? (
            <a
              href={csvUrl}
              download={filename}
              className="btn btn-primary h-[38px] px-5 font-normal tracking-wide shadow-md flex items-center justify-center w-full xs:w-auto"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar CSV
            </a>
          ) : (
            <button
              disabled
              className="btn btn-primary h-[38px] px-5 font-normal tracking-wide shadow-md justify-center w-full xs:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar CSV
            </button>
          )}
        </div>
      </div>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Horas Totales', value: formatHoursDecimal(totalHours), icon: Clock, color: 'text-primary-600', bg: 'bg-primary-50', border: 'border-primary-100' },
          { label: 'Promedio Diario', value: `${avgDaily.toFixed(1)}h`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
          { label: 'Días Trabajados', value: totalDays.toString(), icon: Calendar, color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100' },
          { label: 'Pausas Realizadas', value: totalPauses.toString(), icon: FileSpreadsheet, color: 'text-amber-600', bg: 'bg-warning-light/50', border: 'border-warning-light' },
        ].map((stat, i) => (
          <div
            key={stat.label}
            className="card p-5 border shadow-sm animate-fade-in flex flex-col items-start gap-4"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center border', stat.bg, stat.color, stat.border)}>
              <stat.icon className="w-5 h-5" />
            </div>
            
            <div className="w-full">
              <p className="text-3xl font-normal text-text-primary tabular-nums tracking-tight leading-none mb-1">
                {stat.value}
              </p>
              <p className="text-[11px] font-normal uppercase tracking-wider text-text-tertiary">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* CHARTS */}
      <div className="card p-6 border shadow-sm">
        <div className="mb-6 flex items-center justify-between border-b border-border/50 pb-4">
          <h3 className="text-sm font-medium text-text-primary flex items-center gap-2">
             <TrendingUp className="w-4 h-4 text-text-tertiary" />
             Evolución temporal
          </h3>
          <span className="text-[11px] font-normal tracking-wider text-primary uppercase bg-primary-50 px-2 py-1 rounded border border-primary-100">
             {rangeLabels[dateRange]}
          </span>
        </div>
        
        <div className="h-[300px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorHoras" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke="#E2E8F0" vertical={false} />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#94A3B8', fontWeight: 400 }}
                interval="preserveStartEnd"
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#94A3B8', fontWeight: 400 }}
                tickFormatter={(v) => `${v}h`}
              />
              <Tooltip
                contentStyle={{
                 backgroundColor: '#ffffff',
                 border: '1px solid #E2E8F0',
                 borderRadius: '0.75rem',
                 boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                 padding: '8px 12px',
                 fontSize: '12px',
                 fontWeight: 600,
                }}
                formatter={(value: any) => [`${Number(value).toFixed(1)}h`, 'Trabajado']}
              />
              <Area
                type="monotone"
                dataKey="trabajado"
                stroke="#3B82F6"
                strokeWidth={3}
                fill="url(#colorHoras)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="card border shadow-sm p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-surface flex items-center">
          <h3 className="text-sm font-medium text-text-primary flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-text-tertiary" />
            Tabla Analítica
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-hover/50 border-b border-border">
                <th className="text-[11px] font-normal text-text-tertiary uppercase tracking-wider px-6 py-4">Día</th>
                <th className="text-[11px] font-normal text-text-tertiary uppercase tracking-wider px-6 py-4">Entrada</th>
                <th className="text-[11px] font-normal text-text-tertiary uppercase tracking-wider px-6 py-4">Salida</th>
                <th className="text-[11px] font-normal text-text-tertiary uppercase tracking-wider px-6 py-4">Pausas</th>
                <th className="text-[11px] font-normal text-text-tertiary uppercase tracking-wider px-6 py-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredEntries.map((entry) => (
                <tr
                  key={entry.id}
                  className="hover:bg-surface-hover transition-colors text-sm"
                >
                  <td className="px-6 py-4 font-normal text-text-primary min-w-[120px]">
                    {format(parseISO(entry.date), 'dd MMM yyyy', { locale: es })}
                  </td>
                  <td className="px-6 py-4 text-text-secondary tabular-nums font-normal">
                    {entry.clock_in ? new Date(entry.clock_in).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                  </td>
                  <td className="px-6 py-4 text-text-secondary tabular-nums font-normal">
                    {entry.clock_out ? new Date(entry.clock_out).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                  </td>
                  <td className="px-6 py-4 text-text-secondary">
                     <span className="bg-surface border border-border px-2 py-0.5 rounded-md text-xs font-normal tabular-nums">
                       {entry.pauses?.length ?? 0}
                     </span>
                     <span className="text-xs text-text-tertiary ml-2 font-normal">({entry.pauses?.reduce((s, p) => s + (p.duration ?? 0), 0) ?? 0}m)</span>
                  </td>
                  <td className="px-6 py-4 font-normal text-text-primary text-right tabular-nums">
                    {entry.total_hours ? `${entry.total_hours.toFixed(1)}h` : '--'}
                  </td>
                </tr>
              ))}
              
              {filteredEntries.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-text-tertiary text-sm font-normal">
                    No hay registros disponibles para el rango seleccionado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
