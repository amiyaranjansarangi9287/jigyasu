const fs = require('fs');
const { translateText } = require('./translation_service.cjs');

// Check if string is mainly english letters
function isEnglish(text) {
  const letters = text.replace(/[^a-zA-Z]/g, '');
  return letters.length > text.length * 0.4 && text.length > 2; // if more than 40% are english letters, we assume it's english
}

async function translateFile(filePath, targetLang) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Find all name and description properties
  const nameRegex = /name:\s*'([^']+)'/g;
  const descRegex = /description:\s*'([^']+)'/g;
  
  let match;
  const names = [];
  while ((match = nameRegex.exec(content)) !== null) {
    if (isEnglish(match[1])) names.push(match[1]);
  }
  
  const descs = [];
  while ((match = descRegex.exec(content)) !== null) {
    if (isEnglish(match[1])) descs.push(match[1]);
  }
  
  // Deduplicate
  const uniqueNames = [...new Set(names)];
  const uniqueDescs = [...new Set(descs)];
  
  console.log(`Found ${uniqueNames.length} english names and ${uniqueDescs.length} english descriptions to translate for ${targetLang}.`);
  
  // Translate names
  for (const name of uniqueNames) {
    const translated = await translateText(name, targetLang);
    console.log(`Translated [${name}] -> [${translated}]`);
    // Escape quotes if any
    const safeTranslated = translated.replace(/'/g, "\\'");
    content = content.replace(new RegExp(`name:\\s*'${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'`, 'g'), `name: '${safeTranslated}'`);
    // Sleep to avoid rate limiting
    await new Promise(r => setTimeout(r, 200));
  }
  
  // Translate descriptions
  for (const desc of uniqueDescs) {
    const translated = await translateText(desc, targetLang);
    console.log(`Translated [${desc.substring(0, 20)}...] -> [${translated.substring(0, 20)}...]`);
    const safeTranslated = translated.replace(/'/g, "\\'");
    content = content.replace(new RegExp(`description:\\s*'${desc.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'`, 'g'), `description: '${safeTranslated}'`);
    await new Promise(r => setTimeout(r, 200));
  }
  
  fs.writeFileSync(filePath, content);
  console.log(`Done translating ${filePath}`);
}

async function main() {
  await translateFile('src/kidscamp/data/activities.od.ts', 'or'); // 'or' is Odia code
}

main().catch(console.error);
