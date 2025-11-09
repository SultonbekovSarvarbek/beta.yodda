import { useState, useEffect } from 'react';
import { getAnnouncementById, ApiError } from '@/services/api';
import type { ApiAnnouncement } from '@/types/api';

interface UseTutorByIdResult {
  data: ApiAnnouncement | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useTutorById(id: string): UseTutorByIdResult {
  const [data, setData] = useState<ApiAnnouncement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const tutor = await getAnnouncementById(parseInt(id));
      setData(tutor);
    } catch (err) {
      const errorMessage =
        err instanceof ApiError
          ? err.message
          : 'Failed to load tutor details. Please try again later.';
      setError(errorMessage);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}
