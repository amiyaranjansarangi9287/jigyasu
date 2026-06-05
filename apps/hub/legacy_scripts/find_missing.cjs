const fs = require('fs');
const path = require('path');

const search = (dir, queries) => {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      search(fullPath, queries);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      queries.forEach(q => {
        if (content.includes(q)) console.log(`Found '${q}' in ${fullPath}`);
      });
    }
  });
};

search('./src', [
  'Welcome', 
  'Time to Review!', 
  "You're all caught up!", 
  'Coming Soon', 
  'Share Your Experience', 
  'Ready to learn something today?', 
  'Weekly Summary', 
  'Impact', 
  'Analytics',
  '\\u2192'
]);
