const fs = require('fs');
const lines = fs.readFileSync('src/kidscamp/data/activities.hi.ts', 'utf8').split('\n');
lines.forEach((l, i) => {
  if (l.match(/[^\\]'[a-z]/i) && l.includes("description: '")) {
    console.log(`Line ${i+1}: ${l.trim()}`);
  }
});
