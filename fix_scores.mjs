// fix_scores.mjs
import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('D:/vision_agentic/jigyasu/apps/hub/src/learnos/worlds');

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  if (content.includes('const [score, setScore] = useState')) {
    content = content.replace(/const \[score, setScore\] = useState\((.*?)\);/g, "const [mastery, setMastery] = useState($1);");
    content = content.replace(/setScore\(([^)]*)\)/g, (match, p1) => {
      if (p1 === '0') return 'setMastery(0)';
      if (p1.includes('=>')) {
        // e.g. setScore(s => s + 10)
        return `setMastery(m => m + 1)`;
      }
      return `setMastery(${p1})`;
    });
    
    // Replace {score} usages with {mastery}
    content = content.replace(/\{score\}/g, '{mastery}');
    content = content.replace(/\{formatNumber\(score\)\}/g, '{formatNumber(mastery)}');
    content = content.replace(/score >/g, 'mastery >');
    content = content.replace(/score =/g, 'mastery =');
    content = content.replace(/Score:/gi, 'Mastery:');
    
    changed = true;
  }

  // Replace "Failed" / "Wrong" texts
  if (content.includes('❌')) {
    content = content.replace(/❌/g, '🤔');
    changed = true;
  }
  if (content.includes("feedback === 'wrong'") || content.includes('bg-red-500')) {
    // We want to remove the harsh red color for wrong answers.
    content = content.replace(/bg-red-500\/10 border-red-500\/30/g, 'bg-white/5 border-white/10');
    content = content.replace(/bg-red-500\/10 border-red-500\/40/g, 'bg-white/5 border-white/10');
    content = content.replace(/bg-red-500\/10 border-red-500\/50/g, 'bg-white/5 border-white/10');
    content = content.replace(/text-red-400/g, 'text-orange-400'); // Softer feedback color
    changed = true;
  }
  
  if (changed) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
}
