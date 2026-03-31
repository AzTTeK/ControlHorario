<div align="center">

# Control Horario

### Sistema de Control de Jornada Laboral

[![GitHub](https://img.shields.io/badge/GitHub-AzTTeK-181717?style=for-the-badge&logo=github)](https://github.com/AzTTeK)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel)](https://vercel.com)
[![Supabase](https://img.shields.io/badge/Database-Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)

![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=flat-square&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.2-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)

</div>

---

## Descripcion

**Control Horario** es una aplicacion web moderna para el registro y seguimiento de la jornada laboral. Permite a los empleados fichar entradas y salidas, gestionar pausas, y visualizar estadisticas detalladas de sus horas trabajadas.


</div>

---

## Funcionalidades

| Modulo | Descripcion |
|--------|-------------|
| **Autenticacion** | Registro, login y recuperacion de contrasena con Supabase Auth |
| **Fichaje** | Clock-in/Clock-out con registro de hora exacta |
| **Pausas** | Gestion de pausas (comida, descanso, otras) |
| **Dashboard** | Visualizacion de estadisticas semanales y mensuales |
| **Historial** | Registro completo de todas las jornadas |
| **Reportes** | Generacion de informes de horas trabajadas |
| **Perfil** | Gestion de datos personales del usuario |
| **Tema Oscuro** | Soporte completo para modo oscuro/claro |

---

## Stack Tecnologico

<div align="center">

| Frontend | Backend | Herramientas |
|----------|---------|--------------|
| ![React](https://img.shields.io/badge/-React%2019-61DAFB?style=flat-square&logo=react&logoColor=black) | ![Supabase](https://img.shields.io/badge/-Supabase-3FCF8E?style=flat-square&logo=supabase&logoColor=white) | ![Vite](https://img.shields.io/badge/-Vite-646CFF?style=flat-square&logo=vite&logoColor=white) |
| ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white) | ![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white) | ![ESLint](https://img.shields.io/badge/-ESLint-4B32C3?style=flat-square&logo=eslint&logoColor=white) |
| ![TailwindCSS](https://img.shields.io/badge/-Tailwind%20CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white) | | ![Vercel](https://img.shields.io/badge/-Vercel-000000?style=flat-square&logo=vercel&logoColor=white) |
| ![React Router](https://img.shields.io/badge/-React%20Router-CA4245?style=flat-square&logo=reactrouter&logoColor=white) | | |
| ![Recharts](https://img.shields.io/badge/-Recharts-FF6384?style=flat-square&logo=chart.js&logoColor=white) | | |

</div>

---

## Arquitectura del Proyecto

```
src/
├── components/
│   ├── auth/              # Componentes de autenticacion
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   ├── ForgotPasswordForm.tsx
│   │   └── ProtectedRoute.tsx
│   ├── dashboard/         # Componentes del dashboard
│   │   ├── StatsCard.tsx
│   │   └── WeeklyChart.tsx
│   ├── layout/            # Layout de la aplicacion
│   │   ├── Header.tsx
│   │   ├── Layout.tsx
│   │   └── Sidebar.tsx
│   └── time-tracking/     # Control de tiempo
│       ├── CurrentStatus.tsx
│       ├── PauseControls.tsx
│       └── TimeClockControls.tsx
├── contexts/              # Context API
│   ├── AuthContext.tsx
│   ├── ThemeContext.tsx
│   └── TimeTrackingContext.tsx
├── lib/                   # Utilidades y configuracion
│   ├── calculations.ts
│   ├── supabase.ts
│   └── utils.ts
├── pages/                 # Paginas de la aplicacion
│   ├── Dashboard.tsx
│   ├── History.tsx
│   ├── Profile.tsx
│   └── Reports.tsx
└── types/                 # Definiciones de tipos
    └── index.ts
```

---

## Instalacion

### Requisitos previos

- Node.js 18+
- npm o pnpm
- Cuenta en Supabase

### Pasos

```bash
# Clonar el repositorio
git clone https://github.com/AzTTeK/ControlHorario.git
cd ControlHorario

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales de Supabase

# Iniciar en desarrollo
npm run dev
```

### Variables de Entorno

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

---

## Scripts Disponibles

| Comando | Descripcion |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Compila la aplicacion para produccion |
| `npm run preview` | Previsualiza el build de produccion |
| `npm run lint` | Ejecuta ESLint |

---

## Despliegue

La aplicacion esta desplegada en **Vercel** con integracion continua desde GitHub.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/AzTTeK/ControlHorario)

---

## Contribuciones

<div align="center">

[![Contributors](https://img.shields.io/github/contributors/AzTTeK/ControlHorario?style=for-the-badge&color=blue)](https://github.com/AzTTeK/ControlHorario/graphs/contributors)
[![Commits](https://img.shields.io/github/commit-activity/m/AzTTeK/ControlHorario?style=for-the-badge&color=green)](https://github.com/AzTTeK/ControlHorario/commits)
[![Last Commit](https://img.shields.io/github/last-commit/AzTTeK/ControlHorario?style=for-the-badge&color=orange)](https://github.com/AzTTeK/ControlHorario/commits)

</div>

### Autor Principal

<div align="center">

[![AzTTeK](https://img.shields.io/badge/Developed%20by-AzTTeK-blue?style=for-the-badge&logo=github)](https://github.com/AzTTeK)

[![GitHub Stats](https://github-readme-stats.vercel.app/api?username=AzTTeK&show_icons=true&theme=dark&hide_border=true&bg_color=0d1117&count_private=true)](https://github.com/AzTTeK)

</div>

---

## Estado del Proyecto

<div align="center">

[![Build Status](https://img.shields.io/github/actions/workflow/status/AzTTeK/ControlHorario/deploy.yml?style=for-the-badge&label=Build)](https://github.com/AzTTeK/ControlHorario/actions)
[![Issues](https://img.shields.io/github/issues/AzTTeK/ControlHorario?style=for-the-badge)](https://github.com/AzTTeK/ControlHorario/issues)
[![Pull Requests](https://img.shields.io/github/issues-pr/AzTTeK/ControlHorario?style=for-the-badge)](https://github.com/AzTTeK/ControlHorario/pulls)
[![License](https://img.shields.io/github/license/AzTTeK/ControlHorario?style=for-the-badge)](https://github.com/AzTTeK/ControlHorario/blob/main/LICENSE)

</div>

---

## Integraciones

<div align="center">

```mermaid
graph LR
    A[React App] --> B[Supabase Auth]
    A --> C[Supabase Database]
    A --> D[Vercel Hosting]
    B --> E[PostgreSQL]
    C --> E
    D --> F[CDN Global]
```

</div>

| Servicio | Uso | Estado |
|----------|-----|--------|
| **Supabase Auth** | Autenticacion de usuarios | ![Active](https://img.shields.io/badge/-Active-success?style=flat-square) |
| **Supabase Database** | Almacenamiento de datos | ![Active](https://img.shields.io/badge/-Active-success?style=flat-square) |
| **Vercel** | Hosting y CI/CD | ![Active](https://img.shields.io/badge/-Active-success?style=flat-square) |
| **GitHub** | Control de versiones | ![Active](https://img.shields.io/badge/-Active-success?style=flat-square) |

---

## Licencia

Este proyecto esta bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para mas detalles.

---

<div align="center">

**Desarrollado con** :heart: **por [AzTTeK](https://github.com/AzTTeK)**

[![GitHub followers](https://img.shields.io/github/followers/AzTTeK?style=social)](https://github.com/AzTTeK)
[![GitHub stars](https://img.shields.io/github/stars/AzTTeK/ControlHorario?style=social)](https://github.com/AzTTeK/ControlHorario)

</div>
