const fs = require('fs');
const path = require('path');

// 1. Fix '6 ' to '22 ' in all locales
const localesDir = 'D:/vision_agentic/jigyasu/apps/hub/src/learnos/i18n/locales';
const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.json')).map(f => path.join(localesDir, f));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let data = JSON.parse(content);
  
  const targetKeys = ['badge', 'six_languages', 'step2_desc', 'desc', 'about.differences.2.title', 'footer.desc'];
  
  function deepReplace(obj, prefix = '') {
    for (const key in obj) {
      const fullKey = prefix ? prefix + '.' + key : key;
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        deepReplace(obj[key], fullKey);
      } else if (typeof obj[key] === 'string') {
        const keyMatch = targetKeys.includes(key) || targetKeys.some(t => fullKey.endsWith(t));
        if (keyMatch) {
          // Replace 6, six, and Hindi numeral 6 (\u096C)
          obj[key] = obj[key].replace(/6 /g, '22 ')
                             .replace(/6/g, '22')
                             .replace(/\u096C /g, '\u0968\u0968 ')
                             .replace(/\u096C/g, '\u0968\u0968')
                             .replace(/six /i, '22 ');
        }
      }
    }
  }
  
  deepReplace(data);
  
  // Add new translation keys
  data['get_help'] = data['get_help'] || 'Get Help';
  data['report'] = data['report'] || 'Report';
  data['weekly_summary'] = data['weekly_summary'] || 'Weekly Summary';
  data['weekly_summary_desc'] = data['weekly_summary_desc'] || "Track your child's learning journey with detailed progress reports, time spent, and achievements.";
  if (!data['landing']) data['landing'] = {};
  if (!data['landing']['hero']) data['landing']['hero'] = {};
  data['landing']['hero']['coming_soon'] = data['landing']['hero']['coming_soon'] || 'Coming Soon';
  
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
});

// 2. Fix CrisisResources.tsx
const crisisFile = 'D:/vision_agentic/jigyasu/apps/hub/src/components/CrisisResources.tsx';
let crisisContent = fs.readFileSync(crisisFile, 'utf8');
crisisContent = crisisContent.replace(/<span>Get Help<\/span>/, "<span>{t('get_help', 'Get Help')}</span>");
fs.writeFileSync(crisisFile, crisisContent);

// 3. Fix SafetyReportButton.tsx
const reportFile = 'D:/vision_agentic/jigyasu/apps/hub/src/components/SafetyReportButton.tsx';
let reportContent = fs.readFileSync(reportFile, 'utf8');
reportContent = reportContent.replace(/<span>Report<\/span>/, "<span>{t('report', 'Report')}</span>");
fs.writeFileSync(reportFile, reportContent);

// 4. Fix ParentsPanel.tsx
const parentsFile = 'D:/vision_agentic/jigyasu/apps/hub/src/learnos/landing/ParentsPanel.tsx';
let parentsContent = fs.readFileSync(parentsFile, 'utf8');
parentsContent = parentsContent.replace(
  /<p className="text-sm font-semibold text-slate-500">Weekly Summary<\/p>/g,
  '<p className="text-sm font-semibold text-slate-500">{t(\'weekly_summary\', \'Weekly Summary\')}</p>'
);
parentsContent = parentsContent.replace(
  /<p className="font-display text-lg font-bold">Coming Soon<\/p>/g,
  '<p className="font-display text-lg font-bold">{t(\'landing.hero.coming_soon\', \'Coming Soon\')}</p>'
);
parentsContent = parentsContent.replace(
  /<p className="text-sm text-slate-600">Track your child\\'s learning journey with detailed progress reports, time spent, and achievements.<\/p>/g,
  '<p className="text-sm text-slate-600">{t(\'weekly_summary_desc\', "Track your child\'s learning journey with detailed progress reports, time spent, and achievements.")}</p>'
);
fs.writeFileSync(parentsFile, parentsContent);

// 5. Fix Hero.tsx
const heroFile = 'D:/vision_agentic/jigyasu/apps/hub/src/learnos/landing/Hero.tsx';
let heroContent = fs.readFileSync(heroFile, 'utf8');
heroContent = heroContent.replace(
  /<dd className="font-display text-2xl font-bold text-slate-900">Coming Soon<\/dd>/g,
  '<dd className="font-display text-2xl font-bold text-slate-900">{t(\'landing.hero.coming_soon\', \'Coming Soon\')}</dd>'
);
fs.writeFileSync(heroFile, heroContent);

console.log('Replacements completed successfully.');
