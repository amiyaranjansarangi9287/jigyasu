const fs = require('fs');
const path = require('path');

const hiPath = path.join(__dirname, 'src/learnos/i18n/locales/hi.json');
const hiData = JSON.parse(fs.readFileSync(hiPath, 'utf8'));

if (!hiData.math_modules) {
  hiData.math_modules = {};
}

hiData.math_modules.DailyChallenge = {
  title: "🎯 दैनिक चुनौती",
  subtitle: "हर दिन एक नई चुनौती!",
  day: "दिन",
  streak: "लगातार (Streak)",
  resetsIn: "में रीसेट",
  needHint: "💡 कोई संकेत चाहिए?",
  complete: "दैनिक चुनौती पूरी हुई!",
  streakDays: "🔥 {{streak}} दिन की स्ट्रीक!",
  comeBack: "नई चुनौती के लिए कल वापस आएं! ⏰",
  hintIsolate: "घटाकर x को अलग करें, फिर भाग दें",
  hintPrime: "ये अभाज्य संख्याएँ (prime numbers) हैं",
  hintPyth: "a² + b² = c² का प्रयोग करें",
  hintMultiFirst: "याद रखें: जोड़ने से पहले गुणा!"
};

fs.writeFileSync(hiPath, JSON.stringify(hiData, null, 2));
console.log("Added DailyChallenge to hi.json");
