const fs = require('fs');
const { translateText } = require('./translation_service.cjs');

function isEnglish(text) {
  const letters = text.replace(/[^a-zA-Z]/g, '');
  return letters.length > text.length * 0.4 && text.length > 1; 
}

async function translateFile(filePath, targetLang) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  const regexes = [
    /title:\s*'([^']+)'/g,
    /timeToMake:\s*'([^']+)'/g,
    /quantity:\s*'([^']+)'/g,
    /tip:\s*'([^']+)'/g,
    /category:\s*'([^']+)'/g,
    /duration:\s*'([^']+)'/g
  ];
  
  let match;
  const terms = [];
  
  for (const regex of regexes) {
    let tempContent = content; // To prevent regex state issues
    while ((match = regex.exec(tempContent)) !== null) {
      if (isEnglish(match[1])) terms.push(match[1]);
    }
  }
  
  const uniqueTerms = [...new Set(terms)];
  console.log(`Found ${uniqueTerms.length} terms to translate for ${targetLang}.`);
  
  for (const term of uniqueTerms) {
    const translated = await translateText(term, targetLang);
    console.log(`Translated [${term.substring(0, 20)}...] -> [${translated.substring(0, 20)}...]`);
    const safeTranslated = translated.replace(/'/g, "\\'");
    
    // Replace carefully (only where it is a property value)
    for (const prefix of ['title:', 'timeToMake:', 'quantity:', 'tip:', 'category:', 'duration:']) {
      content = content.replace(
        new RegExp(`${prefix}\\s*'${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'`, 'g'), 
        `${prefix} '${safeTranslated}'`
      );
    }
    
    await new Promise(r => setTimeout(r, 150));
  }
  
  fs.writeFileSync(filePath, content);
  console.log(`Done translating more in ${filePath}`);
}

async function main() {
  await translateFile('src/kidscamp/data/activities.od.ts', 'or');
}

main().catch(console.error);
