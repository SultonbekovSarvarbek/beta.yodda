import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import { Check } from 'lucide-react';

interface SuggestionItemProps {
  id: string;
  name: string;
  photo: string;
  description: string;
}

export function SuggestionItem({ id, name, photo, description }: SuggestionItemProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleFollowClick = () => {
    navigate({ to: `/tutor/${id}` });
  };

  return (
    <div className="flex items-center justify-between py-1">
      <div className="flex items-center gap-3">
        <Avatar className="w-9 h-9 border">
          <AvatarImage src={photo} alt={name} />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="text-sm font-semibold">{name}</span>
            <div className="flex items-center justify-center w-3.5 h-3.5 bg-blue-500 rounded-full shrink-0">
              <Check className="w-2 h-2 text-white" strokeWidth={4} />
            </div>
          </div>
          <span className="text-xs text-gray-500">{description}</span>
        </div>
      </div>
      <Button
        variant="ghost"
        className="text-blue-500 font-semibold text-xs h-auto p-0 hover:bg-transparent cursor-pointer"
        onClick={handleFollowClick}
      >
        {t('suggestions.follow')}
      </Button>
    </div>
  );
}
