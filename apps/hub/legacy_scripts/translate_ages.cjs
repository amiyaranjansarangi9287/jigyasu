const fs = require('fs');

// Add translation to hi.json
const pathHi = 'd:/vision_agentic/jigyasu/apps/hub/src/learnos/i18n/locales/hi.json';
const dataHi = JSON.parse(fs.readFileSync(pathHi, 'utf8'));
if (!dataHi.kidscamp) dataHi.kidscamp = {};
if (!dataHi.kidscamp.ages) dataHi.kidscamp.ages = {};
dataHi.kidscamp.ages = {
  title1: "लिटिल एक्सप्लोरर्स",
  desc1: "माता-पिता के मार्गदर्शन के साथ सरल, संवेदी गतिविधियाँ। जिज्ञासु बच्चों के लिए बिल्कुल सही!",
  title2: "जूनियर क्रिएटर्स",
  desc2: "स्पष्ट चरण-दर-चरण निर्देशों के साथ मजेदार प्रोजेक्ट। बनाने के माध्यम से आत्मविश्वास का निर्माण!",
  title3: "एडवेंचर बिल्डर्स",
  desc3: "स्वतंत्र निर्माताओं के लिए जटिल प्रोजेक्ट जो वास्तविक चुनौतियों के लिए तैयार हैं!",
  title4: "भविष्य के इनोवेटर्स",
  desc4: "किशोरावस्था के लिए उन्नत प्रोजेक्ट, कोडिंग और वास्तविक दुनिया के कौशल!",
  title5: "आजीवन शिक्षार्थी",
  desc5: "गहराई से जानना, पेशेवर कौशल और उन्नत अवधारणाएँ।",
  whos_making: "आज कौन बना रहा है? 🎨",
  whos_making_modal: "आज कौन बना रहा है?",
  select_age: "अपने बच्चे के कौशल स्तर से मेल खाने वाली व्यक्तिगत गतिविधियों के लिए आयु वर्ग का चयन करें",
  clear_selection: "चयन साफ़ करें (सभी आयु दिखाएं)"
};
fs.writeFileSync(pathHi, JSON.stringify(dataHi, null, 2));

// Add translation to od.json
const pathOd = 'd:/vision_agentic/jigyasu/apps/hub/src/learnos/i18n/locales/od.json';
const dataOd = JSON.parse(fs.readFileSync(pathOd, 'utf8'));
if (!dataOd.kidscamp) dataOd.kidscamp = {};
if (!dataOd.kidscamp.ages) dataOd.kidscamp.ages = {};
dataOd.kidscamp.ages = {
  title1: "ଲିଟିଲ୍ ଏକ୍ସପ୍ଲୋରର୍ସ",
  desc1: "ପିତାମାତାଙ୍କ ମାର୍ଗଦର୍ଶନ ସହିତ ସରଳ, ସମ୍ବେଦନଶୀଳ କାର୍ଯ୍ୟକଳାପ। କୌତୁହଳୀ ପିଲାମାନଙ୍କ ପାଇଁ ଉପଯୁକ୍ତ!",
  title2: "ଜୁନିୟର କ୍ରିଏଟର୍ସ",
  desc2: "ସ୍ପଷ୍ଟ ପଦକ୍ଷେପ-ଅନୁସାରେ ନିର୍ଦ୍ଦେଶ ସହିତ ମଜାଦାର ପ୍ରୋଜେକ୍ଟ। ତିଆରି କରିବା ମାଧ୍ୟମରେ ଆତ୍ମବିଶ୍ୱାସ ବୃଦ୍ଧି!",
  title3: "ଆଡଭେଞ୍ଚର୍ ବିଲ୍ଡର୍ସ",
  desc3: "ବାସ୍ତବିକ ଆହ୍ୱାନ ପାଇଁ ପ୍ରସ୍ତୁତ ସ୍ୱାଧୀନ ନିର୍ମାତାଙ୍କ ପାଇଁ ଜଟିଳ ପ୍ରୋଜେକ୍ଟ!",
  title4: "ଭବିଷ୍ୟତର ଇନୋଭେଟର୍ସ",
  desc4: "କିଶୋରମାନଙ୍କ ପାଇଁ ଉନ୍ନତ ପ୍ରୋଜେକ୍ଟ, କୋଡିଂ, ଏବଂ ବାସ୍ତବ ଦୁନିଆର କୌଶଳ!",
  title5: "ଆଜୀବନ ଶିକ୍ଷାର୍ଥୀ",
  desc5: "ଗଭୀର ଅଧ୍ୟୟନ, ପେସାଦାର କୌଶଳ, ଏବଂ ଉନ୍ନତ ଧାରଣାଗୁଡ଼ିକ।",
  whos_making: "ଆଜି କିଏ ତିଆରି କରୁଛି? 🎨",
  whos_making_modal: "ଆଜି କିଏ ତିଆରି କରୁଛି?",
  select_age: "ଆପଣଙ୍କ ପିଲାଙ୍କ କୌଶଳ ସ୍ତର ସହିତ ମେଳ ଖାଉଥିବା ବ୍ୟକ୍ତିଗତ କାର୍ଯ୍ୟକଳାପ ପାଇଁ ଏକ ବୟସ ବର୍ଗ ଚୟନ କରନ୍ତୁ",
  clear_selection: "ଚୟନ ସଫା କରନ୍ତୁ (ସମସ୍ତ ବୟସ ଦେଖାନ୍ତୁ)"
};
fs.writeFileSync(pathOd, JSON.stringify(dataOd, null, 2));

