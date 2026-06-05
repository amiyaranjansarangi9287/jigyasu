const fs = require('fs');
const { translateText } = require('./translation_service.cjs');

function unflatten(data) {
  var result = {};
  for (var i in data) {
    var keys = i.split('.');
    keys.reduce(function(r, e, j) {
      return r[e] || (r[e] = isNaN(Number(keys[j + 1])) ? (keys.length - 1 == j ? data[i] : {}) : []);
    }, result);
  }
  return result;
}

function getMissingKeys(flatExtracted, existingNested) {
  const missing = {};
  for (const [key, val] of Object.entries(flatExtracted)) {
    const parts = key.split('.');
    let current = existingNested;
    let found = true;
    for (const part of parts) {
      if (current === undefined || current === null || current[part] === undefined) {
        found = false;
        break;
      }
      current = current[part];
    }
    if (!found || (typeof current === 'string' && current === val)) {
      missing[key] = val;
    }
  }
  return missing;
}

function setNested(obj, path, value) {
  const parts = path.split('.');
  let current = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!current[parts[i]]) current[parts[i]] = {};
    current = current[parts[i]];
  }
  current[parts[parts.length - 1]] = value;
}

async function run() {
  const extracted = JSON.parse(fs.readFileSync('extracted_translations.json', 'utf8'));

  // 1. Update en.json
  const enPath = 'src/learnos/i18n/locales/en.json';
  const enJson = JSON.parse(fs.readFileSync(enPath, 'utf8'));
  for (const [k, v] of Object.entries(extracted)) setNested(enJson, k, v);
  fs.writeFileSync(enPath, JSON.stringify(enJson, null, 2));
  console.log('Updated en.json');

  // 2. Translate hi.json and od.json
  const langs = [
    { code: 'hi', file: 'hi.json', name: 'Hindi' },
    { code: 'od', file: 'od.json', name: 'Odia' }
  ];

  for (const lang of langs) {
    const filePath = `src/learnos/i18n/locales/${lang.file}`;
    const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const missing = getMissingKeys(extracted, json);
    
    const keysToTranslate = Object.keys(missing);
    console.log(`Translating ${keysToTranslate.length} keys for ${lang.name}...`);
    
    for (let i = 0; i < keysToTranslate.length; i++) {
      const k = keysToTranslate[i];
      const val = missing[k];
      
      try {
        const translated = await translateText(val, lang.name);
        setNested(json, k, translated);
        process.stdout.write('.');
      } catch (e) {
        console.error('Failed to translate: ' + k, e.message);
        setNested(json, k, val); // fallback to English
      }
      await new Promise(r => setTimeout(r, 100)); // sleep to avoid rate limits
    }
    
    console.log(`\nUpdated ${lang.file}`);
    fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
  }
  console.log('Done!');
}

run().catch(console.error);
