import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslations from './locales/en.json';
import arTranslations from './locales/ar.json';

const getInitialLanguage = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('i18nextLng') || 'ar';
  }
  return 'ar';
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations
      },
      ar: {
        translation: arTranslations
      }
    },
    fallbackLng: 'ar',
    lng: getInitialLanguage(),
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

// Handle direction updates dynamically
i18n.on('languageChanged', (lng) => {
  if (typeof window !== 'undefined') {
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
  }
});

// Set initial direction
if (typeof window !== 'undefined') {
  const currentLng = i18n.language || getInitialLanguage();
  document.documentElement.dir = currentLng === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = currentLng;
}

export default i18n;
