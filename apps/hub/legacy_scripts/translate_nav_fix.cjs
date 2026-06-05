const fs = require('fs');

const path = 'd:/vision_agentic/jigyasu/apps/hub/src/components/NavigationCards.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(/\{t\('maker_space', 'Maker Space'\)\}/, "{t('nav_maker_space', 'Maker Space')}");

fs.writeFileSync(path, code);
