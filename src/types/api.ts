// API Response Types for https://dev.yodda.online/api

export interface ApiRegion {
  id: number;
  name: string;
  normalized_name: string;
}

export interface ApiCity {
  id: number;
  name: string;
  normalized_name: string;
  longitude: string;
  latitude: string;
  region_id: number;
}

export interface ApiRegionWithCities {
  id: number;
  name: string;
  normalized_name: string;
  cities: ApiCity[];
}

export interface ApiSubject {
  id: number;
  name: string;
}

export interface ApiFormatData {
  id: number;
  name: string;
  format_id: number;
  amount: number;
  duration: string | number;
}

export interface ApiSchedule {
  mon?: string[];
  tue?: string[];
  wed?: string[];
  thu?: string[];
  fri?: string[];
  sat?: string[];
  sun?: string[];
}

export interface ApiImage {
  path: string;
  original: string;
  unique_id: string;
  thumbnail: string;
  small: string;
  medium: string;
  large: string;
}

export interface ApiFile {
  path: string;
  unique_id: string;
}

export interface ApiAnnouncement {
  id: number;
  fullname: string;
  age: string;
  experience: string;
  rate: number;
  gender: number;
  is_favorite: boolean;
  image: ApiImage | null;
  region: ApiRegion;
  city: ApiCity;
  subjects: ApiSubject[];
  subjectLevels?: ApiSubjectLevel[];
  min_price: number;
  max_price: number;
  formatsData: ApiFormatData[];
  description: string;
  schedule: ApiSchedule;
  file?: ApiFile[];
  phone?: string;
  email?: string;
  telegram?: string;
  created_at: string;
  updated_at: string;
}

export interface ApiPaginationLinks {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

export interface ApiPaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface ApiPaginatedResponse<T> {
  data: T[];
  links: ApiPaginationLinks;
  meta: ApiPaginationMeta;
}

export type ApiAnnouncementsResponse = ApiPaginatedResponse<ApiAnnouncement>;

// Subject from /api/subjects
export interface ApiSubjectFull {
  id: number;
  name: string;
  value: string;
  created_at: string;
  updated_at: string;
}

// Education Level response from /api/educationLevels
export interface ApiEducationLevel {
  label: string;
  name: string;
  value: number;
}

export interface ApiEducationLevelResponse {
  subject_id: number;
  subject_name: string;
  levels: ApiEducationLevel[];
}

// Subject level can come in two formats from the API
export interface ApiSubjectLevel {
  subject_id?: number;
  subject?: {
    id: number;
    name: string;
  };
  levels: (ApiEducationLevel | ApiLevelSimple)[];
}

// Simple level format (alternative structure)
export interface ApiLevelSimple {
  id: number;
  name: string;
}

// Language from /api/languages
export interface ApiLanguage {
  id: number;
  name: string;
  code: string;
  created_at: string;
  updated_at: string;
}

// Format from /api/formats
export interface ApiFormat {
  id: number;
  name: string;
  value: string;
  created_at: string;
  updated_at: string;
}

// Day from /api/days
export interface ApiDay {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

// Favorite from /api/favorites
// Note: This interface is kept for reference but not used
// The API actually returns announcements directly, not favorite wrapper objects
export interface ApiFavorite {
  id: number;
  user_id: number;
  announcement_id: number;
  announcement: ApiAnnouncement;
  created_at: string;
  updated_at: string;
}

// API /favorites returns array of announcements directly (with is_favorite: true)
export type ApiFavoritesResponse = ApiAnnouncement[];
