import { Sidebar } from './Sidebar';
import { FeedContent } from './FeedContent';
import { SuggestionsPanel } from './SuggestionsPanel';
import { MobileHeader } from './MobileHeader';
import { BottomNavigation } from './BottomNavigation';
import { Footer } from './Footer';
import type { Story, Post } from '@/types/social';

interface FeedLayoutProps {
  stories: Story[];
  posts: Post[];
}

export function FeedLayout({ stories, posts }: FeedLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Mobile Header - Only visible on mobile */}
      <MobileHeader />

      {/* Desktop Sidebar - Hidden on mobile */}
      <Sidebar />

      {/* Main Feed */}
      <main className="flex-1 lg:ml-64 xl:mr-80 pb-16 lg:pb-0">
        <FeedContent stories={stories} posts={posts} />
      </main>

      {/* Desktop Suggestions Panel - Hidden on mobile */}
      <SuggestionsPanel />

      {/* Mobile Bottom Navigation - Only visible on mobile */}
      <BottomNavigation />

      {/* Footer */}
      <Footer />
    </div>
  );
}
