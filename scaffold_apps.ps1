$apps = @('learn', 'camp')

foreach ($app in $apps) {
    $dir = "D:\vision_agentic\jigyasu\apps\$app"
    New-Item -Path $dir -ItemType Directory -Force | Out-Null
    New-Item -Path "$dir\src" -ItemType Directory -Force | Out-Null

    $port = if ($app -eq 'learn') { 3001 } else { 3002 }
    $title = if ($app -eq 'learn') { "Jigyasu Learn" } else { "Jigyasu Camp" }

    # package.json
    @"
{
  "name": "@jigyasu/$app",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --port $port",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^7.1.5",
    "@jigyasu/ui": "workspace:*",
    "@jigyasu/utils": "workspace:*",
    "@jigyasu/storage": "workspace:*"
  },
  "devDependencies": {
    "@types/react": "^19.0.8",
    "@types/react-dom": "^19.0.3",
    "@vitejs/plugin-react": "^4.3.4",
    "typescript": "~5.7.2",
    "vite": "^6.1.0",
    "@tailwindcss/vite": "^4.0.6",
    "tailwindcss": "^4.0.6"
  }
}
"@ | Out-File -FilePath "$dir\package.json" -Encoding utf8

    # vite.config.ts
    @"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
"@ | Out-File -FilePath "$dir\vite.config.ts" -Encoding utf8

    # index.html
    @"
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>$title</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
"@ | Out-File -FilePath "$dir\index.html" -Encoding utf8

    # src/index.css
    @"
@import "tailwindcss";

@theme {
  --color-primary: #8b5cf6;
}
"@ | Out-File -FilePath "$dir\src\index.css" -Encoding utf8

    # src/main.tsx
    @"
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
"@ | Out-File -FilePath "$dir\src\main.tsx" -Encoding utf8

    # src/App.tsx
    if ($app -eq 'learn') {
        $appContent = @"
import { Layout, ConceptCard } from '@jigyasu/ui';

function App() {
  return (
    <Layout 
      headerContent={<h1 className="text-2xl font-bold text-white">$title</h1>}
      footerContent={<p>© 2026 Jigyasu. All rights reserved.</p>}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ConceptCard 
          title="Photosynthesis" 
          emoji="🌿" 
          category="Biology" 
          description="Learn how plants make their own food using sunlight." 
          onClick={() => console.log('Navigate to Photosynthesis')}
        />
      </div>
    </Layout>
  )
}

export default App
"@
    } else {
        $appContent = @"
import { Layout, ConceptCard } from '@jigyasu/ui';

function App() {
  return (
    <Layout 
      headerContent={<h1 className="text-2xl font-bold text-white">$title</h1>}
      footerContent={<p>© 2026 Jigyasu. All rights reserved.</p>}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ConceptCard 
          title="Camp Sandbox" 
          emoji="🏕️" 
          category="Play" 
          description="Build, execute, and experiment freely." 
          onClick={() => console.log('Navigate to Sandbox')}
        />
      </div>
    </Layout>
  )
}

export default App
"@
    }
    $appContent | Out-File -FilePath "$dir\src\App.tsx" -Encoding utf8

    # tsconfig.json
    @"
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
"@ | Out-File -FilePath "$dir\tsconfig.json" -Encoding utf8

    # tsconfig.node.json
    @"
{
  "compilerOptions": {
    "composite": true,
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
"@ | Out-File -FilePath "$dir\tsconfig.node.json" -Encoding utf8

}
