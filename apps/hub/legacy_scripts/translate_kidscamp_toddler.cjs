const fs = require('fs');

const hiPath = 'd:/vision_agentic/jigyasu/apps/hub/src/learnos/i18n/locales/hi.json';
const dataHi = JSON.parse(fs.readFileSync(hiPath, 'utf8'));
if (!dataHi.kidscamp.toddler) dataHi.kidscamp.toddler = {};
Object.assign(dataHi.kidscamp.toddler, {
  title: 'लिटिल एक्सप्लोरर्स',
  ages: 'उम्र 3-5',
  exit_zone: 'बाहर निकलें',
  welcome: 'स्वागत है, छोटे एक्सप्लोरर! 👋',
  welcome_desc: 'आइए आज कुछ अद्भुत बनाएँ! नीचे से एक गतिविधि चुनें।',
  what_to_do: 'आप क्या करना चाहते हैं? 🤔',
  all_fun: 'सब मज़ेदार!',
  activities_count: 'गतिविधियाँ',
  all_activities: 'सभी गतिविधियाँ',
  activities_suffix: 'गतिविधियाँ',
  done: 'हो गया!',
  started: 'शुरू हो गया!',
  easy: 'आसान',
  with_grownup: 'एक वयस्क के साथ',
  again: '🔄 फिर से!',
  keep_going: '▶️ करते रहें!',
  lets_go: '🎨 चलो शुरू करें!',
  no_activities: 'इस श्रेणी के लिए कोई गतिविधि नहीं मिली!',
  show_all: 'सभी गतिविधियाँ दिखाएं',
  keep_creative: 'रचनात्मक बने रहें!',
  made_with: 'छोटे निर्माताओं के लिए ❤️ के साथ बनाया गया'
});
fs.writeFileSync(hiPath, JSON.stringify(dataHi, null, 2));

const odPath = 'd:/vision_agentic/jigyasu/apps/hub/src/learnos/i18n/locales/od.json';
const dataOd = JSON.parse(fs.readFileSync(odPath, 'utf8'));
if (!dataOd.kidscamp.toddler) dataOd.kidscamp.toddler = {};
Object.assign(dataOd.kidscamp.toddler, {
  title: 'ଲିଟିଲ୍ ଏକ୍ସପ୍ଲୋରର୍ସ',
  ages: 'ବୟସ 3-5',
  exit_zone: 'ବାହାରକୁ ଯାଆନ୍ତୁ',
  welcome: 'ସ୍ୱାଗତ, ଛୋଟ ଏକ୍ସପ୍ଲୋରର୍! 👋',
  welcome_desc: 'ଆସନ୍ତୁ ଆଜି କିଛି ଚମତ୍କାର ତିଆରି କରିବା! ତଳୁ ଏକ କାର୍ଯ୍ୟକଳାପ ବାଛନ୍ତୁ।',
  what_to_do: 'ଆପଣ କଣ କରିବାକୁ ଚାହୁଁଛନ୍ତି? 🤔',
  all_fun: 'ସବୁ ମଜାଦାର!',
  activities_count: 'କାର୍ଯ୍ୟକଳାପଗୁଡ଼ିକ',
  all_activities: 'ସମସ୍ତ କାର୍ଯ୍ୟକଳାପଗୁଡ଼ିକ',
  activities_suffix: 'କାର୍ଯ୍ୟକଳାପଗୁଡ଼ିକ',
  done: 'ହୋଇଗଲା!',
  started: 'ଆରମ୍ଭ ହେଲା!',
  easy: 'ସହଜ',
  with_grownup: 'ଜଣେ ବୟସ୍କଙ୍କ ସହିତ',
  again: '🔄 ପୁଣିଥରେ!',
  keep_going: '▶️ ଜାରି ରଖନ୍ତୁ!',
  lets_go: '🎨 ଆସନ୍ତୁ ଆରମ୍ଭ କରିବା!',
  no_activities: 'ଏହି ବର୍ଗ ପାଇଁ କୌଣସି କାର୍ଯ୍ୟକଳାପ ମିଳିଲା ନାହିଁ!',
  show_all: 'ସମସ୍ତ କାର୍ଯ୍ୟକଳାପ ଦେଖାନ୍ତୁ',
  keep_creative: 'ସୃଜନଶୀଳ ହୋଇ ରୁହନ୍ତୁ!',
  made_with: 'ଛୋଟ ନିର୍ମାତାମାନଙ୍କ ପାଇଁ ❤️ ସହିତ ତିଆରି ହୋଇଛି'
});
fs.writeFileSync(odPath, JSON.stringify(dataOd, null, 2));

