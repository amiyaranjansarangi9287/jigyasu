const fs = require('fs');
const stripPath = 'd:/vision_agentic/jigyasu/apps/hub/src/learnos/landing/FeatureStrip.tsx';
let code = fs.readFileSync(stripPath, 'utf8');

// replace the hardcoded string
code = code.replace(/<span className="text-sm font-bold uppercase tracking-wider text-brand">Core Design Principles<\/span>/, "<span className=\"text-sm font-bold uppercase tracking-wider text-brand\">{t('landing.principles.title', 'Core Design Principles')}</span>");

fs.writeFileSync(stripPath, code);
console.log('Fixed FeatureStrip.tsx title');
