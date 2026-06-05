
const fs = require('fs');

const hindiDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
const odiaDigits = ['୦', '୧', '୨', '୩', '୪', '୫', '୬', '୭', '୮', '୯'];

function replaceDigits(obj, digitMap) {
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      // Replace digits 0-9 but only if they are not part of an interpolation {{something}}
      // To be safe, we'll split by {{ and }} and only replace outside of them.
      const parts = obj[key].split(/(\{\{.*?\}\})/g);
      for (let i = 0; i < parts.length; i++) {
        if (!parts[i].startsWith('{{')) {
          parts[i] = parts[i].replace(/[0-9]/g, match => digitMap[parseInt(match)]);
        }
      }
      obj[key] = parts.join('');
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      replaceDigits(obj[key], digitMap);
    }
  }
}

function processFile(filename, digitMap) {
  const data = JSON.parse(fs.readFileSync(filename, 'utf8'));
  replaceDigits(data, digitMap);
  fs.writeFileSync(filename, JSON.stringify(data, null, 2) + '\n');
  console.log('Processed ' + filename);
}

processFile('src/learnos/i18n/locales/hi.json', hindiDigits);
processFile('src/learnos/i18n/locales/od.json', odiaDigits);
