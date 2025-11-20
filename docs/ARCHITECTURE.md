# Architecture Guide

## Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (New York variant)
- **Routing**: [TanStack Router](https://tanstack.com/router)
- **State Management**: 
  - Server State: [TanStack Query](https://tanstack.com/query)
  - Client State: [Zustand](https://github.com/pmndrs/zustand)

## Routing System

The project uses **TanStack Router** with a code-based routing approach (not file-based).

- **Configuration**: Routes are defined in `src/main.tsx`.
- **Root Route**: Wraps the application with providers and layout.
- **Route Tree**: Manually constructed using `rootRoute.addChildren([...])`.
- **Navigation**: Uses the `<Link />` component or `useNavigate` hook.

### Key Routes
- `/`: Feed (Landing page)
- `/login`, `/register`: Authentication
- `/tutors`: Tutor search and listing
- `/mini-lessons`: Educational content
- `/profile`: User profile management

## State Management

### Authentication (`src/stores/authStore.ts`)
Authentication state is managed globally using **Zustand**. It handles:
- User session data
- Login/Logout actions
- Auth initialization

### Data Fetching
Server-side data is managed with **TanStack Query**. This provides:
- Caching
- Automatic refetching
- Loading/Error states

## Project Structure

```
src/
├── components/     # Reusable UI components
│   ├── ui/         # shadcn/ui primitives
│   └── ...         # Feature-specific components
├── pages/          # Route components (views)
├── hooks/          # Custom React hooks
├── services/       # API service layers
├── stores/         # Global state stores (Zustand)
├── types/          # TypeScript type definitions
├── lib/            # Utilities (cn, etc.)
├── i18n/           # Internationalization config
└── main.tsx        # Application entry point & Router config
```
