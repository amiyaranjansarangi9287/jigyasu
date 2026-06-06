const fs = require('fs');
const path = require('path');

const DOMAIN_MAP = {
  bio: [
    { name: 'BloodCirculation', path: 'blood-circulation' },
    { name: 'CellStructure', path: 'cell-structure' },
    { name: 'DigestiveSystem', path: 'digestive-system' },
    { name: 'DnaReplication', path: 'dna-replication' },
    { name: 'Evolution', path: 'evolution' },
    { name: 'FoodChain', path: 'food-chain' },
    { name: 'Habitats', path: 'habitats' },
    { name: 'Photosynthesis', path: 'photosynthesis' },
    { name: 'PlantGrowth', path: 'plant-growth' },
    { name: 'Respiration', path: 'respiration' },
    { name: 'Senses', path: 'senses' }
  ],
  chem: [
    { name: 'AcidsBases', path: 'acids-bases' },
    { name: 'Atoms', path: 'atoms' },
    { name: 'ChemistryReactions', path: 'chemistry-reactions' },
    { name: 'PeriodicTable', path: 'periodic-table' },
    { name: 'StatesOfMatter', path: 'states-of-matter' }
  ],
  math: [
    { name: 'Fractions', path: 'fractions' },
    { name: 'Multiplication', path: 'multiplication' },
    { name: 'NumberLine', path: 'number-line' },
    { name: 'Pi', path: 'pi' },
    { name: 'Pythagorean', path: 'pythagorean' },
    { name: 'Shapes', path: 'shapes' }
  ],
  cosmos: [
    { name: 'DayNight', path: 'day-night' },
    { name: 'MoonPhases', path: 'moon-phases' },
    { name: 'SolarSystem', path: 'solar-system' },
    { name: 'GravitySpacetime', path: 'gravity-spacetime' }
  ],
  physics: [
    { name: 'Electricity', path: 'electricity' },
    { name: 'FloatSink', path: 'float-sink' },
    { name: 'KineticEnergy', path: 'kinetic-energy' },
    { name: 'LightShadows', path: 'light-shadows' },
    { name: 'LightWaves', path: 'waves-light' },
    { name: 'Magnets', path: 'magnets' },
    { name: 'NewtonsLaws', path: 'newtons-laws' },
    { name: 'Optics', path: 'optics' },
    { name: 'SimpleMachines', path: 'simple-machines' },
    { name: 'SoundWaves', path: 'sound-waves' },
    { name: 'WaterCycle', path: 'water-cycle' },
    { name: 'PlateTectonics', path: 'plate-tectonics' }
  ]
};

const APPS_DIR = path.join(__dirname, 'apps');
const APPS = Object.keys(DOMAIN_MAP);

for (const app of APPS) {
  const appTsxPath = path.join(APPS_DIR, app, 'src', 'App.tsx');
  if (!fs.existsSync(appTsxPath)) continue;

  const concepts = DOMAIN_MAP[app];
  
  let importsStr = '';
  let routesStr = '';

  for (const concept of concepts) {
    importsStr += `import ${concept.name} from './pages/concepts/${concept.name}';\n`;
    routesStr += `          <Route path="/concepts/${concept.path}" element={<${concept.name} />} />\n`;
  }

  const appContent = `import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from '@jigyasu/ui';
import Home from './pages/Home';

${importsStr}

export default function App() {
  return (
    <Router>
      <Layout>
        <Suspense fallback={<div className="flex h-screen w-full items-center justify-center text-2xl font-bold text-gray-500">Loading Module...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
${routesStr}
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
}
`;

  fs.writeFileSync(appTsxPath, appContent);
  console.log(`Updated App.tsx for ${app}`);
}
