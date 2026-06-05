const fs = require('fs');
const path = require('path');

const hiPath = path.join(__dirname, 'src/learnos/i18n/locales/hi.json');
const hiData = JSON.parse(fs.readFileSync(hiPath, 'utf8'));

if (!hiData.math_modules) {
  hiData.math_modules = {};
}

hiData.math_modules.Visualizer3D = {
  title: "📊 3D गणित विज़ुअलाइज़र",
  subtitle: "गणित को 3D में जीवंत होते हुए देखें!",
  numberA: "नंबर A",
  numberB: "नंबर B",
  operation: "संक्रिया (Operation)",
  add: "जोड़ें",
  sub: "घटाएं",
  mul: "गुणा",
  div: "भाग",
  blocks: "ब्लॉक्स",
  bars3d: "3D बार्स",
  spheres: "गोले (Spheres)",
  showing: "(दिखा रहे हैं {{count}} में से {{display}})",
  factAdd: "💡 {{numA}} और {{numB}} को जोड़ना {{numA}} सेब 🍎 और {{numB}} संतरे 🍊 = {{result}} फल मिलाने जैसा है!",
  factSub: "💡 यदि आपके पास {{numA}} कुकीज़ 🍪 थीं और आपने {{numB}} खा लीं, तो आपके पास {{result}} बचेंगी!",
  factMul: "💡 {{numA}} × {{numB}} का मतलब है {{numB}} के {{numA}} समूह — यह कुल {{result}} है! 🎯",
  factDiv: "💡 {{numB}} दोस्तों के बीच {{numA}} पिज्जा 🍕 बांटना = हर एक को {{result}}!"
};

fs.writeFileSync(hiPath, JSON.stringify(hiData, null, 2));
console.log("Added Visualizer3D to hi.json");
