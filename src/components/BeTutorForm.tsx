import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Loader2, CheckCircle2 } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { AvatarUpload } from './AvatarUpload';
import { CertificateUpload } from './CertificateUpload';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MultiSelect } from '@/components/ui/multi-select';
import { Checkbox } from '@/components/ui/checkbox';
import { useSubjects, useEducationLevels, useRegions, useLanguages, useFormats, useDays } from '@/hooks/api';
import { useProfileAnnouncements } from '@/hooks/api/useProfileAnnouncements';
import { registerTutor, createAnnouncement } from '@/services/api';
import * as authService from '@/services/auth';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from '@tanstack/react-router';

// Type definition for form data
type FormData = {
  avatar: File | null;
  fullName: string;
  phoneNumber: string;
  telegramUsername?: string;
  email: string;
  gender: string;
  password: string;
  repeatPassword: string;
  age: string;
  regionId: string;
  cityId: string;
  selectedSubjects: number[];
  subjectsWithLevels: Array<{
    subjectId: number;
    selectedLevels: number[];
  }>;
  experienceYears: string;
  universityName: string;
  mba?: string;
  teachingLanguages: number[];
  pricePerHour: string;
  lessonDuration: string;
  availableDays: string[];
  timeSlots: Array<{
    day: string;
    time: string;
  }>;
  teachingFormat: string;
  bio: string;
  certificates: File[];
  additionalInfo: string;
};

// Helper function to generate time slots based on duration in minutes
const generateTimeSlots = (durationMinutes: number): string[] => {
  const slots: string[] = [];
  const startMinutes = 8 * 60; // 8:00 AM in minutes
  const endMinutes = 22 * 60; // 10:00 PM in minutes

  for (let minutes = startMinutes; minutes + durationMinutes <= endMinutes; minutes += durationMinutes) {
    const startHour = Math.floor(minutes / 60);
    const startMin = minutes % 60;
    const endTotalMinutes = minutes + durationMinutes;
    const endHour = Math.floor(endTotalMinutes / 60);
    const endMin = endTotalMinutes % 60;

    const startTime = `${startHour.toString().padStart(2, '0')}:${startMin.toString().padStart(2, '0')}`;
    const endTime = `${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`;
    slots.push(`${startTime} - ${endTime}`);
  }

  return slots;
};

