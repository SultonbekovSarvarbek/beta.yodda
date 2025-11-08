import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
  subjects: string[];
  experienceYears: string;
  education: string;
  certifications: string;
  pricePerHour: string;
  teachingFormat: string;
  location: string;
  bio: string;
  languages: string;
  additionalInfo: string;
}

export function BeTutorForm() {
  const { t } = useTranslation();
  const [currentTab, setCurrentTab] = useState(0);
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
    subjects: [],
    experienceYears: '',
    education: '',
    certifications: '',
    pricePerHour: '',
    teachingFormat: '',
    location: '',
    bio: '',
    languages: '',
    additionalInfo: '',
  });

  const tabs = [
    t('beTutorForm.tab1'),
    t('beTutorForm.tab2'),
    t('beTutorForm.tab3'),
    t('beTutorForm.tab4'),
  ];

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission
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
                className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-colors ${
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
                <div className="flex justify-center">
                  <AvatarUpload
                    value={formData.avatar ? URL.createObjectURL(formData.avatar) : undefined}
                    onChange={(file) => handleInputChange('avatar', file)}
                  />
                </div>

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
                      <SelectTrigger>
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

                  <div className="space-y-2">
                    <Label htmlFor="password">{t('beTutorForm.password')}</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="repeatPassword">{t('beTutorForm.repeatPassword')}</Label>
                    <Input
                      id="repeatPassword"
                      type="password"
                      value={formData.repeatPassword}
                      onChange={(e) => handleInputChange('repeatPassword', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Professional Information */}
            {currentTab === 1 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="subjects">{t('beTutorForm.subjects')}</Label>
                  <Input
                    id="subjects"
                    value={formData.subjects.join(', ')}
                    onChange={(e) => handleInputChange('subjects', e.target.value.split(', '))}
                    placeholder={t('beTutorForm.selectSubjects')}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="experienceYears">{t('beTutorForm.experienceYears')}</Label>
                    <Input
                      id="experienceYears"
                      type="number"
                      value={formData.experienceYears}
                      onChange={(e) => handleInputChange('experienceYears', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="education">{t('beTutorForm.education')}</Label>
                    <Input
                      id="education"
                      value={formData.education}
                      onChange={(e) => handleInputChange('education', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="certifications">{t('beTutorForm.certifications')}</Label>
                  <Input
                    id="certifications"
                    value={formData.certifications}
                    onChange={(e) => handleInputChange('certifications', e.target.value)}
                  />
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
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="online">{t('beTutorForm.online')}</SelectItem>
                        <SelectItem value="offline">{t('beTutorForm.offline')}</SelectItem>
                        <SelectItem value="both">{t('beTutorForm.both')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">{t('beTutorForm.location')}</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Tab 4: Additional Details */}
            {currentTab === 3 && (
              <div className="space-y-6">
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
                  <Label htmlFor="languages">{t('beTutorForm.languages')}</Label>
                  <Input
                    id="languages"
                    value={formData.languages}
                    onChange={(e) => handleInputChange('languages', e.target.value)}
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

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={currentTab === 0}
              >
                {t('common.previous')}
              </Button>

              {currentTab < tabs.length - 1 ? (
                <Button type="button" onClick={handleNext}>
                  {t('common.next')}
                </Button>
              ) : (
                <Button type="submit">{t('common.submit')}</Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
