const fs = require('fs');
const path = require('path');

const hiPath = path.join(__dirname, 'src/learnos/i18n/locales/hi.json');
const hiData = JSON.parse(fs.readFileSync(hiPath, 'utf8'));

if (!hiData.math_modules) {
  hiData.math_modules = {};
}

hiData.math_modules.NumberBondsGarden = {
  title: "🌻 नंबर बॉन्ड्स गार्डन",
  subtitle: "लक्ष्य तक जोड़ने वाले नंबरों को मिलाकर फूल उगाएं!",
  targetSum: "लक्ष्य योग",
  exploreMode: "🔍 एक्सप्लोर",
  matchMode: "🎮 मैच",
  reset: "🔄 रीसेट",
  allBonds: "🌱 सभी बॉन्ड जो {{target}} बनाते हैं",
  visualDots: "📊 दृश्य: डॉट्स के साथ {{target}} बनाना",
  matchedScore: "🌸 मिलान किया गया: {{score}}",
  pickInstruction: "प्रत्येक पक्ष से एक चुनें जो मिलकर <span className=\"text-green-400 font-bold\">{{target}}</span> बन जाए",
  pickNumber: "🔵 एक नंबर चुनें",
  matchIt: "🟠 इसे मिलाएं",
  gardenComplete: "गार्डन पूरा हुआ!",
  grewAll: "आपने सभी फूल उगाए!"
};

fs.writeFileSync(hiPath, JSON.stringify(hiData, null, 2));
console.log("Added NumberBondsGarden to hi.json");
