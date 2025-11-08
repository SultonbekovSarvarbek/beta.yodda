import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Header() {
  const { t } = useTranslation();

  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <a href="/" className="flex items-center gap-2 cursor-pointer">
              <svg
                className="h-8 w-8 text-primary"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 2.18l8 3.6v8.72c0 4.42-3.05 8.55-8 9.65-4.95-1.1-8-5.23-8-9.65V7.78l8-3.6z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <span className="text-xl font-bold text-primary">TutorHub</span>
            </a>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <a
                href="#"
                className="text-sm font-medium hover:text-primary transition-colors relative cursor-pointer"
              >
                {t('header.experiences')}
                <Badge
                  variant="secondary"
                  className="absolute -top-2 -right-8 text-xs"
                >
                  {t('common.new')}
                </Badge>
              </a>
              <a
                href="#"
                className="text-sm font-medium hover:text-primary transition-colors relative cursor-pointer"
              >
                {t('header.services')}
                <Badge
                  variant="secondary"
                  className="absolute -top-2 -right-8 text-xs"
                >
                  {t('common.new')}
                </Badge>
              </a>
            </nav>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="hidden md:flex">
              {t('header.becomeTutor')}
            </Button>
            <LanguageSwitcher />
            <Button variant="outline" size="sm" className="gap-2">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className="h-6 w-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
