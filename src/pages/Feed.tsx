import { FeedLayout } from '@/components/FeedLayout';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { stories } from '@/data/stories';

export function Feed() {
  const {
    data: announcements,
    loading,
    error,
    currentPage,
    totalPages,
    goToPage,
    refetch,
  } = useAnnouncements();

  return (
    <FeedLayout
      stories={stories}
      announcements={announcements}
      loading={loading}
      error={error}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={goToPage}
      onRetry={refetch}
    />
  );
}
