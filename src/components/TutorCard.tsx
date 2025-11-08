import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Tutor } from '@/types/tutor';
import { cn } from '@/lib/utils';

interface TutorCardProps {
  tutor: Tutor;
}

export function TutorCard({ tutor }: TutorCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <Card className="overflow-hidden border-0 shadow-none group cursor-pointer">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden rounded-xl mb-3">
        <img
          src={tutor.image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop'}
          alt={tutor.fullname}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />

        {/* Favorite Button */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'absolute top-3 right-3 rounded-full bg-background/80 hover:bg-background backdrop-blur-sm',
            'h-8 w-8 transition-colors'
          )}
          onClick={(e) => {
            e.preventDefault();
            setIsFavorite(!isFavorite);
          }}
        >
          <svg
            className={cn(
              'h-5 w-5 transition-colors',
              isFavorite ? 'fill-red-500 stroke-red-500' : 'stroke-current fill-none'
            )}
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </Button>

        {/* Verified Badge */}
        {tutor.verified && (
          <Badge className="absolute top-3 left-3 bg-background/80 backdrop-blur-sm text-foreground border-0">
            ✓ Verified
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="space-y-1">
        {/* Location and Rating */}
        <div className="flex items-center justify-between">
          <span className="font-semibold text-sm truncate">{tutor.city.name}</span>
          <div className="flex items-center gap-1 text-sm">
            <svg
              className="h-4 w-4 fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
            <span className="font-medium">{tutor.rate.toFixed(2)}</span>
            {tutor.reviewCount && (
              <span className="text-muted-foreground">({tutor.reviewCount})</span>
            )}
          </div>
        </div>

        {/* Name */}
        <div className="text-sm text-muted-foreground truncate">{tutor.fullname}</div>

        {/* Subjects */}
        <div className="text-sm text-muted-foreground truncate">
          {tutor.subjects.slice(0, 2).map(s => s.name).join(', ')}
          {tutor.subjects.length > 2 && '...'}
        </div>

        {/* Price */}
        <div className="text-sm pt-1">
          {tutor.min_price === tutor.max_price ? (
            <>
              <span className="font-semibold">{tutor.min_price.toLocaleString()} sum</span>
              <span className="text-muted-foreground"> / hour</span>
            </>
          ) : (
            <>
              <span className="font-semibold">{tutor.min_price.toLocaleString()}-{tutor.max_price.toLocaleString()} sum</span>
              <span className="text-muted-foreground"> / hour</span>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
