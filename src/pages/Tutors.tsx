import { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { Helmet } from 'react-helmet-async';
import { TutorCard } from '@/components/TutorCard';
import { StoriesContainer } from '@/components/StoriesContainer';
import { TutorsFilters, type FilterValues } from '@/components/TutorsFilters';
import { useAnnouncements, useSubjects, useRegions, useLanguages } from '@/hooks/api';
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
import { useTranslation } from 'react-i18next';

export function Tutors() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const searchParams = useSearch({ from: '/tutors' }) as { page?: number };

  // Filter state
  const [filters, setFilters] = useState<FilterValues>({
    searchQuery: '',
    selectedSubjects: [],
    selectedLanguages: [],
    selectedGender: undefined,
    selectedRegion: undefined,
    selectedCity: undefined,
    priceRange: [50000, 1200000],
  });

  // Fetch filter data from APIs
  const { data: subjectsData, isLoading: isLoadingSubjects } = useSubjects();
  const { data: regionsData, isLoading: isLoadingRegions } = useRegions();
  const { data: languagesData, isLoading: isLoadingLanguages } = useLanguages();

  // Convert API data to OptionType format
  const subjects: OptionType[] = useMemo(() => {
    if (!subjectsData) return [];
    return subjectsData.map((subject) => ({
      value: subject.id.toString(),
      label: subject.name,
    }));
  }, [subjectsData]);

  const languages: OptionType[] = useMemo(() => {
    if (!languagesData) return [];
    return languagesData.map((language) => ({
      value: language.id.toString(),
      label: language.name,
    }));
  }, [languagesData]);

  const regions: OptionType[] = useMemo(() => {
    if (!regionsData) return [];
    return regionsData.map((region) => ({
      value: region.id.toString(),
      label: region.name,
    }));
  }, [regionsData]);

  const cities: OptionType[] = useMemo(() => {
    if (!regionsData || !filters.selectedRegion) return [];
    const selectedRegion = regionsData.find((r) => r.id === filters.selectedRegion);
    if (!selectedRegion) return [];
    return selectedRegion.cities.map((city) => ({
      value: city.id.toString(),
      label: city.name,
    }));
  }, [regionsData, filters.selectedRegion]);

  // Build API filters from state
  const apiFilters = useMemo(() => {
    return {
      search: filters.searchQuery || undefined,
      subjects: filters.selectedSubjects.length > 0 ? filters.selectedSubjects : undefined,
      languages: filters.selectedLanguages.length > 0 ? filters.selectedLanguages : undefined,
      gender: filters.selectedGender,
      region_id: filters.selectedRegion,
      city_id: filters.selectedCity,
      min_amount: filters.priceRange[0],
      max_amount: filters.priceRange[1],
    };
  }, [filters]);

  // Fetch tutors with server-side filtering
  const {
    data: tutors,
    loading,
    error,
    currentPage,
    totalPages,
    total,
    goToPage: goToPageInternal,
    nextPage: nextPageInternal,
    prevPage: prevPageInternal,
    refetch,
  } = useAnnouncements({ filters: apiFilters });

  // Sync URL page param with hook's internal page on mount
  useEffect(() => {
    const urlPage = searchParams.page;
    if (urlPage && urlPage !== currentPage) {
      goToPageInternal(urlPage);
    }
  }, []); // Only run on mount

  // Wrapper functions that update URL
  const goToPage = useCallback((page: number) => {
    goToPageInternal(page);
    navigate({ search: { page } });
  }, [goToPageInternal, navigate]);

  const nextPage = useCallback(() => {
    const nextPageNum = currentPage + 1;
    nextPageInternal();
    navigate({ search: { page: nextPageNum } });
  }, [currentPage, nextPageInternal, navigate]);

  const prevPage = useCallback(() => {
    const prevPageNum = currentPage - 1;
    prevPageInternal();
    navigate({ search: { page: prevPageNum } });
  }, [currentPage, prevPageInternal, navigate]);

  const isLoadingFilters = isLoadingSubjects || isLoadingRegions || isLoadingLanguages;
  const maxPrice = 1200000; // Fixed max price

  // Transform real tutor data to stories format (only tutors with images)
  const stories = tutors
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
    <>
      <Helmet>
        <title>Все репетиторы - YODDAGRAM | Найдите репетитора онлайн</title>
        <meta
          name="description"
          content="Найдите репетитора по математике, английскому, физике и другим предметам. Более 1000 проверенных репетиторов в Узбекистане. Онлайн и офлайн занятия."
        />
        <meta name="keywords" content="репетиторы Узбекистан, найти репетитора, онлайн репетиторы, репетиторы по математике, репетиторы по английскому" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:title" content="Все репетиторы - YODDAGRAM" />
        <meta property="og:description" content="Найдите репетитора по математике, английскому, физике и другим предметам. Более 1000 проверенных репетиторов." />
        <meta property="og:site_name" content="YODDAGRAM" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="Все репетиторы - YODDAGRAM" />
        <meta property="twitter:description" content="Найдите репетитора по математике, английскому, физике и другим предметам." />

        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Stories */}
            <div className="mb-6">
              <StoriesContainer stories={stories} />
            </div>

          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('tutors.title')}</h1>
            <p className="text-gray-600">
              {loading
                ? t('tutors.loading')
                : t('tutors.showing', { count: tutors.length, total })}
            </p>
          </div>

          {/* Filters */}
          <TutorsFilters
            filters={filters}
            onFiltersChange={setFilters}
            subjects={subjects}
            languages={languages}
            regions={regions}
            cities={cities}
            maxPrice={maxPrice}
            isLoadingFilters={isLoadingFilters}
          />

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-gray-400 mb-4" />
              <p className="text-gray-600">{t('tutors.loading')}</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={refetch} variant="outline">
                {t('common.tryAgain')}
              </Button>
            </div>
          )}

          {/* Tutors Grid */}
          {!loading && !error && (
            <>
              {tutors.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-gray-600 text-lg mb-2">{t('tutors.noTutorsFound')}</p>
                  <p className="text-gray-500 text-sm">
                    {t('tutors.adjustFilters')}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
                  {tutors.map((tutor) => (
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
                        label={t('pagination.previous')}
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
                        label={t('pagination.next')}
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
    </>
  );
}
