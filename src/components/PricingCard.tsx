import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import type { FormatData } from '@/types/tutor';

interface PricingCardProps {
  format: FormatData;
  onBook?: () => void;
}

export function PricingCard({ format, onBook }: PricingCardProps) {
  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="space-y-4">
        {/* Format Name */}
        <div>
          <h3 className="font-semibold text-lg">{format.name}</h3>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold">{format.amount.toLocaleString()}</span>
          <span className="text-gray-500 text-sm">sum/lesson</span>
        </div>

        {/* Duration */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="h-4 w-4" />
          <span>{format.duration}</span>
        </div>

        {/* Book Button */}
        {onBook && (
          <Button onClick={onBook} className="w-full">
            Book Lesson
          </Button>
        )}
      </div>
    </Card>
  );
}
