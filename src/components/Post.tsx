import type { Post as PostType } from '@/types/social';
import { PostHeader } from './PostHeader';
import { PostActions } from './PostActions';
import { PostComments } from './PostComments';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useTranslation } from 'react-i18next';

interface PostProps {
  post: PostType;
}

function useFormatTimestamp() {
  const { t } = useTranslation();

  return (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return t('post.secondsAgo', { count: diffInSeconds });
    if (diffInSeconds < 3600) return t('post.minutesAgo', { count: Math.floor(diffInSeconds / 60) });
    if (diffInSeconds < 86400) return t('post.hoursAgo', { count: Math.floor(diffInSeconds / 3600) });
    return t('post.daysAgo', { count: Math.floor(diffInSeconds / 86400) });
  };
}

export function Post({ post }: PostProps) {
  const { t } = useTranslation();
  const formatTimestamp = useFormatTimestamp();

  return (
    <div className="bg-white border-b lg:border lg:rounded-lg mb-0 lg:mb-6">
      {/* Header */}
      <PostHeader
        tutorName={post.tutorName}
        tutorPhoto={post.tutorPhoto}
        subject={post.subject}
        verified={post.verified}
      />

      {/* Image */}
      <AspectRatio ratio={1 / 1}>
        <img
          src={post.images[0]}
          alt={`Post by ${post.tutorName}`}
          className="w-full h-full object-cover"
        />
      </AspectRatio>

      {/* Actions */}
      <PostActions liked={post.liked} saved={post.saved} />

      {/* Likes count */}
      <div className="px-3 py-1">
        <span className="font-semibold text-sm">{t('post.likes', { count: post.likes })}</span>
      </div>

      {/* Comments */}
      <PostComments
        comments={post.comments}
        caption={post.caption}
        tutorName={post.tutorName}
      />

      {/* Timestamp */}
      <div className="px-3 py-2">
        <span className="text-xs text-gray-400 uppercase">
          {formatTimestamp(post.timestamp)}
        </span>
      </div>

      {/* Add comment */}
      <div className="border-t px-3 py-2 flex items-center gap-2">
        <input
          type="text"
          placeholder={t('post.addComment')}
          className="flex-1 outline-none text-sm"
        />
        <button className="text-blue-500 font-semibold text-sm">{t('post.post')}</button>
      </div>
    </div>
  );
}
