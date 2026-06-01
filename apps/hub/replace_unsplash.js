import fs from 'fs';

const filesToUpdate = [
    'D:\\vision_agentic\\jigyasu\\apps\\hub\\src\\kidscamp\\components\\ActivityCard.tsx',
    'D:\\vision_agentic\\jigyasu\\apps\\hub\\src\\kidscamp\\components\\ActivityModal.tsx',
    'D:\\vision_agentic\\jigyasu\\apps\\hub\\src\\kidscamp\\components\\Hero.tsx',
    'D:\\vision_agentic\\jigyasu\\apps\\hub\\src\\kidscamp\\components\\PillarShowcase.tsx',
    'D:\\vision_agentic\\jigyasu\\apps\\hub\\src\\kidscamp\\components\\ToddlerZone.tsx'
];

filesToUpdate.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Regex to match unsplash URLs like https://images.unsplash.com/...
    content = content.replace(/https?:\/\/images\.unsplash\.com\/[^\s'"]+/g, '/images/fallback-placeholder.png');
    
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
});
