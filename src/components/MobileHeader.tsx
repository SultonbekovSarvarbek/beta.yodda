import { LogIn, UserPlus } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';

export function MobileHeader() {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();

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
    <header className="lg:hidden sticky top-0 z-50 bg-white border-b px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link to="/">
          <h1 className="text-2xl font-bold cursor-pointer">
            Yodagram
          </h1>
        </Link>

        {/* Right Side - Auth Buttons or User Avatar */}
        {isAuthenticated && user ? (
          <Link to="/profile">
            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-blue-600 text-white text-xs">
                {getUserInitials(user.name)}
              </AvatarFallback>
            </Avatar>
          </Link>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="gap-1">
                <LogIn className="w-4 h-4" />
                <span className="text-sm">{t('auth.login.title')}</span>
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700 gap-1">
                <UserPlus className="w-4 h-4" />
                <span className="text-sm">{t('auth.register.title')}</span>
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
