/**
 * Profile/Cabinet Page
 * Personal dashboard for authenticated users (tutors and seekers)
 */

import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProfileEditForm } from '@/components/ProfileEditForm';
import { PasswordChangeForm } from '@/components/PasswordChangeForm';
import { useFavorites } from '@/hooks/api/useFavorites';
import { FavoriteItem } from '@/components/FavoriteItem';
import { updateLanguage } from '@/services/auth';
import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';
import {
  User,
  Mail,
  Phone,
  Calendar,
  BookOpen,
  Star,
  Settings,
  Edit,
} from 'lucide-react';

export function Profile() {
  const { t } = useTranslation();
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const getUserInitials = (name: string) => {
    if (!name) return '??';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Profile Header */}
          <Card className="mb-6 border rounded-md">
            <CardContent className="pt-6">
              <div className="flex items-start gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-blue-600 text-white text-2xl">
                    {getUserInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-2xl font-bold">{user.name}</h1>
                      <Badge className="mt-2 capitalize">{user.role}</Badge>
                    </div>
                    <Button variant="outline" className="cursor-pointer" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      {t('common.edit')}
                    </Button>
                  </div>
                  <div className="mt-4 space-y-2 text-sm text-gray-600">
                    {user.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {user.email}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {user.phone}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Role-Specific Content */}
      {user.role === 'tutor' ? (
        <TutorDashboard />
      ) : (
        <SeekerDashboard />
      )}
    </div>
  );
}

/**
 * Tutor-specific dashboard content
 */
