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
  component: () => (
    <ProtectedRoute>
      <TutorProfile />
    </ProtectedRoute>
  ),
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

// Initialize auth state on app load
useAuthStore.getState().initializeAuth()

const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
