import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getGreeting } from '@/lib/utils';
import { Menu, LogOut, User, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const initials = profile?.full_name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) ?? 'U';
  const firstName = profile?.full_name?.split(' ')[0] ?? 'Usuario';

  return (
    <header className="h-16 flex-shrink-0 bg-surface/80 backdrop-blur-md border-b border-border flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10 sticky top-0">
      
      {/* Left Area */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Toggle */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 rounded-md hover:bg-surface-hover text-text-secondary transition-colors"
          aria-label="Abrir menú"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Greeting */}
        <div className="flex flex-col">
          <h1 className="text-sm sm:text-base font-medium text-text-primary leading-tight">
            {getGreeting()}, {firstName}
          </h1>
          <p className="text-xs text-text-tertiary hidden sm:block">
            Dashboard general
          </p>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Separator */}
        <div className="h-6 w-px bg-border mx-1 sm:mx-2 hidden sm:block"></div>

        {/* User Dropdown */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 p-1 pl-1 pr-2 rounded-full hover:bg-surface-hover transition-colors border border-transparent hover:border-border"
          >
            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-normal ring-2 ring-white">
              {initials}
            </div>
            <ChevronDown 
              className={cn(
                "w-4 h-4 text-text-tertiary transition-transform hidden sm:block",
                dropdownOpen && "rotate-180"
              )} 
            />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-surface rounded-card shadow-popover border border-border py-1 z-50 animate-fade-in origin-top-right">
              <div className="px-4 py-3 border-b border-border/50">
                <p className="text-sm font-normal text-text-primary truncate">{profile?.full_name}</p>
                <p className="text-xs text-text-tertiary truncate">{user?.email}</p>
              </div>

              <div className="py-1">
                <button
                  onClick={() => { navigate('/profile'); setDropdownOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors"
                >
                  <User className="w-4 h-4" />
                  Mi Perfil
                </button>
              </div>

              <div className="border-t border-border/50 py-1">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-danger hover:bg-danger-light/30 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
