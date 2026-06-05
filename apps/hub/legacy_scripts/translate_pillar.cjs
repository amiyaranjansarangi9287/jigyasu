const fs = require('fs');

const pillarPath = 'd:/vision_agentic/jigyasu/apps/hub/src/kidscamp/components/PillarShowcase.tsx';
let code = fs.readFileSync(pillarPath, 'utf8');

// Add import
if (!code.includes("import { useTranslation }")) {
  code = code.replace(/import { useReveal } from '..\/hooks\/useReveal';/, "import { useReveal } from '../hooks/useReveal';\nimport { useTranslation } from 'react-i18next';");
}

// Add hook
if (!code.includes("const { t } = useTranslation();")) {
  code = code.replace(/const { activities } = useLocalizedActivities\(\);/, "const { activities } = useLocalizedActivities();\n  const { t } = useTranslation();");
}

// Replace strings
code = code.replace(/>\s*Interactive Learning\s*<\/span>/, ">{t('pillar_showcase.interactive_learning', 'Interactive Learning')}</span>");
code = code.replace(/>\s*Explore Interactive Environments\s*<\/h2>/, ">{t('pillar_showcase.explore', 'Explore Interactive Environments')}</h2>");
code = code.replace(/>\s*Dive into our hands-on simulation labs, digital art studios, and physical maker spaces\. Learn by doing, building, and experimenting\.\s*<\/p>/, ">{t('pillar_showcase.dive_into', 'Dive into our hands-on simulation labs, digital art studios, and physical maker spaces. Learn by doing, building, and experimenting.')}</p>");

code = code.replace(/>{count} Labs<\/span>/, ">{count} {t('pillar_showcase.labs', 'Labs')}</span>");
code = code.replace(/>\s*Enter Lab/g, ">\n                      {t('pillar_showcase.enter_lab', 'Enter Lab')}");

// Make the pillarExtras object use t() inside the render or just wrap it in useMemo?
// Wait, pillarExtras is defined inside PillarShowcase component! 
code = code.replace(/tagline: 'Build amazing handcrafted toys'/, "tagline: t('pillar_showcase.toybox.tagline', 'Build amazing handcrafted toys')");
code = code.replace(/preview: \['Wooden Cars', 'Puppets', 'Puzzles'\]/, "preview: [t('pillar_showcase.toybox.preview.0', 'Wooden Cars'), t('pillar_showcase.toybox.preview.1', 'Puppets'), t('pillar_showcase.toybox.preview.2', 'Puzzles')]");

code = code.replace(/tagline: 'Run interactive simulations & experiments'/, "tagline: t('pillar_showcase.sciencelab.tagline', 'Run interactive simulations & experiments')");
code = code.replace(/preview: \['Physics Lab', 'Chemistry Lab', 'Biology Lab', 'Cosmos Lab'\]/, "preview: [t('pillar_showcase.sciencelab.preview.0', 'Physics Lab'), t('pillar_showcase.sciencelab.preview.1', 'Chemistry Lab'), t('pillar_showcase.sciencelab.preview.2', 'Biology Lab'), t('pillar_showcase.sciencelab.preview.3', 'Cosmos Lab')]");

code = code.replace(/tagline: 'Express your creativity'/, "tagline: t('pillar_showcase.artstudio.tagline', 'Express your creativity')");
code = code.replace(/preview: \['Painting', 'Origami', 'Sculpture'\]/, "preview: [t('pillar_showcase.artstudio.preview.0', 'Painting'), t('pillar_showcase.artstudio.preview.1', 'Origami'), t('pillar_showcase.artstudio.preview.2', 'Sculpture')]");

code = code.replace(/tagline: 'Explore nature and adventure'/, "tagline: t('pillar_showcase.outdoorquest.tagline', 'Explore nature and adventure')");
code = code.replace(/preview: \['Scavenger Hunts', 'Gardening', 'Stargazing'\]/, "preview: [t('pillar_showcase.outdoorquest.preview.0', 'Scavenger Hunts'), t('pillar_showcase.outdoorquest.preview.1', 'Gardening'), t('pillar_showcase.outdoorquest.preview.2', 'Stargazing')]");

// Replace {pillar.name} with t(`pillar_${pillar.id}`, pillar.name)
code = code.replace(/>\s*\{pillar\.name\}\s*<\/h3>/, ">{t(`pillar_${pillar.id}` as any, pillar.name)}</h3>");
// In the alt tag
code = code.replace(/alt=\{pillar\.name\}/, "alt={t(`pillar_${pillar.id}` as any, pillar.name)}");

fs.writeFileSync(pillarPath, code);
console.log('Updated PillarShowcase.tsx');
