import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFavorites, toggleFavorite, deleteFavorite } from '@/services/api';
import type { ApiFavoritesResponse, ApiFavorite } from '@/types/api';

export const favoriteKeys = {
  all: ['favorites'] as const,
  lists: () => [...favoriteKeys.all, 'list'] as const,
};

interface UseFavoritesResult {
  favorites: ApiFavorite[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  toggleFavorite: (announcementId: number) => Promise<void>;
  deleteFavorite: (announcementId: number) => Promise<void>;
  isFavorited: (announcementId: number) => boolean;
  isToggling: boolean;
  isDeleting: boolean;
}

export function useFavorites(): UseFavoritesResult {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    error,
    refetch: queryRefetch,
  } = useQuery<ApiFavoritesResponse>({
    queryKey: favoriteKeys.lists(),
    queryFn: getFavorites,
  });

  const favorites = data?.data || [];

  // Toggle favorite mutation
  const toggleMutation = useMutation({
    mutationFn: toggleFavorite,
    onSuccess: () => {
      // Invalidate favorites query to refetch the list
      queryClient.invalidateQueries({ queryKey: favoriteKeys.lists() });
    },
  });

  // Delete favorite mutation
  const deleteMutation = useMutation({
    mutationFn: deleteFavorite,
    onSuccess: () => {
      // Invalidate favorites query to refetch the list
      queryClient.invalidateQueries({ queryKey: favoriteKeys.lists() });
    },
  });

  // Helper function to check if an announcement is favorited
  const isFavorited = (announcementId: number): boolean => {
    return favorites.some(fav => fav.announcement_id === announcementId);
  };

  const handleToggleFavorite = async (announcementId: number) => {
    await toggleMutation.mutateAsync(announcementId);
  };

  const handleDeleteFavorite = async (announcementId: number) => {
    await deleteMutation.mutateAsync(announcementId);
  };

  return {
    favorites,
    loading: isLoading,
    error: error ? (error as Error).message : null,
    refetch: queryRefetch,
    toggleFavorite: handleToggleFavorite,
    deleteFavorite: handleDeleteFavorite,
    isFavorited,
    isToggling: toggleMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
