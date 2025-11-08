import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface YourStoryItemProps {
  userPhoto: string;
  userName: string;
}

export function YourStoryItem({ userPhoto, userName }: YourStoryItemProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center gap-1 cursor-pointer flex-shrink-0">
      <div className="relative">
        <Avatar className="w-14 h-14">
          <AvatarImage src={userPhoto} alt={userName} />
          <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
        </Avatar>
        {/* Plus icon overlay */}
        <div className="absolute bottom-0 right-0 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
          <Plus className="w-3 h-3 text-white" strokeWidth={3} />
        </div>
      </div>
      <span className="text-xs text-gray-800 max-w-[64px] truncate">
        {t('stories.yourStory')}
      </span>
    </div>
  );
}
