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
  fetchMore: () => Promise<void>;
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

  const fetchData = useCallback(async (page: number, append: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      const response = await getAnnouncements(page);

      if (append) {
        setData((prev) => [...prev, ...response.data]);
      } else {
        setData(response.data);
      }

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

  // Fetch more (pagination)
  const fetchMore = useCallback(async () => {
    if (currentPage < totalPages && !loading) {
      await fetchData(currentPage + 1, true);
    }
  }, [currentPage, totalPages, loading, fetchData]);

  // Refetch from the beginning
  const refetch = useCallback(async () => {
    await fetchData(1, false);
  }, [fetchData]);

  const hasMore = currentPage < totalPages;

  return {
    data,
    loading,
    error,
    currentPage,
    totalPages,
    total,
    fetchMore,
    hasMore,
    refetch,
  };
}
