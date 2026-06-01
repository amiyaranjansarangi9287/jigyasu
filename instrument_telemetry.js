const fs = require('fs');

function injectCamp() {
  const file = 'D:/vision_agentic/jigyasu/apps/camp/src/App.tsx';
  let content = fs.readFileSync(file, 'utf8');

  // Add import
  if (!content.includes('trackEvent')) {
    content = content.replace("import { Activity, activities } from './data/activities';", "import { Activity, activities } from './data/activities';\nimport { trackEvent } from '@jigyasu/storage';");
  }

  // Add page_view
  if (!content.includes("trackEvent('page_view'")) {
    content = content.replace("export default function App() {", "export default function App() {\n  useEffect(() => {\n    trackEvent('page_view', { app: 'camp', page: 'home' });\n  }, []);\n");
  }

  // Add activity_start
  if (!content.includes("trackEvent('activity_start'")) {
    content = content.replace("setActiveActivity(activity);", "setActiveActivity(activity);\n    trackEvent('activity_start', { app: 'camp', activityId: activity.id, pillar: activity.pillar });");
  }

  // Add activity_complete
  if (!content.includes("trackEvent('activity_complete'")) {
    content = content.replace("const handleActivityComplete = useCallback(() => {", "const handleActivityComplete = useCallback(() => {\n    if (activeActivity) {\n      trackEvent('activity_complete', { app: 'camp', activityId: activeActivity.id, pillar: activeActivity.pillar });\n    }");
  }

  fs.writeFileSync(file, content, 'utf8');
}

function injectToys() {
  const file = 'D:/vision_agentic/jigyasu/apps/toys/src/App.tsx';
  let content = fs.readFileSync(file, 'utf8');

  // Add import
  if (!content.includes('trackEvent')) {
    content = content.replace("import type { Toy } from './data/toys';", "import type { Toy } from './data/toys';\nimport { trackEvent } from '@jigyasu/storage';");
  }

  // Add page_view
  if (!content.includes("trackEvent('page_view'")) {
    content = content.replace("export default function App() {", "export default function App() {\n  useEffect(() => {\n    trackEvent('page_view', { app: 'toys', page: 'home' });\n  }, []);\n");
  }

  // Add build_start
  if (!content.includes("trackEvent('build_start'")) {
    content = content.replace("setBuildingToy(toy);", "setBuildingToy(toy);\n    trackEvent('build_start', { app: 'toys', toyId: toy.id });");
  }

  fs.writeFileSync(file, content, 'utf8');
}

function injectLearn() {
    const file = 'D:/vision_agentic/jigyasu/apps/learn/src/pages/Home.tsx';
    if(fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        if (!content.includes('trackEvent')) {
            content = content.replace("import { Layout }", "import { trackEvent } from '@jigyasu/storage';\nimport { Layout }");
        }
        if (!content.includes("trackEvent('page_view'")) {
            content = content.replace("export default function Home() {", "export default function Home() {\n  React.useEffect(() => {\n    trackEvent('page_view', { app: 'learn', page: 'home' });\n  }, []);\n");
        }
        fs.writeFileSync(file, content, 'utf8');
    }
}

injectCamp();
injectToys();
injectLearn();
console.log("Telemetry injected");
