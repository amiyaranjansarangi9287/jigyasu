const fs = require('fs');

const path = 'd:/vision_agentic/jigyasu/apps/hub/src/kidscamp/components/Footer.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(/import \{ pillars \} from '\.\.\/data\/categories';/, "import { pillars } from '../data/categories';\nimport { useTranslation } from 'react-i18next';");

code = code.replace(/export default function Footer\(\{ onNavigate \}: FooterProps\) \{/, "export default function Footer({ onNavigate }: FooterProps) {\n  const { t } = useTranslation();");

code = code.replace(/Free visual STEM learning for every child in India\. Works offline\. 6 Indian languages\./, "{t('footer.desc', 'Free visual STEM learning for every child in India. Works offline. 6 Indian languages.')}");

code = code.replace(/>Activities<\/h4>/, ">{t('kidscamp.footer.activities', 'Activities')}</h4>");
code = code.replace(/>Resources<\/h4>/, ">{t('kidscamp.footer.resources', 'Resources')}</h4>");
code = code.replace(/>Information<\/h4>/, ">{t('footer.information', 'Information')}</h4>");

code = code.replace(/>\s*All Activities →\s*<\/button>/, ">{t('kidscamp.footer.all_activities', 'All Activities →')}</button>");
code = code.replace(/>\s*Project Weeks\s*<\/button>/, ">{t('kidscamp.footer.project_weeks', 'Project Weeks')}</button>");
code = code.replace(/>\s*Printable Checklists\s*<\/a>/, ">{t('kidscamp.footer.printable_checklists', 'Printable Checklists')}</a>");
code = code.replace(/>\s*Safety Tips\s*<\/a>/, ">{t('kidscamp.footer.safety_tips', 'Safety Tips')}</a>");
code = code.replace(/>\s*Material Substitutes\s*<\/a>/, ">{t('kidscamp.footer.material_substitutes', 'Material Substitutes')}</a>");
code = code.replace(/>\s*FAQs\s*<\/a>/, ">{t('kidscamp.footer.faqs', 'FAQs')}</a>");

code = code.replace(/>\s*Privacy\s*<\/a>/, ">{t('footer.privacy', 'Privacy')}</a>");
code = code.replace(/>\s*About Us\s*<\/a>/, ">{t('footer.about', 'About Us')}</a>");

code = code.replace(/© \{currentYear\} Jigyasu\. Made with ❤️ for India\./, "© {currentYear} Jigyasu. {t('footer.made_with', 'Made with ❤️ for India.')}");

fs.writeFileSync(path, code);

// Update hi.json
const hiPath = 'd:/vision_agentic/jigyasu/apps/hub/src/learnos/i18n/locales/hi.json';
const dataHi = JSON.parse(fs.readFileSync(hiPath, 'utf8'));
if (!dataHi.kidscamp) dataHi.kidscamp = {};
if (!dataHi.kidscamp.footer) dataHi.kidscamp.footer = {};
dataHi.kidscamp.footer.activities = 'गतिविधियाँ';
dataHi.kidscamp.footer.resources = 'संसाधन';
dataHi.kidscamp.footer.all_activities = 'सभी गतिविधियाँ →';
dataHi.kidscamp.footer.project_weeks = 'प्रोजेक्ट सप्ताह';
dataHi.kidscamp.footer.printable_checklists = 'प्रिंट करने योग्य चेकलिस्ट';
dataHi.kidscamp.footer.safety_tips = 'सुरक्षा सुझाव';
dataHi.kidscamp.footer.material_substitutes = 'सामग्री विकल्प';
dataHi.kidscamp.footer.faqs = 'अक्सर पूछे जाने वाले प्रश्न';
fs.writeFileSync(hiPath, JSON.stringify(dataHi, null, 2));

// Update od.json
const odPath = 'd:/vision_agentic/jigyasu/apps/hub/src/learnos/i18n/locales/od.json';
const dataOd = JSON.parse(fs.readFileSync(odPath, 'utf8'));
if (!dataOd.kidscamp) dataOd.kidscamp = {};
if (!dataOd.kidscamp.footer) dataOd.kidscamp.footer = {};
dataOd.kidscamp.footer.activities = 'କାର୍ଯ୍ୟକଳାପଗୁଡ଼ିକ';
dataOd.kidscamp.footer.resources = 'ସମ୍ପଦ';
dataOd.kidscamp.footer.all_activities = 'ସମସ୍ତ କାର୍ଯ୍ୟକଳାପ →';
dataOd.kidscamp.footer.project_weeks = 'ପ୍ରୋଜେକ୍ଟ ସପ୍ତାହ';
dataOd.kidscamp.footer.printable_checklists = 'ପ୍ରିଣ୍ଟ୍ ଯୋଗ୍ୟ ଚେକଲିଷ୍ଟ୍';
dataOd.kidscamp.footer.safety_tips = 'ସୁରକ୍ଷା ପରାମର୍ଶ';
dataOd.kidscamp.footer.material_substitutes = 'ସାମଗ୍ରୀ ବିକଳ୍ପ';
dataOd.kidscamp.footer.faqs = 'ବାରମ୍ବାର ପଚରାଯାଉଥିବା ପ୍ରଶ୍ନ (FAQs)';
fs.writeFileSync(odPath, JSON.stringify(dataOd, null, 2));
