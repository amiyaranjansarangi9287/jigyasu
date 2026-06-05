const fs = require('fs');

const pathHi = 'd:/vision_agentic/jigyasu/apps/hub/src/learnos/i18n/locales/hi.json';
const dataHi = JSON.parse(fs.readFileSync(pathHi, 'utf8'));
if (!dataHi.kidscamp) dataHi.kidscamp = {};
if (!dataHi.kidscamp.modal) dataHi.kidscamp.modal = {};
dataHi.kidscamp.modal = {
  completed: 'पूरा हुआ',
  in_progress: 'प्रगति पर',
  reviews: 'समीक्षाएँ',
  ages: 'उम्र',
  materials_needed: 'आवश्यक सामग्री',
  opt: '(वैकल्पिक)',
  more: 'और',
  steps: 'चरण',
  more_steps: 'और चरण...',
  what_youll_learn: 'आप क्या सीखेंगे',
  cross_pillar: 'क्रॉस-पिलर कनेक्शन',
  cross_pillar_desc: 'यह गतिविधि अन्य स्तंभों से जुड़ती है! कनेक्टर उपलब्धि को अनलॉक करने के लिए संबंधित गतिविधियों को पूरा करें।',
  build_again: '🔄 फिर से बनाएं',
  continue: '▶ जारी रखें',
  start_activity: '🚀 गतिविधि शुरू करें'
};
fs.writeFileSync(pathHi, JSON.stringify(dataHi, null, 2));

const pathOd = 'd:/vision_agentic/jigyasu/apps/hub/src/learnos/i18n/locales/od.json';
const dataOd = JSON.parse(fs.readFileSync(pathOd, 'utf8'));
if (!dataOd.kidscamp) dataOd.kidscamp = {};
if (!dataOd.kidscamp.modal) dataOd.kidscamp.modal = {};
dataOd.kidscamp.modal = {
  completed: 'ସମ୍ପୂର୍ଣ୍ଣ ହୋଇଛି',
  in_progress: 'ପ୍ରଗତିରେ',
  reviews: 'ସମୀକ୍ଷା',
  ages: 'ବୟସ',
  materials_needed: 'ଆବଶ୍ୟକ ସାମଗ୍ରୀ',
  opt: '(ବୈକଳ୍ପିକ)',
  more: 'ଅଧିକ',
  steps: 'ପଦକ୍ଷେପଗୁଡ଼ିକ',
  more_steps: 'ଅଧିକ ପଦକ୍ଷେପ...',
  what_youll_learn: 'ଆପଣ କଣ ଶିଖିବେ',
  cross_pillar: 'କ୍ରସ୍-ପିଲାର୍ ସଂଯୋଗ',
  cross_pillar_desc: 'ଏହି କାର୍ଯ୍ୟକଳାପ ଅନ୍ୟ ସ୍ତମ୍ଭଗୁଡ଼ିକ ସହିତ ସଂଯୋଗ କରେ! କନେକ୍ଟର୍ ଉପଲବ୍ଧି ଅନଲକ୍ କରିବାକୁ ସମ୍ବନ୍ଧିତ କାର୍ଯ୍ୟକଳାପଗୁଡ଼ିକ ସମ୍ପୂର୍ଣ୍ଣ କରନ୍ତୁ।',
  build_again: '🔄 ପୁଣି ତିଆରି କରନ୍ତୁ',
  continue: '▶ ଜାରି ରଖନ୍ତୁ',
  start_activity: '🚀 କାର୍ଯ୍ୟକଳାପ ଆରମ୍ଭ କରନ୍ତୁ'
};
fs.writeFileSync(pathOd, JSON.stringify(dataOd, null, 2));

const pathComponent = 'd:/vision_agentic/jigyasu/apps/hub/src/kidscamp/components/ActivityModal.tsx';
let code = fs.readFileSync(pathComponent, 'utf8');

if (!code.includes('useTranslation')) {
  code = code.replace(/import \{ Activity \} from '\.\.\/data\/activities\.en';/, "import { Activity } from '../data/activities.en';\nimport { useTranslation } from 'react-i18next';");
  code = code.replace(/export default function ActivityModal\(\{/, "export default function ActivityModal({\n  selectedActivity,\n  setSelectedActivity,\n  handleStartActivity,\n  getStatus,\n  isFavorite,\n  toggleFavorite,\n  playClick\n}: Props) {\n  const { t } = useTranslation();\n\n  // Skip replacing original args");
  code = code.replace(/export default function ActivityModal\(\{[\s\S]*?\}: Props\) \{/, "export default function ActivityModal({\n  selectedActivity,\n  setSelectedActivity,\n  handleStartActivity,\n  getStatus,\n  isFavorite,\n  toggleFavorite,\n  playClick\n}: Props) {\n  const { t } = useTranslation();");
}

code = code.replace(/>\s*Completed\s*<\/span>/, ">{t('kidscamp.modal.completed', 'Completed')}</span>");
code = code.replace(/>\s*In Progress\s*<\/span>/, ">{t('kidscamp.modal.in_progress', 'In Progress')}</span>");
code = code.replace(/<span>\{selectedActivity\.reviewCount\} reviews<\/span>/, "<span>{selectedActivity.reviewCount} {t('kidscamp.modal.reviews', 'reviews')}</span>");
code = code.replace(/👤 Ages \{selectedActivity\.ageRange\}/, "👤 {t('kidscamp.modal.ages', 'Ages')} {selectedActivity.ageRange}");

code = code.replace(/> Materials Needed\s*<\/h4>/, ">{t('kidscamp.modal.materials_needed', 'Materials Needed')}</h4>");
code = code.replace(/\(opt\)/, "{t('kidscamp.modal.opt', '(opt)')}");
code = code.replace(/\+\{selectedActivity\.materials\.length - 6\} more/, "+{selectedActivity.materials.length - 6} {t('kidscamp.modal.more', 'more')}");

code = code.replace(/\{selectedActivity\.steps\.length\} Steps\s*<\/h4>/, "{selectedActivity.steps.length} {t('kidscamp.modal.steps', 'Steps')}</h4>");
code = code.replace(/\+\{selectedActivity\.steps\.length - 3\} more steps\.\.\./, "+{selectedActivity.steps.length - 3} {t('kidscamp.modal.more_steps', 'more steps...')}");

code = code.replace(/> What You'll Learn\s*<\/h4>/, ">{t('kidscamp.modal.what_youll_learn', \"What You'll Learn\")}</h4>");

code = code.replace(/> Cross-Pillar Connection\s*<\/h4>/, ">{t('kidscamp.modal.cross_pillar', 'Cross-Pillar Connection')}</h4>");
code = code.replace(/>\s*This activity connects with other pillars! Complete related activities to unlock the Connector achievement\.\s*<\/p>/, ">{t('kidscamp.modal.cross_pillar_desc', 'This activity connects with other pillars! Complete related activities to unlock the Connector achievement.')}</p>");

code = code.replace(/'🔄 Build Again'/, "t('kidscamp.modal.build_again', '🔄 Build Again')");
code = code.replace(/'▶ Continue'/, "t('kidscamp.modal.continue', '▶ Continue')");
code = code.replace(/'🚀 Start Activity'/, "t('kidscamp.modal.start_activity', '🚀 Start Activity')");

fs.writeFileSync(pathComponent, code);
