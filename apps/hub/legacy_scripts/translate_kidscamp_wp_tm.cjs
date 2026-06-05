const fs = require('fs');

const hiPath = 'd:/vision_agentic/jigyasu/apps/hub/src/learnos/i18n/locales/hi.json';
const dataHi = JSON.parse(fs.readFileSync(hiPath, 'utf8'));
if (!dataHi.kidscamp.workshop) dataHi.kidscamp.workshop = {};
if (!dataHi.kidscamp.testimonials) dataHi.kidscamp.testimonials = {};
Object.assign(dataHi.kidscamp.workshop, {
  title: 'मेरी प्रगति',
  completed: 'पूरा हुआ',
  total_time: 'कुल समय',
  pillar_progress: 'स्तंभ प्रगति',
  minutes: 'मिनट',
  achievements: 'उपलब्धियां'
});
Object.assign(dataHi.kidscamp.testimonials, {
  happy_campers: 'खुशहाल कैंपर्स',
  title: 'हमारा समुदाय क्या कहता है',
  desc: 'उन हजारों खुशहाल परिवारों से जुड़ें जिन्होंने एक साथ निर्माण और सीखने का आनंद खोजा है।',
  built: 'बनाया गया:',
  activities_done: 'गतिविधियाँ पूरी कीं',
  avg_rating: 'औसत रेटिंग',
  countries: 'देश',
  recommend: 'अनुशंसा करें'
});
fs.writeFileSync(hiPath, JSON.stringify(dataHi, null, 2));

const odPath = 'd:/vision_agentic/jigyasu/apps/hub/src/learnos/i18n/locales/od.json';
const dataOd = JSON.parse(fs.readFileSync(odPath, 'utf8'));
if (!dataOd.kidscamp.workshop) dataOd.kidscamp.workshop = {};
if (!dataOd.kidscamp.testimonials) dataOd.kidscamp.testimonials = {};
Object.assign(dataOd.kidscamp.workshop, {
  title: 'ମୋର ପ୍ରଗତି',
  completed: 'ସମ୍ପୂର୍ଣ୍ଣ ହୋଇଛି',
  total_time: 'ମୋଟ ସମୟ',
  pillar_progress: 'ସ୍ତମ୍ଭ ପ୍ରଗତି',
  minutes: 'ମିନିଟ୍',
  achievements: 'ଉପଲବ୍ଧିଗୁଡିକ'
});
Object.assign(dataOd.kidscamp.testimonials, {
  happy_campers: 'ଖୁସି କ୍ୟାମ୍ପର୍ସ',
  title: 'ଆମର ସମ୍ପ୍ରଦାୟ କଣ କହୁଛି',
  desc: 'ହଜାର ହଜାର ଖୁସି ପରିବାରରେ ଯୋଗ ଦିଅନ୍ତୁ ଯେଉଁମାନେ ଏକାଠି ନିର୍ମାଣ ଏବଂ ଶିଖିବାର ଆନନ୍ଦ ଆବିଷ୍କାର କରିଛନ୍ତି।',
  built: 'ନିର୍ମିତ:',
  activities_done: 'କାର୍ଯ୍ୟକଳାପ ସମ୍ପୂର୍ଣ୍ଣ',
  avg_rating: 'ହାରାହାରି ରେଟିଂ',
  countries: 'ଦେଶଗୁଡ଼ିକ',
  recommend: 'ପରାମର୍ଶ ଦିଅନ୍ତୁ'
});
fs.writeFileSync(odPath, JSON.stringify(dataOd, null, 2));


const wpPath = 'd:/vision_agentic/jigyasu/apps/hub/src/kidscamp/components/WorkshopPanel.tsx';
let wpCode = fs.readFileSync(wpPath, 'utf8');

if (!wpCode.includes('useTranslation')) {
  wpCode = wpCode.replace(/export default function WorkshopPanel\(\{[\s\S]*?\}: Props\) \{/, "import { useTranslation } from 'react-i18next';\n\nexport default function WorkshopPanel({\n  setWorkshopOpen,\n  getCompletedCount,\n  getTotalTime,\n  getCompletedByPillar,\n  getAchievementProgress,\n  getUnlockedAchievements,\n  getLockedAchievements\n}: Props) {\n  const { t } = useTranslation();");
}

wpCode = wpCode.replace(/>My Progress<\/h2>/, ">{t('kidscamp.workshop.title', 'My Progress')}</h2>");
wpCode = wpCode.replace(/>Completed<\/div>/, ">{t('kidscamp.workshop.completed', 'Completed')}</div>");
wpCode = wpCode.replace(/\{Math\.floor\(getTotalTime\(\) \/ 60\)\}m/, "{Math.floor(getTotalTime() / 60)}{t('kidscamp.workshop.minutes', 'm')}");
wpCode = wpCode.replace(/>Total Time<\/div>/, ">{t('kidscamp.workshop.total_time', 'Total Time')}</div>");
wpCode = wpCode.replace(/>Pillar Progress<\/h3>/, ">{t('kidscamp.workshop.pillar_progress', 'Pillar Progress')}</h3>");
wpCode = wpCode.replace(/>\s*Achievements \(/, ">{t('kidscamp.workshop.achievements', 'Achievements')} (");

fs.writeFileSync(wpPath, wpCode);


const tmPath = 'd:/vision_agentic/jigyasu/apps/hub/src/kidscamp/components/Testimonials.tsx';
let tmCode = fs.readFileSync(tmPath, 'utf8');

if (!tmCode.includes('useTranslation')) {
  tmCode = tmCode.replace(/import \{ useReveal \} from '\.\.\/hooks\/useReveal';/, "import { useReveal } from '../hooks/useReveal';\nimport { useTranslation } from 'react-i18next';");
  tmCode = tmCode.replace(/export default function Testimonials\(\) \{/, "export default function Testimonials() {\n  const { t } = useTranslation();");
}

tmCode = tmCode.replace(/Happy Campers\s*<\/span>/, "{t('kidscamp.testimonials.happy_campers', 'Happy Campers')}\n          </span>");
tmCode = tmCode.replace(/>\s*What Our Community Says\s*<\/h2>/, ">{t('kidscamp.testimonials.title', 'What Our Community Says')}</h2>");
tmCode = tmCode.replace(/>\s*Join thousands of happy families who have discovered the joy of building and learning together\.\s*<\/p>/, ">{t('kidscamp.testimonials.desc', 'Join thousands of happy families who have discovered the joy of building and learning together.')}</p>");
tmCode = tmCode.replace(/>\s*Built: \{testimonials\[active\]\.toyName\}\s*<\/p>/, ">{t('kidscamp.testimonials.built', 'Built:')} {testimonials[active].toyName}</p>");

tmCode = tmCode.replace(/label: 'Activities Done'/, "label: t('kidscamp.testimonials.activities_done', 'Activities Done')");
tmCode = tmCode.replace(/label: 'Avg Rating'/, "label: t('kidscamp.testimonials.avg_rating', 'Avg Rating')");
tmCode = tmCode.replace(/label: 'Countries'/, "label: t('kidscamp.testimonials.countries', 'Countries')");
tmCode = tmCode.replace(/label: 'Recommend'/, "label: t('kidscamp.testimonials.recommend', 'Recommend')");

fs.writeFileSync(tmPath, tmCode);
