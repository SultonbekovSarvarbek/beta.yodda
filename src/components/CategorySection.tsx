import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { TutorCard } from '@/components/TutorCard';
import type { Tutor } from '@/types/tutor';
import { cn } from '@/lib/utils';

interface CategorySectionProps {
  title: string;
  tutors: Tutor[];
}

export function CategorySection({ title, tutors }: CategorySectionProps) {
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;

    const scrollAmount = 400;
    const newScrollLeft =
      scrollContainerRef.current.scrollLeft +
      (direction === 'left' ? -scrollAmount : scrollAmount);

    scrollContainerRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth',
    });
  };

  if (tutors.length === 0) return null;

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{title}</h2>
          <Button variant="link" className="text-sm font-semibold">
            Show all
            <svg
              className="h-4 w-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Button>
        </div>

        {/* Tutors Grid with Horizontal Scroll */}
        <div className="relative group">
          {/* Left Arrow */}
          {showLeftArrow && (
            <Button
              variant="outline"
              size="icon"
              className={cn(
                'absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full',
                'bg-background shadow-lg hover:scale-110 transition-transform',
                'opacity-0 group-hover:opacity-100'
              )}
              onClick={() => scroll('left')}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Button>
          )}

          {/* Right Arrow */}
          {showRightArrow && (
            <Button
              variant="outline"
              size="icon"
              className={cn(
                'absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full',
                'bg-background shadow-lg hover:scale-110 transition-transform',
                'opacity-0 group-hover:opacity-100'
              )}
              onClick={() => scroll('right')}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Button>
          )}

          {/* Scrollable Container */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
          >
            {tutors.map((tutor) => (
              <div key={tutor.id} className="flex-none w-72">
                <TutorCard tutor={tutor} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
