const fs = require('fs');
const enPath = './src/learnos/i18n/locales/en.json';
const odPath = './src/learnos/i18n/locales/od.json';

const en = JSON.parse(fs.readFileSync(enPath));
const od = JSON.parse(fs.readFileSync(odPath));

en.parent_permission = "I have my parent/guardian's permission to create a local profile.";
od.parent_permission = "ଏକ ସ୍ଥାନୀୟ ପ୍ରୋଫାଇଲ୍ ତିଆରି କରିବାକୁ ମୋର ପିତାମାତା / ଅଭିଭାବକଙ୍କ ଅନୁମତି ଅଛି |";

fs.writeFileSync(enPath, JSON.stringify(en, null, 2));
fs.writeFileSync(odPath, JSON.stringify(od, null, 2));
