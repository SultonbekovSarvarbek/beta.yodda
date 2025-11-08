import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Globe className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => changeLanguage('ru')}
          className={i18n.language === 'ru' ? 'bg-accent' : ''}
        >
          Русский
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => changeLanguage('uz')}
          className={i18n.language === 'uz' ? 'bg-accent' : ''}
        >
          O'zbek
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
