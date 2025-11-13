import { useTranslation } from 'react-i18next';
import { Link } from '@tanstack/react-router';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Footer() {
  const { t } = useTranslation();

  const links = [
    { label: t('footer.privacyPolicy'), href: '/privacy', isExternal: false },
    { label: t('footer.userAgreement'), href: '/terms', isExternal: false },
    { label: t('footer.offer'), href: '/offer', isExternal: false },
  ];

  return (
    <footer className="mt-auto py-6 px-4 bg-background border-t">
      <div className="container mx-auto">
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs text-muted-foreground">
          {links.map((link, index) => (
            <Link
              key={index}
              to={link.href as '/privacy' | '/terms' | '/offer'}
              className="hover:underline"
            >
              {link.label}
            </Link>
          ))}

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <span>© {new Date().getFullYear()} YODDAGRAM</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
