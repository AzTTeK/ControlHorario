import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Loader2, Clock, ArrowLeft, CheckCircle } from 'lucide-react';

/**
 * Formulario de recuperación de contraseña.
 */
export function ForgotPasswordForm() {
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('El email es obligatorio');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar el email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-bg-subtle">
      <div className="w-full max-w-md animate-scale-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary mb-4 shadow-lg">
            <Clock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-normal text-[var(--color-text-primary)]">
            Recuperar Contraseña
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-1">
            Te enviaremos un email para restablecer tu contraseña
          </p>
        </div>

        <div className="glass-card rounded-2xl p-8">
          {sent ? (
            <div className="text-center space-y-4 animate-fade-in">
              <CheckCircle className="w-16 h-16 text-[var(--color-success)] mx-auto" />
              <h2 className="text-lg font-normal text-[var(--color-text-primary)]">
                ¡Email enviado!
              </h2>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Revisa tu bandeja de entrada en <strong>{email}</strong> y sigue las instrucciones.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] font-normal transition-colors mt-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver al login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" id="forgot-password-form">
              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm animate-fade-in">
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label htmlFor="forgot-email" className="block text-sm font-normal text-[var(--color-text-primary)]">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-tertiary)]" />
                  <input
                    id="forgot-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-[var(--color-border)] bg-white text-sm
                      focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]
                      transition-all duration-200 placeholder:text-[var(--color-text-tertiary)]"
                    autoComplete="email"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                id="forgot-submit"
                className="w-full py-3 px-4 rounded-xl gradient-primary text-white font-normal text-sm
                  hover:opacity-90 active:scale-[0.98] transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg
                  flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Enviar email de recuperación'
                )}
              </button>
            </form>
          )}

          {!sent && (
            <p className="text-center text-sm text-[var(--color-text-secondary)] mt-6">
              <Link
                to="/login"
                className="inline-flex items-center gap-1 text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] font-normal transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver al login
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
