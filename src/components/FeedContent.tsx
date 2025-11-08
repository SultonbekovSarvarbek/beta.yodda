import { StoriesContainer } from './StoriesContainer';
import { Post } from './Post';
import type { Story, Post as PostType } from '@/types/social';

interface FeedContentProps {
  stories: Story[];
  posts: PostType[];
}

export function FeedContent({ stories, posts }: FeedContentProps) {
  return (
    <div className="max-w-[470px] mx-auto pt-0 lg:pt-8 px-0 lg:px-0">
      {/* Stories */}
      <StoriesContainer stories={stories} />

      {/* Posts */}
      <div>
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
