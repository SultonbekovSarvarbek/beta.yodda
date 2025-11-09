import { useQuery } from '@tanstack/react-query';
import { getAnnouncementById } from '@/services/api';
import type { ApiAnnouncement } from '@/types/api';
import { announcementKeys } from './useAnnouncements';

export function useAnnouncementById(id: number) {
  return useQuery<ApiAnnouncement>({
    queryKey: announcementKeys.detail(id),
    queryFn: () => getAnnouncementById(id),
    enabled: !!id,
  });
}
