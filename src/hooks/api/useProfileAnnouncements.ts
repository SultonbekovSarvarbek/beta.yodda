import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProfileAnnouncements, deleteAnnouncement } from '@/services/api';
import type { ApiAnnouncement } from '@/types/api';
import { useAuth } from '@/hooks/useAuth';

export const profileAnnouncementKeys = {
  all: ['profileAnnouncements'] as const,
  lists: () => [...profileAnnouncementKeys.all, 'list'] as const,
};

interface UseProfileAnnouncementsResult {
  announcements: ApiAnnouncement[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  deleteAnnouncement: (announcementId: number) => Promise<void>;
  isDeleting: boolean;
}

export function useProfileAnnouncements(): UseProfileAnnouncementsResult {
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuth();

  // Only fetch announcements for authenticated tutors
  const isTutor = user?.role_id === 1;
  const shouldFetch = isAuthenticated && isTutor;

  const {
    data,
    isLoading,
    error,
    refetch: queryRefetch,
  } = useQuery<ApiAnnouncement[]>({
    queryKey: profileAnnouncementKeys.lists(),
    queryFn: getProfileAnnouncements,
    enabled: shouldFetch, // Only fetch when logged in as tutor
  });

  const announcements = data || [];

  // Delete announcement mutation
  const deleteMutation = useMutation({
    mutationFn: deleteAnnouncement,
    onSuccess: () => {
      // Invalidate profile announcements query to refetch the list
      queryClient.invalidateQueries({ queryKey: profileAnnouncementKeys.lists() });
    },
  });

  const handleDeleteAnnouncement = async (announcementId: number) => {
    await deleteMutation.mutateAsync(announcementId);
  };

  return {
    announcements,
    loading: isLoading,
    error: error ? (error as Error).message : null,
    refetch: queryRefetch,
    deleteAnnouncement: handleDeleteAnnouncement,
    isDeleting: deleteMutation.isPending,
  };
}
