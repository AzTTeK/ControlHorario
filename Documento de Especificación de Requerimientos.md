[**![][image1]**](https://www.dominiaacademy.com/)

[**DominIA Academy**](https://www.dominiaacademy.com/)

**Autor: Josema Fernández.**

# **Especificación Técnica: Aplicación de Control Horario**

## **1\. VISIÓN GENERAL DEL PROYECTO**

### **1.1 Descripción**

Aplicación web moderna para control y gestión de horarios laborales que permite a los usuarios registrar entradas/salidas, gestionar pausas y generar reportes de tiempo trabajado.

### **1.2 Objetivos**

* Facilitar el registro de jornadas laborales de forma intuitiva  
* Calcular automáticamente horas trabajadas y descansos  
* Generar reportes visuales del tiempo trabajado  
* Proporcionar una interfaz moderna y responsive

### **1.3 Alcance**

**Incluido en MVP:**

* Sistema de autenticación (registro y login)  
* Gestión de usuarios con datos privados  
* Registro de entrada/salida (check-in/check-out)  
* Gestión de pausas/descansos  
* Cálculo automático de horas trabajadas  
* Vista de historial diario/semanal/mensual  
* Dashboard con estadísticas básicas  
* Exportación de reportes  
* Persistencia en Supabase

**Fuera del alcance inicial:**

* Gestión multi-usuario/empresa (roles y equipos)  
* Sistema de aprobaciones de supervisor  
* Integración con nóminas  
* Geolocalización  
* OAuth/Social login (Google, GitHub, etc.)

---

## **2\. REQUERIMIENTOS FUNCIONALES**

### **2.1 Autenticación y Gestión de Usuarios**

**RF-001: Registro de Usuario**

* Formulario con campos: email, contraseña, nombre completo  
* Validación de email válido  
* Validación de contraseña (mínimo 8 caracteres)  
* Confirmación de contraseña  
* Email de verificación (opcional)  
* Creación automática de perfil de usuario en Supabase  
* Redirección automática al dashboard tras registro exitoso

**RF-002: Login de Usuario**

* Formulario con email y contraseña  
* Validación de credenciales contra Supabase Auth  
* Mantener sesión activa (remember me)  
* Manejo de errores (credenciales incorrectas)  
* Redirección al dashboard tras login exitoso

**RF-003: Logout**

* Botón de cerrar sesión visible en toda la app  
* Limpiar sesión de Supabase  
* Redirección a página de login  
* Confirmación antes de cerrar sesión si hay jornada activa

**RF-004: Recuperación de Contraseña**

* Link "¿Olvidaste tu contraseña?"  
* Envío de email de recuperación vía Supabase  
* Página de reset con token de seguridad  
* Actualización de contraseña

**RF-005: Perfil de Usuario**

* Vista de información personal  
* Edición de nombre y datos de perfil  
* Cambio de contraseña  
* Opción de eliminar cuenta (con confirmación)

**RF-006: Protección de Rutas**

* Todas las rutas excepto login/registro requieren autenticación  
* Redirección automática a login si no está autenticado  
* Prevención de acceso a login/registro si ya está autenticado

### **2.2 Gestión de Jornada Laboral**

**RF-007: Iniciar Jornada**

* El usuario puede registrar el inicio de su jornada con un botón "Entrar"  
* Se captura fecha y hora automáticamente  
* Se asocia con el user\_id del usuario autenticado  
* Se muestra confirmación visual del registro  
* El estado cambia a "En trabajo"  
* Se guarda en Supabase

**RF-008: Finalizar Jornada**

* El usuario puede registrar el fin de su jornada con un botón "Salir"  
* Se captura fecha y hora automáticamente  
* Se calcula y muestra el total de horas trabajadas  
* Se actualiza el registro en Supabase  
* Se actualiza el historial

**RF-009: Gestión de Pausas**

* El usuario puede iniciar una pausa durante la jornada  
* El usuario puede finalizar la pausa y volver al trabajo  
* Se contabiliza el tiempo de pausa por separado  
* Tipos de pausa: Comida, Descanso, Otra  
* Se actualizan en tiempo real en Supabase

**RF-010: Validaciones**

* No permitir "Salir" sin haber hecho "Entrar"  
* No permitir múltiples "Entrar" activos simultáneamente  
* No permitir iniciar pausa si no hay jornada activa  
* Validar que solo el propietario pueda modificar sus registros

### **2.2 Visualización y Reportes**

**RF-011: Dashboard Principal**

* Mostrar estado actual (trabajando, en pausa, fuera de jornada)  
* Mostrar tiempo trabajado hoy  
* Mostrar tiempo en pausa hoy  
* Botones principales de acción según el estado  
* Solo mostrar datos del usuario autenticado

**RF-012: Historial de Registros**

* Vista de calendario con registros diarios del usuario  
* Lista detallada por día con entradas, salidas y pausas  
* Filtros por fecha (día, semana, mes)  
* Visualización de horas totales por período  
* Datos privados, solo visibles para el usuario propietario

**RF-013: Estadísticas**

* Total horas trabajadas en la semana  
* Total horas trabajadas en el mes  
* Promedio de horas diarias  
* Gráfico de distribución de horas por día  
* Basadas únicamente en los datos del usuario actual

**RF-014: Exportación**

* Exportar datos propios a CSV  
* Exportar rango de fechas seleccionado  
* Formato: Fecha, Hora Entrada, Hora Salida, Pausas, Total Horas

### **2.3 Edición y Gestión**

**RF-015: Editar Registros**

* Permitir editar solo registros propios  
* Modificar horas de entrada/salida  
* Agregar/eliminar pausas  
* Mostrar indicador de "editado manualmente"  
* Actualizar en Supabase

**RF-016: Eliminar Registros**

* Permitir eliminar solo registros propios  
* Solicitar confirmación antes de eliminar  
* No permitir eliminar jornada activa  
* Eliminación permanente en Supabase

---

## **3\. REQUERIMIENTOS NO FUNCIONALES**

### **3.1 Usabilidad**

* **RNF-001:** Interfaz intuitiva, accesible sin capacitación  
* **RNF-002:** Responsive design (móvil, tablet, desktop)  
* **RNF-003:** Feedback visual inmediato en todas las acciones  
* **RNF-004:** Diseño moderno con estética "vibe coding"

### **3.2 Rendimiento**

* **RNF-005:** Carga inicial \< 2 segundos  
* **RNF-006:** Respuesta a acciones \< 200ms  
* **RNF-007:** Funcionar sin conexión (offline-first con sincronización)

### **3.3 Confiabilidad**

* **RNF-008:** Los datos deben persistir en Supabase de forma segura  
* **RNF-009:** Prevención de pérdida de datos con transacciones  
* **RNF-010:** Validación robusta de datos en cliente y servidor

### **3.4 Seguridad**

* **RNF-011:** Contraseñas hasheadas (manejado por Supabase Auth)  
* **RNF-012:** Sesiones seguras con tokens JWT  
* **RNF-013:** Row Level Security (RLS) en todas las tablas de Supabase  
* **RNF-014:** Validación de permisos en cada operación  
* **RNF-015:** Protección contra SQL injection (ORM de Supabase)  
* **RNF-016:** HTTPS obligatorio en producción

### **3.5 Compatibilidad**

* **RNF-017:** Navegadores modernos (Chrome, Firefox, Safari, Edge)  
* **RNF-018:** Progressive Web App (PWA) instalable

---

## **4\. ARQUITECTURA TÉCNICA**

### **4.1 Stack Tecnológico Recomendado**

**Frontend:**

* React 18+ con TypeScript  
* Vite como build tool  
* Tailwind CSS para estilos  
* shadcn/ui para componentes base  
* Recharts para gráficos  
* date-fns para manejo de fechas  
* React Router DOM para navegación

**Backend y Base de Datos:**

* **Supabase** como Backend-as-a-Service (BaaS)  
  * Supabase Auth para autenticación  
  * Supabase Database (PostgreSQL) para datos  
  * Supabase Client para JavaScript  
  * Row Level Security (RLS) activado

**Estado y Persistencia:**

* React Context \+ Hooks para estado global  
* Supabase como fuente de verdad  
* React Query (TanStack Query) para caché y sincronización  
* LocalStorage solo para preferencias UI

**Utilidades:**

* Zod para validación de esquemas  
* React Hook Form para formularios  
* Lucide React para iconos  
* @supabase/supabase-js (cliente oficial)

### **4.2 Arquitectura de Componentes**

src/  
├── components/  
│   ├── auth/  
│   │   ├── LoginForm.tsx  
│   │   ├── RegisterForm.tsx  
│   │   ├── ForgotPasswordForm.tsx  
│   │   ├── ResetPasswordForm.tsx  
│   │   └── ProtectedRoute.tsx  
│   ├── layout/  
│   │   ├── Header.tsx  
│   │   ├── Sidebar.tsx  
│   │   ├── Layout.tsx  
│   │   └── UserMenu.tsx  
│   ├── time-tracking/  
│   │   ├── TimeClockControls.tsx  
│   │   ├── CurrentStatus.tsx  
│   │   └── PauseControls.tsx  
│   ├── history/  
│   │   ├── TimeEntryList.tsx  
│   │   ├── TimeEntryCard.tsx  
│   │   └── Calendar.tsx  
│   ├── dashboard/  
│   │   ├── StatsCard.tsx  
│   │   ├── WeeklyChart.tsx  
│   │   └── MonthlyChart.tsx  
│   ├── reports/  
│   │   ├── ExportButton.tsx  
│   │   └── ReportFilters.tsx  
│   ├── profile/  
│   │   ├── ProfileForm.tsx  
│   │   └── ChangePasswordForm.tsx  
│   └── ui/  
│       └── \[componentes shadcn\]  
├── hooks/  
│   ├── useAuth.ts  
│   ├── useTimeTracking.ts  
│   ├── useTimeEntries.ts  
│   ├── useStats.ts  
│   └── useSupabase.ts  
├── lib/  
│   ├── supabase.ts (cliente Supabase)  
│   ├── utils.ts  
│   └── calculations.ts  
├── types/  
│   └── index.ts  
├── contexts/  
│   ├── AuthContext.tsx  
│   └── TimeTrackingContext.tsx  
├── pages/  
│   ├── Login.tsx  
│   ├── Register.tsx  
│   ├── ForgotPassword.tsx  
│   ├── Dashboard.tsx  
│   ├── History.tsx  
│   ├── Reports.tsx  
│   └── Profile.tsx  
└── App.tsx

### **4.3 Modelo de Datos**

**Users (Tabla de Supabase Auth \- auth.users)**

// Manejada automáticamente por Supabase Auth  
interface AuthUser {  
  id: string; // UUID  
  email: string;  
  created\_at: Date;  
  // Otros campos de Supabase Auth  
}

**Profiles (Tabla personalizada \- public.profiles)**

interface Profile {  
  id: string; // FK a auth.users.id  
  full\_name: string;  
  avatar\_url?: string;  
  created\_at: Date;  
  updated\_at: Date;  
}

**TimeEntry (Registros de Tiempo \- public.time\_entries)**

interface TimeEntry {  
  id: string; // UUID  
  user\_id: string; // FK a auth.users.id  
  date: Date;  
  clock\_in: Date;  
  clock\_out: Date | null;  
  total\_hours: number | null;  
  status: 'active' | 'paused' | 'completed';  
  edited\_manually: boolean;  
  notes?: string;  
  created\_at: Date;  
  updated\_at: Date;  
}

**Pause (Pausas \- public.pauses)**

interface Pause {  
  id: string; // UUID  
  time\_entry\_id: string; // FK a time\_entries.id  
  start\_time: Date;  
  end\_time: Date | null;  
  type: 'meal' | 'break' | 'other';  
  duration: number | null; // en minutos  
  created\_at: Date;  
  updated\_at: Date;  
}

**DailyStats (Vista o cálculo en tiempo real)**

interface DailyStats {  
  date: Date;  
  totalWorked: number; // en horas  
  totalPaused: number; // en horas  
  entries: number; // cantidad de registros  
}

### **4.4 Esquema de Base de Datos Supabase**

**SQL para crear las tablas:**

\-- Habilitar UUID  
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\-- Tabla de Perfiles (enlazada con auth.users)  
CREATE TABLE profiles (  
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,  
  full\_name TEXT NOT NULL,  
  avatar\_url TEXT,  
  created\_at TIMESTAMPTZ DEFAULT NOW(),  
  updated\_at TIMESTAMPTZ DEFAULT NOW()  
);

\-- Tabla de Registros de Tiempo  
CREATE TABLE time\_entries (  
  id UUID DEFAULT uuid\_generate\_v4() PRIMARY KEY,  
  user\_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,  
  date DATE NOT NULL,  
  clock\_in TIMESTAMPTZ NOT NULL,  
  clock\_out TIMESTAMPTZ,  
  total\_hours DECIMAL(5,2),  
  status TEXT CHECK (status IN ('active', 'paused', 'completed')) DEFAULT 'active',  
  edited\_manually BOOLEAN DEFAULT FALSE,  
  notes TEXT,  
  created\_at TIMESTAMPTZ DEFAULT NOW(),  
  updated\_at TIMESTAMPTZ DEFAULT NOW()  
);

\-- Tabla de Pausas  
CREATE TABLE pauses (  
  id UUID DEFAULT uuid\_generate\_v4() PRIMARY KEY,  
  time\_entry\_id UUID REFERENCES time\_entries(id) ON DELETE CASCADE NOT NULL,  
  start\_time TIMESTAMPTZ NOT NULL,  
  end\_time TIMESTAMPTZ,  
  type TEXT CHECK (type IN ('meal', 'break', 'other')) NOT NULL,  
  duration INTEGER, \-- en minutos  
  created\_at TIMESTAMPTZ DEFAULT NOW(),  
  updated\_at TIMESTAMPTZ DEFAULT NOW()  
);

\-- Índices para mejor rendimiento  
CREATE INDEX idx\_time\_entries\_user\_id ON time\_entries(user\_id);  
CREATE INDEX idx\_time\_entries\_date ON time\_entries(date);  
CREATE INDEX idx\_time\_entries\_status ON time\_entries(status);  
CREATE INDEX idx\_pauses\_time\_entry\_id ON pauses(time\_entry\_id);

\-- Row Level Security (RLS)  
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;  
ALTER TABLE time\_entries ENABLE ROW LEVEL SECURITY;  
ALTER TABLE pauses ENABLE ROW LEVEL SECURITY;

\-- Políticas RLS para Profiles  
CREATE POLICY "Users can view own profile"   
  ON profiles FOR SELECT   
  USING (auth.uid() \= id);

CREATE POLICY "Users can update own profile"   
  ON profiles FOR UPDATE   
  USING (auth.uid() \= id);

CREATE POLICY "Users can insert own profile"   
  ON profiles FOR INSERT   
  WITH CHECK (auth.uid() \= id);

\-- Políticas RLS para Time Entries  
CREATE POLICY "Users can view own time entries"   
  ON time\_entries FOR SELECT   
  USING (auth.uid() \= user\_id);

CREATE POLICY "Users can insert own time entries"   
  ON time\_entries FOR INSERT   
  WITH CHECK (auth.uid() \= user\_id);

CREATE POLICY "Users can update own time entries"   
  ON time\_entries FOR UPDATE   
  USING (auth.uid() \= user\_id);

CREATE POLICY "Users can delete own time entries"   
  ON time\_entries FOR DELETE   
  USING (auth.uid() \= user\_id);

\-- Políticas RLS para Pauses  
CREATE POLICY "Users can view own pauses"   
  ON pauses FOR SELECT   
  USING (  
    EXISTS (  
      SELECT 1 FROM time\_entries   
      WHERE time\_entries.id \= pauses.time\_entry\_id   
      AND time\_entries.user\_id \= auth.uid()  
    )  
  );

CREATE POLICY "Users can insert own pauses"   
  ON pauses FOR INSERT   
  WITH CHECK (  
    EXISTS (  
      SELECT 1 FROM time\_entries   
      WHERE time\_entries.id \= pauses.time\_entry\_id   
      AND time\_entries.user\_id \= auth.uid()  
    )  
  );

CREATE POLICY "Users can update own pauses"   
  ON pauses FOR UPDATE   
  USING (  
    EXISTS (  
      SELECT 1 FROM time\_entries   
      WHERE time\_entries.id \= pauses.time\_entry\_id   
      AND time\_entries.user\_id \= auth.uid()  
    )  
  );

CREATE POLICY "Users can delete own pauses"   
  ON pauses FOR DELETE   
  USING (  
    EXISTS (  
      SELECT 1 FROM time\_entries   
      WHERE time\_entries.id \= pauses.time\_entry\_id   
      AND time\_entries.user\_id \= auth.uid()  
    )  
  );

\-- Función para crear perfil automáticamente al registrarse  
CREATE OR REPLACE FUNCTION handle\_new\_user()   
RETURNS TRIGGER AS $  
BEGIN  
  INSERT INTO profiles (id, full\_name)  
  VALUES (NEW.id, COALESCE(NEW.raw\_user\_meta\_data-\>\>'full\_name', 'Usuario'));  
  RETURN NEW;  
END;  
$ LANGUAGE plpgsql SECURITY DEFINER;

\-- Trigger para ejecutar la función  
CREATE TRIGGER on\_auth\_user\_created  
  AFTER INSERT ON auth.users  
  FOR EACH ROW  
  EXECUTE FUNCTION handle\_new\_user();

\-- Función para actualizar updated\_at automáticamente  
CREATE OR REPLACE FUNCTION update\_updated\_at\_column()  
RETURNS TRIGGER AS $  
BEGIN  
  NEW.updated\_at \= NOW();  
  RETURN NEW;  
END;  
$ LANGUAGE plpgsql;

\-- Triggers para updated\_at  
CREATE TRIGGER update\_profiles\_updated\_at BEFORE UPDATE ON profiles  
  FOR EACH ROW EXECUTE FUNCTION update\_updated\_at\_column();

CREATE TRIGGER update\_time\_entries\_updated\_at BEFORE UPDATE ON time\_entries  
  FOR EACH ROW EXECUTE FUNCTION update\_updated\_at\_column();

CREATE TRIGGER update\_pauses\_updated\_at BEFORE UPDATE ON pauses  
  FOR EACH ROW EXECUTE FUNCTION update\_updated\_at\_column();

### **4.5 Configuración de Supabase**

**Variables de Entorno (.env):**

VITE\_SUPABASE\_URL=https://tu-proyecto.supabase.co  
VITE\_SUPABASE\_ANON\_KEY=tu\_clave\_publica\_anon

**Cliente de Supabase (lib/supabase.ts):**

import { createClient } from '@supabase/supabase-js'  
import type { Database } from '@/types/database'

const supabaseUrl \= import.meta.env.VITE\_SUPABASE\_URL  
const supabaseAnonKey \= import.meta.env.VITE\_SUPABASE\_ANON\_KEY

export const supabase \= createClient\<Database\>(supabaseUrl, supabaseAnonKey, {  
  auth: {  
    persistSession: true,  
    autoRefreshToken: true,  
  }  
})

**Configuración en Supabase Dashboard:**

1. Crear nuevo proyecto en supabase.com  
2. Ejecutar el SQL del esquema en SQL Editor  
3. En Authentication \> Settings:  
   * Habilitar Email provider  
   * Configurar Email templates (opcional)  
   * Configurar Site URL y Redirect URLs  
4. Copiar Project URL y anon/public key

### **4.6 Flujos de Datos Principales**

**1\. Registro de Usuario:**

Usuario completa formulario  
  → Llamar supabase.auth.signUp({ email, password, options: { data: { full\_name } } })  
  → Supabase crea usuario en auth.users  
  → Trigger automático crea perfil en profiles  
  → Redirección a dashboard  
  → Context actualizado con usuario

**2\. Login:**

Usuario envía credenciales  
  → Llamar supabase.auth.signInWithPassword({ email, password })  
  → Supabase valida y retorna sesión \+ JWT  
  → Guardar sesión en localStorage (automático)  
  → Cargar perfil desde profiles  
  → Actualizar AuthContext  
  → Redirección a dashboard

**3\. Iniciar Jornada:**

Usuario click "Entrar"  
  → Obtener user\_id de sesión actual  
  → Crear TimeEntry en Supabase  
    supabase.from('time\_entries').insert({  
      user\_id: user.id,  
      clock\_in: new Date(),  
      date: today,  
      status: 'active'  
    })  
  → RLS valida que user\_id \= auth.uid()  
  → Actualizar estado local  
  → Mostrar UI de "trabajando"

**4\. Iniciar Pausa:**

Usuario click "Pausa"  
  → Obtener time\_entry\_id actual  
  → Insertar Pause en Supabase  
    supabase.from('pauses').insert({  
      time\_entry\_id: currentEntry.id,  
      start\_time: new Date(),  
      type: 'break'  
    })  
  → Actualizar status de time\_entry a 'paused'  
  → RLS valida propiedad a través de time\_entry  
  → Actualizar UI

**5\. Cargar Historial:**

Al montar componente History  
  → Consultar time\_entries del usuario  
    supabase  
      .from('time\_entries')  
      .select('\*, pauses(\*)')  
      .eq('user\_id', user.id)  
      .gte('date', startDate)  
      .lte('date', endDate)  
      .order('date', { ascending: false })  
  → RLS filtra automáticamente por user\_id  
  → Renderizar en UI

**6\. Calcular Horas:**

Al finalizar jornada o pausa:  
  → Calcular en cliente  
    total \= clockOut \- clockIn  
    restar suma de duraciones de pausas  
  → Actualizar time\_entry en Supabase  
    supabase  
      .from('time\_entries')  
      .update({   
        clock\_out: new Date(),   
        total\_hours: calculatedHours,  
        status: 'completed'   
      })  
      .eq('id', entryId)  
  → RLS valida propiedad  
  → Actualizar UI y estadísticas

---

## **5\. INTERFAZ DE USUARIO**

### **5.1 Páginas Principales**

**Página de Login**

* Formulario centrado y minimalista  
* Campos: email, contraseña  
* Botón "Iniciar Sesión"  
* Link a "¿Olvidaste tu contraseña?"  
* Link a "Crear cuenta"  
* Validación en tiempo real  
* Mensajes de error claros

**Página de Registro**

* Formulario similar a login  
* Campos: nombre completo, email, contraseña, confirmar contraseña  
* Botón "Registrarse"  
* Link a "Ya tengo cuenta"  
* Validación de contraseña fuerte  
* Términos y condiciones checkbox

**Recuperación de Contraseña**

* Campo email único  
* Botón "Enviar email de recuperación"  
* Mensaje de confirmación  
* Link de vuelta a login

**Dashboard (Página Principal)**

* Header con saludo personalizado y foto de perfil  
* Estado actual grande y visible  
* Botones de acción principales (tamaño grande, colores distintivos)  
* Resumen del día actual  
* Estadísticas rápidas de la semana  
* Botón de cerrar sesión en header

**Historial**

* Vista de calendario mensual  
* Lista de registros con scroll  
* Tarjetas por día expandibles  
* Acciones de editar/eliminar  
* Solo muestra datos del usuario actual

**Reportes**

* Filtros de fecha (rango personalizado)  
* Gráficos visuales (barras, líneas)  
* Tabla resumen  
* Botón de exportación

**Perfil**

* Información del usuario  
* Formulario de edición (nombre, email)  
* Cambio de contraseña  
* Avatar (opcional)  
* Botón "Eliminar cuenta"

### **5.2 Diseño Visual (Vibe Coding Style)**

**Paleta de Colores:**

* Primario: Azul vibrante (\#3B82F6)  
* Secundario: Púrpura (\#8B5CF6)  
* Éxito: Verde (\#10B981)  
* Advertencia: Ámbar (\#F59E0B)  
* Error: Rojo (\#EF4444)  
* Fondo: Gris claro/oscuro según tema

**Tipografía:**

* Inter o similar (moderna, legible)  
* Tamaños jerárquicos claros  
* Peso variable para énfasis

**Componentes:**

* Bordes redondeados (rounded-lg)  
* Sombras sutiles  
* Animaciones suaves (transitions)  
* Glassmorphism en cards principales  
* Micro-interacciones en botones

### **5.3 Responsive Breakpoints**

* **Mobile:** \< 640px (1 columna, botones grandes)  
* **Tablet:** 640px \- 1024px (2 columnas)  
* **Desktop:** \> 1024px (3 columnas, sidebar)

---

## **6\. LÓGICA DE NEGOCIO Y AUTENTICACIÓN**

### **6.1 Sistema de Autenticación**

**Hook useAuth:**

interface AuthContextType {  
  user: User | null;  
  profile: Profile | null;  
  loading: boolean;  
  signUp: (email: string, password: string, fullName: string) \=\> Promise\<void\>;  
  signIn: (email: string, password: string) \=\> Promise\<void\>;  
  signOut: () \=\> Promise\<void\>;  
  resetPassword: (email: string) \=\> Promise\<void\>;  
  updatePassword: (newPassword: string) \=\> Promise\<void\>;  
}

export function useAuth() {  
  // Implementación del contexto de autenticación  
  // Manejo de sesión con Supabase  
  // Listeners de cambios de estado auth.onAuthStateChange()  
}

**Protección de Rutas:**

function ProtectedRoute({ children }: { children: ReactNode }) {  
  const { user, loading } \= useAuth();  
    
  if (loading) return \<LoadingSpinner /\>;  
  if (\!user) return \<Navigate to="/login" /\>;  
    
  return \<\>{children}\</\>;  
}

**Flujo de Sesión:**

1. Al iniciar app: verificar sesión existente con supabase.auth.getSession()  
2. Si hay sesión válida: cargar usuario y perfil  
3. Si no hay sesión: redireccionar a login  
4. Escuchar cambios: supabase.auth.onAuthStateChange()

### **6.2 Cálculos de Tiempo**

**Calcular Horas Trabajadas:**

function calculateWorkedHours(entry: TimeEntry): number {  
  if (\!entry.clockOut) return 0;  
    
  const totalMinutes \= differenceInMinutes(entry.clockOut, entry.clockIn);  
  const pauseMinutes \= entry.pauses  
    .filter(p \=\> p.endTime)  
    .reduce((sum, p) \=\> sum \+ differenceInMinutes(p.endTime\!, p.startTime), 0);  
    
  return (totalMinutes \- pauseMinutes) / 60;  
}

**Calcular Estadísticas Semanales:**

function getWeeklyStats(entries: TimeEntry\[\]): WeeklyStats {  
  const weekStart \= startOfWeek(new Date());  
  const weekEntries \= entries.filter(e \=\>   
    isAfter(e.date, weekStart) &&   
    e.total\_hours \!== null &&  
    e.user\_id \=== currentUser.id // Solo del usuario actual  
  );  
    
  return {  
    totalHours: sum(weekEntries.map(e \=\> e.total\_hours)),  
    averageDaily: average(weekEntries.map(e \=\> e.total\_hours)),  
    daysWorked: weekEntries.length  
  };  
}

### **6.3 Validaciones de Seguridad**

### **6.3 Validaciones de Seguridad**

**Validar Registro:**

* Email válido (formato correcto)  
* Contraseña mínimo 8 caracteres  
* Contraseña coincide con confirmación  
* Nombre completo no vacío  
* Email no registrado previamente (manejado por Supabase)

**Validar Inicio de Jornada:**

* Usuario autenticado (verificar sesión)  
* No debe haber otra jornada activa del mismo usuario  
* Fecha/hora debe ser válida  
* No puede ser fecha futura  
* user\_id debe coincidir con usuario autenticado

**Validar Pausa:**

* Usuario autenticado  
* Debe existir jornada activa del usuario  
* No puede haber otra pausa activa  
* Duración mínima: 1 minuto  
* time\_entry debe pertenecer al usuario (RLS)

**Validar Edición:**

* Usuario autenticado  
* Usuario debe ser propietario del registro (RLS)  
* Hora de salida debe ser posterior a entrada  
* Pausas deben estar dentro del rango de jornada  
* Total de pausas no puede exceder jornada total  
* Validar en cliente Y en servidor (RLS)

**Validar Eliminación:**

* Usuario autenticado  
* Usuario debe ser propietario (RLS automático)  
* No se puede eliminar jornada activa  
* Confirmación explícita del usuario

---

## **7\. MANEJO DE ERRORES Y SEGURIDAD**

### **7.1 Escenarios de Error**

**E-001: Error de autenticación**

* Credenciales incorrectas: "Email o contraseña incorrectos"  
* Email no verificado: "Por favor verifica tu email"  
* Usuario no encontrado: "No existe una cuenta con este email"  
* Mostrar mensaje específico según error de Supabase

**E-002: Error de registro**

* Email ya registrado: "Este email ya está registrado"  
* Contraseña débil: "La contraseña debe tener al menos 8 caracteres"  
* Error de red: "Error de conexión, intenta nuevamente"

**E-003: Error al guardar datos**

* Mostrar toast de error  
* Intentar guardar localmente como respaldo  
* Opción de reintentar  
* Log del error para debugging

**E-004: Sesión expirada**

* Detectar token JWT expirado  
* Mostrar modal "Tu sesión ha expirado"  
* Redireccionar a login  
* Preservar ruta para volver después del login

**E-005: Datos corruptos**

* Validar esquema al cargar desde Supabase  
* Mostrar diálogo de error amigable  
* Opción de contactar soporte  
* No exponer detalles técnicos al usuario

**E-006: Error de permisos (RLS)**

* "No tienes permisos para realizar esta acción"  
* Verificar sesión activa  
* Refrescar token si es necesario  
* Log del intento para auditoría

**E-007: Jornada activa al cerrar**

* Detectar en beforeunload  
* Advertencia: "Tienes una jornada activa"  
* Opciones: "Finalizar ahora" o "Mantener activa"  
* Persistir estado en Supabase

### **7.2 Mensajes de Usuario y Seguridad**

**Mensajes de Éxito:**

* "¡Bienvenido de vuelta\!"  
* "Jornada iniciada correctamente"  
* "Pausa registrada"  
* "Datos exportados exitosamente"  
* Confirmaciones breves con toast/snackbar

**Mensajes de Error:**

* Claros y accionables  
* Evitar jerga técnica  
* Sugerir solución cuando sea posible  
* "Algo salió mal. Por favor intenta nuevamente"

**Advertencias:**

* Prevenir antes de acciones destructivas  
* "¿Estás seguro de eliminar este registro?"  
* "Esta acción no se puede deshacer"  
* Botones claramente diferenciados (Cancelar / Confirmar)

### **7.3 Mejores Prácticas de Seguridad**

**Implementadas:**

* ✅ Contraseñas hasheadas por Supabase (bcrypt)  
* ✅ JWT para sesiones con refresh automático  
* ✅ Row Level Security (RLS) en todas las tablas  
* ✅ Validación client-side y server-side  
* ✅ HTTPS obligatorio en producción  
* ✅ Sanitización de inputs  
* ✅ Rate limiting por Supabase  
* ✅ CORS configurado correctamente

**A Considerar:**

* Límite de intentos de login fallidos  
* 2FA (Two-Factor Authentication) \- Fase 2  
* Logs de auditoría de acciones críticas  
* Rotación de tokens de sesión  
* Encriptación adicional de datos sensibles

---

## **8\. MEJORAS FUTURAS (Post-MVP)**

### **Fase 2**

* Sistema de usuarios múltiples  
* Autenticación (email/password)  
* Proyectos y tareas  
* Tags personalizados  
* Notas por jornada

### **Fase 3**

* Sincronización en la nube  
* Aplicación móvil nativa  
* Notificaciones push  
* Recordatorios automáticos  
* Integración con calendario

### **Fase 4**

* Gestión de equipos  
* Aprobaciones de supervisor  
* Integración con nóminas  
* API REST pública  
* Geolocalización opcional

---

## **9\. CRITERIOS DE ACEPTACIÓN**

### **Para considerar el MVP completo:**

1. ✅ Usuario puede iniciar y finalizar jornada  
2. ✅ Usuario puede tomar pausas y reanudar trabajo  
3. ✅ Se calculan automáticamente las horas trabajadas  
4. ✅ Se muestra historial de al menos 30 días  
5. ✅ Se pueden editar registros pasados  
6. ✅ Dashboard muestra estadísticas semanales  
7. ✅ Se puede exportar datos a CSV  
8. ✅ Funciona en móvil y desktop  
9. ✅ Datos persisten al cerrar navegador  
10. ✅ Interfaz es intuitiva sin documentación

---

## **10\. GUÍA DE IMPLEMENTACIÓN**

### **Orden Sugerido de Desarrollo:**

**Sprint 1: Fundación (Días 1-3)**

1. Setup del proyecto (Vite \+ React \+ TypeScript)  
2. Configurar Tailwind y shadcn/ui  
3. Estructura de carpetas y arquitectura base  
4. Modelo de datos e IndexedDB  
5. Context y hooks básicos

**Sprint 2: Core Functionality (Días 4-7)**

1. Componentes de Clock In/Out  
2. Lógica de inicio/fin de jornada  
3. Gestión de pausas  
4. Cálculos de tiempo  
5. Persistencia de datos

**Sprint 3: Visualización (Días 8-11)**

1. Dashboard principal  
2. Componentes de historial  
3. Vista de calendario  
4. Estadísticas básicas  
5. Gráficos con Recharts

**Sprint 4: Polish & Features (Días 12-14)**

1. Edición de registros  
2. Exportación CSV  
3. Responsive design  
4. Animaciones y transiciones  
5. Manejo de errores  
6. Testing manual completo

---

## **11\. RECURSOS Y REFERENCIAS**

### **Librerías Clave:**

* **React**: https://react.dev  
* **Tailwind CSS**: https://tailwindcss.com  
* **shadcn/ui**: https://ui.shadcn.com  
* **Dexie.js**: https://dexie.org  
* **date-fns**: https://date-fns.org  
* **Recharts**: https://recharts.org

### **Inspiración de Diseño:**

* Toggl Track  
* Clockify  
* Harvest

---

## **NOTAS FINALES PARA LA IA DE DESARROLLO**

Este documento contiene toda la información necesaria para desarrollar la aplicación. Los puntos críticos son:

1. **Prioridad en UX**: La interfaz debe ser extremadamente simple, los botones grandes y claros  
2. **Persistencia robusta**: Usar IndexedDB correctamente, manejar todos los edge cases  
3. **Cálculos precisos**: La lógica de cálculo de horas debe ser exacta al minuto  
4. **Mobile-first**: Diseñar primero para móvil, luego expandir  
5. **Feedback visual**: Cada acción debe tener respuesta visual inmediata

**Principio guía**: Un usuario debe poder usar la app completamente sin ninguna documentación o tutorial.

[**![][image1]**](https://www.dominiaacademy.com/)

[**DominIA Academy**](https://www.dominiaacademy.com/)

[image1]: <data:image/png;base64,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3HKL3rWueu+998wxw5QLBrVWrc8KKhduail9LK3cOQSvV6rgOTOEGyAzTAPIrY8//lj/HfFLbxcoV3q7cg499FC9a9Wq5eObQFidfPLJZjshV07CSj5u0dtq5YJBtVqxYkVd9w8lGW72339//ZJfH3300eptCDdAZpgGkEvl/rjrm29LPffcc3pzv37wgx+YbSvp379/6PNzgnrkkUf8r4Lr/Sop96BAvV2psJIbZfV2WrlgoEs+fpo7d6530UUX1Xy1plSS4Ubokn835Gpf8DrhBsgM0wDgiAQsubIiXxeXj7fkt5f69OljtgMANMU0AAAAssw0AAAAssw0AAAAssw0AAAAssw0AAAAssw0AAAAssw0AAAAssw0AAAAssw0AAAAssw0AAAAssw0AAAAssw0AAAAssw0AAAAssw0AAAAssw0AAAAssw0AAAAssw0AAAAssw0AAAAssw0AAAAssw0AAAAssw0AAAAssw0AAAAssw0AAAAssw0AAAAssw0AAAAssw0AAAAssw0AAAAssw0AAAAssw0AAAAssw0AAAAssw0AAAAssw0AAAAssw0AAAAssw0AAAAssw0AAAAssw0AAAAssw0AAAAssw0AAAAssw0AAAAssw0AAAAssw0AAAAssw0AAAAssw0AAAAssw0AAAAssw0AAAAMut/ALQTNCknPS3OAAAAAElFTkSuQmCC>