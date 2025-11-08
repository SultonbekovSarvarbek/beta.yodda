import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { categories } from '@/data/tutors';
import { cn } from '@/lib/utils';

interface CategoryNavProps {
  onCategoryChange?: (category: string) => void;
}

export function CategoryNav({ onCategoryChange }: CategoryNavProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const handleCategoryClick = (categoryName: string) => {
    setActiveCategory(categoryName);
    onCategoryChange?.(categoryName);
  };

  const allCategories = [{ name: 'All', icon: '🏠' }, ...categories];

  return (
    <div className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-hide">
          {/* Categories */}
          <div className="flex gap-6 flex-1">
            {allCategories.map((category) => (
              <button
                key={category.name}
                onClick={() => handleCategoryClick(category.name)}
                className={cn(
                  'flex flex-col items-center gap-2 pb-3 border-b-2 transition-colors whitespace-nowrap',
                  activeCategory === category.name
                    ? 'border-foreground text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                )}
              >
                <span className="text-2xl">{category.icon}</span>
                <span className="text-xs font-medium">{category.name}</span>
              </button>
            ))}
          </div>

          {/* Filter Button */}
          <Button variant="outline" size="sm" className="gap-2 shrink-0">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Filters
          </Button>
        </div>
      </div>
    </div>
  );
}
