import fs from 'fs';
import { LAB_MODULES } from '../apps/hub/src/learnos/worlds/lab/data/labContent';

const json = {
  modules: {}
};

LAB_MODULES.forEach(m => {
  json.modules[m.id] = {
    title: m.title,
    realWorldConnection: m.realWorldConnection
  };
  if (m.toyboxProject) {
    json.modules[m.id].toyboxProject = m.toyboxProject;
  }
});

const output = JSON.stringify(json, null, 2);
fs.writeFileSync('D:/vision_agentic/jigyasu/scratch/lab.json', output);
console.log('Successfully wrote lab.json');
