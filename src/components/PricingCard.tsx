import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import type { FormatData } from '@/types/tutor';
import { useTranslation } from 'react-i18next';

interface PricingCardProps {
  format: FormatData;
  onBook?: () => void;
}

export function PricingCard({ format, onBook }: PricingCardProps) {
  const { t } = useTranslation();

  return (
    <Card className="p-5 border border-gray-200 hover:border-blue-300 transition-colors bg-white shadow-none">
      <div className="space-y-4">
        {/* Format Name */}
        <div>
          <h3 className="font-semibold text-xl text-gray-900">{format.name}</h3>
        </div>

        {/* Price */}
        <div className="space-y-0.5">
          <div className="text-4xl font-bold text-gray-900">{format.amount.toLocaleString()}</div>
          <div className="text-sm text-gray-500">{t('pricingCard.sumPerLesson')}</div>
        </div>

        {/* Duration */}
        <div className="flex items-center gap-1.5 text-sm text-gray-600">
          <Clock className="h-4 w-4" />
          <span>{format.duration} {t('pricingCard.minutes')}</span>
        </div>

        {/* Book Button */}
        {onBook && (
          <Button onClick={onBook} className="w-full">
            {t('pricingCard.bookLesson')}
          </Button>
        )}
      </div>
    </Card>
  );
}
