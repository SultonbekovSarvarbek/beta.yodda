import { useQuery } from '@tanstack/react-query';
import { getDays } from '@/services/api';
import type { ApiDay } from '@/types/api';

export const dayKeys = {
  all: ['days'] as const,
};

export function useDays() {
  return useQuery<ApiDay[]>({
    queryKey: dayKeys.all,
    queryFn: getDays,
  });
}
