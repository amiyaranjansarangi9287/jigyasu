const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = [
  ...walk('D:/vision_agentic/jigyasu/apps/camp/src'),
  ...walk('D:/vision_agentic/jigyasu/apps/toys/src')
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Replace import { cn } from '../utils/cn' (or whatever path)
  if (content.match(/import\s+\{\s*cn\s*\}\s+from\s+['"][^'"]*cn['"]/)) {
    content = content.replace(/import\s+\{\s*cn\s*\}\s+from\s+['"][^'"]*cn['"];?/g, "import { cn } from '@jigyasu/utils';");
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated cn import in: ' + file);
  }
});
