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

export interface ApiAnnouncement {
  id: number;
  fullname: string;
  age: string;
  experience: string;
  rate: number;
  gender: number;
  image: string | null;
  region: ApiRegion;
  city: ApiCity;
  subjects: ApiSubject[];
  min_price: number;
  max_price: number;
  formatsData: ApiFormatData[];
  description: string;
  schedule: ApiSchedule;
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
