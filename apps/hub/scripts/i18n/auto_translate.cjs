const fs = require('fs');
const path = require('path');
const { translateText } = require('./translation_service.cjs');

const LOCALES_DIR = path.join(__dirname, '../../src/learnos/i18n/locales');

function getFlatKeys(obj, prefix = '') {
  let keys = {};
  for (const [k, v] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${k}` : k;
    if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
      Object.assign(keys, getFlatKeys(v, fullKey));
    } else if (typeof v === 'string') {
      keys[fullKey] = v;
    }
  }
  return keys;
}

function setNested(obj, pathStr, value) {
  const parts = pathStr.split('.');
  let current = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    // If current[parts[i]] is a string/primitive, overwrite it with an object
    if (typeof current[parts[i]] !== 'object' || current[parts[i]] === null) {
        current[parts[i]] = {};
    }
    current = current[parts[i]];
  }
  current[parts[parts.length - 1]] = value;
}

const TARGET_LANGUAGES = [
  'as', 'bn', 'brx', 'doi', 'es', 'fr', 'gu', 'hi', 'kn', 'ks', 'mai', 
  'ml', 'mni', 'mr', 'ne', 'od', 'pa', 'sa', 'sat', 'sd', 'ta', 'te', 'ur'
];

const getGoogleLangCode = (code) => {
  if (code === 'od') return 'or';
  if (code === 'mni') return 'mni-Mtei'; 
  return code;
}

async function run() {
  const enPath = path.join(LOCALES_DIR, 'en.json');
  const enJson = JSON.parse(fs.readFileSync(enPath, 'utf8'));
  const enKeys = getFlatKeys(enJson);
  const totalEnKeys = Object.keys(enKeys).length;
  console.log(`Loaded ${totalEnKeys} keys from en.json`);

  for (const lang of TARGET_LANGUAGES) {
    const filePath = path.join(LOCALES_DIR, `${lang}.json`);
    let json = {};
    if (fs.existsSync(filePath)) {
        try {
            json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        } catch(e) {
            console.error(`Failed to parse ${lang}.json`);
        }
    }
    
    const langKeys = getFlatKeys(json);
    const missing = {};
    const pseudoPrefix = `[${lang.toUpperCase()}] `;

    for (const [k, enVal] of Object.entries(enKeys)) {
      const langVal = langKeys[k];
      if (!langVal || langVal === enVal || langVal.startsWith(pseudoPrefix)) {
        missing[k] = enVal;
      }
    }

    const keysToTranslate = Object.keys(missing);
    if (keysToTranslate.length === 0) {
      console.log(`[${lang}] is fully translated.`);
      continue;
    }

    console.log(`[${lang}] Translating ${keysToTranslate.length} missing keys...`);
    const googleLang = getGoogleLangCode(lang);
    let translatedCount = 0;

    for (let i = 0; i < keysToTranslate.length; i++) {
      const k = keysToTranslate[i];
      const enVal = missing[k];
      
      try {
        const translated = await translateText(enVal, googleLang);
        setNested(json, k, translated);
        translatedCount++;
        if (translatedCount % 50 === 0) {
            process.stdout.write(`\n[${lang}] Translated ${translatedCount}/${keysToTranslate.length}... `);
            fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
        } else {
            process.stdout.write('.');
        }
      } catch (e) {
        console.error(`\nFailed to translate [${lang}] key ${k}:`, e.message);
        setNested(json, k, enVal); 
      }
      await new Promise(r => setTimeout(r, 200)); 
    }
    
    console.log(`\n[${lang}] Finished translating. Saving file.`);
    fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
  }
  
  console.log('All translations complete!');
}

run().catch(console.error);
