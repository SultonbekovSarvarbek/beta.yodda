import { useQuery } from '@tanstack/react-query';
import { getLanguages } from '@/services/api';
import type { ApiLanguage } from '@/types/api';

export const languageKeys = {
  all: ['languages'] as const,
};

export function useLanguages() {
  return useQuery<ApiLanguage[]>({
    queryKey: languageKeys.all,
    queryFn: getLanguages,
  });
}
