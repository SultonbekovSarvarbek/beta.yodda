import { StoriesContainer } from './StoriesContainer';
import { TutorCard } from './TutorCard';
import { MiniLessonCard } from './MiniLessonCard';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { Pagination } from './Pagination';
import type { Story } from '@/types/social';
import type { ApiAnnouncement, MiniLesson } from '@/types/api';

interface FeedContentProps {
  stories: Story[];
  feedItems: Array<{ type: 'tutor' | 'miniLesson'; data: ApiAnnouncement | MiniLesson }>;
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onRetry: () => void;
}

export function FeedContent({
  stories,
  feedItems,
  loading,
  error,
  currentPage,
  totalPages,
  onPageChange,
  onRetry,
}: FeedContentProps) {
  const handlePageChange = (page: number) => {
    onPageChange(page);
    // Scroll to top of feed
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-[470px] mx-auto pt-0 lg:pt-8 px-0 lg:px-0">
      {/* Stories */}
      <StoriesContainer stories={stories} />

      {/* Loading State */}
      {loading && (
        <div className="py-12">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="py-8">
          <ErrorMessage message={error} onRetry={onRetry} />
        </div>
      )}

      {/* Feed Items (Tutors and Mini Lessons) */}
      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 gap-6">
            {feedItems.map((item, index) => (
              <div key={`${item.type}-${item.data.id}-${index}`}>
                {item.type === 'tutor' ? (
                  <TutorCard tutor={item.data as ApiAnnouncement} />
                ) : (
                  <MiniLessonCard lesson={item.data as MiniLesson} />
                )}
              </div>
            ))}
          </div>

          {feedItems.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No content found.
            </div>
          )}

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            loading={loading}
          />
        </>
      )}
    </div>
  );
}
