import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FeedContent } from '@/components/FeedContent';
import { useAnnouncements } from '@/hooks/api';
import { getMiniLessons } from '@/services/api';
import type { MiniLesson, ApiAnnouncement } from '@/types/api';

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

  // Fetch mini lessons for feed
  const { data: miniLessonsData } = useQuery({
    queryKey: ['feed-mini-lessons'],
    queryFn: () => getMiniLessons({ per_page: 20 }),
  });

  const miniLessons = miniLessonsData?.data || [];

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

  // Create mixed feed of tutors and mini lessons
  const mixedFeed = useMemo(() => {
    const feed: Array<{ type: 'tutor' | 'miniLesson'; data: ApiAnnouncement | MiniLesson }> = [];
    let tutorIndex = 0;
    let lessonIndex = 0;

    // Alternate between tutors and mini lessons (2 tutors, then 1 mini lesson)
    while (tutorIndex < announcements.length || lessonIndex < miniLessons.length) {
      // Add 2 tutors
      for (let i = 0; i < 2 && tutorIndex < announcements.length; i++) {
        feed.push({ type: 'tutor', data: announcements[tutorIndex++] });
      }
      // Add 1 mini lesson
      if (lessonIndex < miniLessons.length) {
        feed.push({ type: 'miniLesson', data: miniLessons[lessonIndex++] });
      }
    }

    return feed;
  }, [announcements, miniLessons]);

  return (
    <FeedContent
      stories={stories}
      feedItems={mixedFeed}
      loading={loading}
      error={error}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={goToPage}
      onRetry={refetch}
    />
  );
}
