const fs = require('fs');

const hiPath = 'd:/vision_agentic/jigyasu/apps/hub/src/learnos/i18n/locales/hi.json';
const dataHi = JSON.parse(fs.readFileSync(hiPath, 'utf8'));
if (!dataHi.kidscamp.activity_mode) dataHi.kidscamp.activity_mode = {};
Object.assign(dataHi.kidscamp.activity_mode, {
  great_job: 'बहुत बढ़िया!',
  back: 'वापस',
  pause_timer: 'टाइमर रोकें',
  resume_timer: 'टाइमर फिर से शुरू करें',
  reset_activity: 'गतिविधि रीसेट करें',
  complete: '% पूरा हुआ',
  steps_remaining: 'चरण शेष',
  step1: 'चरण 1: सामग्री इकट्ठा करें',
  before_begin: 'शुरू करने से पहले',
  check_off: 'सामग्री इकट्ठा करते समय हर एक चीज़ पर सही का निशान लगाएँ। अगर कुछ छूट जाए तो चिंता न करें - फिर भी शुरू करने के लिए "अभी छोड़ें" पर टैप करें!',
  optional: 'वैकल्पिक',
  items: 'सामान',
  safety_notes: 'सुरक्षा संबंधी नोट्स',
  lets_build: 'चलो बनाएँ!',
  check: 'जांचें',
  more_items: 'और आइटम',
  skip_now: 'अभी छोड़ें',
  steps: 'चरण',
  estimated_time: 'अनुमानित समय:',
  pro_tip: 'विशेषज्ञ टिप',
  parent_help: 'माता-पिता की मदद चाहिए',
  parent_help_desc: 'इस चरण में सुरक्षा या जटिलता के लिए वयस्क की सहायता की आवश्यकता हो सकती है।',
  completed_undo: 'पूरा हुआ! (अनडू करने के लिए टैप करें)',
  mark_done: 'पूर्ण के रूप में चिह्नित करें',
  skip_step: 'चरण छोड़ें',
  previous: 'पिछला',
  next: 'अगला',
  amazing_work: 'अद्भुत काम!',
  you_completed: 'आपने पूरा कर लिया',
  total_time: 'कुल समय',
  steps_done: 'चरण पूरे हुए',
  pillar: 'स्तंभ',
  skills: 'कौशल जिनका आपने अभ्यास किया',
  whats_next: 'आगे क्या?',
  whats_next_desc: 'अपनी उपलब्धियों को देखने के लिए कार्यशाला में अपनी प्रगति की जाँच करें, या उसी स्तंभ में और अधिक गतिविधियों का अन्वेषण करें!',
  build_again: '🔄 फिर से बनाएँ',
  done_back: '✨ हो गया — गतिविधियों पर वापस जाएँ',
  reset_progress: 'प्रगति रीसेट करें?',
  reset_desc: 'यह इस गतिविधि के लिए आपकी सभी प्रगति को मिटा देगा। आप शुरू से शुरू करेंगे।',
  cancel: 'रद्द करें',
  reset: 'रीसेट करें',
  save_exit: 'सहेजें और बाहर निकलें?',
  save_exit_desc: 'आपकी प्रगति स्वचालित रूप से सहेजी जाती है! आप इस गतिविधि को कभी भी वहीं से जारी रख सकते हैं जहाँ आपने छोड़ा था।',
  keep_building: 'बनाना जारी रखें',
  save_exit_btn: 'सहेजें और बाहर निकलें'
});
fs.writeFileSync(hiPath, JSON.stringify(dataHi, null, 2));

