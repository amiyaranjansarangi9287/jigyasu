import fs from 'fs';
import { 
  DISCOVERY_MODULES, UNSOLVED_QUESTIONS, GO_DEEPER_CONTENT, 
  DISCOVERY_CROSS_BRIDGES, CHEMICAL_REACTIONS, 
  GEOMETRY_THEOREMS, GENETIC_TRAITS, ALGEBRA_CHALLENGES 
} from '../apps/hub/src/learnos/worlds/discovery/data/discoveryContent';

const json = {
  modules: {},
  unsolvedQuestions: {},
  goDeeper: {},
  crossBridges: {},
  chemicalReactions: {},
  geometryTheorems: {},
  geneticTraits: {},
  algebraChallenges: {}
};

DISCOVERY_MODULES.forEach(m => {
  json.modules[m.id] = {
    title: m.title,
    hook: m.hook,
    realWorldConnection: m.realWorldConnection,
    unsolvedQuestion: m.unsolvedQuestion
  };
});

UNSOLVED_QUESTIONS.forEach(q => {
  json.unsolvedQuestions[q.moduleId] = {
    question: q.question,
    context: q.context,
    fieldName: q.fieldName
  };
});

GO_DEEPER_CONTENT.forEach(gd => {
  json.goDeeper[gd.moduleId] = gd.connections.map(c => ({
    title: c.title,
    description: c.description,
    type: c.type
  }));
});

DISCOVERY_CROSS_BRIDGES.forEach(cb => {
  json.crossBridges[cb.id] = {
    title: cb.title,
    description: cb.description,
    insight: cb.insight
  };
});

CHEMICAL_REACTIONS.forEach(cr => {
  json.chemicalReactions[cr.id] = {
    name: cr.name,
    everydayContext: cr.everydayContext
  };
});

GEOMETRY_THEOREMS.forEach(gt => {
  json.geometryTheorems[gt.id] = {
    name: gt.name,
    application: gt.application
  };
});

GENETIC_TRAITS.forEach(gt => {
  json.geneticTraits[gt.id] = {
    name: gt.name,
    dominantPhenotype: gt.dominantPhenotype,
    recessivePhenotype: gt.recessivePhenotype,
    exampleContext: gt.exampleContext
  };
});

ALGEBRA_CHALLENGES.forEach(ac => {
  json.algebraChallenges[ac.id] = {
    hint: ac.hint
  };
});

const output = JSON.stringify(json, null, 2);
fs.writeFileSync('D:/vision_agentic/jigyasu/scratch/discovery.json', output);
console.log('Successfully wrote discovery.json');
