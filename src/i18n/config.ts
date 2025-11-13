import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ru from './locales/ru.json';
import uz from './locales/uz.json';

const LANGUAGE_STORAGE_KEY = 'i18n_language';

// Get initial language from localStorage for non-authenticated users
// If user is authenticated, language will be synced from backend in auth store
const getInitialLanguage = (): string => {
  const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return savedLanguage || 'ru';
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ru: { translation: ru },
      uz: { translation: uz },
    },
    lng: getInitialLanguage(), // Check localStorage first, default to 'ru'
    fallbackLng: 'ru',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
