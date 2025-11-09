/**
 * Authentication-related TypeScript types
 */

/**
 * User role types
 */
export type UserRole = 'tutor' | 'seeker';

/**
 * Requests summary object
 */
export interface RequestsSummary {
  total: number;
  active_user_requests: number;
  converted_guest_requests: number;
  expired_linked_requests: number;
  archived_expired_requests: number;
}

/**
 * Offline access information
 */
export interface OfflineAccess {
  message: string;
  profile_view_link: string;
  instructions: string[];
}

/**
 * Bookings summary object
 */
export interface BookingsSummary {
  total: number;
  pending: number;
  confirmed: number;
  declined: number;
  completed: number;
  cancelled: number;
  pending_approval: number;
  pending_payment: number;
  processing: number;
  paid: number;
  failed: number;
  expired: number;
  refund_requested: number;
  refund_processing: number;
  refund_completed: number;
  refund_failed: number;
}

/**
 * User object returned from API
 */
export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  role_id: number;
  language: string;
  gender: string | null;
  created_at: string;
  updated_at: string;
  requests: any[]; // Replace 'any' with proper Request type when available
  requests_summary: RequestsSummary;
  profile_view_link: string;
  offline_access: OfflineAccess;
  bookings: any[]; // Replace 'any' with proper Booking type when available
  bookings_summary: BookingsSummary;
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
