const fs = require('fs');

const path = 'd:/vision_agentic/jigyasu/apps/hub/src/learnos/landing/SpacedRepetition.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(/<span>\{record\.masteryLevel === 3 \? '🌟 Mastered' : '⭐ Familiar'\}<\/span>/, "<span>{record.masteryLevel === 3 ? '🌟 ' + t('landing.review.mastered', 'Mastered') : '⭐ ' + t('landing.review.familiar', 'Familiar')}</span>");

fs.writeFileSync(path, code);
