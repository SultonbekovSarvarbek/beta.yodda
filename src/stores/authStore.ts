/**
 * Zustand Auth Store
 * Manages authentication state with synchronous updates and persistence
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, LoginRequest, RegisterRequest } from '@/types/auth';
import * as authService from '@/services/auth';

/**
 * Auth store state
 */
interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

/**
 * Auth store actions
 */
interface AuthActions {
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  refreshProfile: () => Promise<void>;
  initializeAuth: () => Promise<void>;
}

/**
 * Combined auth store type
 */
type AuthStore = AuthState & AuthActions;

/**
 * Create auth store with persistence
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      loading: true,
      error: null,
      isAuthenticated: false,

      // Actions
      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
          error: null,
        }),

      setLoading: (loading) => set({ loading }),

      setError: (error) => set({ error }),

      /**
       * Initialize auth on app load
       */
      initializeAuth: async () => {
        try {
          set({ loading: true });
          const token = authService.getToken();

          if (!token) {
            set({ loading: false, user: null, isAuthenticated: false });
            return;
          }

          // Try to fetch fresh profile data
          const profile = await authService.getProfile();
          set({
            user: profile,
            isAuthenticated: true,
            loading: false,
          });
        } catch (err) {
          // If profile fetch fails, clear stored data
          console.error('Failed to load user profile:', err);
          authService.logout();
          set({
            user: null,
            isAuthenticated: false,
            loading: false,
          });
        }
      },

      /**
       * Login user
       */
      login: async (credentials) => {
        try {
          set({ loading: true, error: null });
          
          await authService.login(credentials);

          // Fetch profile data
          const profile = await authService.getProfile();

          // Synchronously update state - no race conditions!
          set({
            user: profile,
            isAuthenticated: true,
            loading: false,
            error: null,
          });
        } catch (err) {
          const errorMessage =
            err instanceof authService.AuthError
              ? err.message
              : 'Login failed. Please try again.';

          set({
            error: errorMessage,
            loading: false,
          });

          throw err;
        }
      },

      /**
       * Register new user
       */
      register: async (data) => {
        try {
          set({ loading: true, error: null });

          await authService.register(data);

          // Fetch profile data
          const profile = await authService.getProfile();

          // Synchronously update state
          set({
            user: profile,
            isAuthenticated: true,
            loading: false,
            error: null,
          });
        } catch (err) {
          const errorMessage =
            err instanceof authService.AuthError
              ? err.message
              : 'Registration failed. Please try again.';

          set({
            error: errorMessage,
            loading: false,
          });

          throw err;
        }
      },

      /**
       * Logout user
       */
      logout: () => {
        authService.logout();
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      /**
       * Clear error message
       */
      clearError: () => set({ error: null }),

      /**
       * Refresh user profile
       */
      refreshProfile: async () => {
        try {
          set({ loading: true });
          const profile = await authService.getProfile();
          set({
            user: profile,
            isAuthenticated: true,
            loading: false,
          });
        } catch (err) {
          console.error('Failed to refresh profile:', err);
          set({ loading: false });
          throw err;
        }
      },
    }),
    {
      name: 'auth-storage',
      // Only persist user data, not loading or error states
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);
