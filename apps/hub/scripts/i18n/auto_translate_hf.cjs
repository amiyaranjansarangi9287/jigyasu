const fs = require('fs');
const path = require('path');
const https = require('https');

const HF_TOKEN = process.env.HF_TOKEN || '';
const LOCALES_DIR = path.join(__dirname, '../../src/learnos/i18n/locales');

async function translateTextHF(text, targetLangCode) {
  return new Promise((resolve, reject) => {
    if (!HF_TOKEN) return reject(new Error('HF_TOKEN environment variable is missing.'));

    const langMap = {
      'hi': 'hin_Deva', 'od': 'ory_Orya', 'or': 'ory_Orya', 'bn': 'ben_Beng',
      'as': 'asm_Beng', 'gu': 'guj_Gujr', 'kn': 'kan_Knda', 'ml': 'mal_Mlym',
      'mr': 'mar_Deva', 'pa': 'pan_Guru', 'ta': 'tam_Taml', 'te': 'tel_Telu',
      'ur': 'urd_Arab'
    };
    
    const targetTag = langMap[targetLangCode] || `${targetLangCode}_Deva`;
    const inputFormatted = `__eng_Latn__ ${text} __${targetTag}__`;

    const data = JSON.stringify({ inputs: inputFormatted, parameters: { max_new_tokens: 256 } });

    const req = https.request({
      hostname: 'api-inference.huggingface.co',
      port: 443,
      path: '/models/ai4bharat/indictrans2-en-indic-1B',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => responseBody += chunk);
      res.on('end', () => {
        if (res.statusCode !== 200) return reject(new Error(`Status ${res.statusCode}: ${responseBody}`));
        try {
          const parsed = JSON.parse(responseBody);
          let translated = parsed[0]?.generated_text || '';
          translated = translated.replace(/__.*?__/g, '').trim();
          resolve(translated);
        } catch (e) { reject(e); }
      });
    });

    req.on('error', (e) => reject(new Error(e.message)));
    req.write(data);
    req.end();
  });
}

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
    if (typeof current[parts[i]] !== 'object' || current[parts[i]] === null) {
        current[parts[i]] = {};
    }
    current = current[parts[i]];
  }
  current[parts[parts.length - 1]] = value;
}

const TARGET_LANGUAGES = ['as', 'bn', 'brx', 'doi', 'es', 'fr', 'gu', 'hi', 'kn', 'ks', 'mai', 'ml', 'mni', 'mr', 'ne', 'od', 'pa', 'sa', 'sat', 'sd', 'ta', 'te', 'ur'];

async function run() {
  const enPath = path.join(LOCALES_DIR, 'en.json');
  const enJson = JSON.parse(fs.readFileSync(enPath, 'utf8'));
  const enKeys = getFlatKeys(enJson);
  console.log(`Loaded ${Object.keys(enKeys).length} keys from en.json`);

  for (const lang of TARGET_LANGUAGES) {
    const filePath = path.join(LOCALES_DIR, `${lang}.json`);
    let json = {};
    if (fs.existsSync(filePath)) {
        try { json = JSON.parse(fs.readFileSync(filePath, 'utf8')); } catch(e) {}
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

    console.log(`[${lang}] Translating ${keysToTranslate.length} missing keys using Hugging Face Inference...`);
    let translatedCount = 0;

    for (let i = 0; i < keysToTranslate.length; i++) {
      const k = keysToTranslate[i];
      
      try {
        const translated = await translateTextHF(missing[k], lang);
        setNested(json, k, translated);
        translatedCount++;
        if (translatedCount % 50 === 0) {
            process.stdout.write(`\n[${lang}] Translated ${translatedCount}/${keysToTranslate.length}... `);
            fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
        } else {
            process.stdout.write('.');
        }
      } catch (e) {
        console.error(`\nFailed HF translate [${lang}] key ${k}:`, e.message);
        setNested(json, k, missing[k]); 
      }
      // Slight delay to avoid hammering the free inference endpoint
      await new Promise(r => setTimeout(r, 500)); 
    }
    fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
  }
}

run().catch(console.error);
