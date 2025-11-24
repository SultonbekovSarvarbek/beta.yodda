import { Home, Search, Users, PlaySquare } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from '@tanstack/react-router';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

export function BottomNavigation() {
  const { user, isAuthenticated } = useAuth();

  const navItems = [
    { icon: Home, label: 'Home', path: '/', active: true },
    { icon: Search, label: 'Search', path: '/tutors', active: false },
    { icon: Users, label: 'For Parents', path: '/for-parents', active: false },
    { icon: PlaySquare, label: 'Mini Lessons', path: '/mini-lessons', active: false, badge: false },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center justify-center p-2 relative cursor-pointer"
            >
              <div className="relative">
                <Icon
                  className={cn(
                    'w-6 h-6',
                    item.active ? 'fill-black stroke-black' : 'stroke-black'
                  )}
                  strokeWidth={item.active ? 0 : 2}
                />
                {item.badge && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </div>
            </Link>
          );
        })}

        {/* Profile Avatar - only show if authenticated */}
        {isAuthenticated && user && (
          <Link to="/profile" className="flex flex-col items-center justify-center p-2 cursor-pointer">
            <Avatar className="w-6 h-6 ring-2 ring-black">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
          </Link>
        )}
      </div>
    </nav>
  );
}