function TutorDashboard() {
  const { t } = useTranslation();

  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList>
        <TabsTrigger value="overview">
          <User className="h-4 w-4 mr-2" />
          {t('profile.overview') || 'Overview'}
        </TabsTrigger>
        <TabsTrigger value="schedule">
          <Calendar className="h-4 w-4 mr-2" />
          {t('profile.schedule') || 'Schedule'}
        </TabsTrigger>
        <TabsTrigger value="students">
          <BookOpen className="h-4 w-4 mr-2" />
          {t('profile.students') || 'Students'}
        </TabsTrigger>
        <TabsTrigger value="settings">
          <Settings className="h-4 w-4 mr-2" />
          {t('profile.settings') || 'Settings'}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                {t('profile.totalStudents') || 'Total Students'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-gray-500 mt-1">
                {t('profile.activeStudents') || 'Active students'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                {t('profile.totalLessons') || 'Total Lessons'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-gray-500 mt-1">
                {t('profile.completedLessons') || 'Completed lessons'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                {t('profile.rating') || 'Rating'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold">0.0</div>
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {t('profile.noReviews') || 'No reviews yet'}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('profile.aboutMe') || 'About Me'}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              {t('profile.noDescription') || 'No description added yet. Click Edit Profile to add your bio.'}
            </p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="schedule">
        <Card>
          <CardHeader>
            <CardTitle>{t('profile.mySchedule') || 'My Schedule'}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              {t('profile.scheduleEmpty') || 'Your schedule is empty. Set your availability to start receiving bookings.'}
            </p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="students">
        <Card>
          <CardHeader>
            <CardTitle>{t('profile.myStudents') || 'My Students'}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              {t('profile.noStudents') || 'You don\'t have any students yet.'}
            </p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="settings">
        <Card>
          <CardHeader>
            <CardTitle>{t('profile.profileSettings') || 'Profile Settings'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              {t('profile.settingsPlaceholder') || 'Manage your account settings and preferences.'}
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

/**
 * Seeker-specific dashboard content
 */
function SeekerDashboard() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { setUser } = useAuthStore();
  const { favorites, loading, error, deleteFavorite: deleteFavoriteApi, isDeleting } = useFavorites();
  const [isUpdatingLanguage, setIsUpdatingLanguage] = useState(false);

  // Debug logging to verify favorites data
  console.log('Favorites Debug:', {
    favorites,
    favoritesLength: favorites.length,
    loading,
    error,
    firstFavorite: favorites[0]
  });

  const handleDeleteFavorite = async (announcementId: number) => {
    try {
      await deleteFavoriteApi(announcementId);
    } catch (error) {
      console.error('Failed to delete favorite:', error);
    }
  };

  const handleLanguageChange = async (newLang: 'uz' | 'ru') => {
    if (!user) return;

    setIsUpdatingLanguage(true);
    try {
      const updatedUser = await updateLanguage(newLang);
      setUser(updatedUser);
      await i18n.changeLanguage(newLang);
      toast.success(
        newLang === 'uz' ? "Til o'zgartirildi" : 'Язык изменен'
      );
    } catch (error) {
      console.error('Failed to update language:', error);
      toast.error(
        newLang === 'uz'
          ? "Tilni o'zgartirishda xatolik"
          : 'Ошибка при изменении языка'
      );
    } finally {
      setIsUpdatingLanguage(false);
    }
  };

  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList>
        <TabsTrigger value="overview">
          <User className="h-4 w-4 mr-2" />
          {t('profile.overview') || 'Overview'}
        </TabsTrigger>
        <TabsTrigger value="bookings">
          <Calendar className="h-4 w-4 mr-2" />
          {t('profile.bookings') || 'My Bookings'}
        </TabsTrigger>
        <TabsTrigger value="favorites">
          <Star className="h-4 w-4 mr-2" />
          {t('profile.favorites') || 'Favorites'}
        </TabsTrigger>
        <TabsTrigger value="settings">
          <Settings className="h-4 w-4 mr-2" />
          {t('profile.settings') || 'Settings'}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                {t('profile.upcomingLessons') || 'Upcoming Lessons'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-gray-500 mt-1">
                {t('profile.scheduledLessons') || 'Scheduled lessons'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                {t('profile.completedLessons') || 'Completed Lessons'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-gray-500 mt-1">
                {t('profile.totalCompleted') || 'Total completed'}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('profile.personalInfo')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">{t('profile.yourRole')}</Label>
              <Input
                id="role"
                value={t('profile.roleSeeker')}
                disabled
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">{t('profile.gender')}</Label>
              <Input
                id="gender"
                value={user?.gender || ''}
                disabled
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">{t('profile.language')}</Label>
              <Select
                value={user?.lang || 'ru'}
                onValueChange={handleLanguageChange}
                disabled={isUpdatingLanguage}
              >
                <SelectTrigger id="language" className="w-full">
                  <SelectValue placeholder={t('profile.selectLanguage')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="uz">{t('profile.languageUzbek')}</SelectItem>
                  <SelectItem value="ru">{t('profile.languageRussian')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('profile.learningGoals') || 'My Learning Goals'}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              {t('profile.noGoals') || 'Set your learning goals to find the perfect tutor for you.'}
            </p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="bookings">
        <Card>
          <CardHeader>
            <CardTitle>{t('profile.myBookings') || 'My Bookings'}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              {t('profile.noBookings') || 'You don\'t have any bookings yet. Browse tutors to schedule a lesson!'}
            </p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="favorites">
        <Card className="border rounded-md">
          <CardHeader>
            <CardTitle>{t('profile.favoriteTutors') || 'Favorite Tutors'}</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-gray-600">{t('common.loading') || 'Loading...'}</p>
            ) : error ? (
              <p className="text-red-600">{error}</p>
            ) : favorites.length === 0 ? (
              <p className="text-gray-600">
                {t('profile.noFavorites') || 'You haven\'t saved any favorite tutors yet.'}
              </p>
            ) : (
              <div className="space-y-2">
                {favorites.map((announcement) => (
                  <FavoriteItem
                    key={announcement.id}
                    announcement={announcement}
                    onDelete={handleDeleteFavorite}
                    isDeleting={isDeleting}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="settings" className="space-y-6">
        <ProfileEditForm />
        <PasswordChangeForm />
      </TabsContent>
    </Tabs>
  );
}
