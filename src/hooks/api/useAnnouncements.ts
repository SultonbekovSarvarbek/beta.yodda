import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAnnouncements } from '@/services/api';
import type { ApiAnnouncementsResponse, ApiAnnouncement } from '@/types/api';

export const announcementKeys = {
  all: ['announcements'] as const,
  lists: () => [...announcementKeys.all, 'list'] as const,
  list: (page: number | undefined) => [...announcementKeys.lists(), page || 1] as const,
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

export function useAnnouncements(): UseAnnouncementsResult {
  const [currentPage, setCurrentPage] = useState<number | undefined>(undefined);

  const {
    data,
    isLoading,
    error,
    refetch: queryRefetch,
  } = useQuery<ApiAnnouncementsResponse>({
    queryKey: announcementKeys.list(currentPage),
    queryFn: () => getAnnouncements(currentPage),
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