// Update AgeSelector.tsx
const pathGrid = 'd:/vision_agentic/jigyasu/apps/hub/src/kidscamp/components/AgeSelector.tsx';
let code = fs.readFileSync(pathGrid, 'utf8');

code = code.replace(/import \{ ageTiers, AgeTier \} from '\.\.\/data\/categories';/, "import { ageTiers, AgeTier } from '../data/categories';\nimport { useTranslation } from 'react-i18next';");

code = code.replace(/export default function AgeSelector\(\{/, "export default function AgeSelector({\n  selectedAge,\n  onSelectAge,\n  variant = 'full',\n  onClose\n}: AgeSelectorProps) {\n  const { t } = useTranslation();\n\n  // Skip replacing the original arguments");

code = code.replace(/export default function AgeSelector\(\{[\s\S]*?\}: AgeSelectorProps\) \{/, "export default function AgeSelector({\n  selectedAge,\n  onSelectAge,\n  variant = 'full',\n  onClose\n}: AgeSelectorProps) {\n  const { t } = useTranslation();");

code = code.replace(/'Little Explorers'/, "t('kidscamp.ages.title1', 'Little Explorers')");
code = code.replace(/'Simple, sensory activities with parent guidance\. Perfect for curious toddlers!'/, "t('kidscamp.ages.desc1', 'Simple, sensory activities with parent guidance. Perfect for curious toddlers!')");

code = code.replace(/'Junior Creators'/, "t('kidscamp.ages.title2', 'Junior Creators')");
code = code.replace(/'Fun projects with clear step-by-step instructions\. Building confidence through making!'/, "t('kidscamp.ages.desc2', 'Fun projects with clear step-by-step instructions. Building confidence through making!')");

code = code.replace(/'Adventure Builders'/, "t('kidscamp.ages.title3', 'Adventure Builders')");
code = code.replace(/'Complex projects for independent makers ready for real challenges!'/, "t('kidscamp.ages.desc3', 'Complex projects for independent makers ready for real challenges!')");

code = code.replace(/'Future Innovators'/, "t('kidscamp.ages.title4', 'Future Innovators')");
code = code.replace(/'Advanced projects, coding, and real-world skills for teens!'/, "t('kidscamp.ages.desc4', 'Advanced projects, coding, and real-world skills for teens!')");

code = code.replace(/'Lifelong Learners'/, "t('kidscamp.ages.title5', 'Lifelong Learners')");
code = code.replace(/'Deep dives, professional skills, and advanced concepts\.'/, "t('kidscamp.ages.desc5', 'Deep dives, professional skills, and advanced concepts.')");

code = code.replace(/>\s*Who's making today\?\s*<\/h2>/g, ">{t('kidscamp.ages.whos_making_modal', \"Who's making today?\")}</h2>");
code = code.replace(/>\s*Who's making today\? 🎨\s*<\/h2>/g, ">{t('kidscamp.ages.whos_making', \"Who's making today? 🎨\")}</h2>");

code = code.replace(/Select an age group for personalized activities that match your child's skill level/, "{t('kidscamp.ages.select_age', \"Select an age group for personalized activities that match your child's skill level\")}");

code = code.replace(/>\s*Clear selection \(show all ages\)\s*<\/button>/g, ">{t('kidscamp.ages.clear_selection', \"Clear selection (show all ages)\")}</button>");

fs.writeFileSync(pathGrid, code);
