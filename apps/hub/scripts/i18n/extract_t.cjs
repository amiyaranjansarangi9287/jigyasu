const fs = require('fs');
const path = require('path');

const enPath = './src/learnos/i18n/locales/en.json';
const en = JSON.parse(fs.readFileSync(enPath));

const tRegex = /t\(\s*['"]([^'"]+)['"]\s*,\s*['"]((?:[^'"]|\\['"])+)['"]\s*\)/g;
const tRegexDouble = /t\(\s*['"]([^'"]+)['"]\s*,\s*"([^"]+)"\s*\)/g;

let count = 0;

const search = (dir) => {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      search(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      
      let match;
      while ((match = tRegex.exec(content)) !== null) {
        const key = match[1];
        let val = match[2];
        val = val.replace(/\\'/g, "'").replace(/\\"/g, '"');
        if (en[key] === undefined) {
          en[key] = val;
          count++;
        }
      }
      
      while ((match = tRegexDouble.exec(content)) !== null) {
        const key = match[1];
        let val = match[2];
        if (en[key] === undefined) {
          en[key] = val;
          count++;
        }
      }
    }
  });
};

search('./src');

fs.writeFileSync(enPath, JSON.stringify(en, null, 2));
console.log(`Added ${count} missing keys to en.json`);