const odPath = 'd:/vision_agentic/jigyasu/apps/hub/src/learnos/i18n/locales/od.json';
const dataOd = JSON.parse(fs.readFileSync(odPath, 'utf8'));
if (!dataOd.kidscamp.activity_mode) dataOd.kidscamp.activity_mode = {};
Object.assign(dataOd.kidscamp.activity_mode, {
  great_job: 'ବହୁତ ବଢିଆ!',
  back: 'ପଛକୁ',
  pause_timer: 'ଟାଇମର୍ ବିରାମ ଦିଅନ୍ତୁ',
  resume_timer: 'ଟାଇମର୍ ପୁନଃ ଆରମ୍ଭ କରନ୍ତୁ',
  reset_activity: 'କାର୍ଯ୍ୟକଳାପ ରିସେଟ୍ କରନ୍ତୁ',
  complete: '% ସମ୍ପୂର୍ଣ୍ଣ ହୋଇଛି',
  steps_remaining: 'ପଦକ୍ଷେପ ବାକି ଅଛି',
  step1: 'ପଦକ୍ଷେପ 1: ସାମଗ୍ରୀ ଏକାଠି କରନ୍ତୁ',
  before_begin: 'ଆରମ୍ଭ କରିବା ପୂର୍ବରୁ',
  check_off: 'ଆପଣ ସାମଗ୍ରୀଗୁଡ଼ିକୁ ଏକାଠି କରିବା ସମୟରେ ପ୍ରତ୍ୟେକ ଆଇଟମ୍ ଉପରେ ଚିହ୍ନ ଦିଅନ୍ତୁ। ଯଦି କିଛି ଛାଡିଯାଏ ତେବେ ବ୍ୟସ୍ତ ହୁଅନ୍ତୁ ନାହିଁ - ତଥାପି ଆରମ୍ଭ କରିବାକୁ "ବର୍ତ୍ତମାନ ଛାଡ଼ନ୍ତୁ" ଉପରେ ଟ୍ୟାପ୍ କରନ୍ତୁ!',
  optional: 'ବୈକଳ୍ପିକ',
  items: 'ଆଇଟମ୍',
  safety_notes: 'ସୁରକ୍ଷା ନୋଟ୍ସ',
  lets_build: 'ଆସନ୍ତୁ ତିଆରି କରିବା!',
  check: 'ଯାଞ୍ଚ କରନ୍ତୁ',
  more_items: 'ଅଧିକ ଆଇଟମ୍',
  skip_now: 'ବର୍ତ୍ତମାନ ଛାଡ଼ନ୍ତୁ',
  steps: 'ପଦକ୍ଷେପଗୁଡ଼ିକ',
  estimated_time: 'ଆନୁମାନିକ ସମୟ:',
  pro_tip: 'ପ୍ରୋ ଟିପ୍',
  parent_help: 'ପିତାମାତାଙ୍କ ସାହାଯ୍ୟ ଆବଶ୍ୟକ',
  parent_help_desc: 'ସୁରକ୍ଷା କିମ୍ବା ଜଟିଳତା ପାଇଁ ଏହି ପଦକ୍ଷେପରେ ବୟସ୍କଙ୍କ ସହାୟତା ଆବଶ୍ୟକ ହୋଇପାରେ।',
  completed_undo: 'ସମ୍ପୂର୍ଣ୍ଣ ହୋଇଛି! (ବାତିଲ୍ କରିବାକୁ ଟ୍ୟାପ୍ କରନ୍ତୁ)',
  mark_done: 'ସମ୍ପୂର୍ଣ୍ଣ ଭାବରେ ଚିହ୍ନିତ କରନ୍ତୁ',
  skip_step: 'ପଦକ୍ଷେପ ଛାଡ଼ନ୍ତୁ',
  previous: 'ପୂର୍ବ',
  next: 'ପରବର୍ତ୍ତୀ',
  amazing_work: 'ଚମତ୍କାର କାମ!',
  you_completed: 'ଆପଣ ସମ୍ପୂର୍ଣ୍ଣ କରିଛନ୍ତି',
  total_time: 'ମୋଟ ସମୟ',
  steps_done: 'ପଦକ୍ଷେପ ସମ୍ପୂର୍ଣ୍ଣ',
  pillar: 'ସ୍ତମ୍ଭ',
  skills: 'କୌଶଳ ଯାହା ଆପଣ ଅଭ୍ୟାସ କରିଥିଲେ',
  whats_next: 'ଆଗକୁ କଣ?',
  whats_next_desc: 'ଆପଣଙ୍କର ଉପଲବ୍ଧିଗୁଡିକ ଦେଖିବା ପାଇଁ ୱାର୍କସପ୍ ରେ ଆପଣଙ୍କର ପ୍ରଗତି ଯାଞ୍ଚ କରନ୍ତୁ, କିମ୍ବା ସମାନ ସ୍ତମ୍ଭରେ ଅଧିକ କାର୍ଯ୍ୟକଳାପ ଅନ୍ୱେଷଣ କରନ୍ତୁ!',
  build_again: '🔄 ପୁଣି ତିଆରି କରନ୍ତୁ',
  done_back: '✨ ହୋଇଗଲା — କାର୍ଯ୍ୟକଳାପଗୁଡ଼ିକୁ ଫେରନ୍ତୁ',
  reset_progress: 'ପ୍ରଗତି ରିସେଟ୍ କରିବେ କି?',
  reset_desc: 'ଏହା ଏହି କାର୍ଯ୍ୟକଳାପ ପାଇଁ ଆପଣଙ୍କର ସମସ୍ତ ପ୍ରଗତି ସଫା କରିବ। ଆପଣ ଆରମ୍ଭରୁ ଆରମ୍ଭ କରିବେ।',
  cancel: 'ବାତିଲ୍ କରନ୍ତୁ',
  reset: 'ରିସେଟ୍ କରନ୍ତୁ',
  save_exit: 'ସେଭ୍ କରନ୍ତୁ ଏବଂ ବାହାରନ୍ତୁ?',
  save_exit_desc: 'ଆପଣଙ୍କର ପ୍ରଗତି ସ୍ୱୟଂଚାଳିତ ଭାବରେ ସେଭ୍ ହୋଇଛି! ଆପଣ ଏହି କାର୍ଯ୍ୟକଳାପକୁ ଯେକୌଣସି ସମୟରେ ସେଠାରୁ ଜାରି ରଖିପାରିବେ ଯେଉଁଠାରୁ ଆପଣ ଛାଡିଥିଲେ।',
  keep_building: 'ନିର୍ମାଣ ଜାରି ରଖନ୍ତୁ',
  save_exit_btn: 'ସେଭ୍ କରନ୍ତୁ ଏବଂ ବାହାରନ୍ତୁ'
});
fs.writeFileSync(odPath, JSON.stringify(dataOd, null, 2));

