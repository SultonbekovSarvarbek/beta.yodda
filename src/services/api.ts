import type { ApiAnnouncementsResponse } from '@/types/api';

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
async function apiFetch<T>(endpoint: string): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
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
    if (error instanceof ApiError) {
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

// Clear cache manually if needed
export function clearApiCache(): void {
  cache.clear();
}
