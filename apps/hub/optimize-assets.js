import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IMAGES_DIR = path.join(__dirname, 'public/images');

async function optimizeAssets() {
  console.log(`Scanning for images in ${IMAGES_DIR}...`);
  
  try {
    const files = await fs.readdir(IMAGES_DIR);
    
    let totalSaved = 0;
    
    for (const file of files) {
      if (file.endsWith('.jpg') || file.endsWith('.png')) {
        const inputPath = path.join(IMAGES_DIR, file);
        const outputPath = path.join(IMAGES_DIR, file.replace(/\.(jpg|png)$/, '.webp'));
        
        // Skip if webp already exists
        try {
          await fs.access(outputPath);
          console.log(`Skipping ${file}, .webp already exists.`);
          continue;
        } catch {
          // File does not exist, proceed
        }

        const inputStats = await fs.stat(inputPath);
        const originalSize = inputStats.size;

        console.log(`Optimizing ${file}... (${(originalSize / 1024).toFixed(2)} KB)`);
        
        await sharp(inputPath)
          .webp({ quality: 80, effort: 6 })
          .toFile(outputPath);
          
        const outputStats = await fs.stat(outputPath);
        const newSize = outputStats.size;
        
        const saved = originalSize - newSize;
        totalSaved += saved;
        
        console.log(`  -> Saved ${(saved / 1024).toFixed(2)} KB (${Math.round((saved / originalSize) * 100)}% reduction)`);
        
        // Delete original file to save space
        await fs.unlink(inputPath);
      }
    }
    
    console.log(`\nOptimization Complete! Total bandwidth saved per load: ${(totalSaved / 1024 / 1024).toFixed(2)} MB`);
  } catch (err) {
    console.error('Error optimizing assets:', err);
  }
}

optimizeAssets();
