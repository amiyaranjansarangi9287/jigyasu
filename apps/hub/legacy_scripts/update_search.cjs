const fs = require('fs');
const file = 'd:/vision_agentic/jigyasu/apps/hub/src/learnos/i18n/locales/hi.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

Object.assign(data, {
  search_placeholder: 'दुनिया, विषय, कौशल खोजें...',
  no_results_found: '\"{{query}}\" के लिए कोई परिणाम नहीं मिला',
  enter: 'प्रवेश करें'
});

fs.writeFileSync(file, JSON.stringify(data, null, 2));
console.log('Added SearchOverlay keys to hi.json');
