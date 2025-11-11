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
import { Toaster } from 'sonner'

import './i18n/config'
import './styles.css'
import reportWebVitals from './reportWebVitals.ts'

import { useAuthStore } from './stores/authStore'
import { ProtectedRoute } from './components/ProtectedRoute.tsx'
import { AppLayout } from './components/AppLayout.tsx'
import { Feed } from './pages/Feed.tsx'
import { BeTutor } from './pages/BeTutor.tsx'
import { ForParents } from './pages/ForParents.tsx'
import { Support } from './pages/Support.tsx'
import { Tutors } from './pages/Tutors.tsx'
import { TutorProfile } from './pages/TutorProfile.tsx'
import { PostView } from './pages/PostView.tsx'
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
  component: () => (
    <AppLayout>
      <Feed />
    </AppLayout>
  ),
})

const beTutorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/be-tutor',
  component: () => (
    <AppLayout>
      <BeTutor />
    </AppLayout>
  ),
})

const forParentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/for-parents',
  component: () => (
    <AppLayout>
      <ForParents />
    </AppLayout>
  ),
})

const supportRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/support',
  component: () => (
    <AppLayout>
      <Support />
    </AppLayout>
  ),
})

const tutorsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tutors',
  component: () => (
    <AppLayout>
      <Tutors />
    </AppLayout>
  ),
})

const tutorProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tutor/$id',
  component: () => (
    <AppLayout>
      <TutorProfile />
    </AppLayout>
  ),
})

const tutorPostRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tutor/$tutorId/post/$postId',
  component: () => (
    <AppLayout>
      <PostView />
    </AppLayout>
  ),
})

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: () => (
    <AppLayout>
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    </AppLayout>
  ),
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: () => (
    <AppLayout>
      <Login />
    </AppLayout>
  ),
})

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: () => (
    <AppLayout>
      <Register />
    </AppLayout>
  ),
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  beTutorRoute,
  forParentsRoute,
  supportRoute,
  tutorsRoute,
  tutorProfileRoute,
  tutorPostRoute,
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
        <Toaster position="top-right" richColors />
      </QueryClientProvider>
    </StrictMode>,
  )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
