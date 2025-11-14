/**
 * Profile/Cabinet Page
 * Personal dashboard for authenticated users (tutors and seekers)
 */

import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from '@tanstack/react-router';
import { UserRole } from '@/constants/roles';
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
import { useProfileAnnouncements } from '@/hooks/api/useProfileAnnouncements';
import {
  User,
  Mail,
  Phone,
  Calendar,
  BookOpen,
  Star,
  Settings,
  Edit,
  LogOut,
  Loader2,
  Eye,
  Trash2,
} from 'lucide-react';

export function Profile() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isLoggingOut = useAuthStore((state) => state.isLoggingOut);
  const [activeTab, setActiveTab] = useState('overview');

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

  const handleLogout = async () => {
    await logout();
    toast.success(t('auth.logoutSuccess'));
    navigate({ to: '/' });
  };

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Profile Header */}
          <Card className="mb-3 border rounded-md">
            <CardContent className="pt-4 sm:pt-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-start gap-4 sm:gap-6">
                <Avatar className="h-20 w-20 sm:h-24 sm:w-24 mx-auto sm:mx-0">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-blue-600 text-white text-xl sm:text-2xl">
                    {getUserInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 w-full">
                  <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-3 sm:gap-0">
                    <div className="text-center sm:text-left w-full sm:w-auto">
                      <h1 className="text-xl sm:text-2xl font-bold">{user.name}</h1>
                      <Badge className="mt-2">
                        {user.role_id === UserRole.TUTOR
                          ? t('auth.register.roleTutor')
                          : t('auth.register.roleSeeker')}
                      </Badge>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                      <Button
                        variant="outline"
                        className="cursor-pointer w-full sm:w-auto"
                        size="sm"
                        onClick={() => setActiveTab('settings')}
                      >
                        <Edit className="h-4 w-4" />
                        {t('common.edit')}
                      </Button>
                      <Button
                        variant="outline"
                        className="cursor-pointer w-full sm:w-auto"
                        size="sm"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                      >
                        {isLoggingOut ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <LogOut className="h-4 w-4" />
                        )}
                        {isLoggingOut ? t('auth.loggingOut') : t('auth.logout')}
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2 text-sm text-gray-600">
                    {user.email && (
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <Mail className="h-4 w-4" />
                        <span className="break-all">{user.email}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <Phone className="h-4 w-4" />
                      {user.phone}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Role-Specific Content */}
          <div className="p-3 border rounded-md bg-white">
      {user.role === 'tutor' ? (
        <TutorDashboard activeTab={activeTab} onTabChange={setActiveTab} />
      ) : (
        <SeekerDashboard activeTab={activeTab} onTabChange={setActiveTab} />
      )}
      </div>
    </div>
  );
}

/**
 * Tutor-specific dashboard content
 */
interface DashboardProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

