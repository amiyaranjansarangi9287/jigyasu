const i18next = require('i18next');
const hi = require('./apps/hub/src/learnos/i18n/locales/hi.json');

i18next.init({
  lng: 'hi',
  resources: {
    hi: { translation: hi }
  }
}, (err, t) => {
  console.log('welcome_title:', t('welcome_title', 'Fallback'));
  console.log('setup_profile:', t('setup_profile', 'Fallback'));
  console.log('private_badge:', t('private_badge', 'Fallback'));
});
