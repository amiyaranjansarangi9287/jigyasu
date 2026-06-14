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
    { src: '/physics/(.*)', dest: 'https://jigyasu-physics.vercel.app/$1' },
    { src: '/toys/(.*)', dest: 'https://jigyasu-toys.vercel.app/$1' },
    { src: '/bio/(.*)', dest: 'https://jigyasu-bio.vercel.app/$1' },
    { src: '/math/(.*)', dest: 'https://jigyasu-math.vercel.app/$1' },
    { src: '/chem/(.*)', dest: 'https://jigyasu-chem.vercel.app/$1' },
    { src: '/cosmos/(.*)', dest: 'https://jigyasu-cosmos.vercel.app/$1' },
    { src: '/camp/(.*)', dest: 'https://jigyasu-camp.vercel.app/$1' },
    { src: '/api/(.*)', dest: 'https://jigyasu-api.up.railway.app/$1' },
    { handle: 'filesystem' },
    { src: '/(.*)', dest: '/index.html' }
  ]
};

fs.writeFileSync(
  path.join(vercelOutputDir, 'config.json'),
  JSON.stringify(config, null, 2)
);

console.log('Successfully generated .vercel/output at: ' + vercelOutputDir);
