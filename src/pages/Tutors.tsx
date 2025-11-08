import { useState, useMemo } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { MobileHeader } from '@/components/MobileHeader';
import { SuggestionsPanel } from '@/components/SuggestionsPanel';
import { BottomNavigation } from '@/components/BottomNavigation';
import { Footer } from '@/components/Footer';
import { TutorCard } from '@/components/TutorCard';
import { StoriesContainer } from '@/components/StoriesContainer';
import { TutorsFilters, type FilterValues } from '@/components/TutorsFilters';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { stories } from '@/data/stories';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import type { OptionType } from '@/components/ui/multi-select';

export function Tutors() {
  const {
    data: tutors,
    loading,
    error,
    currentPage,
    totalPages,
    total,
    goToPage,
    nextPage,
    prevPage,
    refetch,
  } = useAnnouncements();

  // Filter state
  const [filters, setFilters] = useState<FilterValues>({
    searchQuery: '',
    selectedSubjects: [],
    priceRange: [0, 500000],
    selectedCity: '',
  });

  // Extract unique subjects from tutors
  const availableSubjects: OptionType[] = useMemo(() => {
    const subjectsMap = new Map<string, string>();
    tutors.forEach((tutor) => {
      tutor.subjects.forEach((subject) => {
        subjectsMap.set(subject.id.toString(), subject.name);
      });
    });
    return Array.from(subjectsMap.entries()).map(([id, name]) => ({
      value: id,
      label: name,
    }));
  }, [tutors]);

  // Extract unique cities from tutors
  const availableCities: OptionType[] = useMemo(() => {
    const citiesMap = new Map<string, string>();
    tutors.forEach((tutor) => {
      citiesMap.set(tutor.city.id.toString(), tutor.city.name);
    });
    return Array.from(citiesMap.entries()).map(([id, name]) => ({
      value: id,
      label: name,
    }));
  }, [tutors]);

  // Calculate max price from tutors
  const maxPrice = useMemo(() => {
    if (tutors.length === 0) return 500000;
    const max = Math.max(...tutors.map((t) => t.max_price));
    return Math.ceil(max / 10000) * 10000; // Round up to nearest 10k
  }, [tutors]);

  // Update price range when maxPrice changes (first load)
  useMemo(() => {
    if (filters.priceRange[1] === 500000 && maxPrice !== 500000) {
      setFilters((prev) => ({
        ...prev,
        priceRange: [0, maxPrice],
      }));
    }
  }, [maxPrice, filters.priceRange]);

  // Filter tutors based on filters
  const filteredTutors = useMemo(() => {
    return tutors.filter((tutor) => {
      // Search filter
      if (
        filters.searchQuery &&
        !tutor.fullname.toLowerCase().includes(filters.searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Subject filter
      if (filters.selectedSubjects.length > 0) {
        const tutorSubjectIds = tutor.subjects.map((s) => s.id.toString());
        const hasMatchingSubject = filters.selectedSubjects.some((selectedId) =>
          tutorSubjectIds.includes(selectedId)
        );
        if (!hasMatchingSubject) return false;
      }

      // Price filter
      if (
        tutor.min_price > filters.priceRange[1] ||
        tutor.max_price < filters.priceRange[0]
      ) {
        return false;
      }

      // City filter
      if (filters.selectedCity && tutor.city.id.toString() !== filters.selectedCity) {
        return false;
      }

      return true;
    });
  }, [tutors, filters]);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const showPages = 5; // Max number of page buttons to show

    if (totalPages <= showPages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('ellipsis');
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('ellipsis');
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Mobile Header */}
      <MobileHeader />

      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 xl:mr-80 pb-16 lg:pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stories */}
          <div className="mb-6">
            <StoriesContainer stories={stories} />
          </div>

          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">All Tutors</h1>
            <p className="text-gray-600">
              {loading
                ? 'Loading tutors...'
                : `Showing ${filteredTutors.length} of ${total} tutors`}
            </p>
          </div>

          {/* Filters */}
          <TutorsFilters
            filters={filters}
            onFiltersChange={setFilters}
            availableSubjects={availableSubjects}
            availableCities={availableCities}
            maxPrice={maxPrice}
          />

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-gray-400 mb-4" />
              <p className="text-gray-600">Loading tutors...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={refetch} variant="outline">
                Try Again
              </Button>
            </div>
          )}

          {/* Tutors Grid */}
          {!loading && !error && (
            <>
              {filteredTutors.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-gray-600 text-lg mb-2">No tutors found</p>
                  <p className="text-gray-500 text-sm">
                    Try adjusting your filters to see more results
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
                  {filteredTutors.map((tutor) => (
                    <div key={tutor.id}>
                      <TutorCard tutor={tutor} />
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination className="mb-8">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) prevPage();
                        }}
                        className={
                          currentPage === 1
                            ? 'pointer-events-none opacity-50'
                            : 'cursor-pointer'
                        }
                      />
                    </PaginationItem>

                    {getPageNumbers().map((page, index) => (
                      <PaginationItem key={index}>
                        {page === 'ellipsis' ? (
                          <PaginationEllipsis />
                        ) : (
                          <PaginationLink
                            onClick={(e) => {
                              e.preventDefault();
                              goToPage(page);
                            }}
                            isActive={currentPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        )}
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages) nextPage();
                        }}
                        className={
                          currentPage === totalPages
                            ? 'pointer-events-none opacity-50'
                            : 'cursor-pointer'
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </div>
      </main>

      {/* Desktop Suggestions Panel */}
      <SuggestionsPanel />

      {/* Mobile Bottom Navigation */}
      <BottomNavigation />

      {/* Footer */}
      <Footer />
    </div>
  );
}
