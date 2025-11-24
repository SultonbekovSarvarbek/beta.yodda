import { LogIn, Menu } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { useMobileMenu } from '@/contexts/MobileMenuContext';

export function MobileHeader() {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const { toggleMenu } = useMobileMenu();

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
        {/* Hamburger Menu Icon */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMenu}
          className="h-9 w-9"
        >
          <Menu className="h-6 w-6" />
        </Button>

        {/* Logo */}
        <Link to="/">
          <h1 className="text-xl font-bold cursor-pointer">
            YODDAGRAM
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
          <Link to="/login">
            <Button variant="ghost" size="sm" className="gap-1">
              <LogIn className="w-4 h-4" />
              <span className="text-sm">{t('auth.login.title')}</span>
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}
