import fs from 'fs';
import path from 'path';

function search(dir) {
  if (dir.includes('node_modules') || dir.includes('.git') || dir.includes('dist') || dir.includes('.next')) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      search(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx') || fullPath.endsWith('.json') || fullPath.endsWith('.html') || fullPath.endsWith('.md')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.toLowerCase().includes('gurudev')) {
        console.log('FOUND:', fullPath);
      }
    }
  }
}
search(process.cwd());
