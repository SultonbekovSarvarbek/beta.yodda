import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScheduleGrid } from '@/components/ScheduleGrid';
import { Check, Share2, MapPin, Grid3x3, User, Calendar, Star, FileText, Play, Clock } from 'lucide-react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useAnnouncementById } from '@/hooks/api';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { InstagramVideoPlayer } from '@/components/InstagramVideoPlayer';

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
  const { data: tutor, isLoading, isError } = useAnnouncementById(parseInt(id));
  const [selectedPost, setSelectedPost] = useState<{ id: string | number; image: string; fileType: 'pdf' | 'image' | 'video'; isFile: boolean } | null>(null);

  // Handle post click with mobile detection
  const handlePostClick = (post: { id: string | number; image: string; fileType: 'pdf' | 'image' | 'video'; isFile: boolean }) => {
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
    alert(t('tutorProfile.booking.comingSoon'));
  };

  const handleBookSlot = (date: string, time: string) => {
    alert(t('tutorProfile.booking.bookingFor', { date, time }));
  };

  // Mock stats
  const followersCount = Math.floor(Math.random() * 500) + 100;
  const followingCount = Math.floor(Math.random() * 200) + 50;

  // Combine tutor files with mock posts
  const filePosts = (tutor.file || []).map((file) => ({
    id: `file-${file.unique_id}`,
    image: file.path,
    fileType: getFileType(file.path),
    isFile: true,
  }));

  const mockPosts = [
    // Large test image (high resolution)
    {
      id: 'test-large-image',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=4000&h=3000&fit=crop',
      fileType: 'image' as const,
      isFile: false,
    },
    // Test video post
    {
      id: 'video-test-1',
      image: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      fileType: 'video' as const,
      isFile: false,
    },
    // Image posts
    ...Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      image: tutor.image?.small || `https://images.unsplash.com/photo-${1500000000000 + i * 1000}?w=400&h=400&fit=crop`,
      fileType: 'image' as const,
      isFile: false,
    }))
  ];

  const allPosts = [...filePosts, ...mockPosts];
  const postsCount = allPosts.length;

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
                  src={tutor.image?.medium || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&h=300&fit=crop'}
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
                    <div>
                      <span className="font-semibold">{postsCount}</span>{' '}
                      <span className="text-gray-600 text-sm md:text-base">{t('tutorProfile.posts')}</span>
                    </div>
                    <div>
                      <span className="font-semibold">{followersCount}</span>{' '}
                      <span className="text-gray-600 text-sm md:text-base">{t('tutorProfile.followers')}</span>
                    </div>
                    <div>
                      <span className="font-semibold">{followingCount}</span>{' '}
                      <span className="text-gray-600 text-sm md:text-base">{t('tutorProfile.following')}</span>
                    </div>
                    {/* Additional tutor info */}
                    <div className="text-sm md:text-base">
                      📘 <span className="font-semibold">{tutor.experience}</span>{' '}
                      <span className="text-gray-600">{t('tutorProfile.about.yearsTeaching')}</span>
                    </div>
                    <div className="text-sm md:text-base">
                      ⏱ <span className="font-semibold">{tutor.formatsData[0]?.duration}</span>{' '}
                      <span className="text-gray-600">{t('pricingCard.minutes')}</span>
                    </div>
                    <div className="text-sm md:text-base">
                      💰 <span className="font-semibold">{tutor.formatsData[0]?.amount.toLocaleString()}</span>{' '}
                      <span className="text-gray-600">{t('pricingCard.sumPerLesson')}</span>
                    </div>
                    <div className="text-sm md:text-base">
                      🌐 <span className="text-gray-600">{tutor.formatsData[0]?.name || t('tutorProfile.online', { defaultValue: 'Онлайн' })}</span>
                    </div>
                    <div className="text-sm md:text-base">
                      📍 <span className="text-gray-600">{tutor.city.name}, {tutor.region.name}</span>
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
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-gray-600">
                <div className="flex items-center gap-1.5">
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
              </div>

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
                        <h4 className="text-md font-semibold tracking-wide text-indigo-500">- {subject.name}</h4>
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

            

            {/* Lesson Details Card */}
            <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-blue-50/50 to-white">
              <div className="grid grid-cols-2 gap-4 mb-4">
                {/* Format */}
                <div className="space-y-1">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {t('tutorProfile.format', { defaultValue: 'Формат' })}
                  </div>
                  <Badge variant="outline" className="text-sm font-medium">
                    {tutor.formatsData[0]?.name || t('tutorProfile.online', { defaultValue: 'Онлайн' })}
                  </Badge>
                </div>
                {/* Duration */}
                <div className="space-y-1">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {t('tutorProfile.lessonDuration', { defaultValue: 'Длительность' })}
                  </div>
                  <div className="flex items-center gap-1.5 text-sm font-medium text-gray-900">
                    <Clock className="h-4 w-4" />
                    <span>{tutor.formatsData[0].duration} {t('pricingCard.minutes')}</span>
                  </div>
                </div>
              </div>
              {/* Price */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-end justify-between">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {t('tutorProfile.priceLabel', { defaultValue: 'Стоимость' })}
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-green-500">{tutor.formatsData[0]?.amount.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">{t('pricingCard.sumPerLesson')}</div>
                  </div>
                </div>
              </div>
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
            </TabsList>

            {/* Posts Tab */}
            <TabsContent value="posts" className="mt-0">
              <div>
                <div className="grid grid-cols-3 gap-0.5 sm:gap-0.5 my-0 -mx-4 lg:mx-0">
                  {allPosts.map((post) => (
                    <div
                      key={post.id}
                      onClick={() => handlePostClick(post)}
                      className="aspect-[3/4] bg-gray-200 overflow-hidden cursor-pointer hover:opacity-75 transition-opacity min-w-[105px] sm:min-w-[140px] relative group"
                    >
                      {post.fileType === 'pdf' ? (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
                          <FileText className="h-12 w-12 text-gray-400 mb-2" />
                          <span className="text-xs text-gray-500">PDF</span>
                        </div>
                      ) : post.fileType === 'video' ? (
                        <div className="relative w-full h-full">
                          <video
                            src={post.image}
                            className="w-full h-full object-cover"
                            preload="metadata"
                            muted
                            playsInline
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/10 transition-opacity group-hover:bg-black/20">
                            <div className="bg-white/90 rounded-full p-2 sm:p-3 shadow-lg">
                              <Play className="h-6 w-6 sm:h-8 sm:w-8 text-gray-900 fill-gray-900" />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <img
                          src={post.image}
                          alt={`Post ${post.id}`}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  ))}
                </div>
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
          </Tabs>
        </div>

      {/* Image/File Preview Modal - Desktop Only */}
      <Dialog open={selectedPost !== null} onOpenChange={(open) => !open && setSelectedPost(null)}>
        <DialogContent className="hidden lg:block !max-w-[80vw] !w-[70vw] h-[95vh] p-0">
          <div className="flex h-full">
            {/* Left side - Image/File/Video Preview */}
            <div className="flex-1 bg-black flex items-center justify-center">
              {selectedPost?.fileType === 'pdf' ? (
                <div className="flex flex-col items-center gap-4">
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
                <InstagramVideoPlayer src={selectedPost.image} />
              ) : (
                <img
                  src={selectedPost?.image}
                  alt="Preview"
                  className="max-w-full max-h-full object-contain"
                />
              )}
            </div>

            {/* Right side - File Information */}
            <div className="p-6 bg-white overflow-y-auto flex-shrink-[2] flex-grow min-w-[405px] max-w-[500px]">
              <DialogHeader>
                <DialogTitle>File Information</DialogTitle>
              </DialogHeader>
              <div className="mt-4 space-y-4">
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
        </DialogContent>
      </Dialog>
    </>
  );
}
