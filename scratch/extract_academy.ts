import fs from 'fs';
import { 
  ACADEMY_MODULES, BEAUTY_MOMENTS, ELECTROLYSIS_SETUPS, ENVIRONMENTS, ESSAY_PROMPTS, 
  INDICATORS, POLICY_DECISIONS, TRIG_IDENTITIES, FEEDBACK_LOOPS 
} from '../apps/hub/src/learnos/worlds/academy/data/academyContent';

const json = {
  modules: {},
  beautyMoments: BEAUTY_MOMENTS,
  electrolysisSetups: {},
  environments: {},
  essayPrompts: {},
  indicators: {},
  policyDecisions: {},
  trigIdentities: {},
  feedbackLoops: {}
};

// ACADEMY_MODULES
ACADEMY_MODULES.forEach(m => {
  json.modules[m.id] = {
    title: m.title,
    hook: m.hook,
    beauty: m.beauty,
    realFuture: m.realFuture,
    examRelevance: m.examRelevance,
    examQuestions: m.examQuestions.map(q => ({
      question: q.question,
      options: q.options,
      markscheme: q.markscheme,
      topic: q.topic
    }))
  };
});

// ELECTROLYSIS_SETUPS
ELECTROLYSIS_SETUPS.forEach(s => {
  json.electrolysisSetups[s.id] = {
    name: s.name,
    electrolyte: s.electrolyte,
    cathodeProduct: s.cathodeProduct,
    anodeProduct: s.anodeProduct,
    industrialUse: s.industrialUse,
    indianContext: s.indianContext
  };
});

// ENVIRONMENTS
ENVIRONMENTS.forEach(e => {
  json.environments[e.id] = {
    name: e.name,
    indian: e.indian
  };
});

// ESSAY_PROMPTS
ESSAY_PROMPTS.forEach(p => {
  json.essayPrompts[p.id] = {
    title: p.title,
    prompt: p.prompt,
    examinerTip: p.examinerTip
  };
});

// INDICATORS
INDICATORS.forEach(i => {
  json.indicators[i.id] = {
    name: i.name
  };
});

// POLICY_DECISIONS
POLICY_DECISIONS.forEach(p => {
  json.policyDecisions[p.id] = {
    name: p.name,
    note: p.note
  };
});

// TRIG_IDENTITIES
TRIG_IDENTITIES.forEach(t => {
  json.trigIdentities[t.id] = {
    name: t.name,
    statement: t.statement,
    proof: t.proof
  };
});

// FEEDBACK_LOOPS
FEEDBACK_LOOPS.forEach(f => {
  json.feedbackLoops[f.id] = {
    name: f.name,
    india: f.india
  };
});

const output = JSON.stringify(json, null, 2);
fs.writeFileSync('D:/vision_agentic/jigyasu/scratch/academy.json', output);
console.log('Successfully wrote academy.json');
