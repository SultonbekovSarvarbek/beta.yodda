import { StoryItem } from './StoryItem';
import { YourStoryItem } from './YourStoryItem';
import { useAuth } from '@/hooks/useAuth';
import type { Story } from '@/types/social';

interface StoriesContainerProps {
  stories: Story[];
}

export function StoriesContainer({ stories }: StoriesContainerProps) {
  const { user, isAuthenticated } = useAuth();

  // Only show "Your Story" for authenticated tutors
  const showYourStory = isAuthenticated && user?.role === 'tutor';

  return (
    <div className="bg-white sm:border-0 md:border lg:border xl:border lg:rounded-lg p-4 mb-6 p-0">
      <div className="flex gap-4 overflow-x-auto scrollbar-hide">
        {/* Your Story - Only for Tutors */}
        {showYourStory && user && (
          <YourStoryItem
            userPhoto={user.avatar || ''}
            userName={user.name}
          />
        )}

        {/* Other Stories */}
        {stories.map((story) => (
          <StoryItem
            key={story.id}
            tutorName={story.tutorName}
            tutorPhoto={story.tutorPhoto}
            viewed={story.viewed}
          />
        ))}
      </div>
    </div>
  );
}
