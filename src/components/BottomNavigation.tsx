import { Home, Search, Film, Heart } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from '@tanstack/react-router';
import { cn } from '@/lib/utils';

export function BottomNavigation() {

  const navItems = [
    { icon: Home, label: 'Home', path: '/', active: true },
    { icon: Search, label: 'Search', path: '/search', active: false },
    { icon: Film, label: 'Reels', path: '/reels', active: false },
    { icon: Heart, label: 'Notifications', path: '/notifications', active: false, badge: true },
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

        {/* Profile Avatar */}
        <Link to="/" className="flex flex-col items-center justify-center p-2 cursor-pointer">
          <Avatar className="w-6 h-6 ring-2 ring-black">
            <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop" />
            <AvatarFallback>ME</AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </nav>
  );
}
