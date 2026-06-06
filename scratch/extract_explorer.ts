import fs from 'fs';
import { EXPLORER_CONCEPTS } from '../apps/hub/src/learnos/worlds/explorer/data/explorerContent';

const json = {
  concepts: {}
};

EXPLORER_CONCEPTS.forEach(c => {
  json.concepts[c.id] = {
    title: c.title,
    hook: c.hook,
    everydayConnection: c.everydayConnection,
    lumoOpener: c.lumoOpener,
    thinkingPrompt: c.thinkingPrompt,
    indianContext: c.indianContext
  };
});

const output = JSON.stringify(json, null, 2);
fs.writeFileSync('D:/vision_agentic/jigyasu/scratch/explorer.json', output);
console.log('Successfully wrote explorer.json');
