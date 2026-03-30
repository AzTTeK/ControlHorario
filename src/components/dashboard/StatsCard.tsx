import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: ReactNode;
  trend?: { value: string; positive: boolean };
  iconBgColor?: string;
  iconTextColor?: string;
  children?: ReactNode;
}

/**
 * Metric Card Component
 * Unificado con sistema de diseño: bordes, radius, sombras.
 */
export function StatsCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  iconBgColor = 'bg-primary-50',
  iconTextColor = 'text-primary-600',
  children,
}: StatsCardProps) {
  return (
    <div className="card p-6 flex flex-col justify-between group">
      
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className={cn(
            "stat-card-icon transition-transform duration-300 group-hover:scale-110", 
            iconBgColor, 
            iconTextColor
          )}>
            {icon}
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-medium text-text-tertiary uppercase tracking-widest">{title}</span>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-normal text-text-primary tabular-nums tracking-tight">
                {value}
              </h3>
            </div>
          </div>
        </div>

        {trend && (
          <div
            className={cn(
              "flex items-center gap-1 text-[11px] font-normal px-2 py-1 rounded-lg",
              trend.positive
                ? "bg-success-light/40 text-success"
                : "bg-danger-light/40 text-danger"
            )}
          >
            {trend.positive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            {trend.value}
          </div>
        )}
      </div>

      {/* Subtitle area */}
      {subtitle && (
        <p className="text-xs text-text-tertiary font-normal flex items-center gap-2">
          <span className="w-1 h-1 rounded-full bg-border-strong"></span>
          {subtitle}
        </p>
      )}

      {/* Extra content slot (e.g. mini chart) */}
      {children && (
        <div className="mt-6 pt-4 border-t border-border">
          {children}
        </div>
      )}
    </div>
  );
}
