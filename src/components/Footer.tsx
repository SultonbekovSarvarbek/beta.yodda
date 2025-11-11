import { useTranslation } from 'react-i18next';
import { Link } from '@tanstack/react-router';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Footer() {
  const { t } = useTranslation();

  const links = [
    { label: t('footer.aboutUs'), href: '#', isExternal: true },
    { label: t('common.help'), href: '#', isExternal: true },
    { label: t('common.press'), href: '#', isExternal: true },
    { label: t('common.api'), href: '#', isExternal: true },
    { label: t('common.jobs'), href: '#', isExternal: true },
    { label: t('common.privacy'), href: '#', isExternal: true },
    { label: t('common.terms'), href: '#', isExternal: true },
    { label: t('footer.contact'), href: '/support', isExternal: false },
  ];

  return (
    <footer className="mt-auto py-6 px-4 bg-background border-t">
      <div className="container mx-auto">
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs text-muted-foreground">
          {links.map((link, index) =>
            link.isExternal ? (
              <a
                key={index}
                href={link.href}
                className="hover:underline"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={index}
                to={link.href as '/support'}
                className="hover:underline"
              >
                {link.label}
              </Link>
            )
          )}

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <span>© {new Date().getFullYear()} Yodagram</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
