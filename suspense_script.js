const fs = require('fs');
const apps = ['learn', 'math', 'bio', 'chem', 'cosmos'];

apps.forEach(app => {
  const appTsxPath = 'apps/' + app + '/src/App.tsx';
  if (fs.existsSync(appTsxPath)) {
    let content = fs.readFileSync(appTsxPath, 'utf8');
    let changed = false;

    if (!content.includes('import React')) {
       content = "import React, { Suspense } from 'react';\n" + content;
       changed = true;
    } else if (!content.includes('Suspense')) {
       content = content.replace(/import\s+React.*?from\s+['"]react['"]/, "import React, { Suspense } from 'react'");
       changed = true;
    }

    if (!content.includes('<Suspense')) {
      content = content.replace('<Routes>', '<Suspense fallback={<div className="flex h-screen w-full items-center justify-center text-2xl font-bold text-gray-500">Loading Module...</div>}>\n        <Routes>');
      content = content.replace('</Routes>', '</Routes>\n      </Suspense>');
      changed = true;
    }

    if (changed) {
      fs.writeFileSync(appTsxPath, content);
    }
  }
});
console.log('Suspense boundaries added to all App.tsx files!');
