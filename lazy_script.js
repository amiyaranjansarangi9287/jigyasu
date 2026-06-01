const fs = require('fs');
const path = require('path');

function processImports(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (let file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processImports(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      let changed = false;
      const lines = content.split('\n');
      const newLines = [];
      let hasLazy = false;
      let addedSuspense = false;
      
      for (let line of lines) {
        // If it's a bulk import that looks like `import Component from './components/Component'` 
        // or `import Component from '../canvases/Component'`
        if (line.startsWith('import ') && line.includes('from ') && (line.includes('./components/') || line.includes('../canvases/')) && !line.includes('{')) {
          const match = line.match(/import\s+(\w+)\s+from\s+['"]([^'"]+)['"]/);
          if (match) {
            const compName = match[1];
            const importPath = match[2];
            newLines.push(`const ${compName} = lazy(() => import('${importPath}'));`);
            hasLazy = true;
            changed = true;
            continue;
          }
        }
        
        // Also check imports of `import { Component } from './components'`
        if (line.startsWith('import {') && line.includes('from ') && (line.includes('./components/') || line.includes('../canvases/'))) {
          // This is harder to lazy load properly if they are named exports.
          // Let's just track them. We might need a generic solution.
        }

        newLines.push(line);
      }
      
      if (changed) {
        // Add React.lazy import if missing
        if (!content.includes('lazy(')) {
          // find react import
          const reactImportIdx = newLines.findIndex(l => l.includes("from 'react'"));
          if (reactImportIdx !== -1) {
             if (!newLines[reactImportIdx].includes('lazy')) {
                newLines[reactImportIdx] = newLines[reactImportIdx].replace(/import React/, 'import React, { lazy, Suspense }');
                if (!newLines[reactImportIdx].includes('{')) {
                  newLines[reactImportIdx] = newLines[reactImportIdx].replace(/import\s+([^{]+)\s+from/, 'import $1, { lazy, Suspense } from');
                } else if (!newLines[reactImportIdx].includes('lazy')) {
                  newLines[reactImportIdx] = newLines[reactImportIdx].replace('{', '{ lazy, Suspense, ');
                }
             }
          } else {
             newLines.unshift("import React, { lazy, Suspense } from 'react';");
          }
        }
        
        // Wrap rendering in Suspense? It's complex to automate wrapping the JSX return in <Suspense>.
        // Instead of automatically rewriting all JSX to include Suspense, I'll log which files need Suspense wrapping.
        console.log(`Refactored imports in ${fullPath} to use React.lazy. MAKE SURE TO ADD <Suspense fallback={<div>Loading...</div>}> in JSX!`);
        fs.writeFileSync(fullPath, newLines.join('\n'));
      }
    }
  }
}

['math', 'bio', 'chem', 'cosmos', 'learn'].forEach(app => processImports('apps/' + app + '/src'));
