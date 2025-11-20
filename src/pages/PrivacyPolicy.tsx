import { useTranslation } from 'react-i18next';

export function PrivacyPolicy() {
  const { t } = useTranslation();
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h1 className="text-3xl font-bold mb-2">{t('privacyPolicy.title')}</h1>
        <p className="text-muted-foreground mb-8">{t('privacyPolicy.lastUpdated')}</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('privacyPolicy.sections.general.title')}</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              {t('privacyPolicy.sections.general.content')}
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('privacyPolicy.sections.dataCollection.title')}</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              {t('privacyPolicy.sections.dataCollection.content')}
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('privacyPolicy.sections.dataUsage.title')}</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>{t('privacyPolicy.sections.dataUsage.items.registration')}</li>
            <li>{t('privacyPolicy.sections.dataUsage.items.services')}</li>
            <li>{t('privacyPolicy.sections.dataUsage.items.personalization')}</li>
            <li>{t('privacyPolicy.sections.dataUsage.items.communication')}</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('privacyPolicy.sections.dataSharing.title')}</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              {t('privacyPolicy.sections.dataSharing.content')}
            </li>
            <li>{t('privacyPolicy.sections.dataSharing.items.legal')}</li>
            <li>{t('privacyPolicy.sections.dataSharing.items.payment')}</li>
            <li>{t('privacyPolicy.sections.dataSharing.items.consent')}</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('privacyPolicy.sections.security.title')}</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              {t('privacyPolicy.sections.security.content')}
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('privacyPolicy.sections.storage.title')}</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              {t('privacyPolicy.sections.storage.content')}
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('privacyPolicy.sections.rights.title')}</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>{t('privacyPolicy.sections.rights.items.access')}</li>
            <li>{t('privacyPolicy.sections.rights.items.correction')}</li>
            <li>{t('privacyPolicy.sections.rights.items.deletion')}</li>
            <li>{t('privacyPolicy.sections.rights.items.objection')}</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('privacyPolicy.sections.contacts.title')}</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              {t('privacyPolicy.sections.contacts.content')}
            </li>
          </ul>
        </section>
      </div>
    </div>
  )
}
