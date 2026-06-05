const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('src/kidscamp');
const extracted = {};

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  // match t('key', 'default value') or t("key", "default value") or t(`key`, `default value`)
  // also multiline strings, allowing escaped quotes
  const regex = /t\(\s*['"`]([^'"`]+)['"`]\s*,\s*(['"`])([\s\S]*?)\2\s*\)/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const key = match[1];
    const defaultText = match[3];
    if (!key.includes('$') && defaultText) {
      extracted[key] = defaultText;
    }
  }
});

fs.writeFileSync('extracted_translations.json', JSON.stringify(extracted, null, 2));
console.log('Extracted ' + Object.keys(extracted).length + ' keys.');
