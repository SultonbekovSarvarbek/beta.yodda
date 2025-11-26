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
  profile_id?: number; // User's profile ID who created this announcement
  user_id?: number; // Alternative field name for profile_id
  image: ApiImage | null;
  region: ApiRegion;
  city: ApiCity;
  subjects: ApiSubject[];
  subjectLevels?: ApiSubjectLevel[];
  min_price: number;
  max_price: number;
  amount?: number;
  formatsData: ApiFormatData[];
  description: string;
  aboutme?: string;
  education?: string;
  mba?: string;
  telegramUsername?: string;
  schedule: ApiSchedule;
  file?: ApiFile[];
  phone?: string;
  email?: string;
  telegram?: string;
  languages?: ApiLanguage[];
  days?: ApiDay[];
  formats?: ApiFormat[];
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

// Mini Lesson from /api/mini-lessons
export interface MiniLessonMedia {
  original: string;
  versions: {
    '1080p': string;
    '720p': string;
    '480p': string;
  };
  thumbnail: string;
  duration: number;
  resolution: string;
  aspect_ratio: string;
  unique_id: string;
}

export interface MiniLessonTutor {
  id: number;
  profile_id: number;
  fullname: string;
  phone?: string;
  email?: string;
  telegram_username?: string | null;
  image?: ApiImage | string | null; // Can be ApiImage object or string URL
}

export interface MiniLesson {
  id: number;
  announcement_id: number;
  user_id: number;
  title: string;
  description: string;
  media: string | MiniLessonMedia; // String URL in list, Object in detail
  media_type: 'photo' | 'video';
  processing_status?: string;
  processed_at?: string;
  subject?: ApiSubject; // Legacy single subject (deprecated)
  subjects?: ApiSubject[]; // New multiple subjects array
  tutor: MiniLessonTutor;
  views_count: number;
  is_active?: boolean;
  created_at: string;
  updated_at?: string;
}

export interface MiniLessonsPagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface MiniLessonsResponse {
  status: string;
  data: MiniLesson[];
  pagination?: MiniLessonsPagination;
}

export interface MiniLessonDetailResponse {
  status: string;
  data: MiniLesson;
}

// Feedback from /api/feedbacks
export interface ApiFeedback {
  id: number;
  profile_id: number;
  images: ApiImage[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApiFeedbackResponse {
  message: string;
  data: ApiFeedback;
}

export interface ApiFeedbacksListResponse {
  data: ApiFeedback[];
}
