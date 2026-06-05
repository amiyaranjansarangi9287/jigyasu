const fs = require('fs');
const path = require('path');

const hiPath = path.join(__dirname, 'src/learnos/i18n/locales/hi.json');
const hiData = JSON.parse(fs.readFileSync(hiPath, 'utf8'));

if (!hiData.math_modules) {
  hiData.math_modules = {};
}

hiData.math_modules.SkillsAcademy = {
  title: "🎓 कौशल अकादमी",
  subtitle: "कदम दर कदम अपनी गणित की नींव बनाएं!",
  times: "पहाड़े",
  timesDesc: "गुणा में महारत",
  bonds: "नंबर बॉन्ड्स",
  bondsDesc: "जोड़ने के जोड़े",
  fractions: "भिन्न",
  fractionsDesc: "पिज्जा भिन्न"
};

fs.writeFileSync(hiPath, JSON.stringify(hiData, null, 2));
console.log("Added SkillsAcademy to hi.json");
