const fs = require('fs');
const files = ['HabitatsCanvas.tsx', 'KineticEnergyCanvas.tsx', 'SensesCanvas.tsx', 'SimpleMachinesCanvas.tsx'];
files.forEach(f => {
  let file = 'D:/vision_agentic/jigyasu/apps/learn/src/components/canvases/' + f;
  let text = fs.readFileSync(file, 'utf8');
  let newName = f.replace('.tsx', 'Props');
  text = text.replace(new RegExp(': ' + f.replace('.tsx', '') + '\\.tsx\\)'), ': ' + newName + ')');
  fs.writeFileSync(file, text);
});
