const fs = require('fs');
const { translateText } = require('./translation_service.cjs');

const targetLang = process.argv[2];
if (!targetLang) throw new Error("Provide target lang");

const enFile = JSON.parse(fs.readFileSync('src/kidscamp/data/activities.en.json', 'utf8'));
const langFile = JSON.parse(fs.readFileSync(`src/kidscamp/data/activities.${targetLang}.json`, 'utf8'));

const keysToTranslate = new Set(['name', 'description', 'title', 'tip', 'category', 'difficulty', 'timeToMake', 'duration', 'substituteFor', 'quantity']);
const arraysToTranslate = new Set(['safetyNotes', 'learningOutcomes']);

async function translateMissing(enObj, langObj, lang) {
  let count = 0;
  if (Array.isArray(enObj)) {
    for (let i = 0; i < enObj.length; i++) {
      if (typeof enObj[i] === 'string' && langObj[i] === enObj[i]) {
        // Un-translated
        console.log(`Translating: ${enObj[i].substring(0, 30)}...`);
        langObj[i] = await translateText(enObj[i], lang);
        await new Promise(r => setTimeout(r, 200));
        count++;
      } else if (typeof enObj[i] === 'object' && enObj[i] !== null) {
        count += await translateMissing(enObj[i], langObj[i], lang);
      }
    }
  } else if (typeof enObj === 'object' && enObj !== null) {
    for (const key of Object.keys(enObj)) {
      if (langObj[key] === undefined) {
        langObj[key] = enObj[key]; // Copy over missing keys first
      }

      if (arraysToTranslate.has(key) && Array.isArray(enObj[key])) {
        for (let i = 0; i < enObj[key].length; i++) {
          if (typeof enObj[key][i] === 'string' && langObj[key][i] === enObj[key][i]) {
             console.log(`Translating array item [${key}]: ${enObj[key][i].substring(0, 30)}...`);
             langObj[key][i] = await translateText(enObj[key][i], lang);
             await new Promise(r => setTimeout(r, 200));
             count++;
          }
        }
      } else if (keysToTranslate.has(key) && typeof enObj[key] === 'string' && langObj[key] === enObj[key]) {
        console.log(`Translating [${key}]: ${enObj[key].substring(0, 30)}...`);
        langObj[key] = await translateText(enObj[key], lang);
        await new Promise(r => setTimeout(r, 200));
        count++;
      } else if (typeof enObj[key] === 'object' && enObj[key] !== null) {
        count += await translateMissing(enObj[key], langObj[key], lang);
      }
    }
  }
  return count;
}

async function main() {
  console.log(`Checking for missing translations in ${targetLang}...`);
  const c = await translateMissing(enFile, langFile, targetLang);
  if (c > 0) {
    fs.writeFileSync(`src/kidscamp/data/activities.${targetLang}.json`, JSON.stringify(langFile, null, 2));
    console.log(`Updated ${c} fields in activities.${targetLang}.json`);
  } else {
    console.log('No missing fields to translate.');
  }
}

main().catch(console.error);
