import fs from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';

ffmpeg.setFfmpegPath(ffmpegStatic);

const inputDir = path.join(process.cwd(), 'test-results');
const outputDir = path.join(process.cwd(), 'showcase');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Find all webm files
const findWebmFiles = (dir, fileList = []) => {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      findWebmFiles(filePath, fileList);
    } else if (filePath.endsWith('.webm')) {
      fileList.push(filePath);
    }
  }
  return fileList;
};

const webmFiles = findWebmFiles(inputDir);

if (webmFiles.length === 0) {
  console.log('No .webm videos found in test-results. Did you run Playwright with video: "on"?');
  process.exit(0);
}

console.log(`Found ${webmFiles.length} videos to convert to WebP...`);

let convertedCount = 0;

webmFiles.forEach((inputFile, index) => {
  // Try to use a descriptive name based on the parent folder, otherwise generic
  const parentFolder = path.basename(path.dirname(inputFile));
  let name = `showcase_${index + 1}`;
  if (parentFolder.includes('Solar-System')) name = 'solar_system_showcase';
  else if (parentFolder.includes('Atoms')) name = 'atoms_showcase';
  
  const outputFile = path.join(outputDir, `${name}.webp`);

  console.log(`Converting ${path.basename(inputFile)} -> ${name}.webp`);

  ffmpeg(inputFile)
    // Scale down to 800px width, maintaining aspect ratio. 15fps to keep filesize low.
    .outputOptions([
      '-vcodec libwebp',
      '-lossless 0',
      '-qscale 50', // Quality (0-100)
      '-preset picture',
      '-an', // Remove audio
      '-vsync 0',
      '-vf scale=800:-1,fps=15',
      '-loop 0' // Infinite loop
    ])
    .save(outputFile)
    .on('end', () => {
      console.log(`✅ Finished converting ${name}.webp`);
      convertedCount++;
      if (convertedCount === webmFiles.length) {
        console.log('All conversions complete!');
      }
    })
    .on('error', (err) => {
      console.error(`❌ Error converting ${name}:`, err);
    });
});
