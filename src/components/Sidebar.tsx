import { Home, User, Users, LogIn, HelpCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';

interface NavItem {
  icon: React.ReactNode;
  labelKey: string;
  to?: string;
}

export function Sidebar() {
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

  const navItems: NavItem[] = [
    { icon: <Home className="w-6 h-6" />, labelKey: 'sidebar.home', to: '/' },
    // { icon: <Search className="w-6 h-6" />, labelKey: 'sidebar.search' },
    { icon: <Users className="w-6 h-6" />, labelKey: 'sidebar.allTutors', to: '/tutors' },
    // { icon: <Film className="w-6 h-6" />, labelKey: 'sidebar.reels' },
    // { icon: <MessageCircle className="w-6 h-6" />, labelKey: 'sidebar.messages' },
    // { icon: <Heart className="w-6 h-6" />, labelKey: 'sidebar.notifications' },
    { icon: <User className="w-6 h-6" />, labelKey: 'sidebar.forParents', to: '/for-parents' },
    { icon: <User className="w-6 h-6" />, labelKey: 'sidebar.forTutors', to: '/be-tutor' },
    { icon: <HelpCircle className="w-6 h-6" />, labelKey: 'sidebar.support', to: '/support' },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 border-r bg-white p-4 flex flex-col hidden lg:flex">
      {/* Logo */}
      <div className="mb-10 px-3">
        <Link to="/">
          <h1 className="text-2xl font-semibold cursor-pointer">{t('sidebar.appName')}</h1>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const content = (
            <>
              {item.icon}
              <span>{t(item.labelKey)}</span>
            </>
          );

          return item.to ? (
            <Link
              key={item.labelKey}
              to={item.to}
              className="block cursor-pointer"
            >
              {({ isActive }) => (
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-4 px-3 py-6 text-base hover:bg-gray-100 cursor-pointer",
                    isActive && "font-bold"
                  )}
                >
                  {content}
                </Button>
              )}
            </Link>
          ) : (
            <Button
              key={item.labelKey}
              variant="ghost"
              className="w-full justify-start gap-4 px-3 py-6 text-base hover:bg-gray-100 cursor-pointer"
            >
              {content}
            </Button>
          );
        })}

        {/* Authentication Section */}
        {isAuthenticated && user ? (
          <Link to="/profile">
            {({ isActive }) => (
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-4 px-3 py-6 text-base hover:bg-gray-100",
                  isActive && "font-bold"
                )}
              >
                <Avatar className="w-6 h-6">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="bg-blue-600 text-white text-xs">
                    {getUserInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <span>{t('sidebar.profile')}</span>
              </Button>
            )}
          </Link>
        ) : (
          <div className="space-y-2">
            <Link to="/login">
              {({ isActive }) => (
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-4 px-3 py-6 text-base hover:bg-gray-100 cursor-pointer",
                    isActive && "font-bold"
                  )}
                >
                  <LogIn className="w-6 h-6" />
                  <span>{t('auth.login.title')}</span>
                </Button>
              )}
            </Link>
            {/* <Link to="/register">
              {({ isActive }) => (
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-4 px-3 py-6 text-base hover:bg-gray-100",
                    isActive && "font-bold"
                  )}
                >
                  <UserPlus className="w-6 h-6" />
                  <span>{t('auth.register.title')}</span>
                </Button>
              )}
            </Link> */}
          </div>
        )}
      </nav>

      {/* Cabinet/Profile Menu - Only show when authenticated */}
      {isAuthenticated && user && (
        <Link to="/profile">
          {({ isActive }) => (
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-4 px-3 py-6 text-base hover:bg-gray-100",
                isActive && "font-bold"
              )}
            >
              <User className="w-6 h-6" />
              <span>{t('sidebar.cabinet')}</span>
            </Button>
          )}
        </Link>
      )}
    </div>
  );
}
