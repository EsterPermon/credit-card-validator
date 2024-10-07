import i18n from 'i18next';
import SupportedLanguages, { defaultFallbackLanguage } from './i18n-SupportedLanguages';
import english from './en';
import { initReactI18next } from 'react-i18next';

const options = {
  resources: {
    [SupportedLanguages.en]: {
      translation: english,
    },
  },
  lng: 'en',
  fallbackLng: defaultFallbackLanguage,
  interpolation: {
    escapeValue: false,
  },
};

i18n.use(initReactI18next).init(options);

export default i18n;
