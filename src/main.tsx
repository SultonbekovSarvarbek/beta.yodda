import { StrictMode, lazy, Suspense } from 'react'
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
import { PageSkeleton, FormSkeleton, ProfileSkeleton } from './components/skeletons'

// Eager load: Landing page only
import { Feed } from './pages/Feed.tsx'

// Lazy load: All other pages
const BeTutor = lazy(() => import('./pages/BeTutor.tsx').then(m => ({ default: m.BeTutor })))
const ForParents = lazy(() => import('./pages/ForParents.tsx').then(m => ({ default: m.ForParents })))
const Support = lazy(() => import('./pages/Support.tsx').then(m => ({ default: m.Support })))
const MiniLessons = lazy(() => import('./pages/MiniLessons.tsx'))
const MiniLessonsUpload = lazy(() => import('./pages/MiniLessonsUpload.tsx').then(m => ({ default: m.MiniLessonsUpload })))
const Tutors = lazy(() => import('./pages/Tutors.tsx').then(m => ({ default: m.Tutors })))
const TutorProfile = lazy(() => import('./pages/TutorProfile.tsx').then(m => ({ default: m.TutorProfile })))
const PostView = lazy(() => import('./pages/PostView.tsx').then(m => ({ default: m.PostView })))
const Profile = lazy(() => import('./pages/Profile.tsx').then(m => ({ default: m.Profile })))
const Login = lazy(() => import('./pages/Login.tsx').then(m => ({ default: m.Login })))
const Register = lazy(() => import('./pages/Register.tsx').then(m => ({ default: m.Register })))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy.tsx').then(m => ({ default: m.PrivacyPolicy })))
const Terms = lazy(() => import('./pages/Terms.tsx').then(m => ({ default: m.Terms })))
const Offer = lazy(() => import('./pages/Offer.tsx').then(m => ({ default: m.Offer })))

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
      <Suspense fallback={<FormSkeleton />}>
        <BeTutor />
      </Suspense>
    </AppLayout>
  ),
})

const beTutorEditRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/be-tutor/$id',
  component: () => (
    <AppLayout>
      <Suspense fallback={<FormSkeleton />}>
        <BeTutor />
      </Suspense>
    </AppLayout>
  ),
})

const forParentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/for-parents',
  component: () => (
    <AppLayout>
      <Suspense fallback={<PageSkeleton />}>
        <ForParents />
      </Suspense>
    </AppLayout>
  ),
})

const supportRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/support',
  component: () => (
    <AppLayout>
      <Suspense fallback={<PageSkeleton />}>
        <Support />
      </Suspense>
    </AppLayout>
  ),
})

const miniLessonsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/mini-lessons',
  component: () => (
    <AppLayout>
      <Suspense fallback={<PageSkeleton />}>
        <MiniLessons />
      </Suspense>
    </AppLayout>
  ),
})

const miniLessonsUploadRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/mini-lessons/upload',
  component: () => (
    <AppLayout>
      <ProtectedRoute>
        <Suspense fallback={<FormSkeleton />}>
          <MiniLessonsUpload />
        </Suspense>
      </ProtectedRoute>
    </AppLayout>
  ),
})

const tutorsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tutors',
  component: () => (
    <AppLayout>
      <Suspense fallback={<PageSkeleton />}>
        <Tutors />
      </Suspense>
    </AppLayout>
  ),
})

const tutorProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tutor/$id',
  component: () => (
    <AppLayout>
      <Suspense fallback={<ProfileSkeleton />}>
        <TutorProfile />
      </Suspense>
    </AppLayout>
  ),
})

const tutorPostRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tutor/$tutorId/post/$postId',
  component: () => (
    <AppLayout>
      <Suspense fallback={<PageSkeleton />}>
        <PostView />
      </Suspense>
    </AppLayout>
  ),
})

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: () => (
    <AppLayout>
      <ProtectedRoute>
        <Suspense fallback={<ProfileSkeleton />}>
          <Profile />
        </Suspense>
      </ProtectedRoute>
    </AppLayout>
  ),
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: () => (
    <AppLayout>
      <Suspense fallback={<PageSkeleton />}>
        <Login />
      </Suspense>
    </AppLayout>
  ),
})

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: () => (
    <AppLayout>
      <Suspense fallback={<FormSkeleton />}>
        <Register />
      </Suspense>
    </AppLayout>
  ),
})

const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/privacy',
  component: () => (
    <AppLayout>
      <Suspense fallback={<PageSkeleton />}>
        <PrivacyPolicy />
      </Suspense>
    </AppLayout>
  ),
})

const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/terms',
  component: () => (
    <AppLayout>
      <Suspense fallback={<PageSkeleton />}>
        <Terms />
      </Suspense>
    </AppLayout>
  ),
})

const offerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/offer',
  component: () => (
    <AppLayout>
      <Suspense fallback={<PageSkeleton />}>
        <Offer />
      </Suspense>
    </AppLayout>
  ),
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  beTutorRoute,
  beTutorEditRoute,
  forParentsRoute,
  supportRoute,
  miniLessonsRoute,
  miniLessonsUploadRoute,
  tutorsRoute,
  tutorProfileRoute,
  tutorPostRoute,
  profileRoute,
  loginRoute,
  registerRoute,
  privacyRoute,
  termsRoute,
  offerRoute,
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
      structuralSharing: true, // Prevent unnecessary re-renders by comparing data deeply
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
