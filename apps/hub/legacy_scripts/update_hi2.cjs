const fs = require('fs');

const path = 'src/learnos/i18n/locales/hi.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

if (!data.kidscamp.modal) data.kidscamp.modal = {};

Object.assign(data.kidscamp.modal, {
  "more_steps": "और चरण...",
  "what_you_learn": "आप क्या सीखेंगे",
  "cross_pillar": "क्रॉस-पिलर कनेक्शन",
  "cross_pillar_desc": "यह गतिविधि अन्य स्तंभों के साथ जुड़ती है! कनेक्टर उपलब्धि को अनलॉक करने के लिए संबंधित गतिविधियों को पूरा करें।",
  "build_again": "फिर से बनाएँ",
  "continue": "जारी रखें",
  "start_activity": "गतिविधि शुरू करें"
});

fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log('hi.json updated for modal');
