const fs = require('fs');
const path = require('path');

const enPath = path.join(__dirname, 'src/learnos/i18n/locales/en.json');
const hiPath = path.join(__dirname, 'src/learnos/i18n/locales/hi.json');

const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const hiData = JSON.parse(fs.readFileSync(hiPath, 'utf8'));

enData.biology = {
  title: "BioVerse",
  subtitle: "Your Immersive Biology Learning Universe",
  stats: "{{count}} Modules • Maps • 3D • Games • Labs • Simulators",
  new_badge: "NEW",
  search_placeholder: "🔍 Search modules... (try 'DNA', 'game', 'quiz')",
  clear_search: "Clear search",
  found_modules_one: "Found 1 module",
  found_modules_other: "Found {{count}} modules",
  no_modules: "No modules found",
  explored: "explored",
  keep_exploring: "Keep exploring!",
  footer: "🧬 BioVerse — {{count}} Interactive Biology Modules",
  dashboard: {
    level: "Level",
    xp: "XP",
    explored: "Explored",
    streak: "Streak",
    badges: "Badges"
  },
  categories: {
    cell: "🧬 Cell Biology",
    genetics: "🎲 Genetics & Evolution",
    body: "🫀 Human Body",
    lab: "🔬 Lab & Tools",
    plant: "🌱 Plant Biology",
    ecology: "🌍 Ecology & Climate",
    animals: "🦋 Life Cycles & Animals"
  },
  tags: {
    Map: "Map",
    Visualizer: "Visualizer",
    Simulator: "Simulator",
    Lab: "Lab",
    Calculator: "Calculator",
    "3D": "3D",
    Timeline: "Timeline",
    Game: "Game",
    Quiz: "Quiz",
    Diagram: "Diagram",
    Strategy: "Strategy",
    Arcade: "Arcade"
  },
  modules: {
    "cell-map": { title: "Cell Explorer", desc: "14 organelles, plant vs animal" },
    "dna-visualizer": { title: "DNA Visualizer", desc: "Helix, transcription, codons" },
    mitosis: { title: "Mitosis", desc: "6 phases of cell division" },
    meiosis: { title: "Meiosis", desc: "9 stages, crossing over" },
    respiration: { title: "Cell Respiration", desc: "Glycolysis → Krebs → ETC" },
    photosynthesis: { title: "Photosynthesis", desc: "Light, water, CO₂ controls" },
    "punnett-square": { title: "Punnett Square", desc: "8 traits, offspring predictions" },
    crispr: { title: "CRISPR Editor", desc: "Edit genes, real-world targets" },
    "evolution-tree": { title: "Evolution Tree", desc: "Phylogenetic tree of life" },
    brain: { title: "Brain Explorer", desc: "8 regions, neural facts" },
    heart: { title: "Heart & Blood", desc: "Blood flow animation" },
    digestive: { title: "Digestive Journey", desc: "8 organs, follow your food" },
    "immune-defense": { title: "Immune Defense", desc: "Tower defense vs pathogens" },
    "body-quiz": { title: "Body Quiz", desc: "10 questions, all systems" },
    "molecule-3d": { title: "3D Molecules", desc: "Rotate 5 molecules in 3D" },
    microscope: { title: "Microscope", desc: "4 specimens, zoom & pan" },
    "enzyme-lab": { title: "Enzyme Lab", desc: "Temp, pH, substrate effects" },
    "plant-anatomy": { title: "Plant Anatomy", desc: "Flower, leaf, stem, root" },
    ecosystem: { title: "Ecosystem", desc: "17 species, weather events" },
    biomes: { title: "Biomes", desc: "8 world biomes explored" },
    "carbon-cycle": { title: "Carbon Cycle", desc: "CO₂ flows, reservoirs, impacts" },
    "water-cycle": { title: "Water Cycle", desc: "Control sun, watch the cycle" },
    climate: { title: "Climate Sim", desc: "Emissions, sea level, what-if" },
    "food-chain": { title: "Food Chain", desc: "3-level arcade survival" },
    metamorphosis: { title: "Metamorphosis", desc: "Butterfly, frog, dragonfly" },
    "microbe-match": { title: "Microbe Match", desc: "12 microbes, 3 difficulties" }
  }
};

