const fs = require('fs');

// Add translation to hi.json
const pathHi = 'd:/vision_agentic/jigyasu/apps/hub/src/learnos/i18n/locales/hi.json';
const dataHi = JSON.parse(fs.readFileSync(pathHi, 'utf8'));
if (!dataHi.landing) dataHi.landing = {};
if (!dataHi.landing.worlds) dataHi.landing.worlds = {};
dataHi.landing.worlds.step = 'चरण 2';
fs.writeFileSync(pathHi, JSON.stringify(dataHi, null, 2));

// Add translation to od.json
const pathOd = 'd:/vision_agentic/jigyasu/apps/hub/src/learnos/i18n/locales/od.json';
const dataOd = JSON.parse(fs.readFileSync(pathOd, 'utf8'));
if (!dataOd.landing) dataOd.landing = {};
if (!dataOd.landing.worlds) dataOd.landing.worlds = {};
dataOd.landing.worlds.step = 'ପଦକ୍ଷେପ 2';
fs.writeFileSync(pathOd, JSON.stringify(dataOd, null, 2));

// Update WorldsGrid.tsx
const pathGrid = 'd:/vision_agentic/jigyasu/apps/hub/src/learnos/landing/WorldsGrid.tsx';
let codeGrid = fs.readFileSync(pathGrid, 'utf8');
codeGrid = codeGrid.replace(/>Step 2<\/span>/, ">{t('landing.worlds.step', 'Step 2')}</span>");
fs.writeFileSync(pathGrid, codeGrid);
