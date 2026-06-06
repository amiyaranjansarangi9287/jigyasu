const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'apps/hub/src/learnos/i18n/locales');
const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.json'));

for (const file of files) {
  const filePath = path.join(localesDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Replace the placeholder "e.g. Explorer" or its translated versions with "e.g. Kiran"
  // Actually, since I don't know the exact translation in all 22 languages, 
  // I will just parse the json and replace it.
  try {
    const data = JSON.parse(content);
    if (data.enter_name_placeholder) {
      if (file === 'en.json') {
        data.enter_name_placeholder = 'e.g. Kiran';
      } else if (file === 'hi.json') {
        data.enter_name_placeholder = 'जैसे किरण';
      } else if (file === 'bn.json') {
        data.enter_name_placeholder = 'যেমন কিরণ';
      } else if (file === 'ta.json') {
        data.enter_name_placeholder = 'எ.கா. கிரண்';
      } else if (file === 'te.json') {
        data.enter_name_placeholder = 'ఉదా. కిరణ్';
      } else if (file === 'mr.json') {
        data.enter_name_placeholder = 'उदा. किरण';
      } else if (file === 'gu.json') {
        data.enter_name_placeholder = 'દા.ત. કિરણ';
      } else if (file === 'kn.json') {
        data.enter_name_placeholder = 'ಉದಾ. ಕಿರಣ್';
      } else if (file === 'ml.json') {
        data.enter_name_placeholder = 'ഉദാ. കിരൺ';
      } else if (file === 'pa.json') {
        data.enter_name_placeholder = 'ਜਿਵੇਂ ਕਿਰਨ';
      } else if (file === 'ur.json') {
        data.enter_name_placeholder = 'جیسے کرن';
      } else if (file === 'or.json' || file === 'od.json') {
        data.enter_name_placeholder = 'ଯଥା କିରଣ';
      } else if (file === 'as.json') {
        data.enter_name_placeholder = 'যেনে নিৰ্মল'; // Kiran is not common, maybe just use Kiran: কিৰণ
        data.enter_name_placeholder = 'যেনে কিৰণ';
      } else {
        // Fallback for others
        data.enter_name_placeholder = 'e.g. Kiran';
      }
    }
    
    // Also, clean up the corrupted about.* keys!
    const keysToDelete = Object.keys(data).filter(k => k.startsWith('about.'));
    for (const k of keysToDelete) {
      delete data[k];
    }
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error(`Error processing ${file}:`, e);
  }
}
console.log('Fixed placeholders and removed corrupted about keys.');