hiData.biology = {
  title: "बायोवर्स (BioVerse)",
  subtitle: "आपका जीव विज्ञान सीखने का ब्रह्मांड",
  stats: "{{count}} मॉड्यूल • मैप • 3D • गेम • लैब • सिमुलेटर",
  new_badge: "नया",
  search_placeholder: "🔍 मॉड्यूल खोजें... (जैसे 'DNA', 'गेम', 'क्विज़')",
  clear_search: "खोज साफ़ करें",
  found_modules_one: "1 मॉड्यूल मिला",
  found_modules_other: "{{count}} मॉड्यूल मिले",
  no_modules: "कोई मॉड्यूल नहीं मिला",
  explored: "खोजा गया",
  keep_exploring: "खोजते रहें!",
  footer: "🧬 बायोवर्स — {{count}} इंटरैक्टिव जीव विज्ञान मॉड्यूल",
  dashboard: {
    level: "स्तर",
    xp: "एक्सपी (XP)",
    explored: "खोजा",
    streak: "स्ट्रीक",
    badges: "बैज"
  },
  categories: {
    cell: "🧬 कोशिका विज्ञान (Cell Biology)",
    genetics: "🎲 आनुवंशिकी और विकास (Genetics)",
    body: "🫀 मानव शरीर (Human Body)",
    lab: "🔬 लैब और उपकरण (Lab & Tools)",
    plant: "🌱 पादप जीव विज्ञान (Plant Biology)",
    ecology: "🌍 पारिस्थितिकी और जलवायु (Ecology)",
    animals: "🦋 जीवन चक्र और जानवर (Life Cycles & Animals)"
  },
  tags: {
    Map: "मैप",
    Visualizer: "विज़ुअलाइज़र",
    Simulator: "सिमुलेटर",
    Lab: "लैब",
    Calculator: "कैलकुलेटर",
    "3D": "3D",
    Timeline: "टाइमलाइन",
    Game: "गेम",
    Quiz: "क्विज़",
    Diagram: "आरेख",
    Strategy: "रणनीति",
    Arcade: "आर्केड"
  },
  modules: {
    "cell-map": { title: "सेल एक्सप्लोरर", desc: "14 अंगक, पौधा बनाम जानवर" },
    "dna-visualizer": { title: "डीएनए विज़ुअलाइज़र", desc: "हेलिक्स, प्रतिलेखन, कोडन" },
    mitosis: { title: "माइटोसिस", desc: "कोशिका विभाजन के 6 चरण" },
    meiosis: { title: "मेयोसिस", desc: "9 चरण, क्रॉसिंग ओवर" },
    respiration: { title: "सेलुलर श्वसन", desc: "ग्लाइकोलाइसिस → क्रेब्स → ईटीसी" },
    photosynthesis: { title: "प्रकाश संश्लेषण", desc: "प्रकाश, पानी, CO₂ नियंत्रण" },
    "punnett-square": { title: "पुननेट स्क्वायर", desc: "8 लक्षण, संतानों की भविष्यवाणी" },
    crispr: { title: "CRISPR एडिटर", desc: "जीन संपादित करें" },
    "evolution-tree": { title: "विकास वृक्ष", desc: "जीवन का फाइलोजेनेटिक पेड़" },
    brain: { title: "ब्रेन एक्सप्लोरर", desc: "8 क्षेत्र, तंत्रिका तथ्य" },
    heart: { title: "हृदय और रक्त", desc: "रक्त प्रवाह एनीमेशन" },
    digestive: { title: "पाचन यात्रा", desc: "8 अंग, अपने भोजन का पालन करें" },
    "immune-defense": { title: "प्रतिरक्षा रक्षा", desc: "रोगजनकों के खिलाफ टावर रक्षा" },
    "body-quiz": { title: "बॉडी क्विज़", desc: "10 प्रश्न, सभी प्रणालियां" },
    "molecule-3d": { title: "3D अणु", desc: "3D में 5 अणु घुमाएं" },
    microscope: { title: "माइक्रोस्कोप", desc: "4 नमूने, ज़ूम और पैन" },
    "enzyme-lab": { title: "एंजाइम लैब", desc: "तापमान, पीएच, प्रभाव" },
    "plant-anatomy": { title: "पौधों की शारीरिक रचना", desc: "फूल, पत्ती, तना, जड़" },
    ecosystem: { title: "पारिस्थितिकी तंत्र", desc: "17 प्रजातियां, मौसम की घटनाएं" },
    biomes: { title: "बायोम", desc: "8 विश्व बायोम" },
    "carbon-cycle": { title: "कार्बन चक्र", desc: "CO₂ प्रवाह, प्रभाव" },
    "water-cycle": { title: "जल चक्र", desc: "सूरज को नियंत्रित करें" },
    climate: { title: "जलवायु सिम", desc: "उत्सर्जन, समुद्र का स्तर" },
    "food-chain": { title: "खाद्य श्रृंखला", desc: "3-स्तरीय आर्केड अस्तित्व" },
    metamorphosis: { title: "कायांतरण", desc: "तितली, मेंढक, ड्रैगनफ्लाई" },
    "microbe-match": { title: "माइक्रोब मैच", desc: "12 रोगाणु, 3 कठिनाइयां" }
  }
};

fs.writeFileSync(enPath, JSON.stringify(enData, null, 2) + '\n');
fs.writeFileSync(hiPath, JSON.stringify(hiData, null, 2) + '\n');

console.log('Successfully updated i18n JSON files.');
