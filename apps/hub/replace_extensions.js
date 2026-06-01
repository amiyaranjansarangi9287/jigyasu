import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SRC_DIR = path.join(__dirname, 'src');

async function processDirectory(directory) {
  const files = await fs.readdir(directory, { withFileTypes: true });
  for (const file of files) {
    const fullPath = path.join(directory, file.name);
    if (file.isDirectory()) {
      await processDirectory(fullPath);
    } else if (file.isFile() && (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx'))) {
      let content = await fs.readFile(fullPath, 'utf8');
      
      // Replace /images/filename.jpg or .png with .webp
      const regex = /(\/images\/[^'"`\s]+\.)(jpg|png)/g;
      if (regex.test(content)) {
        console.log(`Updating ${fullPath}`);
        content = content.replace(regex, '$1webp');
        await fs.writeFile(fullPath, content, 'utf8');
      }
    }
  }
}

processDirectory(SRC_DIR).then(() => console.log('Done replacement.'));
