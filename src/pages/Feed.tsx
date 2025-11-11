import { FeedContent } from '@/components/FeedContent';
import { useAnnouncements } from '@/hooks/api';
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
    <FeedContent
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