function TutorDashboard({ activeTab, onTabChange }: DashboardProps) {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { setUser } = useAuthStore();
  const [isUpdatingLanguage, setIsUpdatingLanguage] = useState(false);
  const navigate = useNavigate();
  const { announcements, loading: announcementsLoading, deleteAnnouncement, isDeleting } = useProfileAnnouncements();

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

  const handleDeleteAnnouncement = async (announcementId: number) => {
    if (confirm(t('profile.confirmDeleteAnnouncement') || 'Are you sure you want to delete this announcement?')) {
      try {
        await deleteAnnouncement(announcementId);
        toast.success(t('profile.announcementDeleted') || 'Announcement deleted successfully');
      } catch (error) {
        console.error('Failed to delete announcement:', error);
        toast.error(t('profile.deleteAnnouncementError') || 'Failed to delete announcement');
      }
    }
  };

  const handleViewAnnouncement = (announcementId: number) => {
    navigate({ to: `/tutor/${announcementId}` });
  };

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-4 md:space-y-6">
      <TabsList className="w-full grid grid-cols-3 sm:grid-cols-3 h-auto">
        <TabsTrigger value="overview" className="text-xs sm:text-sm cursor-pointer">
          <User className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">{t('profile.overview') || 'Overview'}</span>
        </TabsTrigger>
        <TabsTrigger value="students" className="text-xs sm:text-sm cursor-pointer">
          <BookOpen className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">{t('profile.students') || 'Students'}</span>
        </TabsTrigger>
        <TabsTrigger value="settings" className="text-xs sm:text-sm cursor-pointer">
          <Settings className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">{t('profile.settings') || 'Settings'}</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4 md:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          <Card>
            <CardHeader className="pb-2 md:pb-3">
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
            <CardHeader className="pb-2 md:pb-3">
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
            <CardHeader className="pb-2 md:pb-3">
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

        <Card className="border rounded-md">
          <CardHeader className="pb-2">
            <CardTitle>{t('profile.personalInfo')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 md:space-y-4 pa-4 pt-0">
            <div className="space-y-2">
              <Label htmlFor="role">{t('profile.yourRole')}</Label>
              <Input
                id="role"
                value={t('auth.register.roleTutor')}
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
          <CardHeader className="p-4 md:p-6">
            <CardTitle>{t('profile.aboutMe') || 'About Me'}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0">
            <p className="text-gray-600">
              {t('profile.noDescription') || 'No description added yet. Click Edit Profile to add your bio.'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 md:p-6">
            <CardTitle>{t('profile.myAnnouncements') || 'My Announcements'}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0">
            {announcementsLoading ? (
              <p className="text-gray-600">{t('common.loading') || 'Loading...'}</p>
            ) : announcements.length === 0 ? (
              <p className="text-gray-600">
                {t('profile.noAnnouncements') || 'You haven\'t created any announcements yet.'}
              </p>
            ) : (
              <div className="space-y-3">
                {announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-lg">{announcement.fullname}</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {announcement.subjects.map((subject) => (
                          <Badge key={subject.id} variant="secondary">
                            {subject.name}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {t('profile.price')}: {announcement.min_price} - {announcement.max_price} {t('common.currency')}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewAnnouncement(announcement.id)}
                        className="cursor-pointer"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        {t('profile.view') || 'View'}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteAnnouncement(announcement.id)}
                        disabled={isDeleting}
                        className="cursor-pointer"
                      >
                        {isDeleting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4 mr-1" />
                        )}
                        {t('profile.delete') || 'Delete'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="students">
        <Card>
          <CardHeader className="p-4 md:p-6">
            <CardTitle>{t('profile.myStudents') || 'My Students'}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0">
            <p className="text-gray-600">
              {t('profile.noStudents') || 'You don\'t have any students yet.'}
            </p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="settings" className="space-y-4 md:space-y-6">
        <ProfileEditForm />
        <PasswordChangeForm />
      </TabsContent>
    </Tabs>
  );
}

/**
 * Seeker-specific dashboard content
 */
function SeekerDashboard({ activeTab, onTabChange }: DashboardProps) {
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
    <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-4 md:space-y-6">
      <TabsList className="w-full grid grid-cols-4 sm:grid-cols-4 h-auto">
        <TabsTrigger value="overview" className="text-xs sm:text-sm cursor-pointer">
          <User className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">{t('profile.overview') || 'Overview'}</span>
        </TabsTrigger>
        <TabsTrigger value="bookings" className="text-xs sm:text-sm cursor-pointer">
          <Calendar className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">{t('profile.bookings') || 'My Bookings'}</span>
        </TabsTrigger>
        <TabsTrigger value="favorites" className="text-xs sm:text-sm cursor-pointer">
          <Star className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">{t('profile.favorites') || 'Favorites'}</span>
        </TabsTrigger>
        <TabsTrigger value="settings" className="text-xs sm:text-sm cursor-pointer">
          <Settings className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">{t('profile.settings') || 'Settings'}</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4 md:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <Card className="pa-0 border rounded-md">
            <CardHeader className="pb-2 md:pb-3">
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

          <Card className="border rounded-md">
            <CardHeader className="pb-2 md:pb-3">
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

        <Card className="border rounded-md">
          <CardHeader className="pb-2">
            <CardTitle>{t('profile.personalInfo')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 md:space-y-4 pa-4 pt-0">
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

        <Card className="border rounded-md">
          <CardHeader className="p-4 p-6 pb-0">
            <CardTitle>{t('profile.learningGoals') || 'My Learning Goals'}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 p-6 pt-0">
            <p className="text-gray-600">
              {t('profile.noGoals') || 'Set your learning goals to find the perfect tutor for you.'}
            </p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="bookings">
        <Card className='border rounded-md'>
          <CardHeader className="p-4 p-6 pb-0">
            <CardTitle>{t('profile.myBookings') || 'My Bookings'}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 p-6 pt-0">
            <p className="text-gray-600">
              {t('profile.noBookings') || 'You don\'t have any bookings yet. Browse tutors to schedule a lesson!'}
            </p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="favorites">
        <Card className="border rounded-md">
          <CardHeader className="p-4 p-6 pb-0">
            <CardTitle>{t('profile.favoriteTutors') || 'Favorite Tutors'}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 p-6 pt-0">
            {loading ? (
              <p className="text-gray-600">{t('common.loading') || 'Loading...'}</p>
            ) : error ? (
              <p className="text-red-600">{error}</p>
            ) : favorites.length === 0 ? (
              <p className="text-gray-600">
                {t('profile.noFavorites') || 'You haven\'t saved any favorite tutors yet.'}
              </p>
            ) : (
              <div className="space-y-2 md:space-y-3">
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

      <TabsContent value="settings" className="space-y-4 md:space-y-6">
        <ProfileEditForm />
        <PasswordChangeForm />
      </TabsContent>
    </Tabs>
  );
}
