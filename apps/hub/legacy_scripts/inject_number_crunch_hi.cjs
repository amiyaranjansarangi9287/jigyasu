const fs = require('fs');
const path = require('path');

const hiPath = path.join(__dirname, 'src/learnos/i18n/locales/hi.json');
const hiData = JSON.parse(fs.readFileSync(hiPath, 'utf8'));

if (!hiData.math_modules) {
  hiData.math_modules = {};
}

hiData.math_modules.NumberCrunchGame = {
  title: "🎮 नंबर क्रंच क्वेस्ट",
  subtitle: "गणित की पहेलियों को हल करने के लिए समय से मुकाबला करें!",
  ready: "तैयार हैं, गणित के जादूगर?",
  readyDesc1: "60 सेकंड में अधिक से अधिक गणित के सवालों के जवाब दें!",
  readyDesc2: "बोनस अंकों के लिए कॉम्बो बनाएं! 🔥",
  speed: "⚡ <strong>गति</strong> — घड़ी पर 60 सेकंड",
  combos: "🔥 <strong>कॉम्बो</strong> — स्ट्रीक गुणक 5x तक",
  adaptive: "📈 <strong>अनुकूली</strong> — जैसे-जैसे आप आगे बढ़ते हैं कठिन होता जाता है",
  highScore: "🏆 <strong>उच्च स्कोर</strong> — अपना सर्वश्रेष्ठ प्रदर्शन करें!",
  startBtn: "🚀 क्वेस्ट शुरू करें!",
  level: "स्तर {{level}}",
  pts: "✨ +{{pts}} अंक!",
  answerIs: "❌ उत्तर: {{answer}}",
  questComplete: "क्वेस्ट पूरी हुई!",
  finalScore: "⭐ अंतिम स्कोर",
  accuracy: "✅ सटीकता",
  bestStreak: "🔥 सर्वश्रेष्ठ स्ट्रीक",
  questions: "📊 प्रश्न",
  maxLevel: "📈 अधिकतम स्तर",
  legendary: "🌟 महान गणित जादूगर! 🌟",
  grand: "🧙 संख्याओं के महान जादूगर!",
  apprentice: "📚 प्रशिक्षु गणितज्ञ!",
  keepPracticing: "🌱 अभ्यास करते रहें, युवा जादूगर!",
  playAgain: "🔄 फिर से खेलें!"
};

fs.writeFileSync(hiPath, JSON.stringify(hiData, null, 2));
console.log("Added NumberCrunchGame to hi.json");
