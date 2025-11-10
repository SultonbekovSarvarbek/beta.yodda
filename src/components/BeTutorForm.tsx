import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Loader2 } from 'lucide-react';
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
import { registerTutor, createAnnouncement } from '@/services/api';
import * as authService from '@/services/auth';

interface SubjectWithLevels {
  subjectId: number;
  selectedLevels: number[];
}

interface FormData {
  avatar: File | null;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  telegramUsername: string;
  email: string;
  gender: string;
  password: string;
  repeatPassword: string;
  age: string;
  regionId: string;
  cityId: string;
  selectedSubjects: number[];
  subjectsWithLevels: SubjectWithLevels[];
  experienceYears: string;
  universityName: string;
  mba: string;
  teachingLanguages: number[];
  pricePerHour: string;
  lessonDuration: string;
  availableDays: string[];
  timeSlots: { day: string; time: string }[];
  teachingFormat: string;
  bio: string;
  certificates: File[];
  additionalInfo: string;
}

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
  const [currentTab, setCurrentTab] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    avatar: null,
    firstName: '',
    lastName: '',
    phoneNumber: '',
    telegramUsername: '',
    email: '',
    gender: '',
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
  });

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
  const { data: days = [], isLoading: loadingDays } = useDays();

  // Create day options for MultiSelect (convert API data to options format)
  const dayOptions = days.map(day => ({
    label: day.name,
    value: day.name.toLowerCase(),
  }));

  // Create day mapping from name to ID (for API submission)
  const dayMap: { [key: string]: number } = days.reduce((acc, day) => {
    acc[day.name.toLowerCase()] = day.id;
    return acc;
  }, {} as { [key: string]: number });

  // Initialize subjectsWithLevels when education levels data changes
  useEffect(() => {
    if (educationLevels.length > 0) {
      const newSubjectsWithLevels = formData.selectedSubjects.map(subjectId => {
        const existing = formData.subjectsWithLevels.find(s => s.subjectId === subjectId);
        return existing || { subjectId, selectedLevels: [] };
      });
      setFormData(prev => ({ ...prev, subjectsWithLevels: newSubjectsWithLevels }));
    }
  }, [educationLevels]);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubjectLevelsChange = (subjectId: number, selectedLevels: number[]) => {
    setFormData(prev => ({
      ...prev,
      subjectsWithLevels: prev.subjectsWithLevels.map(s =>
        s.subjectId === subjectId ? { ...s, selectedLevels } : s
      ),
    }));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      // Validate passwords match
      if (formData.password !== formData.repeatPassword) {
        setSubmitError(t('beTutorForm.errors.passwordMismatch'));
        setIsSubmitting(false);
        return;
      }

      // Step 1: Register tutor
      const registerPayload = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        password: formData.password,
        gender: formData.gender === 'male' ? 1 : 2,
        phone: formData.phoneNumber,
        email: formData.email,
        age: formData.age,
        termsAccepted: true,
        role_id: 1,
      };

      await registerTutor(registerPayload);

      // Step 2: Login to get token via centralized auth service
      await authService.login({
        phone: formData.phoneNumber,
        password: formData.password,
      });

      // Step 3: Create announcement
      // Create FormData object
      const apiFormData = new FormData();

      // Add basic fields
      apiFormData.append('fullname', `${formData.firstName} ${formData.lastName}`.trim());
      apiFormData.append('telegramUsername', formData.telegramUsername);
      apiFormData.append('phone', formData.phoneNumber);
      apiFormData.append('email', formData.email);
      apiFormData.append('age', formData.age);
      apiFormData.append('region_id', formData.regionId);
      apiFormData.append('city_id', formData.cityId);
      apiFormData.append('is_active', 'true');

      // Education fields
      apiFormData.append('education', formData.universityName);
      apiFormData.append('mba', formData.mba);

      // Experience
      apiFormData.append('experience', formData.experienceYears);

      // Subjects and levels
      apiFormData.append('subjects', JSON.stringify(formData.selectedSubjects));

      // Subject levels as JSON string
      const subjectLevels = formData.subjectsWithLevels.map(({ subjectId, selectedLevels }) => ({
        subject_id: subjectId,
        levels: selectedLevels,
      }));
      apiFormData.append('subjectLevels', JSON.stringify(subjectLevels));

      // Teaching languages
      apiFormData.append('languages', JSON.stringify(formData.teachingLanguages));

      // Price and format
      apiFormData.append('amount', formData.pricePerHour);

      // Format data
      const formatsData = [{
        format_id: parseInt(formData.teachingFormat),
        amount: formData.pricePerHour,
        duration: parseInt(formData.lessonDuration), // Duration is already in minutes
      }];
      apiFormData.append('formatsData', JSON.stringify(formatsData));
      apiFormData.append('formats', JSON.stringify([parseInt(formData.teachingFormat)]));

      // Days mapping (using dynamic dayMap from API)
      const dayIds = formData.availableDays.map(day => dayMap[day]).filter(Boolean);
      apiFormData.append('days', JSON.stringify(dayIds));

      // Schedule - group time slots by day
      // Map day ID to English abbreviation (backend expects English day names)
      const dayIdToAbbrev: Record<number, string> = {
        1: 'mon', 2: 'tue', 3: 'wed', 4: 'thu',
        5: 'fri', 6: 'sat', 7: 'sun'
      };

      const schedule: { [key: string]: string[] } = {};
      formData.timeSlots.forEach(({ day, time }) => {
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
      apiFormData.append('description', formData.additionalInfo);
      apiFormData.append('aboutme', formData.bio);

      // Qty students (default or could be added to form)
      apiFormData.append('qty_students', '10');

      // Avatar file
      if (formData.avatar) {
        apiFormData.append('image', formData.avatar);
      }

      // Certificate files
      formData.certificates.forEach((file) => {
        apiFormData.append('files[]', file);
      });

      // Submit to API
      await createAnnouncement(apiFormData);

      setSubmitSuccess(true);
      setSubmitError(null);

      // Reset form after successful submission
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error: any) {
      console.error('Form submission error:', error);
      setSubmitError(error?.response?.data?.message || error?.message || t('beTutorForm.submitError'));
      setSubmitSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="shadow-none">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{t('beTutorForm.title')}</CardTitle>
              <CardDescription>
                {tabs[currentTab]}
              </CardDescription>
            </div>
            <Button type="button" variant="success">
              {t('beTutorForm.createProfile')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Tabs Navigation */}
          <div className="flex gap-2 mb-8 overflow-x-auto">
            {tabs.map((tab, index) => (
              <button
                key={index}
                onClick={() => setCurrentTab(index)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-colors cursor-pointer ${
                  currentTab === index
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {index + 1}. {tab}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {/* Tab 1: Basic Information */}
            {currentTab === 0 && (
              <div className="space-y-6">
                <AvatarUpload
                  value={formData.avatar ? URL.createObjectURL(formData.avatar) : undefined}
                  onChange={(file) => handleInputChange('avatar', file)}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">{t('beTutorForm.firstName')}</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">{t('beTutorForm.lastName')}</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">{t('beTutorForm.phoneNumber')}</Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telegramUsername">{t('beTutorForm.telegramUsername')}</Label>
                    <Input
                      id="telegramUsername"
                      value={formData.telegramUsername}
                      onChange={(e) => handleInputChange('telegramUsername', e.target.value)}
                      placeholder="@username"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">{t('beTutorForm.email')}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">{t('beTutorForm.gender')}</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => handleInputChange('gender', value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t('beTutorForm.selectGender')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">{t('common.male')}</SelectItem>
                        <SelectItem value="female">{t('common.female')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age">{t('beTutorForm.age')}</Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="password">{t('beTutorForm.password')}</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="repeatPassword">{t('beTutorForm.repeatPassword')}</Label>
                    <Input
                      id="repeatPassword"
                      type="password"
                      value={formData.repeatPassword}
                      onChange={(e) => handleInputChange('repeatPassword', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="regionId" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {t('beTutorForm.region')}
                    </Label>
                    <Select
                      value={formData.regionId}
                      onValueChange={(value) => {
                        handleInputChange('regionId', value);
                        // Reset city when region changes
                        handleInputChange('cityId', '');
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
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cityId" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {t('beTutorForm.city')}
                    </Label>
                    <Select
                  
                      value={formData.cityId}
                      onValueChange={(value) => handleInputChange('cityId', value)}
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
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Professional Information */}
            {currentTab === 1 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="subjects">{t('beTutorForm.subjects')}</Label>
                  <MultiSelect
                    options={subjects.map(subject => ({
                      label: subject.name,
                      value: subject.id.toString(),
                    }))}
                    selected={formData.selectedSubjects.map(id => id.toString())}
                    onChange={(selected) => {
                      const selectedIds = selected.map(id => parseInt(id));
                      handleInputChange('selectedSubjects', selectedIds);
                    }}
                    placeholder={loadingSubjects ? t('common.loading') : t('beTutorForm.selectSubjects')}
                    searchPlaceholder={t('common.search')}
                    emptyText={t('common.noResults')}
                  />
                </div>

                {/* Education Levels for each selected subject */}
                {loadingLevels ? (
                  <div className="text-center py-4 text-muted-foreground">
                    {t('common.loading')}...
                  </div>
                ) : (
                  educationLevels.map((eduLevel) => {
                    const subjectData = formData.subjectsWithLevels.find(
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
                      </div>
                    );
                  })
                )}

                <div className="space-y-2">
                  <Label htmlFor="experienceYears">{t('beTutorForm.experienceYears')}</Label>
                  <Input
                    id="experienceYears"
                    type="number"
                    value={formData.experienceYears}
                    onChange={(e) => handleInputChange('experienceYears', e.target.value)}
                  />
                </div>

                <div className="space-y-4 border-t pt-4">
                  <h3 className="text-lg font-semibold">{t('beTutorForm.educationSection')}</h3>

                  <div className="space-y-2">
                    <Label htmlFor="universityName">{t('beTutorForm.universityName')}</Label>
                    <Input
                      id="universityName"
                      value={formData.universityName}
                      onChange={(e) => handleInputChange('universityName', e.target.value)}
                      placeholder={t('beTutorForm.universityNamePlaceholder')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mba">{t('beTutorForm.mba')}</Label>
                    <Input
                      id="mba"
                      value={formData.mba}
                      onChange={(e) => handleInputChange('mba', e.target.value)}
                      placeholder={t('beTutorForm.mbaPlaceholder')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="teachingLanguages">{t('beTutorForm.teachingLanguages')}</Label>
                    <MultiSelect
                      options={languages.map(language => ({
                        label: language.name,
                        value: language.id.toString(),
                      }))}
                      selected={formData.teachingLanguages.map(id => id.toString())}
                      onChange={(selected) => {
                        const selectedIds = selected.map(id => parseInt(id));
                        handleInputChange('teachingLanguages', selectedIds);
                      }}
                      placeholder={loadingLanguages ? t('common.loading') : t('beTutorForm.selectTeachingLanguages')}
                      searchPlaceholder={t('common.search')}
                      emptyText={t('common.noResults')}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Work Conditions */}
            {currentTab === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pricePerHour">{t('beTutorForm.pricePerHour')}</Label>
                    <Input
                      id="pricePerHour"
                      type="number"
                      value={formData.pricePerHour}
                      onChange={(e) => handleInputChange('pricePerHour', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="teachingFormat">{t('beTutorForm.teachingFormat')}</Label>
                    <Select
                      value={formData.teachingFormat}
                      onValueChange={(value) => handleInputChange('teachingFormat', value)}
                    >
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
                  </div>
                </div>

                  <div className="space-y-2">
                    <Label htmlFor="lessonDuration">{t('beTutorForm.lessonDuration')}</Label>
                    <Select
                      value={formData.lessonDuration}
                      onValueChange={(value) => {
                        handleInputChange('lessonDuration', value);
                        // Reset time slots when duration changes
                        handleInputChange('timeSlots', []);
                      }}
                    >
                      <SelectTrigger className="w-sm">
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
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="availableDays">{t('beTutorForm.availableDays')}</Label>
                    <MultiSelect
                      options={dayOptions}
                      selected={formData.availableDays}
                      onChange={(selected) => {
                        handleInputChange('availableDays', selected);
                        // Reset time slots when days change
                        handleInputChange('timeSlots', []);
                      }}
                      placeholder={t('beTutorForm.selectAvailableDays')}
                      searchPlaceholder={t('common.search')}
                      emptyText={t('common.noResults')}
                    />
                  </div>

                  {/* Time Slots Selection */}
                  {formData.lessonDuration && formData.availableDays.length > 0 && (
                    <div className="space-y-4">
                      <Label>{t('beTutorForm.timeSlots')}</Label>
                      <div className="text-sm text-muted-foreground mb-2">
                        {t('beTutorForm.timeSlotsDescription')}
                      </div>
                      {formData.availableDays.map((day) => (
                        <div key={day} className="space-y-2">
                          <h4 className="font-medium capitalize">{t(`days.${day}`)}</h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                            {generateTimeSlots(parseInt(formData.lessonDuration)).map((slot) => {
                              const isSelected = formData.timeSlots.some(
                                (ts) => ts.day === day && ts.time === slot
                              );
                              return (
                                <div
                                  key={`${day}-${slot}`}
                                  className="flex items-center space-x-2"
                                >
                                  <Checkbox
                                    id={`${day}-${slot}`}
                                    checked={isSelected}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        handleInputChange('timeSlots', [
                                          ...formData.timeSlots,
                                          { day, time: slot },
                                        ]);
                                      } else {
                                        handleInputChange(
                                          'timeSlots',
                                          formData.timeSlots.filter(
                                            (ts) => !(ts.day === day && ts.time === slot)
                                          )
                                        );
                                      }
                                    }}
                                  />
                                  <label
                                    htmlFor={`${day}-${slot}`}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                  >
                                    {slot}
                                  </label>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            )}

            {/* Tab 4: Additional Details */}
            {currentTab === 3 && (
              <div className="space-y-6">
                <CertificateUpload
                  files={formData.certificates}
                  onChange={(files) => handleInputChange('certificates', files)}
                />

                <div className="space-y-2">
                  <Label htmlFor="bio">{t('beTutorForm.bio')}</Label>
                  <textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    className="w-full min-h-[120px] px-3 py-2 border rounded-md"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalInfo">{t('beTutorForm.additionalInfo')}</Label>
                  <textarea
                    id="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                    className="w-full min-h-[100px] px-3 py-2 border rounded-md"
                  />
                </div>
              </div>
            )}

            {/* Success/Error Messages */}
            {submitSuccess && (
              <div className="rounded-md bg-green-50 p-4 mt-6">
                <p className="text-sm font-medium text-green-800">
                  {t('beTutorForm.submitSuccess')}
                </p>
              </div>
            )}

            {submitError && (
              <div className="rounded-md bg-red-50 p-4 mt-6">
                <p className="text-sm font-medium text-red-800">
                  {submitError}
                </p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={currentTab === 0 || isSubmitting}
              >
                {t('common.previous')}
              </Button>

              {currentTab < tabs.length - 1 ? (
                <Button type="button" onClick={handleNext} disabled={isSubmitting}>
                  {t('common.next')}
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('beTutorForm.submitting')}
                    </>
                  ) : (
                    t('common.submit')
                  )}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
