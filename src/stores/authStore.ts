/**
 * Zustand Auth Store
 * Manages authentication state with synchronous updates and persistence
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, LoginRequest, RegisterRequest } from '@/types/auth';
import * as authService from '@/services/auth';
import i18n from '@/i18n/config';

/**
 * Auth store state
 */
interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isLoggingOut: boolean;
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
  logout: () => Promise<void>;
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
      isLoggingOut: false,

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

          // Clear guest language preference (backend takes over)
          localStorage.removeItem('i18n_language');

          // Sync i18n language with user's preference
          if (profile.lang) {
            await i18n.changeLanguage(profile.lang);
          }

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

          // Clear guest language preference (backend takes over)
          localStorage.removeItem('i18n_language');

          // Sync i18n language with user's preference
          if (profile.lang) {
            await i18n.changeLanguage(profile.lang);
          }

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

          // 1. Call register API to create account
          await authService.register(data);

          // 2. Call login API to authenticate with the new credentials
          await authService.login({
            phone: data.phone,
            password: data.password,
          });

          // 3. Fetch profile data
          const profile = await authService.getProfile();

          // Clear guest language preference (backend takes over)
          localStorage.removeItem('i18n_language');

          // Sync i18n language with user's preference
          if (profile.lang) {
            await i18n.changeLanguage(profile.lang);
          }

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
      logout: async () => {
        try {
          set({ isLoggingOut: true });

          // Call logout API (always clears local storage regardless of result)
          await authService.logout();

          // Clear auth state
          set({
            user: null,
            isAuthenticated: false,
            error: null,
            isLoggingOut: false,
          });
        } catch (error) {
          // Even if there's an error, clear the state (fail-safe)
          console.error('Logout error:', error);
          set({
            user: null,
            isAuthenticated: false,
            error: null,
            isLoggingOut: false,
          });
        }
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

          // Sync i18n language with user's preference
          if (profile.lang) {
            await i18n.changeLanguage(profile.lang);
          }

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