const compPath = 'd:/vision_agentic/jigyasu/apps/hub/src/kidscamp/components/ToddlerZone.tsx';
let code = fs.readFileSync(compPath, 'utf8');

if (!code.includes('useTranslation')) {
  code = code.replace(/import \{ pillars \} from '\.\.\/data\/categories';/, "import { pillars } from '../data/categories';\nimport { useTranslation } from 'react-i18next';");
  code = code.replace(/export default function ToddlerZone\(\{[\s\S]*?\}: ToddlerZoneProps\) \{/, "export default function ToddlerZone({\n  onSelectActivity,\n  onStartActivity,\n  onExitToddlerZone,\n  isFavorite,\n  onToggleFavorite,\n  getStatus\n}: ToddlerZoneProps) {\n  const { t } = useTranslation();");
}

code = code.replace(/>\s*Little Explorers\s*<\/h1>/, ">{t('kidscamp.toddler.title', 'Little Explorers')}</h1>");
code = code.replace(/>Ages 3-5<\/p>/, ">{t('kidscamp.toddler.ages', 'Ages 3-5')}</p>");
code = code.replace(/>Exit Zone<\/span>/, ">{t('kidscamp.toddler.exit_zone', 'Exit Zone')}</span>");

code = code.replace(/>\s*Welcome, Little Explorer! 👋\s*<\/h2>/, ">{t('kidscamp.toddler.welcome', 'Welcome, Little Explorer! 👋')}</h2>");
code = code.replace(/>\s*Let's make something amazing today! Pick an activity below\.\s*<\/p>/, ">{t('kidscamp.toddler.welcome_desc', \"Let's make something amazing today! Pick an activity below.\")}</p>");

code = code.replace(/>\s*What do you want to do\? 🤔\s*<\/h3>/, ">{t('kidscamp.toddler.what_to_do', 'What do you want to do? 🤔')}</h3>");
code = code.replace(/>\s*All Fun!\s*<\/div>/, ">{t('kidscamp.toddler.all_fun', 'All Fun!')}</div>");
code = code.replace(/\{toddlerActivities\.length\} activities/, "{toddlerActivities.length} {t('kidscamp.toddler.activities_count', 'activities')}");
code = code.replace(/\{count\} activities/, "{count} {t('kidscamp.toddler.activities_count', 'activities')}");

code = code.replace(/'🎉 All Activities'/, "t('kidscamp.toddler.all_activities', '🎉 All Activities')");
code = code.replace(/& \{pillars\.find\(p => p\.id === selectedPillar\)\?\.name\} Activities`/, "& {pillars.find(p => p.id === selectedPillar)?.name} {t('kidscamp.toddler.activities_suffix', 'Activities')}`");

code = code.replace(/> Done!/, "> {t('kidscamp.toddler.done', 'Done!')}");
code = code.replace(/>\s*Started!\s*<\/div>/, ">{t('kidscamp.toddler.started', 'Started!')}</div>");

code = code.replace(/>\s*Easy\s*<\/span>/, ">{t('kidscamp.toddler.easy', 'Easy')}</span>");
code = code.replace(/>With a grown-up<\/span>/, ">{t('kidscamp.toddler.with_grownup', 'With a grown-up')}</span>");

code = code.replace(/'🔄 Again!'/, "t('kidscamp.toddler.again', '🔄 Again!')");
code = code.replace(/'▶️ Keep Going!'/, "t('kidscamp.toddler.keep_going', '▶️ Keep Going!')");
code = code.replace(/'🎨 Let\\'s Go!'/, "t('kidscamp.toddler.lets_go', '🎨 Let\\'s Go!')");

code = code.replace(/>\s*No activities found for this category!\s*<\/p>/, ">{t('kidscamp.toddler.no_activities', 'No activities found for this category!')}</p>");
code = code.replace(/>\s*Show All Activities\s*<\/button>/, ">{t('kidscamp.toddler.show_all', 'Show All Activities')}</button>");

code = code.replace(/>Keep being creative!<\/p>/, ">{t('kidscamp.toddler.keep_creative', 'Keep being creative!')}</p>");
code = code.replace(/>Made with ❤️ for little makers<\/p>/, ">{t('kidscamp.toddler.made_with', 'Made with ❤️ for little makers')}</p>");

fs.writeFileSync(compPath, code);
