const fs = require('fs');
const path = require('path');

const hiPath = path.join(__dirname, 'src/learnos/i18n/locales/hi.json');
const hiData = JSON.parse(fs.readFileSync(hiPath, 'utf8'));

if (!hiData.math_modules) {
  hiData.math_modules = {};
}

hiData.math_modules.AlgebraArena = {
  title: "🧮 बीजगणित अरीना",
  subtitle: "x का मान निकालें — समीकरण को संतुलित करें!",
  balance: "⚖️ दोनों पक्ष बराबर होने चाहिए",
  findX: "मान निकालें <span className=\"text-purple-400 font-bold\">x</span>",
  hideSteps: "🙈 हल छिपाएं",
  showSteps: "📝 हल करने के चरण दिखाएं",
  correct: "✨ x = {{ans}} सही है! ✨",
  wrong: "❌ फिर से प्रयास करें! संकेत के लिए चरणों की जाँच करें।",
  skip: "छोड़ें →",
  diffBasic: "मूलभूत",
  diffBasicDesc: "1-चरण: 3x=12",
  diffInter: "माध्यमिक",
  diffInterDesc: "2-चरण: 2x+3=11",
  diffAdv: "उन्नत",
  diffAdvDesc: "कई चरण, x², घातांक"
};

fs.writeFileSync(hiPath, JSON.stringify(hiData, null, 2));
console.log("Added AlgebraArena to hi.json");