const compPath = 'd:/vision_agentic/jigyasu/apps/hub/src/kidscamp/components/ActivityMode.tsx';
let code = fs.readFileSync(compPath, 'utf8');

if (!code.includes('useTranslation')) {
  code = code.replace(/import \{ pillars \} from '\.\.\/data\/categories';/, "import { pillars } from '../data/categories';\nimport { useTranslation } from 'react-i18next';");
  code = code.replace(/export default function ActivityMode\(\{[\s\S]*?\}: ActivityModeProps\) \{/, "export default function ActivityMode({\n  activity,\n  onClose,\n  onComplete,\n  playSound\n}: ActivityModeProps) {\n  const { t } = useTranslation();");
}

code = code.replace(/>Great Job!<\/span>/, ">{t('kidscamp.activity_mode.great_job', 'Great Job!')}</span>");
code = code.replace(/>Back<\/span>/, ">{t('kidscamp.activity_mode.back', 'Back')}</span>");

code = code.replace(/title=\{timerRunning \? 'Pause timer' : 'Resume timer'\}/, "title={timerRunning ? t('kidscamp.activity_mode.pause_timer', 'Pause timer') : t('kidscamp.activity_mode.resume_timer', 'Resume timer')}");
code = code.replace(/title="Reset activity"/, "title={t('kidscamp.activity_mode.reset_activity', 'Reset activity')}");

code = code.replace(/>\{completionPercentage\}% complete<\/span>/, ">{completionPercentage}{t('kidscamp.activity_mode.complete', '% complete')}</span>");
code = code.replace(/>\{activity\.steps\.length - progress\.completedSteps\.length\} steps remaining<\/span>/, ">{activity.steps.length - progress.completedSteps.length} {t('kidscamp.activity_mode.steps_remaining', 'steps remaining')}</span>");

code = code.replace(/>Step 1: Gather Materials<\/span>/, ">{t('kidscamp.activity_mode.step1', 'Step 1: Gather Materials')}</span>");
code = code.replace(/>\s*Before You Begin\s*<\/h2>/, ">{t('kidscamp.activity_mode.before_begin', 'Before You Begin')}</h2>");
code = code.replace(/>\s*Check off each item as you gather them\. Don't worry if you're missing something - tap "Skip for now" to start anyway!\s*<\/p>/, ">{t('kidscamp.activity_mode.check_off', 'Check off each item as you gather them. Don\\'t worry if you\\'re missing something - tap \"Skip for now\" to start anyway!')}</p>");

code = code.replace(/>\s*Optional\s*<\/span>/, ">{t('kidscamp.activity_mode.optional', 'Optional')}</span>");
code = code.replace(/>\s*\{progress\.materialsChecked\.length\} of \{activity\.materials\.length\} items\s*<\/span>/, ">{progress.materialsChecked.length} of {activity.materials.length} {t('kidscamp.activity_mode.items', 'items')}</span>");
code = code.replace(/>⚠️<\/span> Safety Notes/, ">⚠️</span> {t('kidscamp.activity_mode.safety_notes', 'Safety Notes')}");

code = code.replace(/\{allMaterialsChecked \? "🚀 Let's Build!" : `Check \$\{activity\.materials\.length - progress\.materialsChecked\.length\} more items`\}/, "{allMaterialsChecked ? t('kidscamp.activity_mode.lets_build', \"🚀 Let's Build!\") : `${t('kidscamp.activity_mode.check', 'Check')} ${activity.materials.length - progress.materialsChecked.length} ${t('kidscamp.activity_mode.more_items', 'more items')}`}");

code = code.replace(/Skip for now/, "{t('kidscamp.activity_mode.skip_now', 'Skip for now')}");

code = code.replace(/>Steps<\/h3>/, ">{t('kidscamp.activity_mode.steps', 'Steps')}</h3>");
code = code.replace(/>Estimated time: \{activity\.steps\[activeStep\]\.duration\}<\/span>/, "> {t('kidscamp.activity_mode.estimated_time', 'Estimated time:')} {activity.steps[activeStep].duration}</span>");

code = code.replace(/>Pro Tip<\/p>/, ">{t('kidscamp.activity_mode.pro_tip', 'Pro Tip')}</p>");
code = code.replace(/>Parent Help Needed<\/p>/, ">{t('kidscamp.activity_mode.parent_help', 'Parent Help Needed')}</p>");
code = code.replace(/>This step may require adult assistance for safety or complexity\.<\/p>/, ">{t('kidscamp.activity_mode.parent_help_desc', 'This step may require adult assistance for safety or complexity.')}</p>");

code = code.replace(/Completed! \(tap to undo\)/, "{t('kidscamp.activity_mode.completed_undo', 'Completed! (tap to undo)')}");
code = code.replace(/Mark as Done/, "{t('kidscamp.activity_mode.mark_done', 'Mark as Done')}");
code = code.replace(/Skip Step/, "{t('kidscamp.activity_mode.skip_step', 'Skip Step')}");

code = code.replace(/Previous/, "{t('kidscamp.activity_mode.previous', 'Previous')}");
code = code.replace(/Next/, "{t('kidscamp.activity_mode.next', 'Next')}");

code = code.replace(/>\s*Amazing Work!\s*<\/h2>/, ">{t('kidscamp.activity_mode.amazing_work', 'Amazing Work!')}</h2>");
code = code.replace(/You completed <span className="font-bold text-orange-500">\{activity\.name\}<\/span>/, "{t('kidscamp.activity_mode.you_completed', 'You completed')} <span className=\"font-bold text-orange-500\">{activity.name}</span>");

code = code.replace(/>Total Time<\/div>/, ">{t('kidscamp.activity_mode.total_time', 'Total Time')}</div>");
code = code.replace(/>Steps Done<\/div>/, ">{t('kidscamp.activity_mode.steps_done', 'Steps Done')}</div>");
code = code.replace(/>Pillar<\/div>/, ">{t('kidscamp.activity_mode.pillar', 'Pillar')}</div>");

code = code.replace(/>🧠<\/span> Skills You Practiced/, ">🧠</span> {t('kidscamp.activity_mode.skills', 'Skills You Practiced')}");
code = code.replace(/>🚀<\/span> What's Next\?/, ">🚀</span> {t('kidscamp.activity_mode.whats_next', \"What's Next?\")}");
code = code.replace(/>Check your progress in the Workshop to see your achievements, or explore more activities in the same pillar!<\/p>/, ">{t('kidscamp.activity_mode.whats_next_desc', 'Check your progress in the Workshop to see your achievements, or explore more activities in the same pillar!')}</p>");

code = code.replace(/🔄 Build Again/, "{t('kidscamp.activity_mode.build_again', '🔄 Build Again')}");
code = code.replace(/✨ Done — Back to Activities/, "{t('kidscamp.activity_mode.done_back', '✨ Done — Back to Activities')}");

code = code.replace(/>\s*Reset Progress\?\s*<\/h3>/, ">{t('kidscamp.activity_mode.reset_progress', 'Reset Progress?')}</h3>");
code = code.replace(/>\s*This will clear all your progress for this activity\. You'll start from the beginning\.\s*<\/p>/, ">{t('kidscamp.activity_mode.reset_desc', 'This will clear all your progress for this activity. You\\'ll start from the beginning.')}</p>");

code = code.replace(/>\s*Cancel\s*<\/button>/g, ">{t('kidscamp.activity_mode.cancel', 'Cancel')}</button>");
code = code.replace(/>\s*Reset\s*<\/button>/, ">{t('kidscamp.activity_mode.reset', 'Reset')}</button>");

code = code.replace(/>\s*Save & Exit\?\s*<\/h3>/, ">{t('kidscamp.activity_mode.save_exit', 'Save & Exit?')}</h3>");
code = code.replace(/>\s*Your progress is automatically saved! You can continue this activity anytime from where you left off\.\s*<\/p>/, ">{t('kidscamp.activity_mode.save_exit_desc', 'Your progress is automatically saved! You can continue this activity anytime from where you left off.')}</p>");

code = code.replace(/>\s*Keep Building\s*<\/button>/, ">{t('kidscamp.activity_mode.keep_building', 'Keep Building')}</button>");
code = code.replace(/>\s*Save & Exit\s*<\/button>/, ">{t('kidscamp.activity_mode.save_exit_btn', 'Save & Exit')}</button>");

fs.writeFileSync(compPath, code);
