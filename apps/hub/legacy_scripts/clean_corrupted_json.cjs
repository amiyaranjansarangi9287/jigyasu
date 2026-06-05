const fs = require('fs');
const path = require('path');

const localesDir = 'src/learnos/i18n/locales';
const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.json'));

files.forEach(file => {
  const filePath = path.join(localesDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  let modified = false;

  // Fix explore_projects
  if (data.explore_projects && data.explore_projects.length > 200) {
    if (file === 'en.json') {
      data.explore_projects = 'Explore {{count}} hands-on projects across science, art, building, and outdoor adventures';
    } else {
      // For others, let it fall back or we can translate it later
      delete data.explore_projects;
    }
    modified = true;
    console.log(`Fixed explore_projects in ${file}`);
  }

  // Look for any other massive corrupted strings (like search_activities if it was broken)
  Object.keys(data).forEach(k => {
    if (typeof data[k] === 'string' && data[k].length > 200 && data[k].includes('className=')) {
      if (file === 'en.json' && k === 'search_activities') {
        data[k] = 'Search activities...';
      } else {
        delete data[k];
      }
      modified = true;
      console.log(`Removed corrupted key ${k} in ${file}`);
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  }
});
console.log('Cleanup complete.');
