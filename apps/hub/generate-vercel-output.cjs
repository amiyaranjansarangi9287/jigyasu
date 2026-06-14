const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '../../');
const vercelOutputDir = path.join(projectRoot, '.vercel/output');
const staticDir = path.join(vercelOutputDir, 'static');

fs.rmSync(vercelOutputDir, { recursive: true, force: true });
fs.mkdirSync(staticDir, { recursive: true });

const distDir = path.join(__dirname, 'dist');
if (fs.existsSync(distDir)) {
  fs.cpSync(distDir, staticDir, { recursive: true });
}

const config = {
  version: 3,
  routes: [
    { handle: 'filesystem' },
    { src: '/(.*)', dest: '/index.html' }
  ]
};

fs.writeFileSync(
  path.join(vercelOutputDir, 'config.json'),
  JSON.stringify(config, null, 2)
);

console.log('Successfully generated .vercel/output at: ' + vercelOutputDir);
