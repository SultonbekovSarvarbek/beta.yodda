import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { SuggestionItem } from './SuggestionItem';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { useAnnouncements } from '@/hooks/api';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface Suggestion {
  id: string;
  name: string;
  photo: string;
  description: string;
}

export function SuggestionsPanel() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoggingOut, logout } = useAuth();
  const { data: announcements, loading } = useAnnouncements();

  // Map API announcements to Suggestion format
  const suggestions: Suggestion[] = announcements.slice(0, 5).map(announcement => ({
    id: announcement.id.toString(),
    name: announcement.fullname,
    photo: announcement.image?.thumbnail || '',
    description: announcement.subjects.map(s => s.name).join(', ') || announcement.city.name,
  }));

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = async () => {
    await logout();
    toast.success(t('auth.logoutSuccess') || 'Logged out successfully');
    navigate({ to: '/' });
  };

  return (
    <div className="fixed right-0 top-0 w-80 h-full p-4 overflow-y-auto hidden xl:block">
      {/* Language Switcher */}
      <div className="flex justify-end mb-6">
        <LanguageSwitcher />
      </div>

      {/* Current User - Only show when authenticated */}
      {isAuthenticated && user && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Avatar className="w-11 h-11">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="bg-blue-600 text-white">
                {getUserInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">{user.name}</span>
              <span className="text-sm text-gray-500">{user.email || user.phone}</span>
            </div>
          </div>
          <Button
            variant="ghost"
            className="text-red-500 font-semibold text-xs h-auto p-0 hover:bg-transparent hover:text-red-600 flex items-center gap-1 cursor-pointer"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut && <Loader2 className="h-3 w-3 animate-spin" />}
            {isLoggingOut ? t('auth.loggingOut') || 'Logging out...' : t('suggestions.logout')}
          </Button>
        </div>
      )}

      {/* Suggestions */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-gray-500">{t('suggestions.suggestedForYou')}</span>
          <Button
            variant="ghost"
            className="text-xs h-auto p-0 hover:bg-transparent cursor-pointer"
            onClick={() => navigate({ to: '/tutors' })}
          >
            {t('suggestions.seeAll')}
          </Button>
        </div>
        <div className="space-y-3">
          {loading ? (
            <div className="text-sm text-gray-500">Загрузка...</div>
          ) : suggestions.length === 0 ? (
            <div className="text-sm text-gray-500">Нет рекомендаций</div>
          ) : (
            suggestions.map((suggestion) => (
              <SuggestionItem
                key={suggestion.id}
                id={suggestion.id}
                name={suggestion.name}
                photo={suggestion.photo}
                description={suggestion.description}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
