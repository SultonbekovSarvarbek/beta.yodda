import { FeedContent } from '@/components/FeedContent';
import { useAnnouncements } from '@/hooks/api';

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

  // Transform real tutor data to stories format (only tutors with images)
  const stories = announcements
    ?.filter((tutor) => tutor.image !== null)
    .slice(0, 8)
    .map((tutor, index) => ({
      id: `story-${tutor.id}`,
      tutorId: tutor.id.toString(),
      tutorName: tutor.fullname,
      tutorPhoto: tutor.image!.thumbnail,
      image: tutor.image!.medium,
      timestamp: Date.now() - (index * 3600000), // Stagger timestamps by 1 hour
      viewed: false
    })) || [];

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
