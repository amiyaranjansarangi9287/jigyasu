const fs = require('fs');
const path = require('path');
const dir = 'D:/vision_agentic/jigyasu/apps/learn/src/components/canvases';
fs.readdirSync(dir).forEach(f => {
  if (f.endsWith('.tsx')) {
    let file = path.join(dir, f);
    let text = fs.readFileSync(file, 'utf8');
    let replaced = text.replace(/: ([a-zA-Z]+Canvas)\.tsx\)/g, ': $1Props)');
    if (replaced !== text) {
      fs.writeFileSync(file, replaced);
    }
  }
});
