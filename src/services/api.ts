import type {
  ApiAnnouncementsResponse,
  ApiAnnouncement,
  ApiSubjectFull,
  ApiEducationLevelResponse,
  ApiRegionWithCities,
  ApiLanguage,
  ApiFormat,
  ApiDay,
  ApiFavoritesResponse
} from '@/types/api';
import apiClient from '@/lib/axios';
import type { AxiosRequestConfig } from 'axios';

// API Error class (kept for backward compatibility)
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

// Filter parameters for announcements
export interface AnnouncementFilters {
  page?: number;
  region_id?: number;
  city_id?: number;
  gender?: number;
  languages?: number | number[];
  subjects?: number | number[];
  min_amount?: number;
  max_amount?: number;
  search?: string;
}

// Get announcements with pagination and filters
export async function getAnnouncements(
  filters?: AnnouncementFilters
): Promise<ApiAnnouncementsResponse> {
  const params: Record<string, any> = {};

  if (filters) {
    if (filters.page && filters.page > 1) params.page = filters.page;
    if (filters.region_id) params.region_id = filters.region_id;
    if (filters.city_id) params.city_id = filters.city_id;
    if (filters.gender) params.gender = filters.gender;
    if (filters.languages) params.languages = filters.languages;
    if (filters.subjects) params.subjects = filters.subjects;
    if (filters.min_amount !== undefined) params.min_amount = filters.min_amount;
    if (filters.max_amount !== undefined) params.max_amount = filters.max_amount;
    if (filters.search) params.search = filters.search;
  }

  const config = Object.keys(params).length > 0 ? { params } : {};
  const { data } = await apiClient.get<ApiAnnouncementsResponse>('/announcements', config);

  return data;
}

// Get single announcement by ID
export async function getAnnouncementById(id: number): Promise<ApiAnnouncement> {
  const { data } = await apiClient.get<ApiAnnouncement>(`/announcements/${id}`);

  return data;
}

// Get all subjects
export async function getSubjects(): Promise<ApiSubjectFull[]> {
  const { data } = await apiClient.get<ApiSubjectFull[]>('/subjects');

  return data;
}

// Get education levels for subjects
export async function getEducationLevels(
  subjectIds: number[],
  signal?: AbortSignal
): Promise<ApiEducationLevelResponse[]> {
  const config: AxiosRequestConfig = {};

  if (signal) {
    config.signal = signal;
  }

  const { data } = await apiClient.post<ApiEducationLevelResponse[]>(
    '/educationLevels',
    { subject_id: subjectIds },
    config
  );

  return data;
}

// Get all regions with their cities
export async function getRegions(): Promise<ApiRegionWithCities[]> {
  const { data } = await apiClient.get<ApiRegionWithCities[]>('/regions');

  return data;
}

// Get all languages
export async function getLanguages(): Promise<ApiLanguage[]> {
  const { data } = await apiClient.get<ApiLanguage[]>('/languages');

  return data;
}

// Get all teaching formats
export async function getFormats(): Promise<ApiFormat[]> {
  const { data } = await apiClient.get<ApiFormat[]>('/formats');

  return data;
}

// Get all days
export async function getDays(): Promise<ApiDay[]> {
  const { data } = await apiClient.get<ApiDay[]>('/days');

  return data;
}

// Register new tutor
export async function registerTutor(payload: {
  name: string;
  password: string;
  gender: number;
  phone: string;
  email: string;
  age: string;
  termsAccepted: boolean;
  role_id: number;
}): Promise<{ message: string; user?: any }> {
  const { data } = await apiClient.post('/register', payload);
  return data;
}

// Login user
export async function loginUser(payload: {
  phone: string;
  password: string;
}): Promise<{ token: string; user?: any }> {
  const { data } = await apiClient.post('/login', payload);
  return data;
}

// Create new announcement
export async function createAnnouncement(formData: FormData): Promise<ApiAnnouncement> {
  // Set Content-Type to multipart/form-data
  // The Authorization header will be added by the request interceptor
  const { data } = await apiClient.post<ApiAnnouncement>('/announcements', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return data;
}

// Send contact message
export async function sendContactMessage(payload: {
  name: string;
  phone: string;
  message: string;
}): Promise<{ message: string }> {
  const { data } = await apiClient.post<{ message: string }>('/contact/send-message', payload);
  return data;
}

// Get all favorites for the current user
// API returns array directly: ApiFavorite[]
export async function getFavorites(): Promise<ApiFavoritesResponse> {
  const { data } = await apiClient.get<ApiFavoritesResponse>('/favorites');
  return data;
}

// Toggle favorite status for an announcement
export async function toggleFavorite(announcementId: number): Promise<{ message: string; is_favorited: boolean }> {
  const { data } = await apiClient.post<{ message: string; is_favorited: boolean }>(`/favorites/toggle/${announcementId}`);
  return data;
}

// Delete a favorite
export async function deleteFavorite(announcementId: number): Promise<{ message: string }> {
  const { data } = await apiClient.delete<{ message: string }>(`/favorites/${announcementId}`);
  return data;
}

// Get profile announcements for the current user
export async function getProfileAnnouncements(): Promise<ApiAnnouncement[]> {
  const { data } = await apiClient.get<ApiAnnouncement[]>('/getProfileAnnouncements');
  return data;
}

// Delete an announcement
export async function deleteAnnouncement(id: number): Promise<{ message: string }> {
  const { data } = await apiClient.delete<{ message: string }>(`/announcements/${id}`);
  return data;
}
