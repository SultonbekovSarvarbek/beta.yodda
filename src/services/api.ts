import type {
  ApiAnnouncementsResponse,
  ApiAnnouncement,
  ApiSubjectFull,
  ApiEducationLevelResponse
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
