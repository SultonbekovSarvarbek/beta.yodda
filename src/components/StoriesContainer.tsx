import { StoryItem } from './StoryItem';
import { YourStoryItem } from './YourStoryItem';
import type { Story } from '@/types/social';

interface StoriesContainerProps {
  stories: Story[];
}

export function StoriesContainer({ stories }: StoriesContainerProps) {
  return (
    <div className="bg-white border-b lg:border lg:rounded-lg p-4 mb-0 lg:mb-6">
      <div className="flex gap-4 overflow-x-auto scrollbar-hide">
        {/* Your Story - First Item */}
        <YourStoryItem
          userPhoto="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop"
          userName="You"
        />

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
