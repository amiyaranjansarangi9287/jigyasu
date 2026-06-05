const fs = require('fs');

const hiPath = 'd:/vision_agentic/jigyasu/apps/hub/src/learnos/i18n/locales/hi.json';
const dataHi = JSON.parse(fs.readFileSync(hiPath, 'utf8'));
if (!dataHi.kidscamp.favorites) dataHi.kidscamp.favorites = {};
if (!dataHi.kidscamp.settings) dataHi.kidscamp.settings = {};
Object.assign(dataHi.kidscamp.favorites, {
  title: 'पसंदीदा',
  empty: 'अभी तक कोई पसंदीदा नहीं!',
  empty_desc: 'किसी भी गतिविधि को यहां सहेजने के लिए उस पर बने दिल के आइकन को टैप करें।'
});
Object.assign(dataHi.kidscamp.settings, {
  title: 'सेटिंग्स',
  theme: 'थीम',
  light: 'लाइट',
  dark: 'डार्क',
  system: 'सिस्टम',
  sound_effects: 'ध्वनि प्रभाव',
  sound_desc: 'क्रियाओं पर ध्वनियाँ बजाएं',
  made_with: 'रचनात्मक परिवारों के लिए ❤️ के साथ बनाया गया'
});
fs.writeFileSync(hiPath, JSON.stringify(dataHi, null, 2));

const odPath = 'd:/vision_agentic/jigyasu/apps/hub/src/learnos/i18n/locales/od.json';
const dataOd = JSON.parse(fs.readFileSync(odPath, 'utf8'));
if (!dataOd.kidscamp.favorites) dataOd.kidscamp.favorites = {};
if (!dataOd.kidscamp.settings) dataOd.kidscamp.settings = {};
Object.assign(dataOd.kidscamp.favorites, {
  title: 'ପସନ୍ଦ',
  empty: 'ଏପର୍ଯ୍ୟନ୍ତ କୌଣସି ପସନ୍ଦ ନାହିଁ!',
  empty_desc: 'ଏଠାରେ ସେଭ୍ କରିବାକୁ ଯେକୌଣସି କାର୍ଯ୍ୟକଳାପରେ ଥିବା ହାର୍ଟ ଆଇକନ୍ ଉପରେ ଟ୍ୟାପ୍ କରନ୍ତୁ।'
});
Object.assign(dataOd.kidscamp.settings, {
  title: 'ସେଟିଂସମୂହ',
  theme: 'ଥିମ୍',
  light: 'ଲାଇଟ୍',
  dark: 'ଡାର୍କ',
  system: 'ସିଷ୍ଟମ୍',
  sound_effects: 'ଧ୍ୱନି ପ୍ରଭାବଗୁଡ଼ିକ',
  sound_desc: 'କାର୍ଯ୍ୟଗୁଡ଼ିକରେ ଧ୍ୱନି ବଜାନ୍ତୁ',
  made_with: 'ସୃଜନଶୀଳ ପରିବାରମାନଙ୍କ ପାଇଁ ❤️ ସହିତ ତିଆରି ହୋଇଛି'
});
fs.writeFileSync(odPath, JSON.stringify(dataOd, null, 2));

const favPath = 'd:/vision_agentic/jigyasu/apps/hub/src/kidscamp/components/FavoritesPanel.tsx';
let favCode = fs.readFileSync(favPath, 'utf8');

if (!favCode.includes('useTranslation')) {
  favCode = favCode.replace(/import \{ useLocalizedActivities \} from '\.\.\/\.\.\/hooks\/useLocalizedData';/, "import { useLocalizedActivities } from '../../hooks/useLocalizedData';\nimport { useTranslation } from 'react-i18next';");
  favCode = favCode.replace(/export default function FavoritesPanel\(\{[\s\S]*?\}: Props\) \{/, "export default function FavoritesPanel({\n  favorites,\n  favoritesCount,\n  handleSelectActivity,\n  setFavoritesOpen\n}: Props) {\n  const { t } = useTranslation();");
}

favCode = favCode.replace(/>\s*Favorites \(\{favoritesCount\}\)\s*<\/h2>/, ">{t('kidscamp.favorites.title', 'Favorites')} ({favoritesCount})</h2>");
favCode = favCode.replace(/>No favorites yet!<\/p>/, ">{t('kidscamp.favorites.empty', 'No favorites yet!')}</p>");
favCode = favCode.replace(/>Tap the heart icon on any activity to save it here\.<\/p>/, ">{t('kidscamp.favorites.empty_desc', 'Tap the heart icon on any activity to save it here.')}</p>");

fs.writeFileSync(favPath, favCode);

const setPath = 'd:/vision_agentic/jigyasu/apps/hub/src/kidscamp/components/SettingsModal.tsx';
let setCode = fs.readFileSync(setPath, 'utf8');

if (!setCode.includes('useTranslation')) {
  setCode = setCode.replace(/import \{ Theme \} from '\.\.\/hooks\/useTheme';/, "import { Theme } from '../hooks/useTheme';\nimport { useTranslation } from 'react-i18next';");
  setCode = setCode.replace(/export default function SettingsModal\(\{[\s\S]*?\}: Props\) \{/, "export default function SettingsModal({\n  theme,\n  setTheme,\n  soundEnabled,\n  toggleSound,\n  setSettingsOpen\n}: Props) {\n  const { t } = useTranslation();");
}

setCode = setCode.replace(/>Settings<\/h2>/, ">{t('kidscamp.settings.title', 'Settings')}</h2>");
setCode = setCode.replace(/>Theme<\/h4>/, ">{t('kidscamp.settings.theme', 'Theme')}</h4>");

// Note: {t.charAt(0).toUpperCase() + t.slice(1)} was used
// We can use a map
setCode = setCode.replace(/\{t === 'light' \? '☀️' : t === 'dark' \? '🌙' : '💻'\} \{t\.charAt\(0\)\.toUpperCase\(\) \+ t\.slice\(1\)\}/, "{t === 'light' ? '☀️ ' + t('kidscamp.settings.light', 'Light') : t === 'dark' ? '🌙 ' + t('kidscamp.settings.dark', 'Dark') : '💻 ' + t('kidscamp.settings.system', 'System')}");

setCode = setCode.replace(/>Sound Effects<\/h4>/, ">{t('kidscamp.settings.sound_effects', 'Sound Effects')}</h4>");
setCode = setCode.replace(/>Play sounds on actions<\/p>/, ">{t('kidscamp.settings.sound_desc', 'Play sounds on actions')}</p>");

setCode = setCode.replace(/>\s*CampCraft v1\.0 • Made with ❤️ for creative families\s*<\/p>/, ">CampCraft v1.0 • {t('kidscamp.settings.made_with', 'Made with ❤️ for creative families')}</p>");

fs.writeFileSync(setPath, setCode);
