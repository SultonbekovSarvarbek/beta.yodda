import { Home, Search, Film, MessageCircle, Heart, User, Menu } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

interface NavItem {
  icon: React.ReactNode;
  labelKey: string;
  active?: boolean;
  to?: string;
}

export function Sidebar() {
  const { t } = useTranslation();

  const navItems: NavItem[] = [
    { icon: <Home className="w-6 h-6" />, labelKey: 'sidebar.home', active: true, to: '/' },
    { icon: <Search className="w-6 h-6" />, labelKey: 'sidebar.search' },
    { icon: <Film className="w-6 h-6" />, labelKey: 'sidebar.reels' },
    { icon: <MessageCircle className="w-6 h-6" />, labelKey: 'sidebar.messages' },
    // { icon: <Heart className="w-6 h-6" />, labelKey: 'sidebar.notifications' },
    { icon: <User className="w-6 h-6" />, labelKey: 'sidebar.forParents' },
    { icon: <User className="w-6 h-6" />, labelKey: 'sidebar.forTutors', to: '/be-tutor' },
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
            <Link key={item.labelKey} to={item.to} className="block">
              <Button
                variant="ghost"
                className={cn(
                  'w-full justify-start gap-4 px-3 py-6 text-base hover:bg-gray-100',
                  item.active && 'font-bold'
                )}
              >
                {content}
              </Button>
            </Link>
          ) : (
            <Button
              key={item.labelKey}
              variant="ghost"
              className={cn(
                'w-full justify-start gap-4 px-3 py-6 text-base hover:bg-gray-100',
                item.active && 'font-bold'
              )}
            >
              {content}
            </Button>
          );
        })}

        {/* Profile */}
        <Button
          variant="ghost"
          className="w-full justify-start gap-4 px-3 py-6 text-base hover:bg-gray-100"
        >
          <Avatar className="w-6 h-6">
            <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop" />
            <AvatarFallback>ME</AvatarFallback>
          </Avatar>
          <span>{t('sidebar.profile')}</span>
        </Button>
      </nav>

      {/* More Menu */}
      <Button
        variant="ghost"
        className="w-full justify-start gap-4 px-3 py-6 text-base hover:bg-gray-100"
      >
        <Menu className="w-6 h-6" />
        <span>{t('sidebar.more')}</span>
      </Button>
    </div>
  );
}
