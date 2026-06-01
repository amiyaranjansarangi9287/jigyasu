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
let found = false;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if (content.toLowerCase().includes('unsplash')) {
        console.log(`Found unsplash in ${file}`);
        found = true;
    }
});

if (!found) {
    console.log("No Unsplash references found.");
}
