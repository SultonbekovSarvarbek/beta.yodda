import { Link, useNavigate } from '@tanstack/react-router';
import { LogOut, User as UserIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserRole } from '@/constants/roles';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { LanguageSwitcher } from './LanguageSwitcher';
import { toast } from 'sonner';

export function Header() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoggingOut, logout } = useAuth();

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
    toast.success(t('auth.logoutSuccess') || 'Logged out successfully');
    navigate({ to: '/' });
  };

  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <a href="/" className="flex items-center gap-2 cursor-pointer">
              <svg
                className="h-8 w-8 text-primary"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 2.18l8 3.6v8.72c0 4.42-3.05 8.55-8 9.65-4.95-1.1-8-5.23-8-9.65V7.78l8-3.6z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <span className="text-xl font-bold text-primary">YODDAGRAM</span>
            </a>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <a
                href="#"
                className="text-sm font-medium hover:text-primary transition-colors relative cursor-pointer"
              >
                {t('header.experiences')}
                <Badge
                  variant="secondary"
                  className="absolute -top-2 -right-8 text-xs"
                >
                  {t('common.new')}
                </Badge>
              </a>
              <a
                href="#"
                className="text-sm font-medium hover:text-primary transition-colors relative cursor-pointer"
              >
                {t('header.services')}
                <Badge
                  variant="secondary"
                  className="absolute -top-2 -right-8 text-xs"
                >
                  {t('common.new')}
                </Badge>
              </a>
            </nav>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <Link to="/be-tutor">
              <Button variant="ghost" size="sm" className="hidden md:flex">
                {t('header.becomeTutor')}
              </Button>
            </Link>
            <LanguageSwitcher />

            {/* Show user menu when authenticated */}
            {isAuthenticated && user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-blue-600 text-white">
                        {getUserInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email || user.phone}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.role_id === UserRole.TUTOR
                          ? t('auth.register.roleTutor')
                          : t('auth.register.roleSeeker')}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <UserIcon className="mr-2 h-4 w-4" />
                      {t('auth.profile')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer"
                    disabled={isLoggingOut}
                  >
                    {isLoggingOut ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <LogOut className="mr-2 h-4 w-4" />
                    )}
                    {isLoggingOut ? t('auth.loggingOut') || 'Logging out...' : t('auth.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
