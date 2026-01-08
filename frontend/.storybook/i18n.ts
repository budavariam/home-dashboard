import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Import translation files directly
import enTranslation from '../src/locales/en/translation.json';
import huTranslation from '../src/locales/hu/translation.json';

const resources = {
  en: {
    translation: enTranslation,
  },
  hu: {
    translation: huTranslation,
  },
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    supportedLngs: ['en', 'hu'],
    ns: ['translation'],
    defaultNS: 'translation',
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    },
    resources,
  });

export default i18n;
