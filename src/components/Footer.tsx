import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Footer() {
  const { t } = useTranslation();

  const links = [
    { label: t('footer.aboutUs'), href: '#' },
    { label: t('common.help'), href: '#' },
    { label: t('common.press'), href: '#' },
    { label: t('common.api'), href: '#' },
    { label: t('common.jobs'), href: '#' },
    { label: t('common.privacy'), href: '#' },
    { label: t('common.terms'), href: '#' },
    { label: t('footer.contact'), href: '#' },
  ];

  return (
    <footer className="mt-auto py-6 px-4 bg-background border-t">
      <div className="container mx-auto">
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs text-muted-foreground">
          {links.map((link, index) => (
            <a
              key={index}
              href={link.href}
              className="hover:underline"
            >
              {link.label}
            </a>
          ))}

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <span>© {new Date().getFullYear()} TutorGram</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
