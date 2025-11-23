import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScheduleGrid } from '@/components/ScheduleGrid';
import { Check, Share2, Grid3x3, Calendar, Star, FileText, Play, Award, PlayCircle, Trash2 } from 'lucide-react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useAnnouncementById } from '@/hooks/api';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMiniLessonsByAnnouncement, getMiniLessonById, deleteMiniLesson } from '@/services/api';
import type { MiniLesson } from '@/types/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { InstagramVideoPlayer } from '@/components/InstagramVideoPlayer';
import { BookingDialog } from '@/components/BookingDialog';

// Utility function to detect file type
const getFileType = (filePath: string): 'pdf' | 'image' | 'video' => {
  const extension = filePath.split('.').pop()?.toLowerCase();

  // Video extensions
  const videoExtensions = ['mp4', 'webm', 'mov', 'avi', 'mkv', 'ogg', 'm4v'];
  if (videoExtensions.includes(extension || '')) {
    return 'video';
  }

  // PDF extension
  if (extension === 'pdf') {
    return 'pdf';
  }

  // Default to image
  return 'image';
};

export function TutorProfile() {
  const { t } = useTranslation();
  const { id } = useParams({ from: '/tutor/$id' });
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { data: tutor, isLoading, isError } = useAnnouncementById(parseInt(id));
  const [selectedPost, setSelectedPost] = useState<{ id: string | number; image: string; fileType: 'pdf' | 'image' | 'video'; isFile: boolean } | null>(null);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [selectedMiniLessonId, setSelectedMiniLessonId] = useState<number | null>(null);
  const [deleteMiniLessonDialogOpen, setDeleteMiniLessonDialogOpen] = useState(false);
  const [miniLessonToDelete, setMiniLessonToDelete] = useState<number | null>(null);

  // Fetch mini lessons for this tutor
  const { data: miniLessonsData, isLoading: loadingMiniLessons } = useQuery({
    queryKey: ['mini-lessons', id],
    queryFn: () => getMiniLessonsByAnnouncement(parseInt(id)),
    enabled: !!id,
  });

  // Fetch full lesson details when selected
  const { data: selectedMiniLessonData, isLoading: isLoadingMiniLesson } = useQuery({
    queryKey: ['mini-lesson', selectedMiniLessonId],
    queryFn: () => getMiniLessonById(selectedMiniLessonId!),
    enabled: !!selectedMiniLessonId,
  });

  const miniLessons = miniLessonsData?.data || [];
  const selectedMiniLesson = selectedMiniLessonData?.data || null;

  // Delete mini lesson mutation
  const queryClient = useQueryClient();
  const deleteMiniLessonMutation = useMutation({
    mutationFn: deleteMiniLesson,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mini-lessons', id] });
      toast.success('Мини-урок успешно удален');
      setDeleteMiniLessonDialogOpen(false);
      setMiniLessonToDelete(null);
    },
    onError: (error) => {
      toast.error('Ошибка при удалении мини-урока');
      console.error('Failed to delete mini lesson:', error);
    },
  });

  // Helper function to check if user owns the mini lesson
  const isOwner = () => {
    if (!isAuthenticated || !user || user.role !== 'tutor' || !tutor) return false;

    // Compare announcement's profile_id with authenticated user's id
    // user.id is from /api/getprofileuser
    // tutor.profile_id is from /api/announcements/{id}
    // If viewing your own announcement (profile_id matches your user id), you can delete mini lessons
    return user.id === (tutor as any).profile_id;
  };

  // Handle delete mini lesson
  const handleDeleteMiniLesson = (lessonId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the lesson modal
    setMiniLessonToDelete(lessonId);
    setDeleteMiniLessonDialogOpen(true);
  };

  // Confirm delete mini lesson
  const confirmDeleteMiniLesson = async () => {
    if (miniLessonToDelete === null) return;
    await deleteMiniLessonMutation.mutateAsync(miniLessonToDelete);
  };

  // Handle post click with mobile detection
  const handlePostClick = (post: { id: string | number; image: string; fileType: 'pdf' | 'image' | 'video'; isFile: boolean; lesson?: MiniLesson }) => {
    // If this is a mini lesson post, open the mini lesson dialog
    if (post.lesson) {
      setSelectedMiniLessonId(post.lesson.id);
      return;
    }

    // Detect if mobile (< 1024px)
    const isMobile = window.matchMedia('(max-width: 1024px)').matches;

    if (isMobile) {
      // Navigate to dedicated post view on mobile
      navigate({
        to: '/tutor/$tutorId/post/$postId',
        params: {
          tutorId: id,
          postId: post.id.toString()
        }
      });
    } else {
      // Open dialog on desktop
      setSelectedPost(post);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-12 w-12 animate-spin text-gray-400" />
      </div>
    );
  }

  if (isError || !tutor) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-20">
          <p className="text-gray-600 text-lg mb-2">{t('tutorProfile.errors.notFound')}</p>
          <p className="text-gray-500 text-sm">
            {t('tutorProfile.errors.notFoundDesc')}
          </p>
        </div>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${tutor.fullname} - ${t('tutorProfile.share.profileTitle')}`,
        text: t('tutorProfile.share.checkProfile', { name: tutor.fullname }),
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert(t('tutorProfile.share.linkCopied'));
    }
  };

  const handleBookLesson = () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      toast.warning(t('favorites.loginRequired', 'Вам нужно войти или зарегистрироваться'));
      navigate({ to: '/login' });
      return;
    }

    // Check if user is a tutor (only seekers can book lessons)
    if (user?.role === 'tutor') {
      toast.error(t('tutorProfile.errors.tutorCannotBook', 'Вы репетитор. Только ученики могут записываться на уроки'));
      return;
    }

    setIsBookingDialogOpen(true);
  };

  const handleBookSlot = (date: string, time: string) => {
    alert(t('tutorProfile.booking.bookingFor', { date, time }));
  };

  // Create posts from real data: images from files + mini lesson videos
  const imagePosts = tutor.file
    ? tutor.file
      .filter((file) => {
        const fileType = getFileType(file.path);
        return fileType === 'image';
      })
      .map((file) => ({
        id: `file-${file.unique_id}`,
        image: file.path,
        fileType: 'image' as const,
        isFile: true,
      }))
    : [];

  const miniLessonPosts = miniLessons
    ? miniLessons
      .filter((lesson) => lesson.media !== null) // Filter out lessons with null media
      .map((lesson) => {
        // In list endpoint, media is a string URL (thumbnail)
        // In detail endpoint, media is an object with versions
        const mediaUrl = typeof lesson.media === 'string' ? lesson.media : lesson.media.thumbnail;
        const actualType = lesson.media_type === 'video' ? 'video' : 'photo';
        return {
          id: `lesson-${lesson.id}`,
          image: mediaUrl,
          fileType: actualType === 'video' ? ('video' as const) : ('image' as const),
          isFile: false,
          lesson: lesson, // Keep reference to full lesson data
        };
      })
    : [];

  const allPosts = [...imagePosts, ...miniLessonPosts];

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-4">
        {/* Profile Header - Instagram Style */}
        <div className="mb-0">
          {/* Top Row: Avatar + Info */}
          <div className="flex items-start gap-4 md:gap-8 mb-4">
            {/* Avatar */}
            <Avatar className="h-[77px] w-[77px] md:h-30 md:w-30 lg:h-[150px] lg:w-[150px] shrink-0">
              <AvatarImage
                src={tutor.image?.medium}
                alt={tutor.fullname}
              />
              <AvatarFallback>{tutor.fullname.charAt(0)}</AvatarFallback>
            </Avatar>

            {/* Right Side: Username, Stats, Buttons, Bio */}
            <div className="flex-1 min-w-0">
              {/* Username + Stats */}
              <div className="flex flex-col mb-4">
                {/* Username */}
                <div className="flex items-center gap-2 mb-4">
                  <h1 className="text-md sm:text-sm md:text-2xl font-semibold">{tutor.fullname}</h1>
                  <div className="flex items-center justify-center w-4 h-4 bg-blue-500 rounded-full shrink-0">
                    <Check className="w-2.5 h-2.5 text-white" strokeWidth={4} />
                  </div>
                </div>

                {/* Instagram Stats */}
                <div className="flex flex-wrap gap-3 md:gap-4">
                  <div className="text-sm md:text-base">
                    <span className="font-semibold">• {tutor.experience}</span>{' '}
                    <span className="text-gray-600">{t('tutorProfile.about.yearsTeaching')}</span>
                  </div>
                  <div className="text-sm md:text-base">
                    <span className="font-semibold">• {tutor.formatsData[0]?.duration}</span>{' '}
                    <span className="text-gray-600">{t('pricingCard.minutes')}</span>
                  </div>
                  <div className="text-sm md:text-base">
                    <span className="font-semibold text-green-600">• {tutor.formatsData[0]?.amount.toLocaleString()}</span>{' '}
                    <span className="text-gray-600">{t('pricingCard.sumPerLesson')}</span>
                  </div>
                  <div className="text-sm md:text-base">
                    <span className="text-gray-600"><span className="font-semibold text-black">•</span> {tutor.formatsData[0]?.name || t('tutorProfile.online', { defaultValue: 'Онлайн' })}</span>
                  </div>
                  <div className="text-sm md:text-base">
                    <span className="text-gray-600"><span className="font-semibold text-black">•</span> {tutor.city.name}, {tutor.region.name}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Button onClick={handleBookLesson} size="sm" className="bg-indigo-600 hover:bg-indigo-700 flex-1 md:flex-none cursor-pointer">
                  {t('tutorProfile.bookLesson')}
                </Button>
                <Button onClick={handleShare} variant="outline" size="sm" className="cursor-pointer">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>


        {/* Tutor Details Section - Reorganized */}
        <div className="my-5 space-y-5">
          {/* Personal Information */}
          <div className="space-y-3">
            {/* <div>
                <div className="flex items-center gap-1.5"> <div className="rounded-sm"></div> 
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span>{tutor.city.name}, {tutor.region.name}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <User className="h-4 w-4 shrink-0" />
                  <span>{tutor.age} {t('tutorProfile.yearsOld')}</span>
                </div>
                {tutor.experience && tutor.experience !== '0' && (
                  <>
                    <span>•</span>
                    <div className="flex items-center gap-1.5">
                      <Star className="h-4 w-4 shrink-0" />
                      <span>{tutor.experience} {t('tutorProfile.about.yearsTeaching')}</span>
                    </div>
                  </>
                )}
              </div> */}

            {/* Subjects with Levels Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900">{t('tutorProfile.about.subjectsTeach')}</h3>
              {tutor.subjectLevels && tutor.subjectLevels.length > 0 ? (
                <div className="space-y-3">
                  {tutor.subjectLevels.map((subjectLevel: any) => {
                    // Handle both possible data structures
                    const subject = subjectLevel.subject || tutor.subjects.find(s => s.id === subjectLevel.subject_id);
                    if (!subject) return null;

                    const subjectId = subjectLevel.subject_id || subject.id;
                    const levels = subjectLevel.levels || [];

                    return (
                      <div key={subjectId} className="space-y-1.5">
                        <h4 className="text-md font-semibold tracking-wide text-indigo-500">• {subject.name}</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {levels.map((level: any) => (
                            <Badge
                              key={level.value || level.id}
                              variant="outline"
                              className="text-xs px-2.5 py-0.5 bg-gray-50 border-slate-300 font-semibold text-slate-800"
                            >
                              {level.label || level.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {tutor.subjects.map((subject) => (
                    <Badge key={subject.id} variant="secondary" className="text-sm border border-blue-500">
                      {subject.name}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <p className="text-sm text-gray-700 leading-relaxed">{tutor.description}</p>
          </div>

        </div>

        {/* Instagram-Style Tabs */}
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="w-full h-auto justify-center gap-2 bg-gray-50">
            <TabsTrigger
              value="posts"
              className="flex-1 flex items-center justify-center gap-2 py-3 data-[state=active]:bg-indigo-600 data-[state=active]:text-indigo-50 data-[state=active]:font-semibold data-[state=active]:shadow-none rounded-lg cursor-pointer"
            >
              <Grid3x3 className="h-4 w-4" />
              <span className="hidden sm:inline text-sm">{t('tutorProfile.tabs.posts')}</span>
            </TabsTrigger>
            <TabsTrigger
              value="schedule"
              className="flex-1 flex items-center justify-center gap-2 py-3 data-[state=active]:bg-indigo-600 data-[state=active]:text-indigo-50 data-[state=active]:font-semibold data-[state=active]:shadow-none rounded-lg cursor-pointer"
            >
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline text-sm">{t('tutorProfile.tabs.schedule')}</span>
            </TabsTrigger>
            {/* <TabsTrigger
                value="pricing"
                className="flex-1 flex items-center justify-center gap-2 py-3 data-[state=active]:bg-[#548bfa] data-[state=active]:font-semibold data-[state=active]:shadow-none rounded-lg cursor-pointer"
              >
                <DollarSign className="h-4 w-4" />
                <span className="hidden sm:inline text-sm">{t('tutorProfile.tabs.pricing')}</span>
              </TabsTrigger> */}
            <TabsTrigger
              value="reviews"
              className="flex-1 flex items-center justify-center gap-2 py-3 data-[state=active]:bg-indigo-600 data-[state=active]:text-indigo-50 data-[state=active]:font-semibold data-[state=active]:shadow-none rounded-lg cursor-pointer"
            >
              <Star className="h-4 w-4" />
              <span className="hidden sm:inline text-sm">{t('tutorProfile.tabs.reviews')}</span>
            </TabsTrigger>
            <TabsTrigger
              value="certificates"
              className="flex-1 flex items-center justify-center gap-2 py-3 data-[state=active]:bg-indigo-600 data-[state=active]:text-indigo-50 data-[state=active]:font-semibold data-[state=active]:shadow-none rounded-lg cursor-pointer"
            >
              <Award className="h-4 w-4" />
              <span className="hidden sm:inline text-sm">{t('tutorProfile.tabs.certificates')}</span>
            </TabsTrigger>
            <TabsTrigger
              value="minilessons"
              className="flex-1 flex items-center justify-center gap-2 py-3 data-[state=active]:bg-indigo-600 data-[state=active]:text-indigo-50 data-[state=active]:font-semibold data-[state=active]:shadow-none rounded-lg cursor-pointer"
            >
              <PlayCircle className="h-4 w-4" />
              <span className="hidden sm:inline text-sm">{t('tutorProfile.tabs.miniLessons')}</span>
            </TabsTrigger>
          </TabsList>

          {/* Posts Tab */}
          <TabsContent value="posts" className="mt-0">
            <div>
              {allPosts.length > 0 ? (
                <div className="grid grid-cols-3 gap-0.5 sm:gap-0.5 my-0 -mx-4 lg:mx-0">
                  {allPosts.map((post) => (
                    <div
                      key={post.id}
                      onClick={() => handlePostClick(post)}
                      className="aspect-[3/4] bg-gray-200 overflow-hidden cursor-pointer hover:opacity-75 transition-opacity min-w-[105px] sm:min-w-[140px] relative group"
                    >
                      {/* Always use img tag - post.image is thumbnail URL */}
                      <img
                        src={post.image}
                        alt={`Post ${post.id}`}
                        className="w-full h-full object-cover"
                      />
                      {/* Show play button overlay for videos */}
                      {post.fileType === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/10 transition-opacity group-hover:bg-black/20">
                          <div className="bg-white/90 rounded-full p-2 sm:p-3 shadow-lg">
                            <Play className="h-6 w-6 sm:h-8 sm:w-8 text-gray-900 fill-gray-900" />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white border rounded-lg p-6">
                  <div className="text-center py-12 text-gray-500">
                    <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <p>{t('tutorProfile.posts.noPosts') || 'Пока нет постов'}</p>
                    <p className="text-sm mt-2">{t('tutorProfile.posts.noPostsDescription') || 'Изображения и видео будут отображаться здесь'}</p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="mt-0">
            <div className="bg-white border rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4">{t('schedule.title')}</h3>
              <ScheduleGrid
                schedule={tutor.schedule}
                formatsData={tutor.formatsData}
                onBookSlot={handleBookSlot}
              />
            </div>
          </TabsContent>

          {/* Pricing Tab */}
          {/* <TabsContent value="pricing" className="mt-0">
              <div className="bg-white border rounded-lg p-6">
                <div>
                  {tutor.formatsData.map((format) => (
                    <PricingCard key={format.id} format={format} onBook={handleBookLesson} />
                  ))}
                </div>
              </div>
            </TabsContent> */}

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="mt-0">
            <div className="bg-white border rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4">{t('tutorProfile.reviews.title')}</h3>
              <div className="text-center py-12 text-gray-500">
                <p>{t('tutorProfile.reviews.noReviews')}</p>
                <p className="text-sm mt-2">{t('tutorProfile.reviews.firstReview')}</p>
              </div>
            </div>
          </TabsContent>

          {/* Certificates Tab */}
          <TabsContent value="certificates" className="mt-0">
            <div className="bg-white border rounded-lg p-4 sm:p-6">
              <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">{t('tutorProfile.certificates.title')}</h3>
              {tutor.file && tutor.file.length > 0 ? (
                <div className="space-y-2 sm:space-y-3">
                  {tutor.file.map((file) => {
                    const fileType = getFileType(file.path);
                    const fileName = file.path.split('/').pop() || 'Certificate';

                    return (
                      <div
                        key={file.unique_id}
                        className="flex items-center gap-2 sm:gap-4 p-3 sm:p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        {/* File Icon/Preview */}
                        <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center bg-gray-100 rounded-lg shrink-0">
                          {fileType === 'pdf' ? (
                            <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-red-500" />
                          ) : fileType === 'video' ? (
                            <div className="relative w-full h-full">
                              <video
                                src={file.path}
                                className="w-full h-full object-cover rounded-lg"
                                preload="metadata"
                                muted
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Play className="h-4 w-4 sm:h-6 sm:w-6 text-white fill-white drop-shadow-lg" />
                              </div>
                            </div>
                          ) : (
                            <img
                              src={file.path}
                              alt={fileName}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          )}
                        </div>

                        {/* File Info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-xs sm:text-sm truncate">{fileName}</p>
                          <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">
                            {fileType === 'pdf' ? t('tutorProfile.certificates.pdfDocument') :
                              fileType === 'video' ? t('tutorProfile.certificates.videoFile') :
                                t('tutorProfile.certificates.imageFile')}
                          </p>
                        </div>

                        {/* View Button */}
                        <Button
                          size="sm"
                          variant="success"
                          className="shrink-0 cursor-pointer text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9"
                          onClick={() => window.open(file.path, '_blank')}
                        >
                          {t('tutorProfile.certificates.view')}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 sm:py-12 text-gray-500">
                  <Award className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-2 sm:mb-3 text-gray-300" />
                  <p className="text-sm sm:text-base">{t('tutorProfile.certificates.noCertificates')}</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Mini Lessons Tab */}
          <TabsContent value="minilessons" className="mt-0">
            <div className="bg-white border rounded-lg p-4 sm:p-6">
              <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">{t('tutorProfile.tabs.miniLessons')}</h3>
              {loadingMiniLessons ? (
                <div className="flex items-center justify-center py-8 sm:py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : miniLessons && miniLessons.length > 0 ? (
                <div className="space-y-2 sm:space-y-3">
                  {miniLessons.map((lesson) => {
                    // In list endpoint, media is a string URL (thumbnail)
                    // In detail endpoint, media is an object with versions
                    const thumbnailUrl = lesson.media
                      ? (typeof lesson.media === 'string' ? lesson.media : lesson.media.thumbnail)
                      : null;
                    const actualMediaType = lesson.media_type;
                    const isProcessing = lesson.processing_status === 'processing';

                    return (
                      <div
                        key={lesson.id}
                        onClick={() => !isProcessing && setSelectedMiniLessonId(lesson.id)}
                        className={`flex items-center gap-2 sm:gap-4 p-3 sm:p-4 border rounded-lg hover:bg-gray-50 transition-colors relative ${isProcessing ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}`}
                      >
                        {/* Media Thumbnail */}
                        <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center bg-gray-100 rounded-lg shrink-0 overflow-hidden">
                          {isProcessing ? (
                            <div className="relative w-full h-full flex items-center justify-center bg-gray-200">
                              <Loader2 className="h-6 w-6 text-gray-400 animate-spin" />
                            </div>
                          ) : thumbnailUrl ? (
                            actualMediaType === 'video' ? (
                              <div className="relative w-full h-full">
                                <img
                                  src={thumbnailUrl}
                                  alt={lesson.title}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                  <Play className="h-6 w-6 sm:h-8 sm:w-8 text-white fill-white drop-shadow-lg" />
                                </div>
                              </div>
                            ) : (
                              <img
                                src={thumbnailUrl}
                                alt={lesson.title}
                                className="w-full h-full object-cover"
                              />
                            )
                          ) : null}
                        </div>

                        {/* Lesson Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-xs sm:text-sm truncate">{lesson.title}</h4>
                          <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1 line-clamp-2">
                            {lesson.description}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            {isProcessing ? (
                              <Badge variant="secondary" className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0 bg-yellow-100 text-yellow-800">
                                Обработка...
                              </Badge>
                            ) : (
                              <>
                                {lesson.subject && (
                                  <Badge variant="outline" className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0">
                                    {lesson.subject.name}
                                  </Badge>
                                )}
                                {lesson.views_count > 0 && (
                                  <span className="text-[10px] sm:text-xs text-gray-400">
                                    {lesson.views_count} {t('tutorProfile.miniLessons.views')}
                                  </span>
                                )}
                              </>
                            )}
                          </div>
                        </div>


                        {/* Icons: Media Type & Delete Button */}
                        <div className="flex items-center gap-2">
                          {/* Media Type Badge */}
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            {actualMediaType === 'video' ? (
                              <Play className="bg-green-100 rounded p-2 h-8 w-8" />
                            ) : (
                              <FileText className="h-4 w-4" />
                            )}
                          </div>

                          {/* Delete Button - Only for Owner */}
                          {isOwner() && (
                            <Button
                              onClick={(e) => handleDeleteMiniLesson(lesson.id, e)}
                              disabled={deleteMiniLessonMutation.isPending}
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-200 bg-red-100 cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 sm:py-12 text-gray-500">
                  <PlayCircle className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-2 sm:mb-3 text-gray-300" />
                  <p className="text-sm sm:text-base mb-4">{t('tutorProfile.miniLessons.noLessons')}</p>
                  {isOwner() && (
                    <Button
                      onClick={() => navigate({ to: '/mini-lessons/upload' })}
                      className="bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
                    >
                      Загрузить мини-урок
                    </Button>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Image/File Preview Modal - Desktop Only */}
      <Dialog open={selectedPost !== null} onOpenChange={(open) => !open && setSelectedPost(null)}>
        <DialogContent className="hidden lg:block !max-w-[80vw] !w-[80vw] h-[90vh] p-0 overflow-hidden border-none bg-transparent shadow-2xl">
          <DialogTitle className="sr-only">File Preview</DialogTitle>
          <DialogDescription className="sr-only">
            {selectedPost?.fileType === 'pdf' ? 'PDF Document preview' :
              selectedPost?.fileType === 'video' ? 'Video preview' : 'Image preview'}
          </DialogDescription>
          <div className="flex h-full w-full bg-white rounded-lg overflow-hidden">
            {/* Left side - Image/File/Video Preview */}
            <div className="flex-1 bg-black flex items-center justify-center relative min-h-0 min-w-0">
              {selectedPost?.fileType === 'pdf' ? (
                <div className="flex flex-col items-center gap-4 p-8">
                  <FileText className="h-32 w-32 text-white" />
                  <span className="text-white text-lg font-medium">PDF Document</span>
                  <Button
                    onClick={() => window.open(selectedPost.image, '_blank')}
                    variant="outline"
                    className="bg-white text-black hover:bg-gray-100"
                  >
                    Open PDF in New Tab
                  </Button>
                </div>
              ) : selectedPost?.fileType === 'video' ? (
                <InstagramVideoPlayer src={selectedPost.image} className="w-full h-full object-contain bg-black" />
              ) : (
                <img
                  src={selectedPost?.image}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            {/* Right side - File Information */}
            <div className="w-[400px] min-w-[400px] flex-none bg-white border-l flex flex-col h-full">
              <DialogHeader className="p-4 border-b">
                <div className="font-semibold text-lg">File Information</div>
              </DialogHeader>
              <div className="p-4 overflow-y-auto flex-1">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-600 mb-1">File Type</h4>
                    <p className="text-base">
                      {selectedPost?.fileType === 'pdf' ? 'PDF Document' :
                        selectedPost?.fileType === 'video' ? 'Video' : 'Image'}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-600 mb-1">File ID</h4>
                    <p className="text-base">{selectedPost?.id}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-600 mb-1">Source</h4>
                    <p className="text-base">{selectedPost?.isFile ? 'Tutor Upload' : 'Profile Gallery'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-600 mb-1">Description</h4>
                    <p className="text-sm text-gray-500">Mock information - This section will display file metadata and description in future updates.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Mini Lesson Preview Modal */}
      <Dialog open={selectedMiniLessonId !== null} onOpenChange={(open) => !open && setSelectedMiniLessonId(null)}>
        <DialogContent className="!max-w-[95vw] md:!max-w-[85vw] lg:!max-w-[80vw] !w-full lg:!w-[80vw] h-[90vh] p-0 overflow-hidden border-none bg-transparent shadow-2xl">
          <DialogTitle className="sr-only">{selectedMiniLesson?.title || 'Mini Lesson'}</DialogTitle>
          <DialogDescription className="sr-only">
            {selectedMiniLesson?.description || 'Mini lesson video or photo'}
          </DialogDescription>
          {/* Loading state */}
          {isLoadingMiniLesson ? (
            <div className="flex items-center justify-center h-full bg-white rounded-lg">
              <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row h-full w-full bg-white rounded-lg overflow-hidden">
              {/* Left side - Video/Photo Preview */}
              <div className="flex-1 bg-black flex items-center justify-center relative min-h-0 min-w-0">
                {selectedMiniLesson && selectedMiniLesson.media_type === 'video' ? (
                  <InstagramVideoPlayer
                    media={typeof selectedMiniLesson.media === 'string' ? undefined : selectedMiniLesson.media}
                    src={typeof selectedMiniLesson.media === 'string' ? selectedMiniLesson.media : undefined}
                    className="w-full h-full object-contain bg-black"
                  />
                ) : selectedMiniLesson?.media ? (
                  <img
                    src={typeof selectedMiniLesson.media === 'string'
                      ? selectedMiniLesson.media
                      : (selectedMiniLesson.media.thumbnail || selectedMiniLesson.media.original)}
                    alt={selectedMiniLesson?.title}
                    className="w-full h-full object-contain"
                  />
                ) : null}
              </div>

              {/* Right side - Lesson Information */}
              <div className="w-full lg:w-[400px] lg:min-w-[400px] lg:flex-none bg-white border-t lg:border-t-0 lg:border-l flex flex-col h-[40%] lg:h-full">
              <DialogHeader className="p-4 border-b flex-shrink-0">
                <div className="text-base sm:text-lg line-clamp-1 font-semibold">{selectedMiniLesson?.title}</div>
              </DialogHeader>
              <div className="p-4 overflow-y-auto flex-1">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-gray-600 mb-1">{t('tutorProfile.miniLessons.description')}</h4>
                    <p className="text-xs sm:text-sm text-gray-700 whitespace-pre-wrap">
                      {selectedMiniLesson?.description}
                    </p>
                  </div>

                  {selectedMiniLesson?.subject && (
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-gray-600 mb-1">{t('tutorProfile.miniLessons.subject')}</h4>
                      <Badge variant="outline" className="text-xs sm:text-sm border-indigo-500">
                        {selectedMiniLesson.subject.name}
                      </Badge>
                    </div>
                  )}



                  {tutor && (
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-gray-600 mb-1">{t('tutorProfile.miniLessons.tutor')}</h4>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                          <AvatarImage
                            src={tutor.image?.small}
                            alt={tutor.fullname}
                          />
                          <AvatarFallback>
                            {tutor.fullname?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs sm:text-sm font-medium">{tutor.fullname}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Mini Lesson Confirmation Dialog */}
      <Dialog open={deleteMiniLessonDialogOpen} onOpenChange={setDeleteMiniLessonDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Удалить мини-урок</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить этот мини-урок? Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteMiniLessonDialogOpen(false)}
              disabled={deleteMiniLessonMutation.isPending}
            >
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteMiniLesson}
              disabled={deleteMiniLessonMutation.isPending}
              className="cursor-pointer"
            >
              {deleteMiniLessonMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Удаление...
                </>
              ) : (
                'Удалить'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Booking Dialog */}
      {tutor && (
        <BookingDialog
          open={isBookingDialogOpen}
          onOpenChange={setIsBookingDialogOpen}
          tutor={tutor}
        />
      )}
    </>
  );
}
