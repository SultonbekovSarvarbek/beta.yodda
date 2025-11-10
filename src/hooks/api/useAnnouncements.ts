import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAnnouncements, type AnnouncementFilters } from '@/services/api';
import type { ApiAnnouncementsResponse, ApiAnnouncement } from '@/types/api';

export const announcementKeys = {
  all: ['announcements'] as const,
  lists: () => [...announcementKeys.all, 'list'] as const,
  list: (filters: AnnouncementFilters | undefined) => [...announcementKeys.lists(), filters] as const,
  details: () => [...announcementKeys.all, 'detail'] as const,
  detail: (id: number) => [...announcementKeys.details(), id] as const,
};

interface UseAnnouncementsResult {
  data: ApiAnnouncement[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  total: number;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  hasMore: boolean;
  refetch: () => void;
}

interface UseAnnouncementsOptions {
  filters?: Omit<AnnouncementFilters, 'page'>;
}

export function useAnnouncements(options?: UseAnnouncementsOptions): UseAnnouncementsResult {
  const [currentPage, setCurrentPage] = useState<number | undefined>(undefined);
  const filters = options?.filters;

  // Combine page with other filters
  const allFilters: AnnouncementFilters | undefined = filters || currentPage
    ? { ...filters, page: currentPage }
    : undefined;

  const {
    data,
    isLoading,
    error,
    refetch: queryRefetch,
  } = useQuery<ApiAnnouncementsResponse>({
    queryKey: announcementKeys.list(allFilters),
    queryFn: () => getAnnouncements(allFilters),
  });

  // Extract data from response
  const announcements = data?.data || [];
  const totalPages = data?.meta?.last_page || 1;
  const total = data?.meta?.total || 0;

  // Navigation functions
  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

  const nextPage = useCallback(() => {
    const current = currentPage || 1;
    if (current < totalPages) {
      setCurrentPage(current + 1);
    }
  }, [currentPage, totalPages]);

  const prevPage = useCallback(() => {
    const current = currentPage || 1;
    if (current > 1) {
      setCurrentPage(current - 1);
    }
  }, [currentPage]);

  const refetch = useCallback(() => {
    queryRefetch();
  }, [queryRefetch]);

  const hasMore = (currentPage || 1) < totalPages;

  return {
    data: announcements,
    loading: isLoading,
    error: error ? (error as Error).message : null,
    currentPage: currentPage || 1,
    totalPages,
    total,
    goToPage,
    nextPage,
    prevPage,
    hasMore,
    refetch,
  };
}
