import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  History,
  BarChart3,
  UserCircle,
  Clock,
  X,
} from 'lucide-react';
import { useTimeTracking } from '@/contexts/TimeTrackingContext';
import { formatDuration } from '@/lib/utils';
import { cn } from '@/lib/utils';

export function Sidebar({ onCloseMobile }: { onCloseMobile: () => void }) {
  const location = useLocation();
  const { status, todayWorkedSeconds } = useTimeTracking();

  const NAV_ITEMS = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Historial', path: '/history', icon: History },
    { label: 'Reportes', path: '/reports', icon: BarChart3 },
    { label: 'Perfil', path: '/profile', icon: UserCircle },
  ];

  return (
    <div className="h-full flex flex-col bg-surface border-r border-border">
      
      {/* Brand / Logo Area */}
      <div className="flex h-16 items-center flex-shrink-0 px-6 justify-between lg:justify-start gap-3 border-b border-border/50">
        <div className="flex gap-3 items-center">
          <div className="flex w-8 h-8 rounded-lg bg-primary items-center justify-center shadow-sm">
             <Clock className="w-4 h-4 text-white" />
          </div>
          <span className="font-normal text-[15px] tracking-tight text-text-primary">
            Control Horario
          </span>
        </div>
        
        {/* Mobile Close Button */}
        <button 
          onClick={onCloseMobile}
          className="lg:hidden p-1 rounded-md text-text-tertiary hover:bg-surface-hover hover:text-text-primary transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <p className="px-2 mb-3 text-xs font-normal text-text-tertiary uppercase tracking-wider">
          Menú
        </p>

        {/* Navigation Wrapper with subtle background */}
        <div className="bg-surface-hover/80 dark:bg-black/30 rounded-2xl p-2 border border-border/40">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-normal transition-all duration-200 mb-1 last:mb-0",
                  isActive 
                    ? "bg-white dark:bg-primary-500/10 text-primary-600 dark:text-primary-500 shadow-sm ring-1 ring-border/50 dark:ring-primary-500/20" 
                    : "text-text-secondary hover:bg-white/60 dark:hover:bg-white/5 hover:text-text-primary"
                )}
              >
                <Icon 
                  className={cn(
                    "w-5 h-5 transition-colors", 
                    isActive ? "text-primary-500" : "text-text-tertiary group-hover:text-text-secondary dark:group-hover:text-white"
                  )} 
                />
                {item.label}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Working Track (Bottom) */}
      <div className="p-4 border-t border-border/50 flex-shrink-0 bg-background/50">
        <div 
          className={cn(
            "rounded-card p-4 transition-all border",
            status === 'working' ? "bg-success-light/30 border-success-light" : 
            status === 'paused' ? "bg-warning-light/50 border-warning-light" : 
            "bg-surface border-border"
          )}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-normal text-text-tertiary uppercase tracking-wider">
              Jornada Actual
            </span>
            <span className="flex h-2 w-2">
               <span className={cn(
                 "relative inline-flex rounded-full h-2 w-2",
                 status === 'working' ? "bg-success" : 
                 status === 'paused' ? "bg-warning" : 
                 "bg-text-tertiary"
               )} />
            </span>
          </div>

          <div>
             <div className="text-xs font-normal text-text-secondary mb-1">
               {status === 'idle' ? 'Inactivo' : status === 'working' ? 'Trabajando' : 'En pausa'}
             </div>
             
             {status !== 'idle' ? (
               <div className="text-lg font-normal text-text-primary tabular-nums tracking-tight">
                 {formatDuration(todayWorkedSeconds)}
               </div>
             ) : (
               <div className="text-sm text-text-tertiary">
                 Sin iniciar
               </div>
             )}
          </div>
        </div>
      </div>

    </div>
  );
}
