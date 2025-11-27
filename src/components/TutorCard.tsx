import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { Tutor } from '@/types/tutor';
import type { ApiAnnouncement } from '@/types/api';
import { Check, Heart, MessageCircle, Send, MoreHorizontal, Star } from 'lucide-react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { useFavorites } from '@/hooks/api/useFavorites';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface TutorCardProps {
  tutor: Tutor | ApiAnnouncement;
}

// Helper function to get correct Russian plural form for years
function getYearsWord(num: number | string): 'one' | 'few' | 'many' {
  const n = typeof num === 'string' ? parseInt(num, 10) : num;
  const lastDigit = n % 10;
  const lastTwoDigits = n % 100;

  // Special case for 11-14 (always "лет")
  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return 'many';
  }

  // 1, 21, 31, 41... → "год"
  if (lastDigit === 1) {
    return 'one';
  }

  // 2-4, 22-24, 32-34... → "года"
  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'few';
  }

  // 5-20, 25-30... → "лет"
  return 'many';
}

export function TutorCard({ tutor }: TutorCardProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isFavorited, toggleFavorite: toggleFavoriteApi, isToggling } = useFavorites();
  const isFavorite = isFavorited(tutor.id);

  const handleToggleFavorite = async () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      toast.warning(t('favorites.loginRequired', 'Вам нужно войти или зарегистрироваться'));
      navigate({ to: '/login' });
      return;
    }

    try {
      await toggleFavoriteApi(tutor.id);

      // Show success notification
      if (isFavorite) {
        toast.success(t('favorites.removedSuccess', 'Removed from favorites'));
      } else {
        toast.success(t('favorites.addedSuccess', 'Added to favorites'));
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      toast.error(t('favorites.error', 'Failed to update favorites. Please try again.'));
    }
  };

  const handleShareTutor = async () => {
    try {
      // Construct the full URL to the tutor's profile
      const tutorUrl = `${window.location.origin}/tutor/${tutor.id}`;

      // Copy to clipboard
      await navigator.clipboard.writeText(tutorUrl);

      // Show success notification
      toast.success(t('tutorProfile.share.linkCopied', 'Ссылка на профиль скопирована!'));
    } catch (error) {
      console.error('Failed to copy link:', error);
      toast.error(t('favorites.error', 'Failed to copy link. Please try again.'));
    }
  };

  return (
    <Card className="overflow-hidden sm:rounded-none md:rounded-md lg:rounded-lg xl:rounded-xl bg-white shadow-none sm:border-0 md:border lg:border xl:border">
      {/* Header - Instagram Post Header Style */}
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Link
            to="/tutor/$id"
            params={{ id: tutor.id.toString() }}
            className="cursor-pointer"
          >
            <Avatar className="w-10 h-10">
              <AvatarImage
                src={tutor.image?.thumbnail}
                alt={tutor.fullname}
              />
              <AvatarFallback className="text-sm font-semibold bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                {tutor.fullname.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </AvatarFallback>
            </Avatar>
          </Link>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <Link
                to="/tutor/$id"
                params={{ id: tutor.id.toString() }}
                className="font-semibold text-sm hover:underline cursor-pointer"
              >
                {tutor.fullname}
              </Link>
              <div className="flex items-center justify-center w-4 h-4 bg-blue-500 rounded-full shrink-0">
                <Check className="w-2.5 h-2.5 text-white" strokeWidth={4} />
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              {tutor.subjects.length > 0 && (
                <span>{tutor.subjects[0].name}</span>
              )}
              {tutor.subjects.length > 0 && (
                <span>•</span>
              )}
              <span>{tutor.city.name}</span>
            </div>
          </div>
        </div>

        {/* <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="w-5 h-5" />
        </Button> */}
      </div>

      {/* Main Image - Square */}
      <div className="relative aspect-square bg-gray-100">
        {tutor.image?.large ? (
          <img
            src={tutor.image.large}
            alt={tutor.fullname}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500">
            <span className="text-8xl font-bold text-white">
              {tutor.fullname.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons - Instagram Style */}
      <div className="flex items-center justify-between px-4 py-3 pt-0">
        <div className="flex items-center gap-4">
          <button
            onClick={handleToggleFavorite}
            disabled={isToggling}
            className="transition-transform hover:scale-110 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Heart
              className={`w-6 h-6 ${
                isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-900'
              }`}
            />
          </button>
          <button className="transition-transform hover:scale-110 active:scale-95 cursor-pointer">
            <MessageCircle className="w-6 h-6 text-gray-900" />
          </button>
          <button
            onClick={handleShareTutor}
            className="transition-transform hover:scale-110 active:scale-95 cursor-pointer"
          >
            <Send className="w-6 h-6 text-gray-900" />
          </button>
        </div>

        {/* <button
          onClick={handleToggleFavorite}
          disabled={isToggling}
          className="transition-transform hover:scale-110 active:scale-95 disabled:opacity-50"
        >
          <Bookmark
            className={`w-6 h-6 ${
              isFavorite ? 'fill-gray-900 text-gray-900' : 'text-gray-900'
            }`}
          />
        </button> */}
      </div>

      {/* Content Section */}
      <div className="px-4 pb-3 space-y-2">
        {/* Rating */}
        <div className="flex items-center gap-1 text-sm">
          <span className="flex items-center gap-1 font-semibold">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            {tutor.rate.toFixed(1)}
          </span>
          {'reviewCount' in tutor && tutor.reviewCount && (
            <span className="text-gray-500">• {tutor.reviewCount} {t('tutorCard.reviews', 'reviews')}</span>
          )}
        </div>

        {/* Tutor Name */}
        <div className="text-sm">
          <span className="font-semibold">{tutor.fullname}</span>
        </div>

        {/* Subject and Price Row */}
        <div className="flex items-center flex-wrap gap-3 justify-between text-sm">
          {/* Subject with Label */}
          {tutor.subjects.length > 0 && (
            <div className="text-gray-700">
              <span className="font-semibold text-black">{t('tutorCard.subject', 'Предмет:')}</span>{' '}
              <span>{tutor.subjects[0].name}</span>
            </div>
          )}

          {/* Price */}
          <div className="font-bold text-white">
            {tutor.min_price === tutor.max_price ? (
              <span className="bg-green-600 p-1 px-2 d-block rounded-full">{tutor.min_price.toLocaleString()} сум</span>
            ) : (
              <span>
                {tutor.min_price.toLocaleString()}-{tutor.max_price.toLocaleString()} сум
              </span>
            )}
          </div>
        </div>

        {/* Description - Truncated to 2 lines */}
        {tutor.description && (
          <div className="text-sm text-gray-600 line-clamp-2">
            {tutor.description}
          </div>
        )}

        {/* Experience */}
        <div className="text-sm text-gray-700">
          <span className="font-medium text-black font-semibold">{t('tutorCard.workExperience', 'Опыт работы:')}</span>{' '}
          <span>{tutor.experience} {t(`tutorCard.yearsExperience_${getYearsWord(tutor.experience)}`, 'лет')}</span>
        </div>

        {/* View Profile Link */}
        <Link
          to="/tutor/$id"
          params={{ id: tutor.id.toString() }}
          className="text-sm text-blue-600 hover:text-blue-700 hover:underline inline-block"
        >
          {t('tutorCard.viewProfile', 'Смотреть профиль')}
        </Link>
      </div>
    </Card>
  );
}
