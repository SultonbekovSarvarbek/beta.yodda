import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Loader2, Eye, Clock, ChevronUp, ChevronDown, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from '@tanstack/react-router';
import { getMiniLessonById } from '@/services/api';
import type { MiniLesson } from '@/types/api';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { InstagramVideoPlayer } from '@/components/InstagramVideoPlayer';

interface MiniLessonCardProps {
  lesson: MiniLesson;
}

export function MiniLessonCard({ lesson }: MiniLessonCardProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOverlayExpanded, setIsOverlayExpanded] = useState(false);

  // Fetch full lesson details when modal opens
  const { data: selectedLessonData, isLoading: isLoadingLesson } = useQuery({
    queryKey: ['mini-lesson', lesson.id],
    queryFn: () => getMiniLessonById(lesson.id),
    enabled: isModalOpen,
  });

  const selectedLesson = selectedLessonData?.data || null;

  // In list endpoint, media is a string URL (thumbnail)
  const thumbnailUrl = lesson.media
    ? (typeof lesson.media === 'string' ? lesson.media : lesson.media.thumbnail)
    : null;
  const isVideo = lesson.media_type === 'video';
  const isProcessing = lesson.processing_status === 'processing';

  const handleTutorClick = (tutorId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate({
      to: '/tutor/$id',
      params: { id: tutorId.toString() }
    });
  };

  const handleCardClick = () => {
    if (!isProcessing) {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <Card
        className={`overflow-hidden sm:rounded-none md:rounded-md lg:rounded-lg xl:rounded-xl bg-white shadow-none sm:border-0 md:border lg:border xl:border ${isProcessing ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}`}
        onClick={handleCardClick}
      >
        {/* Header - Instagram Post Header Style */}
        <div className="flex items-center justify-between px-4">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={(e) => handleTutorClick(lesson.tutor.id, e)}
          >
            <Avatar className="w-10 h-10">
              <AvatarImage
                src={typeof lesson.tutor.image === 'string' ? lesson.tutor.image : lesson.tutor.image?.small}
                alt={lesson.tutor.fullname}
              />
              <AvatarFallback className="text-sm font-semibold bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                {lesson.tutor.fullname.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm hover:underline">
                  {lesson.tutor.fullname}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                {lesson.subject && (
                  <span>{lesson.subject.name}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Video/Image - Square aspect ratio like Instagram */}
        <div className="relative aspect-square bg-gray-100">
          {thumbnailUrl && (
            <img
              src={thumbnailUrl}
              alt={lesson.title}
              className="w-full h-full object-cover"
            />
          )}
          {isProcessing ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
              <Loader2 className="h-10 w-10 text-white animate-spin mb-3" />
              <div className="bg-white/95 rounded-full px-4 py-2 shadow-lg">
                <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {t('miniLessons.processing') || 'Обработка...'}
                </p>
              </div>
            </div>
          ) : isVideo && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="bg-white/90 rounded-full p-3 shadow-lg">
                <Play className="h-8 w-8 text-gray-900 fill-gray-900" />
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="px-4 pb-3 space-y-2">
          {/* Title */}
          <div className="text-sm mt-3">
            <span className="font-semibold">{lesson.title}</span>
          </div>

          {/* Views */}
          {lesson.views_count !== undefined && lesson.views_count > 0 && (
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Eye className="h-4 w-4" />
              <span>{lesson.views_count} {t('miniLessons.views', 'views')}</span>
            </div>
          )}
        </div>
      </Card>

      {/* Mini Lesson Preview Modal - Instagram Style */}
      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) {
            setIsOverlayExpanded(false);
          }
        }}
      >
        <DialogContent className="!max-w-[95vw] sm:!max-w-[600px] md:!max-w-[700px] lg:!max-w-[800px] !w-[95vw] sm:!w-[600px] md:!w-[700px] lg:!w-[800px] h-[95vh] p-0 overflow-hidden">
          <DialogTitle className="sr-only">
            {selectedLesson?.title || 'Mini Lesson'}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {selectedLesson?.description || 'Mini lesson video or photo'}
          </DialogDescription>

          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-50 bg-black/50 text-white rounded-full h-10 w-10"
            onClick={() => setIsModalOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>

          <div className="relative w-full h-full bg-black">
            {/* Loading state */}
            {isLoadingLesson ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-white" />
              </div>
            ) : (
              <>
                {/* Video/Photo Full Size */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {selectedLesson && selectedLesson.media_type === 'video' ? (
                    <InstagramVideoPlayer
                      media={typeof selectedLesson.media === 'string' ? undefined : selectedLesson.media}
                      src={typeof selectedLesson.media === 'string' ? selectedLesson.media : undefined}
                    />
                  ) : selectedLesson?.media ? (
                    <img
                      src={typeof selectedLesson.media === 'string'
                        ? selectedLesson.media
                        : (selectedLesson.media.thumbnail || selectedLesson.media.original)}
                      alt={selectedLesson?.title}
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : null}
                </div>
              </>
            )}

            {/* Bottom Overlay - Instagram Style - Only show when loaded */}
            {!isLoadingLesson && selectedLesson && (
              <div
                className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/80 to-transparent text-white transition-all duration-300 ease-in-out cursor-pointer ${
                  isOverlayExpanded ? 'max-h-[70vh] overflow-y-auto' : 'max-h-[180px]'
                }`}
                onClick={() => setIsOverlayExpanded(!isOverlayExpanded)}
              >
                <div className="p-4 sm:p-6">
                  {/* Expand/Collapse Indicator */}
                  <div className="flex justify-center mb-2">
                    {isOverlayExpanded ? (
                      <ChevronDown className="h-5 w-5 text-white/70 animate-bounce" />
                    ) : (
                      <ChevronUp className="h-5 w-5 text-white/70 animate-bounce" />
                    )}
                  </div>

                  {/* Title and Basic Info - Always Visible */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-lg sm:text-xl">{selectedLesson?.title}</h3>

                    {/* Tutor Info */}
                    <div
                      className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (selectedLesson) {
                          handleTutorClick(selectedLesson.tutor.id, e);
                        }
                      }}
                    >
                      <Avatar className="h-10 w-10 border-2 border-white/50">
                        <AvatarImage
                          src={selectedLesson ? (typeof selectedLesson.tutor.image === 'string' ? selectedLesson.tutor.image : selectedLesson.tutor.image?.small) : undefined}
                          alt={selectedLesson?.tutor.fullname}
                        />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {selectedLesson?.tutor.fullname.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{selectedLesson?.tutor.fullname}</p>
                        <div className="flex items-center gap-3 text-sm text-white/80">
                          {selectedLesson?.subject && (
                            <Badge variant="secondary" className="text-xs">
                              {selectedLesson.subject.name}
                            </Badge>
                          )}
                          {selectedLesson?.views_count !== undefined && selectedLesson.views_count > 0 && (
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {selectedLesson.views_count}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {isOverlayExpanded && (
                      <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        {/* Description */}
                        <div>
                          <h4 className="text-sm font-semibold text-white/90 mb-2">
                            {t('tutorProfile.miniLessons.description')}
                          </h4>
                          <p className="text-sm text-white/80 whitespace-pre-wrap leading-relaxed">
                            {selectedLesson?.description}
                          </p>
                        </div>

                        {/* Tap to collapse hint */}
                        <p className="text-xs text-white/50 text-center pt-2">
                          {t('miniLessons.page.tapToCollapse') || 'Нажмите, чтобы свернуть'}
                        </p>
                      </div>
                    )}

                    {/* Tap to expand hint when collapsed */}
                    {!isOverlayExpanded && (
                      <p className="text-xs text-white/50 text-center">
                        {t('miniLessons.page.tapForDetails') || 'Нажмите для подробностей'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
