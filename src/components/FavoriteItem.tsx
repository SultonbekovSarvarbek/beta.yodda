import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { ApiAnnouncement } from '@/types/api';
import { Trash2, MapPin } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

interface FavoriteItemProps {
  announcement: ApiAnnouncement;
  onDelete: (announcementId: number) => void;
  isDeleting: boolean;
}

export function FavoriteItem({ announcement, onDelete, isDeleting }: FavoriteItemProps) {
  const { t } = useTranslation();

  return (
    <Card className="py-2">
      <CardContent className="p-4 border rounded-md">
        <div className="flex items-start gap-4">
          {/* Tutor Avatar */}
          <Link
            to="/tutor/$id"
            params={{ id: announcement.id.toString() }}
            className="shrink-0"
          >
            <Avatar className="w-16 h-16">
              <AvatarImage
                src={announcement.image?.thumbnail || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop'}
                alt={announcement.fullname}
              />
              <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                {announcement.fullname.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </AvatarFallback>
            </Avatar>
          </Link>

          {/* Tutor Info */}
          <div className="flex-1 min-w-0">
            {/* Name */}
            <Link
              to="/tutor/$id"
              params={{ id: announcement.id.toString() }}
              className="font-semibold text-lg hover:underline block mb-1"
            >
              {announcement.fullname}
            </Link>

            {/* Subject */}
            {announcement.subjects.length > 0 && (
              <div className="text-sm text-gray-600 mb-1">
                <span className="font-medium">{t('tutorCard.subject', 'Предмет:')}</span>{' '}
                {announcement.subjects.map(s => s.name).join(', ')}
              </div>
            )}

            {/* Location */}
            <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
              <MapPin className="w-4 h-4" />
              <span>{announcement.city.name}, {announcement.region.name}</span>
            </div>

            {/* Price */}
            <div className="text-sm font-semibold text-gray-900">
              {announcement.min_price === announcement.max_price ? (
                <span>{t('tutorCard.from', 'от')} {announcement.min_price.toLocaleString()} {t('tutorCard.currency', 'сум')}</span>
              ) : (
                <span>
                  {announcement.min_price.toLocaleString()}-{announcement.max_price.toLocaleString()} {t('tutorCard.currency', 'сум')}
                </span>
              )}
            </div>
          </div>

          {/* Delete Button */}
          <Button
            onClick={() => onDelete(announcement.id)}
            disabled={isDeleting}
            variant="ghost"
            size="icon"
            className="shrink-0 text-gray-400 hover:text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
