import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from './locales/en.json';
import translationNL from './locales/nl.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: translationEN
      },
      nl: {
        translation: translationNL
      }
    },
    fallbackLng: 'nl',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n; 