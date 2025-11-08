import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Send, Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PostActionsProps {
  liked: boolean;
  saved: boolean;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onSave?: () => void;
}

export function PostActions({
  liked,
  saved,
  onLike,
  onComment,
  onShare,
  onSave,
}: PostActionsProps) {
  return (
    <div className="flex items-center justify-between px-3 py-2">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-transparent"
          onClick={onLike}
        >
          <Heart
            className={cn('w-6 h-6', liked && 'fill-red-500 text-red-500')}
          />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-transparent"
          onClick={onComment}
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-transparent"
          onClick={onShare}
        >
          <Send className="w-6 h-6" />
        </Button>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 hover:bg-transparent"
        onClick={onSave}
      >
        <Bookmark className={cn('w-6 h-6', saved && 'fill-black')} />
      </Button>
    </div>
  );
}
