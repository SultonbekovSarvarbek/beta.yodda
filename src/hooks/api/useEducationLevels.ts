import { useQuery } from '@tanstack/react-query';
import { getEducationLevels } from '@/services/api';
import type { ApiEducationLevelResponse } from '@/types/api';

export const educationLevelKeys = {
  all: ['educationLevels'] as const,
  forSubjects: (subjectIds: number[]) => [...educationLevelKeys.all, { subjectIds }] as const,
};

export function useEducationLevels(subjectIds: number[], enabled: boolean = true) {
  return useQuery<ApiEducationLevelResponse[]>({
    queryKey: educationLevelKeys.forSubjects(subjectIds),
    queryFn: ({ signal }) => getEducationLevels(subjectIds, signal),
    enabled: enabled && subjectIds.length > 0,
  });
}
