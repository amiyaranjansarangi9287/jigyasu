const fs = require('fs');
const content = require('./academyContent.js');

const json = {
  modules: {},
  beautyMoments: content.BEAUTY_MOMENTS,
  electrolysisSetups: {},
  environments: {},
  essayPrompts: {},
  indicators: {},
  policyDecisions: {},
  trigIdentities: {},
  feedbackLoops: {}
};

// ACADEMY_MODULES
content.ACADEMY_MODULES.forEach(m => {
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
content.ELECTROLYSIS_SETUPS.forEach(s => {
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
content.ENVIRONMENTS.forEach(e => {
  json.environments[e.id] = {
    name: e.name,
    indian: e.indian
  };
});

// ESSAY_PROMPTS
content.ESSAY_PROMPTS.forEach(p => {
  json.essayPrompts[p.id] = {
    title: p.title,
    prompt: p.prompt,
    examinerTip: p.examinerTip
  };
});

// INDICATORS
content.INDICATORS.forEach(i => {
  json.indicators[i.id] = {
    name: i.name
  };
});

// POLICY_DECISIONS
content.POLICY_DECISIONS.forEach(p => {
  json.policyDecisions[p.id] = {
    name: p.name,
    note: p.note
  };
});

// TRIG_IDENTITIES
content.TRIG_IDENTITIES.forEach(t => {
  json.trigIdentities[t.id] = {
    name: t.name,
    statement: t.statement,
    proof: t.proof
  };
});

// FEEDBACK_LOOPS
content.FEEDBACK_LOOPS.forEach(f => {
  json.feedbackLoops[f.id] = {
    name: f.name,
    india: f.india
  };
});

fs.writeFileSync('D:/vision_agentic/jigyasu/apps/hub/src/learnos/i18n/locales/en/academy.json', JSON.stringify(json, null, 2));
