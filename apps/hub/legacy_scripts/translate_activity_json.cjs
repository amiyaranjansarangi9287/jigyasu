const fs = require('fs');
const { translateText } = require('./translation_service.cjs');

const keysToTranslate = new Set(['name', 'description', 'title', 'tip', 'category', 'difficulty', 'timeToMake', 'duration', 'substituteFor', 'quantity']);
const arraysToTranslate = new Set(['safetyNotes', 'learningOutcomes']);

async function processObject(obj, targetLang) {
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      if (typeof obj[i] === 'string') {
        obj[i] = await translateText(obj[i], targetLang);
        await new Promise(r => setTimeout(r, 100));
      } else if (typeof obj[i] === 'object' && obj[i] !== null) {
        await processObject(obj[i], targetLang);
      }
    }
  } else if (typeof obj === 'object' && obj !== null) {
    for (const key of Object.keys(obj)) {
      if (arraysToTranslate.has(key) && Array.isArray(obj[key])) {
        for (let i = 0; i < obj[key].length; i++) {
          if (typeof obj[key][i] === 'string') {
            obj[key][i] = await translateText(obj[key][i], targetLang);
            await new Promise(r => setTimeout(r, 100));
          }
        }
      } else if (keysToTranslate.has(key) && typeof obj[key] === 'string') {
        obj[key] = await translateText(obj[key], targetLang);
        await new Promise(r => setTimeout(r, 100));
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        await processObject(obj[key], targetLang);
      }
    }
  }
}

async function main() {
  const targetLang = process.argv[2];
  if (!targetLang) throw new Error('Provide target lang');
  
  const input = JSON.parse(fs.readFileSync('src/kidscamp/data/activities.en.json', 'utf8'));
  console.log('Loaded JSON. Translating to ' + targetLang);
  
  await processObject(input, targetLang);
  
  fs.writeFileSync('src/kidscamp/data/activities.' + targetLang + '.json', JSON.stringify(input, null, 2));
  console.log('Saved to activities.' + targetLang + '.json');
}

main().catch(console.error);
