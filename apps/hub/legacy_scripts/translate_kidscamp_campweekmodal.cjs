const fs = require('fs');

const pathHi = 'd:/vision_agentic/jigyasu/apps/hub/src/learnos/i18n/locales/hi.json';
const dataHi = JSON.parse(fs.readFileSync(pathHi, 'utf8'));
if (!dataHi.kidscamp.modal) dataHi.kidscamp.modal = {};
dataHi.kidscamp.modal.completed_excl = 'पूरा हुआ!';
dataHi.kidscamp.modal.days = 'दिन';
dataHi.kidscamp.modal.showcase = 'शोकेस';
dataHi.kidscamp.modal.day = 'दिन';
dataHi.kidscamp.modal.done = '✓ हो गया';
dataHi.kidscamp.modal.start = '🚀 शुरू करें';
dataHi.kidscamp.modal.preview = 'पूर्वावलोकन';
dataHi.kidscamp.modal.materials_week = 'इस सप्ताह के लिए सामग्री';
dataHi.kidscamp.modal.tip_gather = 'सुझाव: एक आसान अनुभव के लिए सप्ताह की शुरुआत में ही सारी सामग्री इकट्ठा कर लें!';
dataHi.kidscamp.modal.week_complete = 'सप्ताह पूरा हुआ!';
dataHi.kidscamp.modal.amazing_job = 'पूरा करने में अद्भुत काम';
dataHi.kidscamp.modal.earned = 'आपने अर्जित किया है';
dataHi.kidscamp.modal.badge = 'बैज!';
dataHi.kidscamp.modal.continue_exploring = 'खोजना जारी रखें';
dataHi.kidscamp.modal.ready_next = 'अपनी अगली गतिविधि के लिए तैयार हैं?';
dataHi.kidscamp.modal.start_day = '🚀 दिन शुरू करें';
fs.writeFileSync(pathHi, JSON.stringify(dataHi, null, 2));

const pathOd = 'd:/vision_agentic/jigyasu/apps/hub/src/learnos/i18n/locales/od.json';
const dataOd = JSON.parse(fs.readFileSync(pathOd, 'utf8'));
if (!dataOd.kidscamp.modal) dataOd.kidscamp.modal = {};
dataOd.kidscamp.modal.completed_excl = 'ସମ୍ପୂର୍ଣ୍ଣ ହୋଇଛି!';
dataOd.kidscamp.modal.days = 'ଦିନ';
dataOd.kidscamp.modal.showcase = 'ଶୋକେସ୍';
dataOd.kidscamp.modal.day = 'ଦିନ';
dataOd.kidscamp.modal.done = '✓ ହୋଇଗଲା';
dataOd.kidscamp.modal.start = '🚀 ଆରମ୍ଭ କରନ୍ତୁ';
dataOd.kidscamp.modal.preview = 'ପୂର୍ବାବଲୋକନ';
dataOd.kidscamp.modal.materials_week = 'ଏହି ସପ୍ତାହ ପାଇଁ ସାମଗ୍ରୀ';
dataOd.kidscamp.modal.tip_gather = 'ପରାମର୍ଶ: ଏକ ସହଜ ଅଭିଜ୍ଞତା ପାଇଁ ସପ୍ତାହ ଆରମ୍ଭରେ ସମସ୍ତ ସାମଗ୍ରୀ ଏକାଠି କରନ୍ତୁ!';
dataOd.kidscamp.modal.week_complete = 'ସପ୍ତାହ ସମ୍ପୂର୍ଣ୍ଣ ହୋଇଛି!';
dataOd.kidscamp.modal.amazing_job = 'ସମ୍ପୂର୍ଣ୍ଣ କରିବାରେ ଚମତ୍କାର କାମ';
dataOd.kidscamp.modal.earned = 'ଆପଣ ଅର୍ଜନ କରିଛନ୍ତି';
dataOd.kidscamp.modal.badge = 'ବ୍ୟାଜ୍!';
dataOd.kidscamp.modal.continue_exploring = 'ଅନ୍ୱେଷଣ ଜାରି ରଖନ୍ତୁ';
dataOd.kidscamp.modal.ready_next = 'ଆପଣଙ୍କର ପରବର୍ତ୍ତୀ କାର୍ଯ୍ୟକଳାପ ପାଇଁ ପ୍ରସ୍ତୁତ କି?';
dataOd.kidscamp.modal.start_day = '🚀 ଦିନ ଆରମ୍ଭ କରନ୍ତୁ';
fs.writeFileSync(pathOd, JSON.stringify(dataOd, null, 2));

