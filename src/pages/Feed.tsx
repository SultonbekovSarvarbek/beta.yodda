import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
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
    <>
      <Helmet>
        <title>YODDAGRAM - Репетиторы и Мини-уроки | Найдите лучшего репетитора</title>
        <meta
          name="description"
          content="YODDAGRAM - платформа для поиска репетиторов по любому предмету. Просматривайте мини-уроки от опытных преподавателей и находите идеального репетитора для вас или вашего ребенка."
        />
        <meta name="keywords" content="репетиторы, мини-уроки, обучение, образование, преподаватели, онлайн обучение, Узбекистан" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:title" content="YODDAGRAM - Репетиторы и Мини-уроки" />
        <meta property="og:description" content="Найдите лучшего репетитора по любому предмету. Просматривайте мини-уроки от опытных преподавателей." />
        <meta property="og:site_name" content="YODDAGRAM" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={window.location.href} />
        <meta property="twitter:title" content="YODDAGRAM - Репетиторы и Мини-уроки" />
        <meta property="twitter:description" content="Найдите лучшего репетитора по любому предмету. Просматривайте мини-уроки от опытных преподавателей." />

        <link rel="canonical" href={window.location.href} />
      </Helmet>

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
    </>
  );
}
