import fs from 'fs';
import path from 'path';

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                results.push(file);
            }
        }
    });
    return results;
}

const srcDir = path.join(process.cwd(), 'src');
const files = walk(srcDir);
let changedCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    const original = content;
    
    // Replace exact Tailwind classes with word boundaries
    // Note: for text-[10px], the brackets are not word characters, so we handle it specifically.
    content = content.replace(/\btext-xs\b/g, 'text-sm');
    content = content.replace(/text-\[10px\]/g, 'text-sm');
    
    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        changedCount++;
        console.log(`Updated ${file}`);
    }
});

console.log(`Mass replacement complete. Modified ${changedCount} files.`);
