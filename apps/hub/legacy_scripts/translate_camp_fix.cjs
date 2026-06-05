const fs = require('fs');

const path = 'd:/vision_agentic/jigyasu/apps/hub/src/kidscamp/components/CampWeeksPreview.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(/>\s*Complete all 4 Project Weeks to earn the <span className=\"font-bold text-orange-500\">dY\?\+ Summer Champion<\/span> badge!\s*<\/p>/, ">{t('camp_weeks.complete_all', 'Complete all 4 Project Weeks to earn the')} <span className=\"font-bold text-orange-500\">dY?+ {t('camp_weeks.summer_champion', 'Summer Champion')}</span> {t('camp_weeks.badge', 'badge!')}</p>");

fs.writeFileSync(path, code);
