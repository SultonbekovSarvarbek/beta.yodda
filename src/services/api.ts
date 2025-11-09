import type {
  ApiAnnouncementsResponse,
  ApiAnnouncement,
  ApiSubjectFull,
  ApiEducationLevelResponse,
  ApiRegionWithCities,
  ApiLanguage,
  ApiFormat
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

// Get announcements with pagination
export async function getAnnouncements(
  page: number = 1
): Promise<ApiAnnouncementsResponse> {
  const { data } = await apiClient.get<ApiAnnouncementsResponse>('/announcements', {
    params: { page },
  });

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
  // Let axios automatically set Content-Type with boundary for FormData
  // The Authorization header will be added by the request interceptor
  const { data } = await apiClient.post<ApiAnnouncement>('/announcements', formData);

  return data;
}
