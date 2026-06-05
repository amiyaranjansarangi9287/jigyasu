const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const apps = [
  { name: 'physics', path: 'apps/physics', base: '/physics/' },
  { name: 'math', path: 'apps/math', base: '/math/' },
  { name: 'bio', path: 'apps/bio', base: '/bio/' },
  { name: 'chem', path: 'apps/chem', base: '/chem/' },
  { name: 'cosmos', path: 'apps/cosmos', base: '/cosmos/' },
  { name: 'toys', path: 'apps/toys', base: '/toys/' }
];
const hubDist = path.join(__dirname, 'dist');

console.log('Building Jigyasu Hub...');
execSync('pnpm build', { stdio: 'inherit' });

apps.forEach(app => {
  console.log(`Building ${app.name}...`);
  // We need to set the base path so assets load correctly in subfolders
  execSync(`pnpm --filter @jigyasu/${app} build --base=/${app}/`, { stdio: 'inherit' });
  
  const sourceDist = path.join(__dirname, '..', app, 'dist');
  const targetDist = path.join(hubDist, app);
  
  if (fs.existsSync(sourceDist)) {
    console.log(`Copying ${app} to hub/dist/${app}...`);
    // Simple recursive copy (sync)
    fs.cpSync(sourceDist, targetDist, { recursive: true });
  }
});

console.log('Monolithic build complete! Ready for Capacitor sync.');
