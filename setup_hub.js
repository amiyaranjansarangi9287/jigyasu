const fs = require('fs');

// Copy tsconfigs
fs.copyFileSync('apps/learn/tsconfig.json', 'apps/hub/tsconfig.json');
fs.copyFileSync('apps/learn/tsconfig.node.json', 'apps/hub/tsconfig.node.json');

// Modify package.json
const pkgPath = 'apps/hub/package.json';
const learnPkg = JSON.parse(fs.readFileSync('apps/learn/package.json', 'utf8'));
const hubPkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

hubPkg.name = '@jigyasu/hub';
hubPkg.dependencies = {
  ...hubPkg.dependencies,
  ...learnPkg.dependencies,
  'react-router-dom': '^6.22.1'
};
hubPkg.devDependencies = {
  ...hubPkg.devDependencies,
  ...learnPkg.devDependencies
};
hubPkg.scripts.dev = 'vite --port 3000';

fs.writeFileSync(pkgPath, JSON.stringify(hubPkg, null, 2));

// Create vite.config.ts for hub with proxy
const viteConfig = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: { globPatterns: ['**/*.{js,css,html,ico,png,svg,mp3,woff2}'], maximumFileSizeToCacheInBytes: 5000000 },
      manifest: {
        name: 'Jigyasu Hub',
        short_name: 'Jigyasu',
        description: 'Interactive STEM Learning',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  server: {
    proxy: {
      '/learn': { target: 'http://localhost:3001', changeOrigin: true },
      '/toys': { target: 'http://localhost:3002', changeOrigin: true },
      '/bio': { target: 'http://localhost:3003', changeOrigin: true },
      '/math': { target: 'http://localhost:3004', changeOrigin: true },
      '/chem': { target: 'http://localhost:3005', changeOrigin: true },
      '/cosmos': { target: 'http://localhost:3006', changeOrigin: true },
    }
  }
})
`;
fs.writeFileSync('apps/hub/vite.config.ts', viteConfig);
console.log('Setup hub completed.');
