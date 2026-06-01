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

  // Replace cn import
  if (content.match(/import\s+\{\s*cn\s*\}\s+from\s+['"].*?cn['"]/)) {
    content = content.replace(/import\s+\{\s*cn\s*\}\s+from\s+['"].*?cn['"];?/g, "import { cn } from '@jigyasu/utils';");
    changed = true;
  }

  // Replace Layout import
  if (content.match(/import\s+\{\s*Layout\s*\}\s+from\s+['"].*?Layout['"]/)) {
    content = content.replace(/import\s+\{\s*Layout\s*\}\s+from\s+['"].*?Layout['"];?/g, "import { Layout } from '@jigyasu/ui';");
    changed = true;
  }

  // Replace ConceptCard import
  if (content.match(/import\s+\{\s*ConceptCard\s*\}\s+from\s+['"].*?ConceptCard['"]/)) {
    content = content.replace(/import\s+\{\s*ConceptCard\s*\}\s+from\s+['"].*?ConceptCard['"];?/g, "import { ConceptCard } from '@jigyasu/ui';");
    changed = true;
  }

  // Special fix for Atoms.tsx missing electrons prop
  if (file.endsWith('Atoms.tsx')) {
    if (content.includes('<AtomsCanvas />')) {
      content = content.replace('<AtomsCanvas />', '<AtomsCanvas electrons={[{x: 0, y: 0, angle: 0, speed: 1}]} />');
      changed = true;
    }
    if (content.includes('<AtomsCanvas />')) { // In case it's on multiple lines
        content = content.replace(/<AtomsCanvas \/>/g, '<AtomsCanvas electrons={[{x: 0, y: 0, angle: 0, speed: 1}]} />');
        changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated imports in: ' + file);
  }
});
