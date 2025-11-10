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

export function TutorCard({ tutor }: TutorCardProps) {
  const { t } = useTranslation();
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <Card className="overflow-hidden border rounded-xl bg-white shadow-none">
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
              <div className="flex items-center justify-center w-4 h-4 bg-blue-500 rounded-full">
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
      <div className="flex items-center justify-between px-4 py-3">
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
      <div className="px-4 space-y-2">
        {/* Rating */}
        <div className="flex items-center gap-1 text-sm">
          <span className="font-semibold">⭐ {tutor.rate.toFixed(1)}</span>
          {tutor.reviewCount && (
            <span className="text-gray-500">• {tutor.reviewCount} {t('tutorCard.reviews', 'reviews')}</span>
          )}
        </div>

        {/* Subjects and Bio */}
        <div className="text-sm">
          <span className="font-semibold">{tutor.fullname}</span>{' '}
          <span className="text-gray-900">
            {tutor.subjects.map(s => s.name).join(', ')}
          </span>
        </div>

        {/* Price */}
        <div className="text-sm font-semibold text-gray-900">
          {tutor.min_price === tutor.max_price ? (
            <span>{tutor.min_price.toLocaleString()} sum/{t('tutorCard.perHour', 'hour')}</span>
          ) : (
            <span>
              {tutor.min_price.toLocaleString()}-{tutor.max_price.toLocaleString()} sum/{t('tutorCard.perHour', 'hour')}
            </span>
          )}
        </div>

        {/* View Profile Link */}
        <Link
          to="/tutor/$id"
          params={{ id: tutor.id.toString() }}
          className="text-sm text-gray-500 hover:text-gray-700 hover:underline"
        >
          {t('tutorCard.viewProfile', 'View profile')}
        </Link>

        {/* Experience */}
        <div className="text-xs text-gray-400 uppercase">
          {tutor.experience} {t('tutorCard.yearsExperience', 'years experience')}
        </div>
      </div>
    </Card>
  );
}
