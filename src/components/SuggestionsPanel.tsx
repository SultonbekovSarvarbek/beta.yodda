import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { SuggestionItem } from './SuggestionItem';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';

interface Suggestion {
  id: string;
  name: string;
  photo: string;
  description: string;
}

const suggestions: Suggestion[] = [
  {
    id: '1',
    name: 'James Wilson',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
    description: 'Chemistry tutor',
  },
  {
    id: '2',
    name: 'Lisa Anderson',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop',
    description: 'Biology expert',
  },
  {
    id: '3',
    name: 'Robert Taylor',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop',
    description: 'History professor',
  },
  {
    id: '4',
    name: 'Jennifer Lee',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    description: 'English literature',
  },
  {
    id: '5',
    name: 'Daniel Brown',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    description: 'Music theory',
  },
];

export function SuggestionsPanel() {
  const { t } = useTranslation();

  return (
    <div className="fixed right-0 top-0 w-80 h-full p-4 overflow-y-auto hidden xl:block">
      {/* Language Switcher */}
      <div className="flex justify-end mb-6">
        <LanguageSwitcher />
      </div>

      {/* Current User */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Avatar className="w-11 h-11">
            <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop" />
            <AvatarFallback>ME</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">yourprofile</span>
            <span className="text-sm text-gray-500">{t('suggestions.yourProfile')}</span>
          </div>
        </div>
        <Button variant="ghost" className="text-blue-500 font-semibold text-xs h-auto p-0 hover:bg-transparent">
          {t('suggestions.logout')}
        </Button>
      </div>

      {/* Suggestions */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-gray-500">{t('suggestions.suggestedForYou')}</span>
          <Button variant="ghost" className="text-xs h-auto p-0 hover:bg-transparent">
            {t('suggestions.seeAll')}
          </Button>
        </div>
        <div className="space-y-3">
          {suggestions.map((suggestion) => (
            <SuggestionItem
              key={suggestion.id}
              name={suggestion.name}
              photo={suggestion.photo}
              description={suggestion.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
