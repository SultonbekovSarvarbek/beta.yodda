import { useState, useEffect, useCallback } from 'react';
import { getAnnouncements, ApiError } from '@/services/api';
import type { ApiAnnouncement } from '@/types/api';

interface UseAnnouncementsResult {
  data: ApiAnnouncement[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  total: number;
  goToPage: (page: number) => Promise<void>;
  nextPage: () => Promise<void>;
  prevPage: () => Promise<void>;
  hasMore: boolean;
  refetch: () => Promise<void>;
}

export function useAnnouncements(): UseAnnouncementsResult {
  const [data, setData] = useState<ApiAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchData = useCallback(async (page: number) => {
    try {
      setLoading(true);
      setError(null);

      const response = await getAnnouncements(page);

      setData(response.data);
      setCurrentPage(response.meta.current_page);
      setTotalPages(response.meta.last_page);
      setTotal(response.meta.total);
    } catch (err) {
      const errorMessage =
        err instanceof ApiError
          ? err.message
          : 'Failed to load announcements. Please try again later.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchData(1);
  }, [fetchData]);

  // Go to specific page
  const goToPage = useCallback(async (page: number) => {
    if (page >= 1 && page <= totalPages && !loading) {
      await fetchData(page);
    }
  }, [totalPages, loading, fetchData]);

  // Next page
  const nextPage = useCallback(async () => {
    if (currentPage < totalPages && !loading) {
      await fetchData(currentPage + 1);
    }
  }, [currentPage, totalPages, loading, fetchData]);

  // Previous page
  const prevPage = useCallback(async () => {
    if (currentPage > 1 && !loading) {
      await fetchData(currentPage - 1);
    }
  }, [currentPage, loading, fetchData]);

  // Refetch current page
  const refetch = useCallback(async () => {
    await fetchData(currentPage);
  }, [currentPage, fetchData]);

  const hasMore = currentPage < totalPages;

  return {
    data,
    loading,
    error,
    currentPage,
    totalPages,
    total,
    goToPage,
    nextPage,
    prevPage,
    hasMore,
    refetch,
  };
}
