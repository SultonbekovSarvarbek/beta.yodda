import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { SearchBar } from '@/components/SearchBar';
import { CategoryNav } from '@/components/CategoryNav';
import { CategorySection } from '@/components/CategorySection';
import { TutorCard } from '@/components/TutorCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import type { Tutor } from '@/types/tutor';

function App() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const { data: tutors, loading, error, refetch } = useAnnouncements();

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

  // Loading state
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
        {selectedCategory === 'All' ? (
          <>
            <CategorySection title="Popular tutors" tutors={popularTutors} />
            {mathTutors.length > 0 && (
              <CategorySection title="Mathematics tutors" tutors={mathTutors} />
            )}
            {programmingTutors.length > 0 && (
              <CategorySection title="Programming tutors" tutors={programmingTutors} />
            )}
            {languageTutors.length > 0 && (
              <CategorySection title="Language tutors" tutors={languageTutors} />
            )}
          </>
        ) : (
          <section className="py-8">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold mb-6">{selectedCategory} Tutors</h2>
              {displayedTutors.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {displayedTutors.map((tutor) => (
                    <div key={tutor.id}>
                      <TutorCard tutor={tutor} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  No tutors found for this category.
                </div>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
