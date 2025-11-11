import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { Tutor } from '@/types/tutor';
import { Check, Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

interface TutorCardProps {
  tutor: Tutor;
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
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <Card className="overflow-hidden sm:rounded-none md:rounded-md lg:rounded-lg xl:rounded-xl bg-white shadow-none sm:border-0 md:border lg:border xl:border">
      {/* Header - Instagram Post Header Style */}
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage
              src={tutor.image?.thumbnail || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop'}
              alt={tutor.fullname}
            />
            <AvatarFallback className="text-sm font-semibold bg-gradient-to-br from-purple-500 to-pink-500 text-white">
              {tutor.fullname.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
            </AvatarFallback>
          </Avatar>

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

        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="w-5 h-5" />
        </Button>
      </div>

      {/* Main Image - Square */}
      <div className="relative aspect-square bg-gray-100">
        <img
          src={tutor.image?.medium || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=800&fit=crop'}
          alt={tutor.fullname}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Action Buttons - Instagram Style */}
      <div className="flex items-center justify-between px-4 py-3 pt-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setLiked(!liked)}
            className="transition-transform hover:scale-110 active:scale-95"
          >
            <Heart
              className={`w-6 h-6 ${
                liked ? 'fill-red-500 text-red-500' : 'text-gray-900'
              }`}
            />
          </button>
          <button className="transition-transform hover:scale-110 active:scale-95">
            <MessageCircle className="w-6 h-6 text-gray-900" />
          </button>
          <button className="transition-transform hover:scale-110 active:scale-95">
            <Send className="w-6 h-6 text-gray-900" />
          </button>
        </div>

        <button
          onClick={() => setSaved(!saved)}
          className="transition-transform hover:scale-110 active:scale-95"
        >
          <Bookmark
            className={`w-6 h-6 ${
              saved ? 'fill-gray-900 text-gray-900' : 'text-gray-900'
            }`}
          />
        </button>
      </div>

      {/* Content Section */}
      <div className="px-4 pb-3 space-y-2">
        {/* Rating */}
        <div className="flex items-center gap-1 text-sm">
          <span className="font-semibold">⭐ {tutor.rate.toFixed(1)}</span>
          {tutor.reviewCount && (
            <span className="text-gray-500">• {tutor.reviewCount} {t('tutorCard.reviews', 'reviews')}</span>
          )}
        </div>

        {/* Tutor Name */}
        <div className="text-sm">
          <span className="font-semibold">{tutor.fullname}</span>
        </div>

        {/* Subject and Price Row */}
        <div className="flex items-center justify-between text-sm">
          {/* Subject with Label */}
          {tutor.subjects.length > 0 && (
            <div className="text-gray-700">
              <span className="font-semibold text-black">{t('tutorCard.subject', 'Предмет:')}</span>{' '}
              <span>{tutor.subjects[0].name}</span>
            </div>
          )}

          {/* Price */}
          <div className="font-semibold text-gray-900">
            {tutor.min_price === tutor.max_price ? (
              <span className="bg-gray-300 p-1 px-2 d-block rounded-full">от {tutor.min_price.toLocaleString()} сум</span>
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
