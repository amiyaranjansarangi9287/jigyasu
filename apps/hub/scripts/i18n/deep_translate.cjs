const fs = require('fs');
const path = require('path');
const { translateText } = require('./translation_service.cjs');

const TARGET_LANGUAGES = ['hi', 'od', 'kn', 'ta', 'te', 'mr', 'bn', 'gu', 'ml', 'pa', 'as', 'ur', 'sa', 'sat', 'ne', 'brx', 'doi', 'ks', 'mai', 'sd', 'mni'];
const LOCALES_DIR = path.join(__dirname, '../../src/learnos/i18n/locales');
const EN_FILE_PATH = path.join(LOCALES_DIR, 'en.json');

const enFile = JSON.parse(fs.readFileSync(EN_FILE_PATH, 'utf8'));

async function deepTranslate(en, od, lang) {
  let count = 0;
  for (const key of Object.keys(en)) {
    if (typeof en[key] === 'object' && en[key] !== null) {
      if (!od[key] || typeof od[key] !== 'object') {
        od[key] = Array.isArray(en[key]) ? [] : {};
      }
      count += await deepTranslate(en[key], od[key], lang);
    } else if (typeof en[key] === 'string') {
      if (od[key] === undefined || od[key] === en[key]) {
        if (en[key].trim() !== '' && isNaN(en[key])) {
          console.log(`Translating: ${en[key]}`);
          try {
            od[key] = await translateText(en[key], lang);
            await new Promise(r => setTimeout(r, 200));
            count++;
          } catch (e) {
            console.error(`Failed to translate ${key}`);
            od[key] = en[key]; // Fallback
          }
        } else {
          od[key] = en[key];
        }
      }
    } else {
      if (od[key] === undefined) {
        od[key] = en[key];
      }
    }
  }
  return count;
}

async function main() {
  for (const lang of TARGET_LANGUAGES) {
    console.log(`\n--- Processing language: ${lang.toUpperCase()} ---`);
    const langFilePath = path.join(LOCALES_DIR, `${lang}.json`);
    
    let langFile = {};
    if (fs.existsSync(langFilePath)) {
      langFile = JSON.parse(fs.readFileSync(langFilePath, 'utf8'));
    }

    const count = await deepTranslate(enFile, langFile, lang);
    if (count > 0 || !fs.existsSync(langFilePath)) {
      fs.writeFileSync(langFilePath, JSON.stringify(langFile, null, 2));
      console.log(`Updated ${count} fields for ${lang}.`);
    } else {
      console.log(`No missing fields to translate for ${lang}.`);
    }
  }
}

main().catch(console.error);
