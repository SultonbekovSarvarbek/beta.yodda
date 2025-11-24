import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

interface StoryItemProps {
  tutorName: string;
  tutorPhoto: string;
  viewed: boolean;
}

export function StoryItem({ tutorName, tutorPhoto, viewed }: StoryItemProps) {
  const { t } = useTranslation();

  const handleClick = () => {
    toast.info(t('stories.comingSoon'));
  };

  return (
    <div className="flex flex-col items-center gap-1 cursor-pointer" onClick={handleClick}>
      <div
        className={cn(
          'rounded-full p-0.5',
          viewed
            ? 'bg-gray-300'
            : 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500'
        )}
      >
        <div className="bg-white rounded-full p-0.5">
          <Avatar className="w-14 h-14">
            <AvatarImage src={tutorPhoto} alt={tutorName} />
            <AvatarFallback>{tutorName.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
      </div>
      <span className="text-xs text-gray-800 max-w-[64px] truncate">
        {tutorName.split(' ')[0]}
      </span>
    </div>
  );
}
