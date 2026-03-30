import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import type { DailyStats } from '@/types';
import { DAY_NAMES_SHORT } from '@/lib/calculations';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';

interface WeeklyChartProps {
  data: DailyStats[];
}

export function WeeklyChart({ data }: WeeklyChartProps) {
  const chartData = data.map((day, index) => ({
    name: DAY_NAMES_SHORT[index] || '',
    horas: Math.round(day.totalWorked * 100) / 100,
    pausas: Math.round(day.totalPaused * 100) / 100,
  }));

  return (
    <div className="flex flex-col h-full bg-surface p-6">
      <div className="flex flex-col sm:flex-row items-baseline justify-between mb-6 border-b border-border/50 pb-4">
        <h3 className="text-sm font-normal text-text-primary flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary-500" />
          Horas esta semana
        </h3>
        <div className="flex items-center gap-4 text-xs font-normal uppercase tracking-wide mt-2 sm:mt-0">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-primary-500 shadow-sm" />
            <span className="text-text-tertiary">Trabajo</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-warning shadow-sm" />
            <span className="text-text-tertiary">Pausas</span>
          </div>
        </div>
      </div>

      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barGap={4} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#94A3B8', fontWeight: 400 }}
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
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                padding: '8px 12px',
                fontSize: '12px',
                fontWeight: 500,
              }}
              formatter={(value: number, name: string) => [
                `${value.toFixed(1)}h`,
                name === 'horas' ? 'Trabajado' : 'Pausas',
              ]}
              cursor={{ fill: '#F8FAFC' }}
            />
            <Bar dataKey="horas" fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={36} />
            <Bar dataKey="pausas" fill="#F59E0B" radius={[4, 4, 0, 0]} maxBarSize={36} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function MiniBarChart({ data, color = 'var(--color-primary)' }: { data: number[]; color?: string }) {
  const max = Math.max(...data, 1);

  return (
    <div className="flex justify-end items-end gap-[3px] h-10 w-full mt-1">
      {data.map((value, i) => {
        const heightPct = Math.max((value / max) * 100, value > 0 ? 8 : 4);
        return (
          <div
            key={i}
            className={cn(
               "w-full max-w-[12px] rounded-t-sm transition-all duration-300 bg-current",
               value === 0 && "opacity-20"
            )}
            style={{
              height: `${heightPct}%`,
              color: color,
              opacity: value > 0 ? 0.6 + (i / Math.max(data.length - 1, 1)) * 0.4 : 0.1,
            }}
          />
        );
      })}
    </div>
  );
}
