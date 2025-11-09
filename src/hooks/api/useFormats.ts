import { useQuery } from '@tanstack/react-query';
import { getFormats } from '@/services/api';
import type { ApiFormat } from '@/types/api';

export const formatKeys = {
  all: ['formats'] as const,
};

export function useFormats() {
  return useQuery<ApiFormat[]>({
    queryKey: formatKeys.all,
    queryFn: getFormats,
  });
}
