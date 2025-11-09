/**
 * Authentication-related TypeScript types
 */

/**
 * User role types
 */
export type UserRole = 'tutor' | 'seeker';

/**
 * User object returned from API
 */
export interface User {
  id: number;
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
  avatar?: string;
  createdAt?: string;
}

/**
 * Login request payload
 */
export interface LoginRequest {
  phone: string;
  password: string;
}

/**
 * Registration request payload
 */
export interface RegisterRequest {
  name: string;
  phone: string;
  email: string;
  role: UserRole;
  password: string;
  confirmPassword: string;
}

/**
 * Authentication response from login/register endpoints
 */
export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  message?: string;
}

/**
 * Profile response from getprofileuser endpoint
 */
export interface ProfileResponse {
  user: User;
}

/**
 * Auth error response
 */
export interface AuthError {
  message: string;
  errors?: Record<string, string[]>;
}
