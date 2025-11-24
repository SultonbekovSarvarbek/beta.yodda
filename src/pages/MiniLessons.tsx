import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlayCircle, Loader2, Play, ChevronUp, ChevronDown, Eye, Clock, X } from 'lucide-react';
import { getMiniLessons, getMiniLessonById } from '@/services/api';
import type { MiniLesson } from '@/types/api';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { InstagramVideoPlayer } from '@/components/InstagramVideoPlayer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from '@tanstack/react-router';

export default function MiniLessons() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);
  const [isOverlayExpanded, setIsOverlayExpanded] = useState(false);

  // Fetch all mini lessons
  const { data: miniLessonsData, isLoading } = useQuery({
    queryKey: ['all-mini-lessons'],
    queryFn: () => getMiniLessons({}),
  });

  // Fetch full lesson details when selected
  const { data: selectedLessonData, isLoading: isLoadingLesson } = useQuery({
    queryKey: ['mini-lesson', selectedLessonId],
    queryFn: () => getMiniLessonById(selectedLessonId!),
    enabled: !!selectedLessonId,
  });

  const miniLessons = miniLessonsData?.data || [];
  const selectedLesson = selectedLessonData?.data || null;

  const handleTutorClick = (tutorId: number) => {
    navigate({
      to: '/tutor/$id',
      params: { id: tutorId.toString() }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
      {/* Mini Lessons Grid */}
      <section>
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
          {t('miniLessons.page.title') || 'Мини-уроки от репетиторов'}
        </h2>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
          </div>
        ) : miniLessons.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
            {miniLessons.map((lesson) => {
              // In list endpoint, media is a string URL (thumbnail)
              // In detail endpoint, media is an object with versions
              const thumbnailUrl = lesson.media
                ? (typeof lesson.media === 'string' ? lesson.media : lesson.media.thumbnail)
                : null;
              const isVideo = lesson.media_type === 'video';
              const isProcessing = lesson.processing_status === 'processing';

              return (
                <Card
                  key={lesson.id}
                  className={`group overflow-hidden border gap-0 bg-transparent shadow-none rounded-xl sm:rounded-2xl p-1 sm:p-1.5 ${isProcessing ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}`}
                  onClick={() => !isProcessing && setSelectedLessonId(lesson.id)}
                >
                  {/* Thumbnail */}
                  <div className="aspect-[3/4] sm:aspect-[9/16] bg-muted relative overflow-hidden rounded-lg sm:rounded-xl">
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
                            Обработка...
                          </p>
                        </div>
                      </div>
                    ) : isVideo && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <div className="bg-white/90 rounded-full p-2 sm:p-3 shadow-lg">
                          <Play className="h-5 w-5 sm:h-8 sm:w-8 text-gray-900 fill-gray-900" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-2 sm:p-3 space-y-1.5 sm:space-y-2">
                    <h3 className="font-semibold text-xs sm:text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                      {lesson.title}
                    </h3>

                    {/* Tutor Info */}
                    <div
                      className="flex items-center gap-1.5 sm:gap-2 cursor-pointer group/tutor"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTutorClick(lesson.tutor.id);
                      }}
                    >
                      <Avatar className="h-5 w-5 sm:h-6 sm:w-6 border border-indigo-400">
                        <AvatarImage
                          src={typeof lesson.tutor.image === 'string' ? lesson.tutor.image : lesson.tutor.image?.small}
                          alt={lesson.tutor.fullname}
                        />
                        <AvatarFallback className="text-[10px] sm:text-xs bg-gradient-to-br from-primary/10 to-primary/5">
                          {lesson.tutor.fullname.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <p className="text-[10px] sm:text-xs font-medium text-gray-700 group-hover/tutor:text-primary transition-colors truncate">
                        {lesson.tutor.fullname}
                      </p>
                    </div>

                    {/* Subject & Views */}
                    <div className="flex items-center gap-1.5 sm:gap-2 text-xs">
                      {lesson.subject && (
                        <Badge variant="secondary" className="text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0 sm:py-0.5 font-normal border-indigo-500">
                          {lesson.subject.name}
                        </Badge>
                      )}
                      {lesson.views_count !== undefined && lesson.views_count > 0 && (
                        <span className="flex items-center gap-0.5 sm:gap-1 text-muted-foreground text-[10px] sm:text-xs">
                          <Eye className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                          <span className="font-medium">{lesson.views_count}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <PlayCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-xl text-muted-foreground">
              {t('miniLessons.page.noLessons') || 'Мини-уроки пока не загружены'}
            </p>

          </div>
        )}
      </section>

      {/* Mini Lesson Preview Modal - Instagram Style */}
      <Dialog
        open={selectedLessonId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedLessonId(null);
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
            onClick={() => setSelectedLessonId(null)}
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
              className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/80 to-transparent text-white transition-all duration-300 ease-in-out cursor-pointer ${isOverlayExpanded ? 'max-h-[70vh] overflow-y-auto' : 'max-h-[180px]'
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
                        handleTutorClick(selectedLesson.tutor.id);
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
    </div>
  );
}
