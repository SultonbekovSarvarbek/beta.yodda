/**
 * Authentication service
 * Handles all authentication-related API calls
 */

import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
} from '@/types/auth';
import apiClient from '@/lib/axios';

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
  const { data } = await apiClient.post<AuthResponse>('/login', credentials);

  // Store access token
  if (data.access_token) {
    setToken(data.access_token);
  }

  return data;
}

/**
 * Register new user
 */
export async function register(userData: RegisterRequest): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/register', userData);

  // Store access token
  if (data.access_token) {
    setToken(data.access_token);
  }

  return data;
}

/**
 * Get current user profile
 */
export async function getProfile(): Promise<User> {
  const { data } = await apiClient.get<User>('/getprofileuser');

  // Update stored user data
  if (data) {
    setStoredUser(data);
  }

  return data;
}

/**
 * Logout user
 */
export async function logout(): Promise<void> {
  try {
    // Call logout API endpoint to invalidate token on server
    await apiClient.post('/logout');
  } catch (error) {
    // Log error but continue with local logout
    console.error('Logout API call failed:', error);
  } finally {
    // Always clear local storage regardless of API call result
    removeToken();
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getToken();
}

/**
 * Update profile information
 */
export interface UpdateProfileRequest {
  name: string;
  email: string;
  phone: string;
}

export async function updateProfile(data: UpdateProfileRequest): Promise<User> {
  const { data: response } = await apiClient.patch<User>('/updateprofileuser', data);

  // Update stored user data
  if (response) {
    setStoredUser(response);
  }

  return response;
}

/**
 * Change password
 */
export interface ChangePasswordRequest {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export async function changePassword(userId: number, data: ChangePasswordRequest): Promise<{ message: string }> {
  const { data: response } = await apiClient.patch<{ message: string }>(
    `/profile/${userId}/password`,
    data
  );

  return response;
}
