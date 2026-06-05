const fs = require('fs');
const path = require('path');

const hiPath = path.join(__dirname, 'src/learnos/i18n/locales/hi.json');
const hiData = JSON.parse(fs.readFileSync(hiPath, 'utf8'));

if (!hiData.math_modules) {
  hiData.math_modules = {};
}

hiData.math_modules.PatternHub = {
  patterns: "पैटर्न पहेलियाँ",
  patternsShort: "पैटर्न",
  memory: "मेमोरी मैच",
  memoryShort: "मेमोरी"
};

fs.writeFileSync(hiPath, JSON.stringify(hiData, null, 2));
console.log("Added PatternHub to hi.json");
