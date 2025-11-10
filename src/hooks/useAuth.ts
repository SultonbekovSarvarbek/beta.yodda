/**
 * useAuth Hook
 * Provides access to authentication state via Zustand store
 */

import { useAuthStore } from '@/stores/authStore';
import type { LoginRequest, RegisterRequest, User } from '@/types/auth';

/**
 * Auth hook return type (compatible with previous Context API)
 */
export interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isLoggingOut: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  refreshProfile: () => Promise<void>;
}

/**
 * Custom hook to use auth store
 * Uses Zustand for fast, synchronous state updates
 */
export function useAuth(): UseAuthReturn {
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoggingOut = useAuthStore((state) => state.isLoggingOut);
  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);
  const logout = useAuthStore((state) => state.logout);
  const clearError = useAuthStore((state) => state.clearError);
  const refreshProfile = useAuthStore((state) => state.refreshProfile);

  return {
    user,
    loading,
    error,
    isAuthenticated,
    isLoggingOut,
    login,
    register,
    logout,
    clearError,
    refreshProfile,
  };
}
