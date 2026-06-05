const fs = require('fs');

const hiPath = 'd:/vision_agentic/jigyasu/apps/hub/src/learnos/i18n/locales/hi.json';
const dataHi = JSON.parse(fs.readFileSync(hiPath, 'utf8'));
if (!dataHi.kidscamp.app) dataHi.kidscamp.app = {};
Object.assign(dataHi.kidscamp.app, {
  easy: 'आसान',
  ask_grownup: 'इस गतिविधि में मदद करने के लिए किसी बड़े से कहें!',
  lets_make_it: 'चलो इसे बनाते हैं!',
  new_badge: 'वाह! नया बैज!',
  achievement_unlocked: 'उपलब्धि हासिल की!'
});
fs.writeFileSync(hiPath, JSON.stringify(dataHi, null, 2));

const odPath = 'd:/vision_agentic/jigyasu/apps/hub/src/learnos/i18n/locales/od.json';
const dataOd = JSON.parse(fs.readFileSync(odPath, 'utf8'));
if (!dataOd.kidscamp.app) dataOd.kidscamp.app = {};
Object.assign(dataOd.kidscamp.app, {
  easy: 'ସହଜ',
  ask_grownup: 'ଏହି କାର୍ଯ୍ୟକଳାପରେ ସାହାଯ୍ୟ କରିବାକୁ ଜଣେ ବୟସ୍କଙ୍କୁ କୁହନ୍ତୁ!',
  lets_make_it: 'ଆସନ୍ତୁ ଏହାକୁ ତିଆରି କରିବା!',
  new_badge: 'ୱାହ! ନୂଆ ବ୍ୟାଜ୍!',
  achievement_unlocked: 'ଉପଲବ୍ଧି ହାସଲ ହେଲା!'
});
fs.writeFileSync(odPath, JSON.stringify(dataOd, null, 2));

const appPath = 'd:/vision_agentic/jigyasu/apps/hub/src/kidscamp/App.tsx';
let appCode = fs.readFileSync(appPath, 'utf8');

if (!appCode.includes("useTranslation")) {
  appCode = appCode.replace(/import \{ Suspense, lazy \} from 'react';/, "import { Suspense, lazy } from 'react';\nimport { useTranslation } from 'react-i18next';");
  appCode = appCode.replace(/export default function App\(\) \{/, "export default function App() {\n  const { t } = useTranslation();");
}

appCode = appCode.replace(/>\s*Easy\s*<\/span>/, ">{t('kidscamp.app.easy', 'Easy')}</span>");
appCode = appCode.replace(/>\s*👨‍👩‍👧 Ask a grown-up to help you with this activity!\s*<\/p>/, ">👨‍👩‍👧 {t('kidscamp.app.ask_grownup', 'Ask a grown-up to help you with this activity!')}</p>");
appCode = appCode.replace(/Let's Make It!/, "{t('kidscamp.app.lets_make_it', \"Let's Make It!\")}");
appCode = appCode.replace(/>Yay! New Badge!<\/p>/, ">{t('kidscamp.app.new_badge', 'Yay! New Badge!')}</p>");
appCode = appCode.replace(/>Achievement Unlocked!<\/p>/, ">{t('kidscamp.app.achievement_unlocked', 'Achievement Unlocked!')}</p>");

appCode = appCode.replace(/>\{toastAchievement\.name\}<\/p>/g, ">{t(`kidscamp.achievements.${toastAchievement.id}.name`, toastAchievement.name)}</p>");
appCode = appCode.replace(/>\{toastAchievement\.description\}<\/p>/g, ">{t(`kidscamp.achievements.${toastAchievement.id}.description`, toastAchievement.description)}</p>");

fs.writeFileSync(appPath, appCode);