const pathComponent = 'd:/vision_agentic/jigyasu/apps/hub/src/kidscamp/components/CampWeekModal.tsx';
let code = fs.readFileSync(pathComponent, 'utf8');

if (!code.includes('useTranslation')) {
  code = code.replace(/import \{ useLocalizedActivities \} from '\.\.\/\.\.\/hooks\/useLocalizedData';/, "import { useLocalizedActivities } from '../../hooks/useLocalizedData';\nimport { useTranslation } from 'react-i18next';");
  code = code.replace(/export default function CampWeekModal\(\{[\s\S]*?\}: CampWeekModalProps\) \{/, "export default function CampWeekModal({\n  weekId,\n  onClose,\n  onStartActivity,\n  getActivityStatus\n}: CampWeekModalProps) {\n  const { t } = useTranslation();");
}

code = code.replace(/>\s*Completed!\s*<\/span>/, ">{t('kidscamp.modal.completed_excl', 'Completed!')}</span>");
code = code.replace(/\/5 days/, "/5 {t('kidscamp.modal.days', 'days')}");

code = code.replace(/⭐ Showcase/, "⭐ {t('kidscamp.modal.showcase', 'Showcase')}");

code = code.replace(/>Day<\/span>/g, ">{t('kidscamp.modal.day', 'Day')}</span>");

code = code.replace(/'✓ Done'/, "t('kidscamp.modal.done', '✓ Done')");
code = code.replace(/'▶ Continue'/, "t('kidscamp.modal.continue', '▶ Continue')");
code = code.replace(/'🚀 Start'/, "t('kidscamp.modal.start', '🚀 Start')");
code = code.replace(/'Preview'/, "t('kidscamp.modal.preview', 'Preview')");

code = code.replace(/>\s*📦 Materials for This Week\s*<\/h4>/, ">{t('kidscamp.modal.materials_week', '📦 Materials for This Week')}</h4>");
code = code.replace(/>\s*💡 Tip: Gather all materials at the start of the week for a smoother experience!\s*<\/p>/, ">{t('kidscamp.modal.tip_gather', '💡 Tip: Gather all materials at the start of the week for a smoother experience!')}</p>");

code = code.replace(/>\s*Week Complete!\s*<\/h4>/, ">{t('kidscamp.modal.week_complete', 'Week Complete!')}</h4>");
code = code.replace(/Amazing job completing \{week\.name\}! You've earned the \{week\.icon\} badge!/, "{t('kidscamp.modal.amazing_job', 'Amazing job completing')} {week.name}! {t('kidscamp.modal.earned', 'You\\'ve earned the')} {week.icon} {t('kidscamp.modal.badge', 'badge!')}");
code = code.replace(/>\s*Continue Exploring\s*<\/button>/, ">{t('kidscamp.modal.continue_exploring', 'Continue Exploring')}</button>");

code = code.replace(/>Ready for your next activity\?<\/p>/, ">{t('kidscamp.modal.ready_next', 'Ready for your next activity?')}</p>");
code = code.replace(/>\s*🚀 Start Day \{nextDay\}\s*<\/button>/, ">{t('kidscamp.modal.start_day', '🚀 Start Day')} {nextDay}</button>");

fs.writeFileSync(pathComponent, code);
