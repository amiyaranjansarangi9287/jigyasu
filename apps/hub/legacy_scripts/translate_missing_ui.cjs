const fs = require('fs');
const { translateText } = require('./translation_service.cjs');

const targetLang = process.argv[2];
if (!targetLang) throw new Error("Provide target lang");

const enFile = JSON.parse(fs.readFileSync('src/learnos/i18n/locales/en.json', 'utf8'));
const langFile = JSON.parse(fs.readFileSync(`src/learnos/i18n/locales/${targetLang}.json`, 'utf8'));

async function translateMissing(enObj, langObj, lang) {
  let count = 0;
  for (const key of Object.keys(enObj)) {
    if (langObj[key] === undefined) {
      langObj[key] = enObj[key];
    }

    if (typeof enObj[key] === 'string') {
      // If the string in target lang is exactly the same as English, it's untranslated
      if (langObj[key] === enObj[key] && isNaN(enObj[key]) && enObj[key].length > 0) {
        console.log(`Translating [${key}]: ${enObj[key].substring(0, 30)}...`);
        try {
          langObj[key] = await translateText(enObj[key], lang);
          await new Promise(r => setTimeout(r, 200)); // Delay
          count++;
        } catch (e) {
          console.error(`Failed to translate [${key}]`);
        }
      }
    } else if (typeof enObj[key] === 'object' && enObj[key] !== null) {
      if (typeof langObj[key] !== 'object' || langObj[key] === null) {
        langObj[key] = {};
      }
      count += await translateMissing(enObj[key], langObj[key], lang);
    }
  }
  return count;
}

async function main() {
  console.log(`Checking for missing UI translations in ${targetLang}...`);
  const c = await translateMissing(enFile, langFile, targetLang);
  if (c > 0) {
    fs.writeFileSync(`src/learnos/i18n/locales/${targetLang}.json`, JSON.stringify(langFile, null, 2));
    console.log(`Updated ${c} fields in ${targetLang}.json`);
  } else {
    console.log('No missing fields to translate.');
  }
}

main().catch(console.error);
