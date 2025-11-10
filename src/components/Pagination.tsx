import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

export function Pagination({ currentPage, totalPages, onPageChange, loading = false }: PaginationProps) {
  const { t } = useTranslation();
  if (totalPages <= 1) return null;

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex items-center justify-center gap-4 py-8">
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrevious}
        disabled={currentPage === 1 || loading}
        className="gap-1"
      >
        <ChevronLeft className="w-4 h-4" />
        {t('pagination.previous')}
      </Button>

      <span className="text-sm text-muted-foreground">
        {t('pagination.pageOf', { current: currentPage, total: totalPages })}
      </span>

      <Button
        variant="outline"
        size="sm"
        onClick={handleNext}
        disabled={currentPage === totalPages || loading}
        className="gap-1"
      >
        {t('pagination.next')}
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
