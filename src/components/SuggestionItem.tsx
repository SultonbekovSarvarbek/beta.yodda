import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface SuggestionItemProps {
  name: string;
  photo: string;
  description: string;
}

export function SuggestionItem({ name, photo, description }: SuggestionItemProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-3">
        <Avatar className="w-9 h-9">
          <AvatarImage src={photo} alt={name} />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-semibold">{name}</span>
          <span className="text-xs text-gray-500">{description}</span>
        </div>
      </div>
      <Button variant="ghost" className="text-blue-500 font-semibold text-xs h-auto p-0 hover:bg-transparent">
        {t('suggestions.follow')}
      </Button>
    </div>
  );
}
