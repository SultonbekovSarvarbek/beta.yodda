import type { ApiRegion, ApiCity, ApiFormatData, ApiSchedule, ApiImage, ApiFile } from './api';

// Subject interface matching API
export interface Subject {
  id: number;
  name: string;
}

// Region interface from API
export interface Region extends ApiRegion {}

// City interface from API
export interface City extends ApiCity {}

// Format data interface from API
export interface FormatData extends ApiFormatData {}

// Schedule interface from API
export interface Schedule extends ApiSchedule {}

// Tutor interface matching API announcement structure
export interface Tutor {
  id: number;
  fullname: string;
  age: string;
  experience: string;
  rate: number;
  gender: number; // 1 = male, 2 = female (presumably)
  image: ApiImage | null;
  region: Region;
  city: City;
  subjects: Subject[];
  min_price: number;
  max_price: number;
  formatsData: FormatData[];
  description: string;
  schedule: Schedule;
  file?: ApiFile[];
  created_at: string;
  updated_at: string;
  // Optional fields not in API (for backward compatibility)
  reviewCount?: number;
  languages?: string[];
  verified?: boolean;
  availability?: 'online' | 'in-person' | 'both';
}

// Legacy subject type for backward compatibility
export type LegacySubject =
  | 'Mathematics'
  | 'Physics'
  | 'Chemistry'
  | 'Biology'
  | 'English'
  | 'Spanish'
  | 'French'
  | 'German'
  | 'Chinese'
  | 'Programming'
  | 'Web Development'
  | 'Data Science'
  | 'Music'
  | 'Art'
  | 'History'
  | 'Geography'
  | 'Business'
  | 'Economics';

export type CategoryType = {
  name: string;
  icon: string;
  subjects: LegacySubject[];
};
