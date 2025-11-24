import { Home, User, Users, LogIn, HelpCircle, PlayCircle, Plus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link, useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { CreateMenuDialog } from './CreateMenuDialog';
import { useState, useEffect } from 'react';
import { useMobileMenu } from '@/contexts/MobileMenuContext';

interface NavItem {
  icon: React.ReactNode;
  labelKey: string;
  to?: string;
  requiresAuth?: boolean;
}

export function Sidebar() {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { isOpen, closeMenu } = useMobileMenu();

  // Close menu when ESC key is pressed
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeMenu();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeMenu]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

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
    { icon: <PlayCircle className="w-6 h-6" />, labelKey: 'sidebar.miniLessons', to: '/mini-lessons' },
    { icon: <HelpCircle className="w-6 h-6" />, labelKey: 'sidebar.support', to: '/support' },
  ];

  const handleNavClick = () => {
    // Close mobile menu when navigation link is clicked
    closeMenu();
  };

  const handleCreateClick = () => {
    if (!isAuthenticated) {
      navigate({ to: '/login' });
    } else {
      setIsCreateDialogOpen(true);
    }
  };

  return (
    <>
      {/* Backdrop Overlay for Mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={closeMenu}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 h-full w-64 border-r bg-white p-4 flex flex-col z-50 transition-transform duration-300",
        // Desktop: always visible
        "lg:flex",
        // Mobile: slide in/out
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
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
              onClick={handleNavClick}
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

        {/* Create Button - Opens Dialog */}
        <Button
          variant="ghost"
          className="w-full justify-start gap-4 px-3 py-6 text-base hover:bg-gray-100 cursor-pointer"
          onClick={handleCreateClick}
        >
          <Plus className="w-6 h-6" />
          <span>{t('sidebar.create')}</span>
        </Button>

        {/* Authentication Section */}
        {isAuthenticated && user ? (
          <Link to="/profile">
            {({ isActive }) => (
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-4 px-3 py-6 text-base hover:bg-gray-100 cursor-pointer",
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

      {/* Create Menu Dialog */}
      <CreateMenuDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </>
  );
}
