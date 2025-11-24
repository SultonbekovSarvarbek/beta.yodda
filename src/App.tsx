import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/Header';
import { SearchBar } from '@/components/SearchBar';
import { CategoryNav } from '@/components/CategoryNav';
import { CategorySection } from '@/components/CategorySection';
import { TutorCard } from '@/components/TutorCard';
import { MiniLessonCard } from '@/components/MiniLessonCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import { useAnnouncements } from '@/hooks/api';
import { getMiniLessons } from '@/services/api';
import type { Tutor } from '@/types/tutor';
import type { MiniLesson } from '@/types/api';

function App() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const { data: tutors, loading, error, refetch } = useAnnouncements();

  // Fetch mini lessons for home page
  const { data: miniLessonsData, isLoading: miniLessonsLoading, error: miniLessonsError } = useQuery({
    queryKey: ['home-mini-lessons'],
    queryFn: () => getMiniLessons({ per_page: 20 }),
  });

  const miniLessons = miniLessonsData?.data || [];

  // Debug: Log mini lessons count
  console.log('Mini lessons count:', miniLessons.length, miniLessons);
  console.log('Mini lessons loading:', miniLessonsLoading);
  console.log('Mini lessons error:', miniLessonsError);

  // Helper function to filter tutors by subject
  const getTutorsBySubject = (subjectName: string): Tutor[] => {
    return tutors.filter(tutor =>
      tutor.subjects.some(subject =>
        subject.name.toLowerCase().includes(subjectName.toLowerCase())
      )
    );
  };

  // Get popular tutors (highest rated)
  const popularTutors = useMemo(() => {
    return [...tutors]
      .sort((a, b) => b.rate - a.rate)
      .slice(0, 8);
  }, [tutors]);

  // Category-specific tutors
  const mathTutors = useMemo(() => getTutorsBySubject('Math'), [tutors]);
  const programmingTutors = useMemo(() => getTutorsBySubject('Programming'), [tutors]);
  const languageTutors = useMemo(() => {
    return tutors.filter(tutor =>
      tutor.subjects.some(subject =>
        ['English', 'Russian', 'French', 'Spanish', 'German', 'Chinese'].some(lang =>
          subject.name.toLowerCase().includes(lang.toLowerCase())
        )
      )
    );
  }, [tutors]);

  // Display tutors based on selected category
  const displayedTutors = useMemo(() => {
    if (selectedCategory === 'All') return tutors;
    return getTutorsBySubject(selectedCategory);
  }, [tutors, selectedCategory]);

  // Create mixed feed of tutors and mini lessons
  const mixedFeed = useMemo(() => {
    if (selectedCategory !== 'All') {
      // Only show tutors when filtering by category
      return displayedTutors.map((tutor) => ({ type: 'tutor' as const, data: tutor }));
    }

    // Mix tutors and mini lessons for 'All' view
    const feed: Array<{ type: 'tutor' | 'miniLesson'; data: Tutor | MiniLesson }> = [];
    let tutorIndex = 0;
    let lessonIndex = 0;

    // Alternate between tutors and mini lessons (2 tutors, then 1 mini lesson)
    while (tutorIndex < tutors.length || lessonIndex < miniLessons.length) {
      // Add 2 tutors
      for (let i = 0; i < 2 && tutorIndex < tutors.length; i++) {
        feed.push({ type: 'tutor', data: tutors[tutorIndex++] });
      }
      // Add 1 mini lesson
      if (lessonIndex < miniLessons.length) {
        feed.push({ type: 'miniLesson', data: miniLessons[lessonIndex++] });
      }
    }

    return feed;
  }, [tutors, miniLessons, displayedTutors, selectedCategory]);

  // Debug: Log mixed feed
  console.log('Mixed feed:', mixedFeed.length, 'items', mixedFeed);
  console.log('Tutors count:', tutors.length);

  // Loading state - don't wait for mini lessons to load
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <ErrorMessage message={error} onRetry={refetch} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <SearchBar />
      <CategoryNav onCategoryChange={setSelectedCategory} />

      <main>
        <section className="py-8">
          <div className="container mx-auto px-4">
            {selectedCategory !== 'All' && (
              <h2 className="text-2xl font-bold mb-6">{selectedCategory} Tutors</h2>
            )}
            {mixedFeed.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {mixedFeed.map((item, index) => (
                  <div key={`${item.type}-${item.data.id}-${index}`}>
                    {item.type === 'tutor' ? (
                      <TutorCard tutor={item.data as Tutor} />
                    ) : (
                      <MiniLessonCard lesson={item.data as MiniLesson} />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No content found.
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
