const i18next = require('i18next');
const LanguageDetector = require('i18next-browser-languagedetector');

i18next.init({
  resources: {
    en: { translation: { hello: 'Hello' } },
    od: { translation: { hello: 'Namaskar' } }
  },
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
});

console.log('Initial lang:', i18next.language);
i18next.changeLanguage('od').then(() => {
  console.log('After change lang:', i18next.language);
});
