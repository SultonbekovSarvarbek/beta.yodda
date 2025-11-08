import type { Comment } from '@/types/social';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface PostCommentsProps {
  comments: Comment[];
  caption: string;
  tutorName: string;
}

export function PostComments({ comments, caption, tutorName }: PostCommentsProps) {
  const { t } = useTranslation();

  return (
    <div className="px-3 py-1 space-y-2">
      {/* Caption */}
      <div className="text-sm">
        <span className="font-semibold mr-2">{tutorName}</span>
        <span>{caption}</span>
      </div>

      {/* View all comments */}
      {comments.length > 2 && (
        <Button variant="ghost" className="h-auto p-0 text-sm text-gray-500 hover:bg-transparent">
          {t('post.viewAllComments', { count: comments.length })}
        </Button>
      )}

      {/* Show latest 2 comments */}
      {comments.slice(-2).map((comment) => (
        <div key={comment.id} className="text-sm">
          <span className="font-semibold mr-2">{comment.userName}</span>
          <span>{comment.text}</span>
        </div>
      ))}
    </div>
  );
}
