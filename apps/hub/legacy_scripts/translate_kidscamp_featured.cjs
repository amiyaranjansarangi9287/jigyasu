const fs = require('fs');

const pathHi = 'd:/vision_agentic/jigyasu/apps/hub/src/learnos/i18n/locales/hi.json';
const dataHi = JSON.parse(fs.readFileSync(pathHi, 'utf8'));
if (!dataHi.kidscamp) dataHi.kidscamp = {};
if (!dataHi.kidscamp.featured) dataHi.kidscamp.featured = {};
dataHi.kidscamp.featured.built = 'बनाया गया';
dataHi.kidscamp.featured.in_progress = 'प्रगति पर';
dataHi.kidscamp.featured.build_again = '🔄 फिर से बनाएं';
dataHi.kidscamp.featured.continue = '▶ जारी रखें';
dataHi.kidscamp.featured.start_building = '🔨 बनाना शुरू करें';
dataHi.kidscamp.featured.staff_picks = 'स्टाफ़ की पसंद';
dataHi.kidscamp.featured.title = 'विशेष गतिविधियाँ';
dataHi.kidscamp.featured.desc = 'हमारे सबसे लोकप्रिय प्रोजेक्ट जिन्हें हर जगह परिवारों द्वारा पसंद किया जाता है';
dataHi.kidscamp.featured.view_details = 'विवरण देखें';
fs.writeFileSync(pathHi, JSON.stringify(dataHi, null, 2));

const pathOd = 'd:/vision_agentic/jigyasu/apps/hub/src/learnos/i18n/locales/od.json';
const dataOd = JSON.parse(fs.readFileSync(pathOd, 'utf8'));
if (!dataOd.kidscamp) dataOd.kidscamp = {};
if (!dataOd.kidscamp.featured) dataOd.kidscamp.featured = {};
dataOd.kidscamp.featured.built = 'ନିର୍ମିତ';
dataOd.kidscamp.featured.in_progress = 'ପ୍ରଗତିରେ';
dataOd.kidscamp.featured.build_again = '🔄 ପୁଣି ତିଆରି କରନ୍ତୁ';
dataOd.kidscamp.featured.continue = '▶ ଜାରି ରଖନ୍ତୁ';
dataOd.kidscamp.featured.start_building = '🔨 ତିଆରି ଆରମ୍ଭ କରନ୍ତୁ';
dataOd.kidscamp.featured.staff_picks = 'ଷ୍ଟାଫ୍ ପସନ୍ଦ';
dataOd.kidscamp.featured.title = 'ବିଶେଷ କାର୍ଯ୍ୟକଳାପଗୁଡ଼ିକ';
dataOd.kidscamp.featured.desc = 'ସବୁ ସ୍ଥାନରେ ପରିବାର ଦ୍ୱାରା ପସନ୍ଦ କରାଯାଉଥିବା ଆମର ସବୁଠାରୁ ଲୋକପ୍ରିୟ ପ୍ରୋଜେକ୍ଟଗୁଡ଼ିକ';
dataOd.kidscamp.featured.view_details = 'ବିବରଣୀ ଦେଖନ୍ତୁ';
fs.writeFileSync(pathOd, JSON.stringify(dataOd, null, 2));


const pathComponent = 'd:/vision_agentic/jigyasu/apps/hub/src/kidscamp/components/FeaturedActivities.tsx';
let code = fs.readFileSync(pathComponent, 'utf8');

code = code.replace(/import \{ useLocalizedActivities \} from '\.\.\/\.\.\/hooks\/useLocalizedData';/, "import { useLocalizedActivities } from '../../hooks/useLocalizedData';\nimport { useTranslation } from 'react-i18next';");
code = code.replace(/const \{ getFeaturedActivities \} = useLocalizedActivities\(\);/, "const { getFeaturedActivities } = useLocalizedActivities();\n  const { t } = useTranslation();");

code = code.replace(/>\s*Built\s*<\/span>/, ">{t('kidscamp.featured.built', 'Built')}</span>");
code = code.replace(/>\s*In Progress\s*<\/span>/, ">{t('kidscamp.featured.in_progress', 'In Progress')}</span>");

code = code.replace(/'🔄 Build Again'/, "t('kidscamp.featured.build_again', '🔄 Build Again')");
code = code.replace(/'▶ Continue'/, "t('kidscamp.featured.continue', '▶ Continue')");
code = code.replace(/'🔨 Start Building'/, "t('kidscamp.featured.start_building', '🔨 Start Building')");

code = code.replace(/>Staff Picks<\/span>/, ">{t('kidscamp.featured.staff_picks', 'Staff Picks')}</span>");
code = code.replace(/>\s*Featured Activities\s*<\/h2>/, ">{t('kidscamp.featured.title', 'Featured Activities')}</h2>");
code = code.replace(/>\s*Our most popular projects loved by families everywhere\s*<\/p>/, ">{t('kidscamp.featured.desc', 'Our most popular projects loved by families everywhere')}</p>");
code = code.replace(/>\s*View Details\s*<\/button>/, ">{t('kidscamp.featured.view_details', 'View Details')}</button>");

fs.writeFileSync(pathComponent, code);
