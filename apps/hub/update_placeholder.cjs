
const fs = require('fs');
const path = require('path');

const translations = {
  as: 'যেনে কিৰণ',
  bn: 'যেমন কিরণ',
  brx: 'e.g. Kiran',
  doi: 'उदा. किरण',
  en: 'e.g. Kiran',
  gu: 'દા.ત. કિરણ',
  hi: 'जैसे किरण',
  kn: 'ಉದಾ. ಕಿರಣ್',
  kok: 'उदा. किरण',
  ks: 'e.g. Kiran',
  mai: 'जेना। किरण',
  ml: 'ഉദാ. കിരൺ',
  mni: 'e.g. Kiran',
  mr: 'उदा. किरण',
  ne: 'जस्तै किरण',
  od: 'ଯଥା କିରଣ',
  pa: 'ਜਿਵੇਂ ਕਿ ਕਿਰਨ',
  sa: 'यथा किरण',
  sat: 'e.g. Kiran',
  sd: 'مثال طور ڪِرڻ',
  ta: 'எ.கா. கிரண்',
  te: 'ఉదా. కిరణ్',
  ur: 'جیسے کرن'
};

const dir = 'src/learnos/i18n/locales';
const files = fs.readdirSync(dir);

files.forEach(file => {
  if (file.endsWith('.json')) {
    const lang = file.replace('.json', '');
    if (translations[lang]) {
      const filePath = path.join(dir, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      if (data.enter_name_placeholder) {
        data.enter_name_placeholder = translations[lang];
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
        console.log('Updated ' + lang);
      }
    }
  }
});
