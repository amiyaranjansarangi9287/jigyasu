const fs = require('fs');
const path = require('path');

const hiPath = path.join(__dirname, 'src/learnos/i18n/locales/hi.json');
const hiData = JSON.parse(fs.readFileSync(hiPath, 'utf8'));

if (!hiData.math_modules) {
  hiData.math_modules = {};
}

hiData.math_modules.AdventureMap = {
  title: "🗺️ मैथ किंगडम एडवेंचर मैप",
  subtitle: "किसी क्षेत्र की चुनौती को हल करने के लिए उस पर क्लिक करें!",
  zones: {
    "addition-forest": {
      name: "जोड़ का जंगल (Addition Forest)",
      description: "जादुई पेड़ अपने छल्लों को जोड़कर बढ़ते हैं!",
      challenge: "🌳 एक पेड़ में 15 छल्ले हैं। यह 27 और बढ़ता है। कुल कितने छल्ले हुए?"
    },
    "subtraction-caves": {
      name: "घटाव की गुफाएं (Subtraction Caves)",
      description: "चमगादड़ हर रात गुफा से निकलते हैं। कितने बचे हैं?",
      challenge: "🦇 गुफा में 83 चमगादड़ रहते थे। 47 उड़ गए। कितने बचे हैं?"
    },
    "multiply-mountains": {
      name: "गुणा के पहाड़ (Multiply Mountains)",
      description: "प्रत्येक पर्वत की चोटी पर जादुई क्रिस्टल के समूह हैं!",
      challenge: "⛰️ 7 चोटियों में से प्रत्येक पर 8 क्रिस्टल हैं। कुल कितने क्रिस्टल हैं?"
    },
    "division-desert": {
      name: "विभाजन रेगिस्तान (Division Desert)",
      description: "रेगिस्तान के खोजकर्ताओं के बीच खजाना समान रूप से साझा करें!",
      challenge: "🏜️ 96 सोने के सिक्के 8 खोजकर्ताओं के बीच बांटे गए। प्रत्येक को कितने मिले?"
    },
    "fraction-falls": {
      name: "अंश झरने (Fraction Falls)",
      description: "झरना समान धाराओं में विभाजित हो जाता है!",
      challenge: "🌊 झरने का 1/4 + 1/4 + 1/2 क्या है?"
    }
  },
  conquered: "पहले ही जीत लिया!",
  answer: "उत्तर: {{answer}}",
  correct: "✨ शानदार! आप एक गणित विज़ार्ड हैं! ✨",
  wrong: "🤔 फिर से प्रयास करें, बहादुर खोजकर्ता!"
};

fs.writeFileSync(hiPath, JSON.stringify(hiData, null, 2));
console.log("Added AdventureMap to hi.json");
