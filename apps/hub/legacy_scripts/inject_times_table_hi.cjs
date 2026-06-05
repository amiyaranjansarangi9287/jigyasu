const fs = require('fs');
const path = require('path');

const hiPath = path.join(__dirname, 'src/learnos/i18n/locales/hi.json');
const hiData = JSON.parse(fs.readFileSync(hiPath, 'utf8'));

if (!hiData.math_modules) {
  hiData.math_modules = {};
}

hiData.math_modules.TimesTableTrainer = {
  title: "पहाड़े मास्टर",
  subtitle: "एक-एक करके गुणा के पहाड़े सीखें!",
  practice: "अभ्यास",
  speedQuiz: "स्पीड क्विज़",
  chooseTable: "अपना पहाड़ा चुनें:",
  hide: "छिपाएं",
  show: "दिखाएं",
  fullTable: "पूरा पहाड़ा",
  correct: "सही!",
  wrong: "❌ यह {{answer}} है — फिर से प्रयास करें!",
  hideHint: "संकेत छिपाएं",
  peekHint: "💡 उत्तर देखें",
  answerIs: "उत्तर: {{answer}}",
  tableHeading: "{{table}} का पहाड़ा",
  redMistakes: "🔴 लाल = की गई गलतियाँ (इन्हें दोहराएं!)",
  speedQuizTitle: "स्पीड क्विज़",
  quizDesc1: "60 सेकंड में अधिक से अधिक गुणा के प्रश्नों के उत्तर दें!",
  quizDesc2: "सभी पहाड़े एक साथ!",
  startBtn: "शुरू करें!",
  timesUp: "समय समाप्त!",
  champ: "🌟 पहाड़े चैंपियन!",
  wizard: "🧙 गणित के जादूगर!",
  keepPracticing: "🌱 अभ्यास करते रहें!",
  tryAgain: "फिर से प्रयास करें"
};

fs.writeFileSync(hiPath, JSON.stringify(hiData, null, 2));
console.log("Added TimesTableTrainer to hi.json");
