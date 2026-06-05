const fs = require('fs');

const content = fs.readFileSync('src/i18n.ts', 'utf8');

const top = content.slice(0, content.indexOf('const resources = {'));
// find exactly the i18n initialization block
const bottom = content.slice(content.indexOf('i18n\n  .use(LanguageDetector)'));

const imports = `import en from './learnos/i18n/locales/en.json';
import hi from './learnos/i18n/locales/hi.json';
import kn from './learnos/i18n/locales/kn.json';
import te from './learnos/i18n/locales/te.json';
import ta from './learnos/i18n/locales/ta.json';
import od from './learnos/i18n/locales/od.json';
import es from './learnos/i18n/locales/es.json';
import fr from './learnos/i18n/locales/fr.json';

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  kn: { translation: kn },
  te: { translation: te },
  ta: { translation: ta },
  od: { translation: od },
  es: { translation: es },
  fr: { translation: fr }
};

`;

fs.writeFileSync('src/i18n.ts', top + imports + bottom);
console.log('src/i18n.ts updated.');
