import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import './i18n/config'
import './styles.css'
import reportWebVitals from './reportWebVitals.ts'

import { useAuthStore } from './stores/authStore'
import { ProtectedRoute } from './components/ProtectedRoute.tsx'
import { Feed } from './pages/Feed.tsx'
import { BeTutor } from './pages/BeTutor.tsx'
import { Tutors } from './pages/Tutors.tsx'
import { TutorProfile } from './pages/TutorProfile.tsx'
import { Profile } from './pages/Profile.tsx'
import { Login } from './pages/Login.tsx'
import { Register } from './pages/Register.tsx'

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Feed,
})

const beTutorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/be-tutor',
  component: BeTutor,
})

const tutorsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tutors',
  component: Tutors,
})

const tutorProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tutor/$id',
  component: TutorProfile,
})

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: () => (
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  ),
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: Login,
})

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: Register,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  beTutorRoute,
  tutorsRoute,
  tutorProfileRoute,
  profileRoute,
  loginRoute,
  registerRoute,
])

const router = createRouter({
  routeTree,
  context: {},
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Create QueryClient instance with default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes (matching previous cache TTL)
      gcTime: 10 * 60 * 1000, // 10 minutes (garbage collection time)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

// Initialize auth state on app load
useAuthStore.getState().initializeAuth()

const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </StrictMode>,
  )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
