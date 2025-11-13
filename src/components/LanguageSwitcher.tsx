import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/stores/authStore';
import { updateLanguage } from '@/services/auth';
import { toast } from 'sonner';

const LANGUAGE_STORAGE_KEY = 'i18n_language';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const { user, setUser } = useAuthStore();

  const changeLanguage = async (lng: string) => {
    const language = lng as 'uz' | 'ru';

    try {
      if (user) {
        // Authenticated user: persist to backend
        const updatedUser = await updateLanguage(language);
        setUser(updatedUser);
        await i18n.changeLanguage(language);
        toast.success(
          language === 'uz' ? "Til o'zgartirildi" : 'Язык изменен'
        );
      } else {
        // Non-authenticated user: save to localStorage
        localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
        await i18n.changeLanguage(language);
      }
    } catch (error) {
      console.error('Failed to change language:', error);
      toast.error(
        language === 'uz'
          ? "Tilni o'zgartirishda xatolik"
          : 'Ошибка при изменении языка'
      );
    }
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
