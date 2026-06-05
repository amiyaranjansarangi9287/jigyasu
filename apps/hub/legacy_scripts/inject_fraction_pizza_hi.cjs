const fs = require('fs');
const path = require('path');

const hiPath = path.join(__dirname, 'src/learnos/i18n/locales/hi.json');
const hiData = JSON.parse(fs.readFileSync(hiPath, 'utf8'));

if (!hiData.math_modules) {
  hiData.math_modules = {};
}

hiData.math_modules.FractionPizza = {
  title: "🍕 भिन्न पिज़्ज़ा पार्टी",
  subtitle: "पिज़्ज़ा के टुकड़े खाकर भिन्न (Fractions) सीखें!",
  explore: "खोजें",
  challenge: "चुनौती",
  numSlices: "टुकड़ों की संख्या",
  challengeLabel: "चुनौती:",
  eatSlices: "कुल {{den}} टुकड़ों में से <span className=\"text-orange-400\">{{num}}</span> टुकड़े खाएं",
  correct: "सही!",
  tooMany: "❌ बहुत अधिक!",
  breakdown: "📊 भिन्न विवरण",
  eaten: "खाया गया:",
  remaining: "बचा हुआ:",
  percentage: "प्रतिशत:",
  decimal: "दशमलव:",
  equivFractions: "🔄 समतुल्य भिन्न",
  funFact: "💡 <strong>रोचक तथ्य:</strong>",
  factStart: "खाने के लिए पिज़्ज़ा के टुकड़ों पर क्लिक करें!",
  factWhole: "आपने पूरा पिज़्ज़ा खा लिया! 🎉",
  factUnit: "एक टुकड़े को 'इकाई भिन्न' कहा जाता है",
  factHalf: "आपने बिल्कुल आधा पिज़्ज़ा खाया है!",
  factDefault: "भिन्न संपूर्ण के हिस्से दिखाते हैं"
};

fs.writeFileSync(hiPath, JSON.stringify(hiData, null, 2));
console.log("Added FractionPizza to hi.json");
