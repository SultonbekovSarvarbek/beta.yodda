import type {
  ApiAnnouncementsResponse,
  ApiAnnouncement,
  ApiSubjectFull,
  ApiEducationLevelResponse
} from '@/types/api';
import { getToken } from '@/services/auth';
import i18n from '@/i18n/config';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://dev.yodda.online/api';

// Simple in-memory cache
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class ApiCache {
  private cache = new Map<string, CacheEntry<any>>();
  private readonly TTL = 5 * 60 * 1000; // 5 minutes

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > this.TTL) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  set<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  clear(): void {
    this.cache.clear();
  }
}

const cache = new ApiCache();

// API Error class
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public statusText?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Base fetch wrapper with error handling
async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Accept-Language': i18n.language || 'ru',
  };

  // Add Authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new ApiError(
        `API request failed: ${response.statusText}`,
        response.status,
        response.statusText
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // Don't wrap ApiError or AbortError - let them propagate as-is
    if (error instanceof ApiError) {
      throw error;
    }

    // Preserve AbortError for proper cleanup handling
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }

    throw new ApiError(
      error instanceof Error ? error.message : 'An unknown error occurred'
    );
  }
}

// Get announcements with pagination and caching
export async function getAnnouncements(
  page: number = 1
): Promise<ApiAnnouncementsResponse> {
  const cacheKey = `announcements_page_${page}`;

  // Check cache first
  const cachedData = cache.get<ApiAnnouncementsResponse>(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  // Fetch from API
  const endpoint = `/announcements?page=${page}`;
  const data = await apiFetch<ApiAnnouncementsResponse>(endpoint);

  // Cache the result
  cache.set(cacheKey, data);

  return data;
}

// Get single announcement by ID with caching
export async function getAnnouncementById(id: number): Promise<ApiAnnouncement> {
  const cacheKey = `announcement_${id}`;

  // Check cache first
  const cachedData = cache.get<ApiAnnouncement>(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  // Fetch from API
  const endpoint = `/announcements/${id}`;
  const data = await apiFetch<ApiAnnouncement>(endpoint);

  // Cache the result
  cache.set(cacheKey, data);

  return data;
}

// Clear cache manually if needed
export function clearApiCache(): void {
  cache.clear();
}

// Get all subjects
export async function getSubjects(): Promise<ApiSubjectFull[]> {
  const cacheKey = 'subjects';

  // Check cache first
  const cachedData = cache.get<ApiSubjectFull[]>(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  // Fetch from API
  const endpoint = '/subjects';
  const data = await apiFetch<ApiSubjectFull[]>(endpoint);

  // Cache the result
  cache.set(cacheKey, data);

  return data;
}

// Get education levels for subjects
export async function getEducationLevels(
  subjectIds: number[],
  signal?: AbortSignal
): Promise<ApiEducationLevelResponse[]> {
  const endpoint = '/educationLevels';
  const data = await apiFetch<ApiEducationLevelResponse[]>(endpoint, {
    method: 'POST',
    body: JSON.stringify({ subject_id: subjectIds }),
    signal,
  });

  return data;
}
