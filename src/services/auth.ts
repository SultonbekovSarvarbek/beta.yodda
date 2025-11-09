/**
 * Authentication service
 * Handles all authentication-related API calls
 */

import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ProfileResponse,
  User,
} from '@/types/auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://dev.yodda.online/api';

/**
 * Token storage keys
 */
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

/**
 * Custom error class for auth errors
 */
export class AuthError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

/**
 * Helper to make authenticated API calls
 */
async function authFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (options.headers) {
    Object.assign(headers, options.headers);
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new AuthError(
        data.message || 'Authentication failed',
        response.status,
        data.errors
      );
    }

    return data;
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    throw new AuthError(
      error instanceof Error ? error.message : 'Network error occurred'
    );
  }
}

/**
 * Get stored auth token
 */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Store auth token
 */
export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Remove auth token
 */
export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/**
 * Get stored user data
 */
export function getStoredUser(): User | null {
  const userData = localStorage.getItem(USER_KEY);
  if (!userData) return null;

  try {
    return JSON.parse(userData);
  } catch {
    return null;
  }
}

/**
 * Store user data
 */
export function setStoredUser(user: User): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

/**
 * Login user
 */
export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  const response = await authFetch<AuthResponse>('/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

  // Store access token
  if (response.access_token) {
    setToken(response.access_token);
  }

  return response;
}

/**
 * Register new user
 */
export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const response = await authFetch<AuthResponse>('/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  // Store access token
  if (response.access_token) {
    setToken(response.access_token);
  }

  return response;
}

/**
 * Get current user profile
 */
export async function getProfile(): Promise<User> {
  const response = await authFetch<ProfileResponse>('/getprofileuser', {
    method: 'GET',
  });

  // Update stored user data
  if (response.user) {
    setStoredUser(response.user);
  }

  return response.user;
}

/**
 * Logout user
 */
export function logout(): void {
  removeToken();
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getToken();
}
