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

const files = walk('D:/vision_agentic/jigyasu/apps/learn/src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  if (content.includes("ConceptCard from")) {
    content = content.replace(/import ConceptCard from ['"].*?ConceptCard['"];?/g, "import { ConceptCard } from '@jigyasu/ui';");
    changed = true;
  }
  
  if (content.includes("Layout from")) {
    content = content.replace(/import Layout from ['"].*?Layout['"];?/g, "import { Layout } from '@jigyasu/ui';");
    changed = true;
  }

  if (content.includes("import { cn } from")) {
    content = content.replace(/import\s*\{\s*cn\s*\}\s*from\s*['"].*?cn['"];?/g, "import { cn } from '@jigyasu/utils';");
    changed = true;
  }

  if (file.endsWith('Atoms.tsx')) {
    if (content.includes('<AtomsCanvas />')) {
      content = content.replace(/<AtomsCanvas \/>/g, '<AtomsCanvas electrons={[{x: 0, y: 0, angle: 0, speed: 1}]} />');
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated imports in: ' + file);
  }
});
