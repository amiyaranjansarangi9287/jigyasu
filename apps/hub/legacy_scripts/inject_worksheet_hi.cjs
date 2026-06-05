const fs = require('fs');
const path = require('path');

const hiPath = path.join(__dirname, 'src/learnos/i18n/locales/hi.json');
const hiData = JSON.parse(fs.readFileSync(hiPath, 'utf8'));

if (!hiData.math_modules) {
  hiData.math_modules = {};
}

hiData.math_modules.WorksheetGenerator = {
  title: "📝 वर्कशीट जनरेटर",
  subtitle: "किसी भी विषय के लिए प्रिंट करने योग्य अभ्यास शीट उत्पन्न करें!",
  chooseTopic: "विषय चुनें",
  numProblems: "प्रश्नों की संख्या",
  maxNum: "अधिकतम संख्या",
  generate: "📄 वर्कशीट जनरेट करें",
  print: "🖨️ प्रिंट करें",
  hideAnswers: "🙈 छुपाएं",
  showAnswers: "👁️ उत्तर",
  worksheetTitle: "📝 गणित की वर्कशीट — {{topic}}",
  name: "नाम",
  date: "तारीख",
  score: "स्कोर",
  generatedBy: "व्हिमसिकल मैथ किंगडम द्वारा निर्मित 🧙‍♂️",
  topics: {
    addition: "जोड़",
    subtraction: "घटाव",
    multiplication: "गुणा",
    division: "भाग",
    mixed: "मिश्रित",
    fractions: "भिन्न",
    algebra: "बीजगणित",
    exponents: "घातांक"
  }
};

fs.writeFileSync(hiPath, JSON.stringify(hiData, null, 2));
console.log("Added WorksheetGenerator to hi.json");
