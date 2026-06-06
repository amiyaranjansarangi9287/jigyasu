const fs = require('fs');
const path = require('path');

const DOMAIN_MAP = {
  bio: [
    'BloodCirculation', 'CellStructure', 'DigestiveSystem', 'DnaReplication', 
    'Evolution', 'FoodChain', 'Habitats', 'Photosynthesis', 'PlantGrowth', 
    'Respiration', 'Senses'
  ],
  chem: [
    'AcidsBases', 'Atoms', 'ChemistryReactions', 'PeriodicTable', 'StatesOfMatter'
  ],
  math: [
    'Fractions', 'Multiplication', 'NumberLine', 'Pi', 'Pythagorean', 'Shapes'
  ],
  cosmos: [
    'DayNight', 'MoonPhases', 'SolarSystem', 'GravitySpacetime'
  ],
  physics: [
    'Electricity', 'FloatSink', 'KineticEnergy', 'LightShadows', 'LightWaves', 
    'Magnets', 'NewtonsLaws', 'Optics', 'SimpleMachines', 'SoundWaves', 
    'WaterCycle', 'PlateTectonics'
  ]
};

const APPS_DIR = path.join(__dirname, 'apps');
const APPS = ['bio', 'chem', 'math', 'cosmos', 'physics'];
const ALL_CONCEPTS = Object.values(DOMAIN_MAP).flat();

// For each app, we keep its mapped concepts and DELETE the rest.
for (const app of APPS) {
  const conceptsDir = path.join(APPS_DIR, app, 'src', 'pages', 'concepts');
  if (!fs.existsSync(conceptsDir)) continue;

  const allowedConcepts = DOMAIN_MAP[app];
  const files = fs.readdirSync(conceptsDir);

  for (const file of files) {
    if (!file.endsWith('.tsx')) continue;
    const conceptName = file.replace('.tsx', '');
    
    // If it's one of the known 39 concepts, but NOT in this app's allowed list, delete it!
    if (ALL_CONCEPTS.includes(conceptName) && !allowedConcepts.includes(conceptName)) {
      const filePath = path.join(conceptsDir, file);
      fs.unlinkSync(filePath);
      console.log(`Deleted ${file} from apps/${app}`);
    }
  }
}

// Now move canvases from physics to the correct apps.
const physicsCanvasesDir = path.join(APPS_DIR, 'physics', 'src', 'components', 'canvases');

for (const app of APPS) {
  if (app === 'physics') continue; // canvases are already in physics
  
  const targetCanvasesDir = path.join(APPS_DIR, app, 'src', 'components', 'canvases');
  if (!fs.existsSync(targetCanvasesDir)) {
    fs.mkdirSync(targetCanvasesDir, { recursive: true });
  }

  const allowedConcepts = DOMAIN_MAP[app];
  for (const conceptName of allowedConcepts) {
    const canvasName = `${conceptName}Canvas.tsx`;
    const sourcePath = path.join(physicsCanvasesDir, canvasName);
    const targetPath = path.join(targetCanvasesDir, canvasName);

    if (fs.existsSync(sourcePath)) {
      fs.renameSync(sourcePath, targetPath);
      console.log(`Moved ${canvasName} to apps/${app}`);
    }
  }
}

console.log('Restructuring complete!');
