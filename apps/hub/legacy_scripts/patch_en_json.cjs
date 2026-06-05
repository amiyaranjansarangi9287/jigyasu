const fs = require('fs');
const path = require('path');

// Load compiled JS
const { campWeeks } = require('./src/kidscamp/data/campWeeks.cjs');
const { pillars } = require('./src/kidscamp/data/categories.cjs');

const enFilePath = path.join(__dirname, 'src/learnos/i18n/locales/en.json');
const enFile = JSON.parse(fs.readFileSync(enFilePath, 'utf8'));

// Update kidscamp
if (!enFile.kidscamp) enFile.kidscamp = {};
if (!enFile.kidscamp.campWeeks) enFile.kidscamp.campWeeks = {};

// 1. Process campWeeks
campWeeks.forEach(week => {
  if (!enFile.kidscamp.campWeeks[week.id]) {
    enFile.kidscamp.campWeeks[week.id] = {};
  }
  
  const w = enFile.kidscamp.campWeeks[week.id];
  w.name = week.name;
  w.theme = week.theme;
  w.description = week.description;
  
  if (!w.materials) w.materials = {};
  week.materials.forEach((m, idx) => {
    w.materials[`mat_${idx}`] = m;
  });

  week.days.forEach(day => {
    if (!w[`day${day.day}`]) w[`day${day.day}`] = {};
    w[`day${day.day}`].title = day.title;
    w[`day${day.day}`].description = day.description;
  });
});

// 2. Process pillars (at root level as it seems that's where they are searched)
// We add them to root
pillars.forEach(pillar => {
  enFile[`pillar_${pillar.id}`] = pillar.name;
  enFile[`pillar_${pillar.id}_desc`] = pillar.description;
});

// Save
fs.writeFileSync(enFilePath, JSON.stringify(enFile, null, 2));
console.log('en.json patched successfully.');
