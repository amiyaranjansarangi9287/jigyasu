const fs = require('fs');
const path = require('path');

const hiPath = path.join(__dirname, 'src/learnos/i18n/locales/hi.json');
const hiData = JSON.parse(fs.readFileSync(hiPath, 'utf8'));

if (!hiData.math_modules) {
  hiData.math_modules = {};
}

hiData.math_modules.ExplorersHub = {
  title: "🧭 एक्सप्लोरर गिल्ड",
  subtitle: "२० दृश्य रोमांच — बुनियादी बातों से लेकर व्यावहारिक गणित तक।"
};

fs.writeFileSync(hiPath, JSON.stringify(hiData, null, 2));
console.log("Added ExplorersHub to hi.json");
