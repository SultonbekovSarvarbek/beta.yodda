import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from '@tanstack/react-router';
import { Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MediaUpload } from '@/components/MediaUpload';
import { useAuth } from '@/hooks/useAuth';
import { useSubjects } from '@/hooks/api';
import { createMiniLesson, getProfileAnnouncements } from '@/services/api';
import { useQuery } from '@tanstack/react-query';

type FormData = {
  title: string;
  description: string;
  subjectId: string;
  media: File | null;
  mediaType: 'photo' | 'video';
};

export function MiniLessonsUpload() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Check if user is a tutor
  const isTutor = user?.role_id === 1;
  const isSeeker = user?.role_id === 2;

  // Fetch tutor's announcements
  const { data: announcements, isLoading: loadingAnnouncements } = useQuery({
    queryKey: ['profile-announcements'],
    queryFn: getProfileAnnouncements,
    enabled: isAuthenticated && isTutor,
  });

  // Fetch subjects
  const { data: subjects = [], isLoading: loadingSubjects } = useSubjects();

  // Get first announcement ID
  const announcementId = announcements && announcements.length > 0 ? announcements[0].id : null;

  // Create Zod schema with translations
  const formSchema = useMemo(() => z.object({
    title: z.string().min(1, t('miniLessons.create.errors.titleRequired')).max(255, t('miniLessons.create.errors.titleTooLong')),
    description: z.string().min(1, t('miniLessons.create.errors.descriptionRequired')),
    subjectId: z.string().min(1, t('miniLessons.create.errors.subjectRequired')),
    media: z.instanceof(File).nullable().refine((file) => file !== null, {
      message: t('miniLessons.create.errors.mediaRequired'),
    }),
    mediaType: z.enum(['photo', 'video']),
  }), [t]);

  const {
    register,
    handleSubmit: handleFormSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      subjectId: '',
      media: null,
      mediaType: 'photo',
    },
  });

  const onSubmit = async (data: FormData) => {
    setSubmitError(null);
    setSubmitSuccess(false);

    // Check if tutor has announcement
    if (!announcementId) {
      setSubmitError(t('miniLessons.create.errors.noAnnouncement'));
      return;
    }

    try {
      // Create FormData object
      const apiFormData = new FormData();

      apiFormData.append('announcement_id', announcementId.toString());
      apiFormData.append('title', data.title.trim());
      apiFormData.append('description', data.description.trim());
      apiFormData.append('media_type', data.mediaType);
      apiFormData.append('is_active', 'true');

      if (data.subjectId) {
        apiFormData.append('subject_id', data.subjectId);
      }

      if (data.media) {
        apiFormData.append('media', data.media);
      }

      // Submit to API
      await createMiniLesson(apiFormData);

      setSubmitSuccess(true);
      setSubmitError(null);
      toast.success(t('miniLessons.create.success'));

      // Navigate to profile after 1 second
      setTimeout(() => {
        navigate({ to: '/profile' });
      }, 1000);
    } catch (error: any) {
      console.error('Form submission error:', error);
      setSubmitError(error?.response?.data?.message || error?.message || t('miniLessons.create.submitError'));
      setSubmitSuccess(false);
      toast.error(t('miniLessons.create.submitError'));
    }
  };

  // Show loading state
  if (loadingAnnouncements) {
    return (
      <div className="max-w-2xl mx-auto p-4 sm:p-6">
        <Card className="shadow-none border rounded-md">
          <CardContent className="flex items-center justify-center py-8 sm:py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check authentication
  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto p-4 sm:p-6">
        <Card className="shadow-none border rounded-md">
          <CardContent className="py-8 sm:py-12 px-4 sm:px-6">
            <div className="text-center space-y-4">
              <h2 className="text-xl font-semibold">
                {t('miniLessons.create.loginRequired') || 'Please log in to create mini lessons'}
              </h2>
              <Button
                onClick={() => navigate({ to: '/login' })}
                className="cursor-pointer"
              >
                {t('auth.login.title')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if user is tutor
  if (isSeeker || !isTutor) {
    return (
      <div className="max-w-2xl mx-auto p-4 sm:p-6">
        <Card className="shadow-none border rounded-md">
          <CardContent className="py-8 sm:py-12 px-4 sm:px-6">
            <div className="text-center space-y-4">
              <h2 className="text-xl font-semibold text-destructive">
                {t('miniLessons.create.tutorOnly') || 'Only tutors can create mini lessons'}
              </h2>
              <p className="text-muted-foreground">
                {t('miniLessons.create.tutorOnlyDescription') || 'You need to register as a tutor to create mini lessons.'}
              </p>
              <Button
                onClick={() => navigate({ to: '/be-tutor' })}
                className="cursor-pointer"
              >
                {t('sidebar.forTutors')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if tutor has announcement
  if (!announcementId) {
    return (
      <div className="max-w-2xl mx-auto p-4 sm:p-6">
        <Card className="shadow-none border rounded-md">
          <CardContent className="py-8 sm:py-12 px-4 sm:px-6">
            <div className="text-center space-y-4">
              <h2 className="text-xl font-semibold text-destructive">
                {t('miniLessons.create.errors.noAnnouncement')}
              </h2>
              <p className="text-muted-foreground">
                {t('miniLessons.create.createAnnouncementFirst') || 'Please create your tutor profile first before creating mini lessons.'}
              </p>
              <Button
                onClick={() => navigate({ to: '/be-tutor' })}
                className="cursor-pointer"
              >
                {t('sidebar.forTutors')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      <Card className="shadow-none border rounded-md">
        <CardHeader>
          <div className="flex items-center gap-4 mb-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate({ to: '/profile' })}
              className="cursor-pointer"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <CardTitle className="text-xl sm:text-2xl">
                {t('miniLessons.create.title')}
              </CardTitle>
              <CardDescription className="mt-1">
                {t('miniLessons.create.description') || 'Create a new mini lesson to share with students'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFormSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">{t('miniLessons.create.lessonTitle')}</Label>
              <Input
                id="title"
                placeholder={t('miniLessons.create.titlePlaceholder') || 'Enter lesson title...'}
                {...register('title')}
              />
              {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">{t('miniLessons.create.description')}</Label>
              <textarea
                id="description"
                placeholder={t('miniLessons.create.descriptionPlaceholder') || 'Describe what students will learn...'}
                {...register('description')}
                className="w-full min-h-[120px] px-3 py-2 border rounded-md text-sm sm:text-base resize-y"
              />
              {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
            </div>

            {/* Subject (Required) */}
            <div className="space-y-2">
              <Label htmlFor="subjectId">{t('miniLessons.create.subject')}</Label>
              <Controller
                name="subjectId"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={loadingSubjects ? t('common.loading') : t('miniLessons.create.selectSubject')} />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id.toString()}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.subjectId && <p className="text-sm text-red-500">{errors.subjectId.message}</p>}
            </div>

            {/* Media Upload */}
            <Controller
              name="media"
              control={control}
              render={({ field }) => (
                <MediaUpload
                  value={field.value ? URL.createObjectURL(field.value) : undefined}
                  onChange={(file, type) => {
                    field.onChange(file);
                    // Update media type through setValue if needed
                    if (file) {
                      // mediaType will be set automatically by MediaUpload
                    }
                  }}
                />
              )}
            />
            {errors.media && <p className="text-sm text-red-500">{errors.media.message}</p>}

            {/* Success/Error Messages */}
            {submitSuccess && (
              <div className="rounded-md bg-green-50 p-3 sm:p-4">
                <p className="text-xs sm:text-sm font-medium text-green-800">
                  {t('miniLessons.create.success')}
                </p>
              </div>
            )}

            {submitError && (
              <div className="rounded-md bg-red-50 p-3 sm:p-4">
                <p className="text-xs sm:text-sm font-medium text-red-800">
                  {submitError}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate({ to: '/profile' })}
                disabled={isSubmitting}
                className="cursor-pointer"
              >
                {t('common.cancel')}
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('miniLessons.create.submitting') || 'Creating...'}
                  </>
                ) : (
                  t('miniLessons.create.submit')
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
