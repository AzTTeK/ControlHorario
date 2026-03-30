import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { User, Mail, Lock, Save, Loader2, Trash2, Eye, EyeOff, CheckCircle, ShieldUser, Palette, Settings, Monitor, Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

type Tab = 'cuenta' | 'seguridad' | 'tema';

export function ProfilePage() {
  const { profile, user, updateProfile, updatePassword, signOut } = useAuth();
  const { theme, setTheme } = useTheme();

  const [activeTab, setActiveTab] = useState<Tab>('cuenta');

  // Cuenta State
  const [fullName, setFullName] = useState(profile?.full_name ?? '');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  // Seguridad State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Peligro State
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTerm, setDeleteTerm] = useState('');

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await updateProfile({ full_name: fullName });
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (newPassword.length < 8) {
      setPasswordError('La nueva contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden');
      return;
    }

    setSavingPassword(true);
    try {
      await updatePassword(newPassword);
      setPasswordSaved(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSaved(false), 3000);
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : 'Error al cambiar contraseña');
    } finally {
      setSavingPassword(false);
    }
  };

  const initials = profile?.full_name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) ?? 'U';

  return (
    <div className="max-w-4xl mx-auto space-y-6 lg:space-y-8 animate-fade-in pb-10">
      
      {/* HEADER */}
      <div className="border-b border-border/50 pb-5">
        <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-text-primary flex items-center gap-2">
          <Settings className="w-6 h-6 text-primary-500" />
          Ajustes
        </h2>
        <p className="text-sm font-normal text-text-tertiary mt-1">
          Gestiona tu cuenta, preferencias visuales y seguridad
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* SIDEBAR NAVIGATION */}
        <div className="md:w-64 shrink-0">
          <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
            <button
              onClick={() => setActiveTab('cuenta')}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap",
                activeTab === 'cuenta'
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
              )}
            >
              <User className={cn("w-5 h-5", activeTab === 'cuenta' ? "text-white" : "text-text-tertiary")} />
              Cuenta
            </button>
            <button
              onClick={() => setActiveTab('seguridad')}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap",
                activeTab === 'seguridad'
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
              )}
            >
              <ShieldUser className={cn("w-5 h-5", activeTab === 'seguridad' ? "text-white" : "text-text-tertiary")} />
              Seguridad
            </button>
            <button
              onClick={() => setActiveTab('tema')}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap",
                activeTab === 'tema'
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
              )}
            >
              <Palette className={cn("w-5 h-5", activeTab === 'tema' ? "text-white" : "text-text-tertiary")} />
              Tema
            </button>
          </nav>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 min-w-0">
          
          {/* === CUENTA TAB === */}
          {activeTab === 'cuenta' && (
            <div className="card p-0 shadow-sm border border-border animate-fade-in">
              <div className="px-6 py-5 border-b border-border bg-surface">
                <h3 className="text-sm font-medium text-text-primary uppercase tracking-wide">Información Personal</h3>
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-5 mb-8 bg-surface-hover/40 p-4 rounded-xl border border-border/50">
                  <div className="w-20 h-20 rounded-2xl bg-primary text-white flex items-center justify-center text-2xl font-normal shadow-md shrink-0">
                    {initials}
                  </div>
                  <div className="flex flex-col">
                    <p className="text-xl font-medium text-text-primary leading-tight">
                      {profile?.full_name}
                    </p>
                    <div className="bg-primary-50 text-primary-700 text-[11px] font-normal px-2 py-0.5 rounded-sm border border-primary-200 mt-1.5 w-max uppercase tracking-wider dark:bg-primary-500/10 dark:text-primary-400 dark:border-primary-500/20">
                       Miembro registrado
                    </div>
                    <p className="text-xs font-normal text-text-tertiary mt-2">
                      Activo desde {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }) : ''}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-5 max-w-xl">
                  <div className="space-y-2">
                    <label htmlFor="profile-name" className="block text-[13px] font-normal text-text-secondary uppercase tracking-wider">
                      Nombre completo
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                      <input
                        id="profile-name"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="input pl-10 h-12"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[13px] font-normal text-text-secondary uppercase tracking-wider flex items-center gap-2">
                      Correo Electrónico
                      <span className="bg-surface-hover text-text-tertiary px-1.5 py-0.5 rounded-md text-[10px] tracking-normal border border-border">Solo lectura</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                      <input
                        type="email"
                        value={user?.email ?? 'demo@example.com'}
                        disabled
                        className="input pl-10 h-12 bg-surface-hover text-text-secondary opacity-70 cursor-not-allowed border-dashed dark:bg-surface-hover/50 dark:border-border-strong"
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={savingProfile || fullName === profile?.full_name}
                      className={cn(
                        "btn h-11 px-6 font-normal tracking-wide shadow-sm",
                        profileSaved ? "bg-success text-white border-success focus:ring-success hover:bg-success" : "btn-primary"
                      )}
                    >
                      {savingProfile ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : profileSaved ? (
                        <CheckCircle className="w-4 h-4 mr-2" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      {profileSaved ? 'Guardado Exitoso' : 'Guardar Cambios'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* === SEGURIDAD TAB === */}
          {activeTab === 'seguridad' && (
            <div className="space-y-6 animate-fade-in">
              <div className="card p-0 shadow-sm border border-border">
                <div className="px-6 py-5 border-b border-border bg-surface">
                  <h3 className="text-sm font-normal text-text-primary uppercase tracking-wide flex items-center gap-2">
                    <Lock className="w-4 h-4 text-text-tertiary" />
                    Cambiar Contraseña
                  </h3>
                </div>
                
                <div className="p-6">
                  <form onSubmit={handleChangePassword} className="space-y-5 max-w-xl">
                    {passwordError && (
                      <div className="p-3.5 rounded-lg bg-danger-light border border-danger/30 text-[13px] font-normal text-danger animate-fade-in flex items-center gap-2 dark:bg-danger/10 dark:border-danger/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-danger inline-block shrink-0"></span>
                        {passwordError}
                      </div>
                    )}

                    <div className="space-y-2">
                      <label htmlFor="current-password" className="block text-[13px] font-normal text-text-secondary uppercase tracking-wider">
                        Contraseña Actual
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                        <input
                          id="current-password"
                          type={showPasswords ? 'text' : 'password'}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="input pl-10 pr-12 h-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords(!showPasswords)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary p-1 transition-colors"
                        >
                          {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label htmlFor="new-password" className="block text-[13px] font-normal text-text-secondary uppercase tracking-wider">
                          Nueva Contraseña
                        </label>
                        <input
                          id="new-password"
                          type={showPasswords ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Mínimo 8 caracteres"
                          className="input h-12"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="confirm-new-password" className="block text-[13px] font-normal text-text-secondary uppercase tracking-wider">
                          Repetir Contraseña
                        </label>
                        <input
                          id="confirm-new-password"
                          type={showPasswords ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="input h-12"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={savingPassword || !newPassword || !confirmPassword}
                        className={cn(
                          "btn h-11 px-6 font-normal tracking-wide shadow-sm",
                          passwordSaved ? "bg-success text-white border-success focus:ring-success hover:bg-success" : "btn-secondary bg-surface-hover hover:bg-border/60"
                        )}
                      >
                        {savingPassword ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : passwordSaved ? (
                           <CheckCircle className="w-4 h-4 mr-2" />
                        ) : (
                          <Lock className="w-4 h-4 mr-2" />
                        )}
                        {passwordSaved ? 'Actualizada Correctamente' : 'Actualizar Contraseña'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* === DANGER ZONE === */}
              <div className="card p-0 shadow-sm border border-danger-light/50 overflow-hidden dark:border-danger/20">
                <div className="bg-danger-light/10 border-b border-danger-light/30 px-6 py-5 dark:bg-danger/5 dark:border-danger/10">
                   <h3 className="text-sm font-normal text-danger flex items-center gap-2 uppercase tracking-wide">
                      <Trash2 className="w-4 h-4" />
                      Zona de Peligro
                   </h3>
                </div>
                
                <div className="p-6 bg-[#FEF2F2]/50 dark:bg-danger/5">
                  <p className="text-sm font-normal text-danger/80 mb-5 leading-relaxed">
                    Eliminar tu cuenta es una acción irreversible. Todos tus registros horarios, historial y datos personales serán eliminados de nuestros servidores de forma permanente.
                  </p>

                  {showDeleteConfirm ? (
                    <div className="p-5 bg-white dark:bg-surface border border-danger-light dark:border-danger/20 rounded-2xl shadow-lg animate-fade-in space-y-4">
                      <div className="text-center space-y-2">
                        <p className="text-sm font-medium text-text-primary">
                          ¿Estás absolutamente seguro?
                        </p>
                        <p className="text-xs font-normal text-text-tertiary">
                          Esta acción no se puede deshacer. Por favor, escribe <span className="font-medium text-danger">BORRAR</span> para confirmar.
                        </p>
                      </div>

                      <input
                        type="text"
                        value={deleteTerm}
                        onChange={(e) => setDeleteTerm(e.target.value)}
                        placeholder="Escribe BORRAR aquí"
                        className="input h-11 text-center border-danger-light/50 dark:border-danger/30 focus:ring-danger focus:border-danger uppercase tracking-widest text-sm"
                      />

                      <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <button
                          onClick={() => { setShowDeleteConfirm(false); setDeleteTerm(''); }}
                          className="btn btn-secondary flex-1 h-11 shadow-sm font-normal text-xs uppercase"
                        >
                          Cancelar
                        </button>
                        <button
                          disabled={deleteTerm !== 'BORRAR'}
                          onClick={async () => { await signOut(); }}
                          className={cn(
                            "btn flex-1 h-11 shadow-sm font-normal text-xs uppercase transition-all",
                            deleteTerm === 'BORRAR' 
                              ? "bg-danger text-white hover:bg-danger shadow-danger-light/20 dark:shadow-danger/20" 
                              : "bg-danger/20 text-danger/40 cursor-not-allowed border-transparent"
                          )}
                        >
                          Confirmar Eliminación
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="btn h-11 px-6 font-normal text-sm tracking-wide bg-white dark:bg-surface text-danger border border-danger/30 shadow-sm hover:bg-danger hover:border-danger hover:text-white transition-all w-full sm:w-auto"
                    >
                      Eliminar Cuenta Definitivamente
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* === TEMA TAB === */}
          {activeTab === 'tema' && (
            <div className="card p-0 shadow-sm border border-border animate-fade-in">
              <div className="px-6 py-5 border-b border-border bg-surface">
                <h3 className="text-sm font-medium text-text-primary uppercase tracking-wide flex items-center gap-2">
                  <Palette className="w-4 h-4 text-text-tertiary" />
                  Apariencia Visual
                </h3>
              </div>
              
              <div className="p-6">
                <p className="text-sm font-normal text-text-secondary mb-8">
                  Personaliza cómo se ve la aplicación. El modo oscuro está diseñado con contrastes neón ideales para entornos de baja luminosidad.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-2xl">
                  {/* Tema Claro */}
                  <button
                    onClick={() => setTheme('light')}
                    className={cn(
                      "flex flex-col items-center gap-4 p-5 rounded-2xl border-2 transition-all",
                      theme === 'light'
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border hover:border-border-strong hover:bg-surface-hover"
                    )}
                  >
                    <div className="w-12 h-12 rounded-full bg-[#f4f5f7] flex items-center justify-center border border-[#e2e8f0] shadow-inner font-bold text-[#6366f1]">
                      <Sun className="w-6 h-6" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-text-primary">Claro</p>
                      <p className="text-xs text-text-tertiary mt-1">Tonos pastel</p>
                    </div>
                    <div className={cn("w-5 h-5 rounded-full border flex items-center justify-center mt-2", theme === 'light' ? "border-primary bg-primary" : "border-border")}>
                      {theme === 'light' && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </button>

                  {/* Tema Oscuro */}
                  <button
                    onClick={() => setTheme('dark')}
                    className={cn(
                      "flex flex-col items-center gap-4 p-5 rounded-2xl border-2 transition-all",
                      theme === 'dark'
                        ? "border-primary bg-primary/10 shadow-[0_0_15px_rgba(0,240,255,0.1)]"
                        : "border-border hover:border-border-strong hover:bg-surface-hover"
                    )}
                  >
                    <div className="w-12 h-12 rounded-full bg-[#09090b] flex items-center justify-center border border-[#27272a] shadow-inner font-bold text-[#00f0ff]">
                      <Moon className="w-6 h-6" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-text-primary">Oscuro Neón</p>
                      <p className="text-xs text-text-tertiary mt-1">Grises & Neón</p>
                    </div>
                    <div className={cn("w-5 h-5 rounded-full border flex items-center justify-center mt-2", theme === 'dark' ? "border-primary bg-primary" : "border-border")}>
                      {theme === 'dark' && <div className="w-2 h-2 rounded-full bg-black/80" />}
                    </div>
                  </button>

                  {/* Tema Sistema */}
                  <button
                    onClick={() => setTheme('system')}
                    className={cn(
                      "flex flex-col items-center gap-4 p-5 rounded-2xl border-2 transition-all",
                      theme === 'system'
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border hover:border-border-strong hover:bg-surface-hover"
                    )}
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#f4f5f7] to-[#09090b] flex items-center justify-center border border-border shadow-inner font-bold text-white">
                      <Monitor className="w-5 h-5 mix-blend-difference" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-text-primary">Sistema</p>
                      <p className="text-xs text-text-tertiary mt-1">Automático</p>
                    </div>
                    <div className={cn("w-5 h-5 rounded-full border flex items-center justify-center mt-2", theme === 'system' ? "border-primary bg-primary" : "border-border")}>
                      {theme === 'system' && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
