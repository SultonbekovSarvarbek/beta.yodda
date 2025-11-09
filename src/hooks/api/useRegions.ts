import { useQuery } from '@tanstack/react-query';
import { getRegions } from '@/services/api';
import type { ApiRegionWithCities } from '@/types/api';

export const regionKeys = {
  all: ['regions'] as const,
};

export function useRegions() {
  return useQuery<ApiRegionWithCities[]>({
    queryKey: regionKeys.all,
    queryFn: getRegions,
  });
}
