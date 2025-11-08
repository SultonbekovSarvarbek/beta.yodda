import { Plus, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function MobileHeader() {
  return (
    <header className="lg:hidden sticky top-0 z-50 bg-white border-b px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Instagram Logo */}
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'cursive' }}>
          Instagram
        </h1>

        {/* Right Icons */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Plus className="w-6 h-6" strokeWidth={2.5} />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 relative">
            <Heart className="w-6 h-6" strokeWidth={2.5} />
            {/* Notification badge */}
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>
        </div>
      </div>
    </header>
  );
}