export function BeTutorForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { announcements, loading: loadingAnnouncements } = useProfileAnnouncements();
  const [currentTab, setCurrentTab] = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [touchedDays, setTouchedDays] = useState<Set<string>>(new Set());
  const isSubmittingRef = useState(false);

  // Check if user is a tutor who already has announcements
  const isTutor = user?.role_id === 1;
  const isSeeker = user?.role_id === 2;
  const hasExistingAnnouncement = isTutor && announcements.length > 0;

  // Create Zod schema with translations
  const formSchema = useMemo(() => z.object({
    avatar: z.instanceof(File).nullable(),
    fullName: z.string().min(1, t('beTutorForm.errors.fullNameRequired')),
    phoneNumber: z.string().min(1, t('beTutorForm.errors.phoneRequired')),
    telegramUsername: z.string().optional(),
    email: z.string().min(1, t('beTutorForm.errors.emailRequired')).email(t('beTutorForm.errors.invalidEmail')),
    gender: z.string().min(1, t('beTutorForm.errors.genderRequired')),
    password: z.string().min(6, t('beTutorForm.errors.passwordMinLength')),
    repeatPassword: z.string().min(1, t('beTutorForm.errors.repeatPasswordRequired')),
    age: z.string().min(1, t('beTutorForm.errors.ageRequired')),
    regionId: z.string().min(1, t('beTutorForm.errors.regionRequired')),
    cityId: z.string().min(1, t('beTutorForm.errors.cityRequired')),
    selectedSubjects: z.array(z.number()).min(1, t('beTutorForm.errors.subjectsRequired')),
    subjectsWithLevels: z.array(z.object({
      subjectId: z.number(),
      selectedLevels: z.array(z.number()).min(1, t('beTutorForm.errors.levelsRequired')),
    })),
    experienceYears: z.string().min(1, t('beTutorForm.errors.experienceRequired')),
    universityName: z.string().min(1, t('beTutorForm.errors.universityRequired')),
    mba: z.string().optional(),
    teachingLanguages: z.array(z.number()).min(1, t('beTutorForm.errors.languagesRequired')),
    pricePerHour: z.string()
      .min(1, t('beTutorForm.errors.priceRequired'))
      .refine((val) => {
        const num = parseInt(val);
        return !isNaN(num) && num >= 50000;
      }, { message: t('beTutorForm.errors.priceMin') })
      .refine((val) => {
        const num = parseInt(val);
        return !isNaN(num) && num <= 500000;
      }, { message: t('beTutorForm.errors.priceMax') }),
    lessonDuration: z.string().min(1, t('beTutorForm.errors.durationRequired')),
    availableDays: z.array(z.string()).min(1, t('beTutorForm.errors.daysRequired')),
    timeSlots: z.array(z.object({
      day: z.string(),
      time: z.string(),
    })),
    teachingFormat: z.string().min(1, t('beTutorForm.errors.formatRequired')),
    bio: z.string().min(1, t('beTutorForm.errors.bioRequired')),
    certificates: z.array(z.instanceof(File)).min(1, t('beTutorForm.errors.certificatesRequired')),
    additionalInfo: z.string().min(1, t('beTutorForm.errors.additionalInfoRequired')),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: t('beTutorForm.errors.passwordMismatch'),
    path: ['repeatPassword'],
  })
  .superRefine((data, ctx) => {
    // Only validate time slots if both duration and days are selected
    if (data.lessonDuration && data.availableDays.length > 0) {
      // Check each selected day individually and add specific error messages
      data.availableDays.forEach(day => {
        const hasTimeslot = data.timeSlots.some(ts => ts.day === day);
        // Only show error if:
        // 1. User is submitting (validate all days), OR
        // 2. User has interacted with this day's timeslots
        if (!hasTimeslot && (isSubmittingRef[0] || touchedDays.has(day))) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('beTutorForm.errors.timeSlotsRequiredForDay', { day: t(`days.${day}`) }),
            path: ['timeSlots', day],
          });
        }
      });
    }
  }), [t, touchedDays, isSubmittingRef]);

  const {
    register,
    handleSubmit: handleFormSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      avatar: null,
      fullName: user?.name || '',
      phoneNumber: user?.phone || '',
      telegramUsername: '',
      email: user?.email || '',
      gender: user?.gender || '',
      password: '',
      repeatPassword: '',
      age: '',
      regionId: '',
      cityId: '',
      selectedSubjects: [],
      subjectsWithLevels: [],
      experienceYears: '',
      universityName: '',
      mba: '',
      teachingLanguages: [],
      pricePerHour: '',
      lessonDuration: '',
      availableDays: [],
      timeSlots: [],
      teachingFormat: '',
      bio: '',
      certificates: [],
      additionalInfo: '',
    },
  });

  // Watch form values for dependent logic
  const formData = watch();

  const tabs = [
    t('beTutorForm.tab1'),
    t('beTutorForm.tab2'),
    t('beTutorForm.tab3'),
    t('beTutorForm.tab4'),
  ];

  // Fetch subjects using React Query
  const { data: subjects = [], isLoading: loadingSubjects } = useSubjects();

  // Fetch education levels using React Query
  const {
    data: educationLevels = [],
    isLoading: loadingLevels
  } = useEducationLevels(formData.selectedSubjects, formData.selectedSubjects.length > 0);

  // Fetch regions using React Query
  const { data: regions = [], isLoading: loadingRegions } = useRegions();

  // Get cities for selected region
  const selectedRegion = regions.find(r => r.id.toString() === formData.regionId);
  const cities = selectedRegion?.cities || [];

  // Fetch languages using React Query
  const { data: languages = [], isLoading: loadingLanguages } = useLanguages();

  // Fetch formats using React Query
  const { data: formats = [], isLoading: loadingFormats } = useFormats();

  // Filter to show only online format
  const onlineFormats = formats.filter(format => format.value === 'online' || format.id === 8);

  // Fetch days using React Query
  const { data: days = [] } = useDays();

  // Map day IDs to English keys (for translation and storage)
  const dayIdToKey: Record<number, string> = {
    1: 'monday',
    2: 'tuesday',
    3: 'wednesday',
    4: 'thursday',
    5: 'friday',
    6: 'saturday',
    7: 'sunday'
  };

  // Create day options for MultiSelect (use English keys as values)
  const dayOptions = days.map(day => ({
    label: day.name,
    value: dayIdToKey[day.id] || day.name.toLowerCase(),
  }));

  // Create day mapping from English key to ID (for API submission)
  const dayMap: { [key: string]: number } = days.reduce((acc, day) => {
    const englishKey = dayIdToKey[day.id];
    if (englishKey) {
      acc[englishKey] = day.id;
    }
    return acc;
  }, {} as { [key: string]: number });

  // Initialize subjectsWithLevels when education levels data changes
  useEffect(() => {
    if (educationLevels.length > 0 && formData.selectedSubjects.length > 0) {
      const currentSubjects = formData.subjectsWithLevels;
      const newSubjectsWithLevels = formData.selectedSubjects.map(subjectId => {
        const existing = currentSubjects.find(s => s.subjectId === subjectId);
        return existing || { subjectId, selectedLevels: [] };
      });

      // Only update if the structure has changed (subjects added/removed)
      const currentIds = currentSubjects.map(s => s.subjectId).sort();
      const newIds = newSubjectsWithLevels.map(s => s.subjectId).sort();
      const hasChanged = JSON.stringify(currentIds) !== JSON.stringify(newIds);

      if (hasChanged) {
        setValue('subjectsWithLevels', newSubjectsWithLevels);
      }
    }
  }, [educationLevels, formData.selectedSubjects, setValue]);

  // Clear touched days when available days change
  useEffect(() => {
    setTouchedDays(new Set());
    isSubmittingRef[1](false);
  }, [formData.availableDays]);

  const handleSubjectLevelsChange = (subjectId: number, selectedLevels: number[]) => {
    const updatedSubjects = formData.subjectsWithLevels.map(s =>
      s.subjectId === subjectId ? { ...s, selectedLevels } : s
    );
    setValue('subjectsWithLevels', updatedSubjects, { shouldValidate: true });
  };

  const handleNext = () => {
    if (currentTab < tabs.length - 1) {
      setCurrentTab(currentTab + 1);
    }
  };

  const handlePrevious = () => {
    if (currentTab > 0) {
      setCurrentTab(currentTab - 1);
    }
  };

  // Map form fields to their respective tabs
  const getTabForField = (fieldName: string): number => {
    // Tab 0: Basic Information
    if (['avatar', 'fullName', 'phoneNumber', 'telegramUsername', 'email', 'gender', 'age', 'password', 'repeatPassword', 'regionId', 'cityId'].includes(fieldName)) {
      return 0;
    }
    // Tab 1: Professional Information
    if (['selectedSubjects', 'subjectsWithLevels', 'experienceYears', 'universityName', 'mba', 'teachingLanguages'].includes(fieldName)) {
      return 1;
    }
    // Tab 2: Work Conditions
    if (['pricePerHour', 'teachingFormat', 'lessonDuration', 'availableDays', 'timeSlots'].includes(fieldName)) {
      return 2;
    }
    // Tab 3: Additional Details
    if (['certificates', 'bio', 'additionalInfo'].includes(fieldName)) {
      return 3;
    }
    return 0; // Default to first tab
  };

  // Handle validation errors - navigate to first tab with error
  const onError = (errors: any) => {
    // Reset submitting ref after validation fails
    isSubmittingRef[1](false);

    const errorFields = Object.keys(errors);
    if (errorFields.length > 0) {
      const firstErrorField = errorFields[0];
      const tabWithError = getTabForField(firstErrorField);
      setCurrentTab(tabWithError);
    }
  };

  const onSubmit = async (data: FormData) => {
    setSubmitError(null);
    setSubmitSuccess(false);
    // Mark all days as touched to validate all on submit
    isSubmittingRef[1](true);

    try {
      // Password is required for registration (validated by schema)
      if (!data.password) {
        throw new Error('Password is required for registration');
      }

      // Step 1: Register tutor
      const registerPayload = {
        name: data.fullName.trim(),
        password: data.password,
        gender: data.gender === 'male' ? 1 : 2,
        phone: data.phoneNumber,
        email: data.email,
        age: data.age,
        termsAccepted: true,
        role_id: 1,
      };

      await registerTutor(registerPayload);

      // Step 2: Login to get token via centralized auth service
      await authService.login({
        phone: data.phoneNumber,
        password: data.password,
      });

      // Step 3: Create announcement
      // Create FormData object
      const apiFormData = new FormData();

      // Add basic fields
      apiFormData.append('fullname', data.fullName.trim());
      apiFormData.append('telegramUsername', data.telegramUsername || '');
      apiFormData.append('phone', data.phoneNumber);
      apiFormData.append('email', data.email);
      apiFormData.append('age', data.age);
      apiFormData.append('region_id', data.regionId);
      apiFormData.append('city_id', data.cityId);
      apiFormData.append('is_active', 'true');

      // Education fields
      apiFormData.append('education', data.universityName);
      apiFormData.append('mba', data.mba || '');

      // Experience
      apiFormData.append('experience', data.experienceYears);

      // Subjects and levels
      apiFormData.append('subjects', JSON.stringify(data.selectedSubjects));

      // Subject levels as JSON string
      const subjectLevels = data.subjectsWithLevels.map(({ subjectId, selectedLevels }) => ({
        subject_id: subjectId,
        levels: selectedLevels,
      }));
      apiFormData.append('subjectLevels', JSON.stringify(subjectLevels));

      // Teaching languages
      apiFormData.append('languages', JSON.stringify(data.teachingLanguages));

      // Price and format
      apiFormData.append('amount', data.pricePerHour);

      // Format data
      const formatsData = [{
        format_id: parseInt(data.teachingFormat),
        amount: data.pricePerHour,
        duration: parseInt(data.lessonDuration), // Duration is already in minutes
      }];
      apiFormData.append('formatsData', JSON.stringify(formatsData));
      apiFormData.append('formats', JSON.stringify([parseInt(data.teachingFormat)]));

      // Days mapping (using dynamic dayMap from API)
      const dayIds = data.availableDays.map(day => dayMap[day]).filter(Boolean);
      apiFormData.append('days', JSON.stringify(dayIds));

      // Schedule - group time slots by day
      // Map day ID to English abbreviation (backend expects English day names)
      const dayIdToAbbrev: Record<number, string> = {
        1: 'mon', 2: 'tue', 3: 'wed', 4: 'thu',
        5: 'fri', 6: 'sat', 7: 'sun'
      };

      const schedule: { [key: string]: string[] } = {};
      data.timeSlots.forEach(({ day, time }) => {
        const dayId = dayMap[day];
        const dayShort = dayIdToAbbrev[dayId];
        if (!schedule[dayShort]) {
          schedule[dayShort] = [];
        }
        schedule[dayShort].push(time.replace(' - ', '-'));
      });
      apiFormData.append('schedule', JSON.stringify(schedule));

      // Walking study (default values)
      apiFormData.append('walkingStudy', JSON.stringify({ enabled: false, days: [], duration: 60 }));

      // Text fields
      apiFormData.append('description', data.additionalInfo || '');
      apiFormData.append('aboutme', data.bio);

      // Qty students (default or could be added to form)
      apiFormData.append('qty_students', '10');

      // Avatar file
      if (data.avatar) {
        apiFormData.append('image', data.avatar);
      }

      // Certificate files
      data.certificates.forEach((file) => {
        apiFormData.append('files[]', file);
      });

      // Submit to API
      await createAnnouncement(apiFormData);

      setSubmitSuccess(true);
      setSubmitError(null);
      isSubmittingRef[1](false);

      // Reset form after successful submission
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error: any) {
      console.error('Form submission error:', error);
      setSubmitError(error?.response?.data?.message || error?.message || t('beTutorForm.submitError'));
      setSubmitSuccess(false);
      isSubmittingRef[1](false);
    }
  };

  // Show loading state while checking for existing announcements
  if (loadingAnnouncements && isAuthenticated && isTutor) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <Card className="shadow-none border rounded-md">
          <CardContent className="flex items-center justify-center py-8 sm:py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // If tutor already has an announcement, show message with redirect buttons
  if (hasExistingAnnouncement) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <Card className="shadow-none border rounded-md">
          <CardContent className="py-8 sm:py-12 px-4 sm:px-6">
            <div className="text-center space-y-4 sm:space-y-6">
              <div className="flex justify-center">
                <CheckCircle2 className="h-12 w-12 sm:h-16 sm:w-16 text-green-500" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold mb-2">
                  {t('beTutorForm.alreadyCreated') || 'You have already created your tutor profile'}
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                  {t('beTutorForm.alreadyCreatedDescription') || 'You can view or edit your profile from your account page.'}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Button
                  onClick={() => navigate({ to: '/profile' })}
                  variant="default"
                  className="cursor-pointer w-full sm:w-auto"
                >
                  {t('beTutorForm.viewProfile') || 'View Profile'}
                </Button>
                <Button
                  onClick={() => navigate({ to: '/' })}
                  variant="outline"
                  className="cursor-pointer w-full sm:w-auto"
                >
                  {t('common.home') || 'Home'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <Card className="shadow-none border rounded-md">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-xl sm:text-2xl">{t('beTutorForm.title')}</CardTitle>
              <CardDescription className="mt-1">
                {tabs[currentTab]}
              </CardDescription>
            </div>
            <Button
              type="submit"
              form="tutor-form"
              disabled={isSubmitting || isSeeker}
              variant="success"
              className="cursor-pointer w-full sm:w-auto shrink-0"
              title={isSeeker ? (t('beTutorForm.seekerCannotSubmit') || 'Seekers cannot create tutor profiles') : ''}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('beTutorForm.submitting')}
                </>
              ) : (
                t('beTutorForm.createProfile')
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Tabs Navigation */}
          <div className="mb-6 sm:mb-8 -mx-2 sm:mx-0">
            <div className="flex gap-2 overflow-x-auto px-2 sm:px-0 pb-2 sm:pb-0 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              {tabs.map((tab, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTab(index)}
                  className={`px-3 sm:px-4 py-2 rounded-lg whitespace-nowrap text-xs sm:text-sm font-medium transition-colors cursor-pointer shrink-0 ${
                    currentTab === index
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  <span className="hidden sm:inline">{index + 1}. </span>
                  <span className="sm:hidden">{index + 1}</span>
                  <span className="hidden sm:inline">{tab}</span>
                  <span className="sm:hidden">{tab.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          <form id="tutor-form" onSubmit={handleFormSubmit(onSubmit, onError)}>
            {/* Tab 1: Basic Information */}
            {currentTab === 0 && (
              <div className="space-y-6">
                <Controller
                  name="avatar"
                  control={control}
                  render={({ field }) => (
                    <AvatarUpload
                      value={field.value ? URL.createObjectURL(field.value) : undefined}
                      onChange={field.onChange}
                    />
                  )}
                />

                <div className="space-y-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">{t('beTutorForm.fullName')}</Label>
                    <Input
                      id="fullName"
                      placeholder="Мадина Усманова"
                      {...register('fullName')}
                    />
                    {errors.fullName && <p className="text-sm text-red-500">{errors.fullName.message}</p>}
                  </div>
                </div>

                <div className="flex flex-col md:grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">{t('beTutorForm.phoneNumber')}</Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      placeholder="+998901234567"
                      {...register('phoneNumber')}
                    />
                    {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>}
                  </div>

                   <div className="space-y-2">
                    <Label htmlFor="telegramUsername">{t('beTutorForm.telegramUsername')}</Label>
                    <Input
                      id="telegramUsername"
                      placeholder="@madina_usmanova"
                      {...register('telegramUsername')}
                    />
                    {errors.telegramUsername && <p className="text-sm text-red-500">{errors.telegramUsername.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">{t('beTutorForm.email')}</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="madina.usmanova@example.com"
                      {...register('email')}
                    />
                    {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">{t('beTutorForm.gender')}</Label>
                    <Controller
                      name="gender"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={t('beTutorForm.selectGender')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">{t('common.male')}</SelectItem>
                            <SelectItem value="female">{t('common.female')}</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.gender && <p className="text-sm text-red-500">{errors.gender.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age">{t('beTutorForm.age')}</Label>
                    <Input
                      id="age"
                      type="number"
                      {...register('age')}
                    />
                    {errors.age && <p className="text-sm text-red-500">{errors.age.message}</p>}
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="password">{t('beTutorForm.password')}</Label>
                    <Input
                      id="password"
                      type="password"
                      {...register('password')}
                    />
                    {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="repeatPassword">{t('beTutorForm.repeatPassword')}</Label>
                    <Input
                      id="repeatPassword"
                      type="password"
                      {...register('repeatPassword')}
                    />
                    {errors.repeatPassword && <p className="text-sm text-red-500">{errors.repeatPassword.message}</p>}

                    <p className="text-xs sm:text-sm text-yellow-700 bg-yellow-50 p-2 rounded-md">
                      Ваш номер телефона и пароль будут использоваться для входа в личный кабинет.
                    </p>
                  </div>


                  <div className="space-y-2">
                    <Label htmlFor="regionId" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {t('beTutorForm.region')}
                    </Label>
                    <Controller
                      name="regionId"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                            setValue('cityId', '', { shouldValidate: false });
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={loadingRegions ? t('common.loading') : t('beTutorForm.selectRegion')} />
                          </SelectTrigger>
                          <SelectContent>
                            {regions.map((region) => (
                              <SelectItem key={region.id} value={region.id.toString()}>
                                {region.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.regionId && <p className="text-sm text-red-500">{errors.regionId.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cityId" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {t('beTutorForm.city')}
                    </Label>
                    <Controller
                      name="cityId"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={!formData.regionId || cities.length === 0}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={!formData.regionId ? t('beTutorForm.selectRegionFirst') : t('beTutorForm.selectCity')} />
                          </SelectTrigger>
                          <SelectContent>
                            {cities.map((city) => (
                              <SelectItem key={city.id} value={city.id.toString()}>
                                {city.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.cityId && <p className="text-sm text-red-500">{errors.cityId.message}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Professional Information */}
            {currentTab === 1 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="subjects">{t('beTutorForm.subjects')}</Label>
                  <Controller
                    name="selectedSubjects"
                    control={control}
                    render={({ field }) => (
                      <MultiSelect
                        options={subjects.map(subject => ({
                          label: subject.name,
                          value: subject.id.toString(),
                        }))}
                        selected={field.value.map(id => id.toString())}
                        onChange={(selected) => {
                          const selectedIds = selected.map(id => parseInt(id));
                          field.onChange(selectedIds);
                        }}
                        placeholder={loadingSubjects ? t('common.loading') : t('beTutorForm.selectSubjects')}
                        searchPlaceholder={t('common.search')}
                        emptyText={t('common.noResults')}
                      />
                    )}
                  />
                  {errors.selectedSubjects && <p className="text-sm text-red-500">{errors.selectedSubjects.message}</p>}
                </div>

                {/* Education Levels for each selected subject */}
                {loadingLevels ? (
                  <div className="text-center py-4 text-muted-foreground">
                    {t('common.loading')}...
                  </div>
                ) : (
                  <>
                    {educationLevels.map((eduLevel) => {
                      const subjectData = formData.subjectsWithLevels.find(
                        s => s.subjectId === eduLevel.subject_id
                      );
                      const subjectIndex = formData.subjectsWithLevels.findIndex(
                        s => s.subjectId === eduLevel.subject_id
                      );
                      return (
                        <div key={eduLevel.subject_id} className="space-y-2">
                          <Label>{eduLevel.subject_name}</Label>
                          <MultiSelect
                            options={eduLevel.levels.map(level => ({
                              label: level.label,
                              value: level.value.toString(),
                            }))}
                            selected={subjectData?.selectedLevels.map(id => id.toString()) || []}
                            onChange={(selected) => {
                              const selectedLevels = selected.map(id => parseInt(id));
                              handleSubjectLevelsChange(eduLevel.subject_id, selectedLevels);
                            }}
                            placeholder={t('beTutorForm.selectEducationLevels')}
                            searchPlaceholder={t('common.search')}
                            emptyText={t('common.noResults')}
                          />
                          {subjectIndex >= 0 && errors.subjectsWithLevels?.[subjectIndex]?.selectedLevels && (
                            <p className="text-sm text-red-500">
                              {errors.subjectsWithLevels[subjectIndex].selectedLevels.message}
                            </p>
                          )}
                        </div>
                      );
                    })}
                    {errors.subjectsWithLevels && typeof errors.subjectsWithLevels.message === 'string' && (
                      <p className="text-sm text-red-500">{errors.subjectsWithLevels.message}</p>
                    )}
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="experienceYears">{t('beTutorForm.experienceYears')}</Label>
                  <Input
                    id="experienceYears"
                    type="number"
                    {...register('experienceYears')}
                  />
                  {errors.experienceYears && <p className="text-sm text-red-500">{errors.experienceYears.message}</p>}
                </div>

                <div className="space-y-4 border-t pt-4">
                  <h3 className="text-lg font-semibold">{t('beTutorForm.educationSection')}</h3>

                  <div className="space-y-2">
                    <Label htmlFor="universityName">{t('beTutorForm.universityName')}</Label>
                    <Input
                      id="universityName"
                      {...register('universityName')}
                      placeholder={t('beTutorForm.universityNamePlaceholder')}
                    />
                    {errors.universityName && <p className="text-sm text-red-500">{errors.universityName.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mba">{t('beTutorForm.mba')}</Label>
                    <Input
                      id="mba"
                      {...register('mba')}
                      placeholder={t('beTutorForm.mbaPlaceholder')}
                    />
                    {errors.mba && <p className="text-sm text-red-500">{errors.mba.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="teachingLanguages">{t('beTutorForm.teachingLanguages')}</Label>
                    <Controller
                      name="teachingLanguages"
                      control={control}
                      render={({ field }) => (
                        <MultiSelect
                          options={languages.map(language => ({
                            label: language.name,
                            value: language.id.toString(),
                          }))}
                          selected={field.value.map(id => id.toString())}
                          onChange={(selected) => {
                            const selectedIds = selected.map(id => parseInt(id));
                            field.onChange(selectedIds);
                          }}
                          placeholder={loadingLanguages ? t('common.loading') : t('beTutorForm.selectTeachingLanguages')}
                          searchPlaceholder={t('common.search')}
                          emptyText={t('common.noResults')}
                        />
                      )}
                    />
                    {errors.teachingLanguages && <p className="text-sm text-red-500">{errors.teachingLanguages.message}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Work Conditions */}
            {currentTab === 2 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="pricePerHour">{t('beTutorForm.pricePerHour')}</Label>
                  <p className="text-sm text-yellow-700">{t('beTutorForm.priceDescription')}</p>
                  <Input
                    id="pricePerHour"
                    type="number"
                    {...register('pricePerHour')}
                  />
                  {errors.pricePerHour && <p className="text-sm text-red-500">{errors.pricePerHour.message}</p>}
                </div>

                <div className="flex flex-col md:grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="teachingFormat">{t('beTutorForm.teachingFormat')}</Label>
                    <Controller
                      name="teachingFormat"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={loadingFormats ? t('common.loading') : t('beTutorForm.selectFormat')} />
                          </SelectTrigger>
                          <SelectContent>
                            {onlineFormats.map((format) => (
                              <SelectItem key={format.id} value={format.id.toString()}>
                                {format.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.teachingFormat && <p className="text-sm text-red-500">{errors.teachingFormat.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lessonDuration">{t('beTutorForm.lessonDuration')}</Label>
                    <Controller
                      name="lessonDuration"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                            setValue('timeSlots', [], { shouldValidate: false });
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={t('beTutorForm.selectDuration')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="30">30 минут (мини-сессия)</SelectItem>
                            <SelectItem value="45">45 минут (акад. урок)</SelectItem>
                            <SelectItem value="50">50 минут (урок)</SelectItem>
                            <SelectItem value="60">60 минут (час)</SelectItem>
                            <SelectItem value="90">90 минут (1.5 часа)</SelectItem>
                            <SelectItem value="120">120 минут (2 часа)</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.lessonDuration && <p className="text-sm text-red-500">{errors.lessonDuration.message}</p>}
                  </div>
                </div>

                  <div className="space-y-2">
                    <Label htmlFor="availableDays">{t('beTutorForm.availableDays')}</Label>
                    <Controller
                      name="availableDays"
                      control={control}
                      render={({ field }) => (
                        <MultiSelect
                          options={dayOptions}
                          selected={field.value}
                          onChange={(selected) => {
                            field.onChange(selected);
                            setValue('timeSlots', [], { shouldValidate: false });
                          }}
                          placeholder={t('beTutorForm.selectAvailableDays')}
                          searchPlaceholder={t('common.search')}
                          emptyText={t('common.noResults')}
                        />
                      )}
                    />
                    {errors.availableDays && <p className="text-sm text-red-500">{errors.availableDays.message}</p>}
                  </div>

                  {/* Time Slots Selection */}
                  {formData.lessonDuration && formData.availableDays.length > 0 && (
                    <div className="space-y-4">
                      <Label>{t('beTutorForm.timeSlots')}</Label>
                      <div className="text-sm text-muted-foreground mb-2">
                        {t('beTutorForm.timeSlotsDescription')}
                      </div>
                      {formData.availableDays.map((day) => {
                        // Get the error for this specific day
                        const dayError = errors.timeSlots?.[day as keyof typeof errors.timeSlots];
                        return (
                          <div key={day} className="space-y-2">
                            <h4 className="font-medium capitalize text-sm sm:text-base">{t(`days.${day}`)}</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                              {generateTimeSlots(parseInt(formData.lessonDuration)).map((slot) => {
                                const isSelected = formData.timeSlots.some(
                                  (ts) => ts.day === day && ts.time === slot
                                );
                                return (
                                  <div
                                    key={`${day}-${slot}`}
                                    className="flex items-center space-x-1.5 sm:space-x-2"
                                  >
                                    <Checkbox
                                      id={`${day}-${slot}`}
                                      checked={isSelected}
                                      onCheckedChange={(checked) => {
                                        // Mark this day as touched when user interacts with it
                                        setTouchedDays(prev => new Set(prev).add(day));

                                        if (checked) {
                                          setValue('timeSlots', [
                                            ...formData.timeSlots,
                                            { day, time: slot },
                                          ], { shouldValidate: true });
                                        } else {
                                          setValue(
                                            'timeSlots',
                                            formData.timeSlots.filter(
                                              (ts) => !(ts.day === day && ts.time === slot)
                                            ),
                                            { shouldValidate: true }
                                          );
                                        }
                                      }}
                                    />
                                    <label
                                      htmlFor={`${day}-${slot}`}
                                      className="text-xs sm:text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                    >
                                      {slot}
                                    </label>
                                  </div>
                                );
                              })}
                            </div>
                            {/* Show error message for this specific day */}
                            {dayError && (
                              <p className="text-sm text-red-500">
                                {typeof dayError === 'string' ? dayError : (dayError as any)?.message}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
              </div>
            )}

            {/* Tab 4: Additional Details */}
            {currentTab === 3 && (
              <div className="space-y-6">
                <Controller
                  name="certificates"
                  control={control}
                  render={({ field }) => (
                    <CertificateUpload
                      files={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                {errors.certificates && <p className="text-sm text-red-500">{errors.certificates.message}</p>}

                <div className="space-y-2">
                  <Label htmlFor="bio">{t('beTutorForm.bio')}</Label>
                  <textarea
                    id="bio"
                    placeholder="Пример: Я опытный преподаватель математики с индивидуальным подходом к каждому ученику. Помогаю достигать высоких результатов в короткие сроки."
                    {...register('bio')}
                    className="w-full min-h-[120px] px-3 py-2 border rounded-md text-sm sm:text-base resize-y"
                  />
                  {errors.bio && <p className="text-sm text-red-500">{errors.bio.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalInfo">{t('beTutorForm.additionalInfo')}</Label>
                  <textarea
                    id="additionalInfo"
                    placeholder="Пример: Помогаю улучшить грамматику и разговорную речь. Индивидуальный подход к каждому ученику."
                    {...register('additionalInfo')}
                    className="w-full min-h-[100px] px-3 py-2 border rounded-md text-sm sm:text-base resize-y"
                  />
                  {errors.additionalInfo && <p className="text-sm text-red-500">{errors.additionalInfo.message}</p>}
                </div>
              </div>
            )}

            {/* Success/Error Messages */}
            {submitSuccess && (
              <div className="rounded-md bg-green-50 p-3 sm:p-4 mt-4 sm:mt-6">
                <p className="text-xs sm:text-sm font-medium text-green-800">
                  {t('beTutorForm.submitSuccess')}
                </p>
              </div>
            )}

            {submitError && (
              <div className="rounded-md bg-red-50 p-3 sm:p-4 mt-4 sm:mt-6">
                <p className="text-xs sm:text-sm font-medium text-red-800">
                  {submitError}
                </p>
              </div>
            )}

            {/* Seeker Warning Message */}
            {isSeeker && (
              <div className="rounded-md bg-yellow-50 border border-yellow-200 p-3 sm:p-4 mt-4 sm:mt-6">
                <p className="text-xs sm:text-sm font-medium text-yellow-800">
                  {t('beTutorForm.seekerWarning') || 'You are currently registered as a seeker. Only tutors can create tutor profiles. If you want to become a tutor, please create a new tutor account.'}
                </p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 sm:gap-0 mt-6 sm:mt-8">
              <Button
                type="button"
                className="cursor-pointer w-full sm:w-auto"
                variant="outline"
                onClick={handlePrevious}
                disabled={currentTab === 0 || isSubmitting}
              >
                {t('common.previous')}
              </Button>

              {currentTab < tabs.length - 1 && (
                <Button type="button" className="cursor-pointer w-full sm:w-auto" onClick={handleNext} disabled={isSubmitting}>
                  {t('common.next')}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
