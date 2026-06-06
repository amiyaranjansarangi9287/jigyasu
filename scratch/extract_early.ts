import fs from 'fs';
import { 
  EARLY_MODULES, STORY_CHARACTERS, STORY_PLACES, STORY_PROBLEMS, 
  ALPHABET_CONTENT, RECIPES, WORD_SENTENCES 
} from '../apps/hub/src/learnos/worlds/early/data/earlyContent';

const json = {
  modules: {},
  story: {
    characters: {},
    places: {},
    problems: {}
  },
  recipes: {},
  alphabet: {},
  sentences: {}
};

EARLY_MODULES.forEach(m => {
  // Wait, early modules actually have titleKey already! But we can keep them in early.json.
  // Actually, titleKey is already a translation key. So skip modules.
});

STORY_CHARACTERS.forEach(c => {
  json.story.characters[c.id] = c.name;
});
STORY_PLACES.forEach(p => {
  json.story.places[p.id] = p.name;
});
STORY_PROBLEMS.forEach(p => {
  json.story.problems[p.id] = p.name;
});

RECIPES.forEach(r => {
  json.recipes[r.id] = {
    name: r.name,
    ingredients: {}
  };
  r.ingredients.forEach((ing, i) => {
    json.recipes[r.id].ingredients[i] = {
      name: ing.name,
      unit: ing.unit
    };
  });
});

ALPHABET_CONTENT.forEach(a => {
  json.alphabet[a.letter] = {
    phonemeSound: a.phonemeSound,
    items: {}
  };
  a.items.forEach((item, i) => {
    json.alphabet[a.letter].items[i] = item.word;
  });
});

WORD_SENTENCES.forEach(s => {
  json.sentences[s.id] = {
    words: {}
  };
  s.words.forEach((w, i) => {
    json.sentences[s.id].words[i] = w;
  });
});

const output = JSON.stringify(json, null, 2);
fs.writeFileSync('D:/vision_agentic/jigyasu/scratch/early.json', output);
console.log('Successfully wrote early.json');
