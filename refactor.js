const fs = require('fs');
const path = require('path');

function processFiles(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (let file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processFiles(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      
      // Fix audio imports
      if (content.includes('voiceEngine') && content.includes('/engine/voiceEngine')) {
        content = content.replace(/import\s+\{[^}]*voiceEngine[^}]*\}\s+from\s+['"].*?\/engine\/voiceEngine['"]/g, "import { voiceEngine } from '@jigyasu/audio'");
        changed = true;
      }

      // Fix storage imports
      if (content.includes('useProgress')) {
        content = content.replace(/import\s+\{[^}]*useProgress[^}]*\}\s+from\s+['"].*?hooks\/useProgress['"]/g, "import { useActivityProgress } from '@jigyasu/storage'");
        content = content.replace(/useProgress\(/g, "useActivityProgress(");
        changed = true;
      }
      
      if (changed) {
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

['math', 'bio', 'chem', 'cosmos'].forEach(app => processFiles('apps/' + app + '/src'));
console.log('Refactoring complete!');
