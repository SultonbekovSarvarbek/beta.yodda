import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlayCircle, Loader2, Play, ChevronUp, ChevronDown, Eye } from 'lucide-react';
import { getMiniLessons } from '@/services/api';
import type { MiniLesson } from '@/types/api';
import { useSubjects } from '@/hooks/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { InstagramVideoPlayer } from '@/components/InstagramVideoPlayer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from '@tanstack/react-router';

export default function MiniLessons() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<MiniLesson | null>(null);
  const [isOverlayExpanded, setIsOverlayExpanded] = useState(false);

  // Fetch all mini lessons
  const { data: miniLessonsData, isLoading } = useQuery({
    queryKey: ['all-mini-lessons', selectedSubject],
    queryFn: () => getMiniLessons({ subject_id: selectedSubject || undefined }),
  });

  // Fetch subjects for filtering
  const { data: subjects = [] } = useSubjects();

  const miniLessons = miniLessonsData?.data || [];

  // Helper function to detect actual media type from URL
  const getActualMediaType = (mediaUrl: string): 'video' | 'photo' => {
    const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv', '.m4v'];
    const url = mediaUrl.toLowerCase();
    return videoExtensions.some(ext => url.includes(ext)) ? 'video' : 'photo';
  };

  const handleTutorClick = (tutorId: number) => {
    // Navigate to tutor profile - we need to find the announcement ID
    // For now, we'll just navigate to the tutors page
    // In a real app, you'd need to fetch the tutor's announcement ID
    navigate({ to: '/tutors' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
          {t('miniLessons.page.title') || 'Мини-уроки от репетиторов'}
        </h1>
        <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
          <p>
            {t('miniLessons.page.description') || 'Короткие образовательные видео, где репетиторы объясняют одну маленькую тему простым языком. Это быстрые, понятные и полезные мини-разборы длительностью 30–60 секунд — ровно столько, сколько нужно, чтобы уловить суть.'}
          </p>
        </div>
      </div>

      {/* Subject Filter */}
      {subjects.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">{t('miniLessons.page.filterBySubject') || 'Фильтр по предметам'}</h2>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={selectedSubject === null ? 'default' : 'outline'}
              className="cursor-pointer px-3 py-1.5"
              onClick={() => setSelectedSubject(null)}
            >
              {t('miniLessons.page.allSubjects') || 'Все предметы'}
            </Badge>
            {subjects.map((subject) => (
              <Badge
                key={subject.id}
                variant={selectedSubject === subject.id ? 'default' : 'outline'}
                className="cursor-pointer px-3 py-1.5"
                onClick={() => setSelectedSubject(subject.id)}
              >
                {subject.name}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Mini Lessons Grid */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">
          {selectedSubject ? t('miniLessons.page.lessonsInSubject') : t('miniLessons.page.allLessons') || 'Все мини-уроки'}
        </h2>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
          </div>
        ) : miniLessons.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {miniLessons.map((lesson) => {
              const mediaUrl = typeof lesson.media === 'string' ? lesson.media : lesson.media.original;
              const thumbnailUrl = typeof lesson.media === 'object' ? lesson.media.thumbnail : undefined;
              const actualMediaType = getActualMediaType(mediaUrl);

              return (
                <Card
                  key={lesson.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedLesson(lesson)}
                >
                  {/* Thumbnail */}
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    {actualMediaType === 'video' ? (
                      <>
                        <video
                          src={mediaUrl}
                          className="w-full h-full object-cover"
                          preload="metadata"
                          muted
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <div className="bg-white/90 rounded-full p-3 shadow-lg">
                            <Play className="h-8 w-8 text-gray-900 fill-gray-900" />
                          </div>
                        </div>
                      </>
                    ) : (
                      <img
                        src={thumbnailUrl || mediaUrl}
                        alt={lesson.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-2">{lesson.title}</h3>

                    {/* Tutor Info - Only show if available */}
                    {lesson.tutor && (
                      <div
                        className="flex items-center gap-2 mb-3"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTutorClick(lesson.tutor.id);
                        }}
                      >
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={lesson.tutor.image?.small}
                            alt={lesson.tutor.fullname}
                          />
                          <AvatarFallback className="text-xs">
                            {lesson.tutor.fullname.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <p className="text-sm text-muted-foreground hover:text-primary transition-colors">
                          {lesson.tutor.fullname}
                        </p>
                      </div>
                    )}

                    {/* Subject & Views */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      {lesson.subject ? (
                        <Badge variant="outline" className="text-xs">
                          {lesson.subject.name}
                        </Badge>
                      ) : (
                        <span></span>
                      )}
                      {lesson.views_count > 0 && (
                        <span>{lesson.views_count} {t('tutorProfile.miniLessons.views')}</span>
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
            {selectedSubject && (
              <p className="text-sm text-muted-foreground mt-2">
                {t('miniLessons.page.tryAnotherSubject') || 'Попробуйте выбрать другой предмет'}
              </p>
            )}
          </div>
        )}
      </section>

      {/* Mini Lesson Preview Modal - Instagram Style */}
      <Dialog
        open={selectedLesson !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedLesson(null);
            setIsOverlayExpanded(false);
          }
        }}
      >
        <DialogContent className="!max-w-[95vw] sm:!max-w-[600px] md:!max-w-[700px] lg:!max-w-[800px] !w-[95vw] sm:!w-[600px] md:!w-[700px] lg:!w-[800px] h-[95vh] p-0 overflow-hidden">
          <div className="relative w-full h-full bg-black">
            {/* Video/Photo Full Size */}
            <div className="absolute inset-0 flex items-center justify-center">
              {selectedLesson && getActualMediaType(typeof selectedLesson.media === 'string' ? selectedLesson.media : selectedLesson.media.original) === 'video' ? (
                <InstagramVideoPlayer
                  src={typeof selectedLesson.media === 'string' ? selectedLesson.media : selectedLesson.media.original}
                />
              ) : (
                <img
                  src={typeof selectedLesson?.media === 'string' ? selectedLesson.media : selectedLesson?.media.original}
                  alt={selectedLesson?.title}
                  className="max-w-full max-h-full object-contain"
                />
              )}
            </div>

            {/* Bottom Overlay - Instagram Style */}
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

                  {/* Tutor Info - Only show if tutor data is available */}
                  {selectedLesson?.tutor ? (
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-white/50">
                        <AvatarImage
                          src={selectedLesson.tutor.image?.small}
                          alt={selectedLesson.tutor.fullname}
                        />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {selectedLesson.tutor.fullname.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{selectedLesson.tutor.fullname}</p>
                        <div className="flex items-center gap-3 text-sm text-white/80">
                          {selectedLesson?.subject && (
                            <Badge variant="secondary" className="text-xs">
                              {selectedLesson.subject.name}
                            </Badge>
                          )}
                          {selectedLesson?.views_count > 0 && (
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {selectedLesson.views_count}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 text-sm text-white/80">
                      {selectedLesson?.subject && (
                        <Badge variant="secondary" className="text-xs">
                          {selectedLesson.subject.name}
                        </Badge>
                      )}
                      {selectedLesson?.views_count > 0 && (
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {selectedLesson.views_count}
                        </span>
                      )}
                    </div>
                  )}

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

                      {/* Contact Info */}
                      {selectedLesson?.tutor?.phone && (
                        <div>
                          <h4 className="text-sm font-semibold text-white/90 mb-2">
                            {t('tutorProfile.miniLessons.contact')}
                          </h4>
                          <p className="text-sm text-white/80">{selectedLesson.tutor.phone}</p>
                        </div>
                      )}

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
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
