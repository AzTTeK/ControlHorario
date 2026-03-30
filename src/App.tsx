import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { TimeTrackingProvider } from '@/contexts/TimeTrackingContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Layout } from '@/components/layout/Layout';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { DashboardPage } from '@/pages/Dashboard';
import { HistoryPage } from '@/pages/History';
import { ReportsPage } from '@/pages/Reports';
import { ProfilePage } from '@/pages/Profile';

/**
 * Componente raíz de la aplicación.
 * Configura providers de autenticación y time tracking,
 * define las rutas públicas y protegidas.
 */
function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="control-horario-theme">
      <BrowserRouter>
        <AuthProvider>
          <Routes>
          {/* Rutas públicas (autenticación) */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/forgot-password" element={<ForgotPasswordForm />} />

          {/* Rutas protegidas (requieren autenticación) */}
          <Route
            element={
              <ProtectedRoute>
                <TimeTrackingProvider>
                  <Layout />
                </TimeTrackingProvider>
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Redirecciones */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
