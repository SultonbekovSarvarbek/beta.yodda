import { FeedLayout } from '@/components/FeedLayout';
import { stories } from '@/data/stories';
import { posts } from '@/data/posts';

export function Feed() {
  return <FeedLayout stories={stories} posts={posts} />;
}
