const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, 'dist');

const config = {
  version: 3,
  routes: [
    { source: "/physics/(.*)", destination: "https://jigyasu-physics.vercel.app/$1" },
    { source: "/toys/(.*)", destination: "https://jigyasu-toys.vercel.app/$1" },
    { source: "/bio/(.*)", destination: "https://jigyasu-bio.vercel.app/$1" },
    { source: "/math/(.*)", destination: "https://jigyasu-math.vercel.app/$1" },
    { source: "/chem/(.*)", destination: "https://jigyasu-chem.vercel.app/$1" },
    { source: "/cosmos/(.*)", destination: "https://jigyasu-cosmos.vercel.app/$1" },
    { source: "/camp/(.*)", destination: "https://jigyasu-camp.vercel.app/$1" },
    { source: "/api/(.*)", destination: "https://jigyasu-api.up.railway.app/$1" },
    { headers: { "X-Content-Type-Options": "nosniff", "X-Frame-Options": "DENY" }, src: "/(.*)", continue: true },
    { handle: "filesystem" },
    { src: "/(.*)", dest: "/index.html" }
  ]
};

try {
  const pkgVercelOut = path.join(__dirname, '.vercel', 'output');
  fs.mkdirSync(path.join(pkgVercelOut, 'static'), { recursive: true });
  fs.cpSync(distPath, path.join(pkgVercelOut, 'static'), { recursive: true });
  fs.writeFileSync(path.join(pkgVercelOut, 'config.json'), JSON.stringify(config, null, 2));
  console.log('Created .vercel/output at package root');
} catch (e) {
  console.error('Error creating package root output:', e);
}

try {
  const repoVercelOut = path.join(__dirname, '..', '..', '.vercel', 'output');
  fs.mkdirSync(path.join(repoVercelOut, 'static'), { recursive: true });
  fs.cpSync(distPath, path.join(repoVercelOut, 'static'), { recursive: true });
  fs.writeFileSync(path.join(repoVercelOut, 'config.json'), JSON.stringify(config, null, 2));
  console.log('Created .vercel/output at repo root');
} catch (e) {
  console.error('Error creating repo root output:', e);
}
