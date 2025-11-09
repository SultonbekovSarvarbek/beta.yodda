import { useQuery } from '@tanstack/react-query';
import { getSubjects } from '@/services/api';
import type { ApiSubjectFull } from '@/types/api';

export const subjectKeys = {
  all: ['subjects'] as const,
};

export function useSubjects() {
  return useQuery<ApiSubjectFull[]>({
    queryKey: subjectKeys.all,
    queryFn: getSubjects,
  });
}
