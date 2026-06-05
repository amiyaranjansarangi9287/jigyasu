const fs = require('fs');
const path = require('path');

const enPath = path.join(__dirname, 'src/learnos/i18n/locales/en.json');
const hiPath = path.join(__dirname, 'src/learnos/i18n/locales/hi.json');

const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const hiData = JSON.parse(fs.readFileSync(hiPath, 'utf8'));

const modules = [
  { id: 'daily', title: 'Daily Challenge', desc: 'New physics puzzle every day!', tag: 'Daily', cat: 'daily' },
  { id: 'projectile-motion', title: 'Projectile Motion', desc: 'Launch angles, velocity, trajectory', tag: 'Simulator', cat: 'mechanics' },
  { id: 'newtons-laws', title: "Newton's Laws", desc: 'F=ma, action-reaction, inertia', tag: 'Interactive', cat: 'mechanics' },
  { id: 'pendulum-lab', title: 'Pendulum Lab', desc: 'Period, length, gravity effects', tag: 'Lab', cat: 'mechanics' },
  { id: 'collision-sim', title: 'Collision Simulator', desc: 'Elastic & inelastic, momentum', tag: 'Simulator', cat: 'mechanics' },
  { id: 'energy-skate', title: 'Energy Skate Park', desc: 'KE, PE, conservation of energy', tag: 'Park', cat: 'mechanics' },
  { id: 'inclined-plane', title: 'Inclined Plane', desc: 'Forces, friction, acceleration', tag: 'Lab', cat: 'mechanics' },
  { id: 'wave-interference', title: 'Wave Interference', desc: 'Constructive & destructive', tag: 'Visualizer', cat: 'waves' },
  { id: 'sound-waves', title: 'Sound Waves', desc: 'Frequency, amplitude, pitch', tag: 'Visualizer', cat: 'waves' },
  { id: 'doppler-effect', title: 'Doppler Effect', desc: 'Moving sources, frequency shift', tag: 'Simulator', cat: 'waves' },
  { id: 'standing-waves', title: 'Standing Waves', desc: 'Nodes, antinodes, harmonics', tag: 'Lab', cat: 'waves' },
  { id: 'resonance-lab', title: 'Resonance Lab', desc: 'Natural frequency, amplification', tag: 'Lab', cat: 'waves' },
  { id: 'circuit-builder', title: 'Circuit Builder', desc: 'Series, parallel, components', tag: 'Builder', cat: 'electricity' },
  { id: 'magnetic-fields', title: 'Magnetic Fields', desc: 'Field lines, poles, strength', tag: 'Visualizer', cat: 'electricity' },
  { id: 'ohms-law', title: "Ohm's Law", desc: 'V=IR, resistance, current', tag: 'Lab', cat: 'electricity' },
  { id: 'em-induction', title: 'EM Induction', desc: 'Faraday, Lenz, generators', tag: 'Simulator', cat: 'electricity' },
  { id: 'motor-generator', title: 'Motor & Generator', desc: 'AC/DC, conversion, efficiency', tag: 'Simulator', cat: 'electricity' },
  { id: 'heat-transfer', title: 'Heat Transfer', desc: 'Conduction, convection, radiation', tag: 'Simulator', cat: 'thermo' },
  { id: 'gas-laws', title: 'Gas Laws', desc: 'PV=nRT, Boyle, Charles', tag: 'Lab', cat: 'thermo' },
  { id: 'heat-engine', title: 'Heat Engine', desc: 'Carnot cycle, efficiency', tag: 'Simulator', cat: 'thermo' },
  { id: 'phase-change', title: 'Phase Change', desc: 'Melting, boiling, sublimation', tag: 'Lab', cat: 'thermo' },
  { id: 'lens-sim', title: 'Lens Simulator', desc: 'Convex, concave, focal length', tag: 'Simulator', cat: 'optics' },
  { id: 'mirror-lab', title: 'Mirror Lab', desc: 'Plane, concave, convex mirrors', tag: 'Lab', cat: 'optics' },
  { id: 'prism-dispersion', title: 'Prism & Dispersion', desc: 'Spectrum, refraction, wavelength', tag: 'Visualizer', cat: 'optics' },
  { id: 'human-eye', title: 'Human Eye', desc: 'Lens, retina, vision defects', tag: 'Diagram', cat: 'optics' },
  { id: 'interference-patterns', title: 'Interference Patterns', desc: 'Double-slit, diffraction', tag: 'Lab', cat: 'optics' },
  { id: 'atomic-structure', title: 'Atomic Structure', desc: 'Nucleus, electrons, orbitals', tag: '3D', cat: 'modern' },
  { id: 'photoelectric', title: 'Photoelectric Effect', desc: 'Einstein, photons, work function', tag: 'Lab', cat: 'modern' },
  { id: 'quantum-tunneling', title: 'Quantum Tunneling', desc: 'Barrier penetration, probability', tag: 'Simulator', cat: 'modern' },
  { id: 'nuclear-decay', title: 'Nuclear Decay', desc: 'Alpha, beta, gamma, half-life', tag: 'Simulator', cat: 'modern' },
  { id: 'buoyancy-lab', title: 'Buoyancy Lab', desc: 'Archimedes, density, displacement', tag: 'Lab', cat: 'fluids' },
  { id: 'bernoulli', title: "Bernoulli's Principle", desc: 'Pressure, velocity, lift', tag: 'Simulator', cat: 'fluids' },
  { id: 'viscosity', title: 'Viscosity', desc: 'Fluid resistance, flow rate', tag: 'Lab', cat: 'fluids' },
  { id: 'surface-tension', title: 'Surface Tension', desc: 'Capillary action, droplets', tag: 'Lab', cat: 'fluids' },
  { id: 'orbital-mechanics', title: 'Orbital Mechanics', desc: 'Orbits, velocity, escape', tag: 'Simulator', cat: 'space' },
  { id: 'black-hole', title: 'Black Hole', desc: 'Event horizon, spaghettification', tag: 'Simulator', cat: 'space' },
  { id: 'planetary-motion', title: 'Planetary Motion', desc: "Kepler's laws, elliptical orbits", tag: 'Simulator', cat: 'space' },
  { id: 'gravity-wells', title: 'Gravity Wells', desc: 'Spacetime curvature, mass', tag: '3D', cat: 'space' },
  { id: 'particle-accelerator', title: 'Particle Accelerator', desc: 'Discover fundamental particles!', tag: '🔥 Flagship', cat: 'flagship' },
];

const categories = [
  { id: 'mechanics', title: '⚙️ Mechanics' },
  { id: 'waves', title: '🌊 Waves & Sound' },
  { id: 'electricity', title: '⚡ Electricity & Magnetism' },
  { id: 'thermo', title: '🔥 Thermodynamics' },
  { id: 'optics', title: '🔍 Optics' },
  { id: 'modern', title: '⚛️ Modern Physics' },
  { id: 'fluids', title: '💧 Fluid Mechanics' },
  { id: 'space', title: '🚀 Space & Gravity' },
];

// Define EN structure
enData.physics = {
  title: "PhysicsVerse",
  subtitle: "Interactive Physics Simulations & Experiments",
  stats: "{{count}} Modules • 8 Categories • Simulators • Labs • 3D Visualizers",
  to_explore: "TO EXPLORE",
  dashboard: {
    level: "Level",
    xp: "XP",
    explored: "Explored",
    streak: "Streak",
    badges: "Badges"
  },
  keep_exploring: "Keep exploring!",
  search_placeholder: "🔍 Search modules... (try 'wave', 'circuit', 'quantum')",
  clear_search: "Clear search",
  found_modules_one: "Found 1 module",
  found_modules_other: "Found {{count}} modules",
  no_modules: "No modules found",
  explored: "explored",
  footer: "⚛️ PhysicsVerse — {{count}} Interactive Physics Modules • React + Tailwind + Canvas",
  modules: {},
  categories: {},
  tags: {
    "Daily": "Daily",
    "Simulator": "Simulator",
    "Interactive": "Interactive",
    "Lab": "Lab",
    "Park": "Park",
    "Visualizer": "Visualizer",
    "Builder": "Builder",
    "Diagram": "Diagram",
    "3D": "3D",
    "🔥 Flagship": "🔥 Flagship"
  }
};

modules.forEach(m => {
  enData.physics.modules[m.id] = {
    title: m.title,
    desc: m.desc
  };
});

categories.forEach(c => {
  enData.physics.categories[c.id] = c.title;
});

// Define HI structure (AI translation logic - just copy EN keys to start, then manually replace some)
hiData.physics = {
  title: "फ़िज़िक्स वर्स (PhysicsVerse)",
  subtitle: "इंटरैक्टिव भौतिकी सिमुलेशन और प्रयोग",
  stats: "{{count}} मॉड्यूल • 8 श्रेणियां • सिमुलेटर • प्रयोगशालाएं • 3D विज़ुअलाइज़र",
  to_explore: "अन्वेषण करें",
  dashboard: {
    level: "स्तर",
    xp: "XP",
    explored: "खोज लिया",
    streak: "सिलसिला",
    badges: "बैज"
  },
  keep_exploring: "अन्वेषण करते रहें!",
  search_placeholder: "🔍 मॉड्यूल खोजें... ('तरंग', 'सर्किट', 'क्वांटम' आज़माएं)",
  clear_search: "खोज मिटाएं",
  found_modules_one: "1 मॉड्यूल मिला",
  found_modules_other: "{{count}} मॉड्यूल मिले",
  no_modules: "कोई मॉड्यूल नहीं मिला",
  explored: "खोज लिया",
  footer: "⚛️ फ़िज़िक्स वर्स — {{count}} इंटरैक्टिव भौतिकी मॉड्यूल • React + Tailwind + Canvas",
  modules: {},
  categories: {},
  tags: {
    "Daily": "दैनिक",
    "Simulator": "सिम्युलेटर",
    "Interactive": "इंटरएक्टिव",
    "Lab": "लैब",
    "Park": "पार्क",
    "Visualizer": "विज़ुअलाइज़र",
    "Builder": "बिल्डर",
    "Diagram": "आरेख",
    "3D": "3D",
    "🔥 Flagship": "🔥 प्रमुख"
  }
};

const hiModulesTranslations = {
  'daily': { title: 'दैनिक चुनौती', desc: 'हर दिन नई भौतिकी पहेली!' },
  'projectile-motion': { title: 'प्रक्षेप्य गति', desc: 'लॉन्च कोण, वेग, प्रक्षेपवक्र' },
  'newtons-laws': { title: "न्यूटन के नियम", desc: 'F=ma, क्रिया-प्रतिक्रिया, जड़त्व' },
  'pendulum-lab': { title: 'पेंडुलम लैब', desc: 'अवधि, लंबाई, गुरुत्वाकर्षण प्रभाव' },
  'collision-sim': { title: 'टक्कर सिम्युलेटर', desc: 'लोचदार और अलोचदार, संवेग' },
  'energy-skate': { title: 'ऊर्जा स्केट पार्क', desc: 'KE, PE, ऊर्जा का संरक्षण' },
  'inclined-plane': { title: 'आनत तल', desc: 'बल, घर्षण, त्वरण' },
  'wave-interference': { title: 'तरंग व्यतिकरण', desc: 'रचनात्मक और विनाशकारी' },
  'sound-waves': { title: 'ध्वनि तरंगें', desc: 'आवृत्ति, आयाम, पिच' },
  'doppler-effect': { title: 'डॉपलर प्रभाव', desc: 'चलती स्रोत, आवृत्ति बदलाव' },
  'standing-waves': { title: 'अप्रगामी तरंगें', desc: 'नोड्स, एंटीनोड्स, हार्मोनिक्स' },
  'resonance-lab': { title: 'अनुनाद लैब', desc: 'प्राकृतिक आवृत्ति, प्रवर्धन' },
  'circuit-builder': { title: 'सर्किट बिल्डर', desc: 'श्रृंखला, समानांतर, घटक' },
  'magnetic-fields': { title: 'चुंबकीय क्षेत्र', desc: 'क्षेत्र रेखाएं, ध्रुव, ताकत' },
  'ohms-law': { title: "ओम का नियम", desc: 'V=IR, प्रतिरोध, धारा' },
  'em-induction': { title: 'ईएम प्रेरण (EM Induction)', desc: 'फैराडे, लेन्ज, जनरेटर' },
  'motor-generator': { title: 'मोटर और जनरेटर', desc: 'AC/DC, रूपांतरण, दक्षता' },
  'heat-transfer': { title: 'ऊष्मा संचरण', desc: 'चालन, संवहन, विकिरण' },
  'gas-laws': { title: 'गैस नियम', desc: 'PV=nRT, बॉयल, चार्ल्स' },
  'heat-engine': { title: 'हीट इंजन', desc: 'कार्नॉट चक्र, दक्षता' },
  'phase-change': { title: 'चरण परिवर्तन', desc: 'पिघलना, उबलना, उर्ध्वपातन' },
  'lens-sim': { title: 'लेंस सिम्युलेटर', desc: 'उत्तल, अवतल, फोकल लंबाई' },
  'mirror-lab': { title: 'मिरर लैब', desc: 'समतल, अवतल, उत्तल दर्पण' },
  'prism-dispersion': { title: 'प्रिज्म और विक्षेपण', desc: 'स्पेक्ट्रम, अपवर्तन, तरंग दैर्ध्य' },
  'human-eye': { title: 'मानव नेत्र', desc: 'लेंस, रेटिना, दृष्टि दोष' },
  'interference-patterns': { title: 'व्यतिकरण पैटर्न', desc: 'डबल-स्लिट, विवर्तन' },
  'atomic-structure': { title: 'परमाणु संरचना', desc: 'नाभिक, इलेक्ट्रॉन, कक्षक' },
  'photoelectric': { title: 'प्रकाशवैद्युत प्रभाव', desc: 'आइंस्टीन, फोटॉन, कार्य फलन' },
  'quantum-tunneling': { title: 'क्वांटम टनलिंग', desc: 'बाधा प्रवेश, प्रायिकता' },
  'nuclear-decay': { title: 'परमाणु क्षय', desc: 'अल्फा, बीटा, गामा, आधा जीवन' },
  'buoyancy-lab': { title: 'उत्प्लावकता लैब', desc: 'आर्किमिडीज, घनत्व, विस्थापन' },
  'bernoulli': { title: "बर्नौली का सिद्धांत", desc: 'दबाव, वेग, लिफ्ट' },
  'viscosity': { title: 'श्यानता', desc: 'द्रव प्रतिरोध, प्रवाह दर' },
  'surface-tension': { title: 'पृष्ठ तनाव', desc: 'केशिका क्रिया, बूंदें' },
  'orbital-mechanics': { title: 'कक्षीय यांत्रिकी', desc: 'कक्षाएँ, वेग, पलायन' },
  'black-hole': { title: 'ब्लैक होल', desc: 'इवेंट होराइजन, स्पैगेटिफिकेशन' },
  'planetary-motion': { title: 'ग्रहीय गति', desc: "केप्लर के नियम, अण्डाकार कक्षाएँ" },
  'gravity-wells': { title: 'गुरुत्वाकर्षण कुएं', desc: 'स्पेसटाइम वक्रता, द्रव्यमान' },
  'particle-accelerator': { title: 'कण त्वरक', desc: 'मौलिक कणों की खोज करें!' },
};

modules.forEach(m => {
  hiData.physics.modules[m.id] = hiModulesTranslations[m.id] || { title: m.title, desc: m.desc };
});

const hiCatTranslations = {
  'mechanics': '⚙️ यांत्रिकी (Mechanics)',
  'waves': '🌊 तरंगें और ध्वनि',
  'electricity': '⚡ विद्युत और चुंबकत्व',
  'thermo': '🔥 ऊष्मप्रवैगिकी (Thermodynamics)',
  'optics': '🔍 प्रकाशिकी (Optics)',
  'modern': '⚛️ आधुनिक भौतिकी',
  'fluids': '💧 द्रव यांत्रिकी',
  'space': '🚀 अंतरिक्ष और गुरुत्वाकर्षण',
};

categories.forEach(c => {
  hiData.physics.categories[c.id] = hiCatTranslations[c.id] || c.title;
});

fs.writeFileSync(enPath, JSON.stringify(enData, null, 2) + '\n');
fs.writeFileSync(hiPath, JSON.stringify(hiData, null, 2) + '\n');

console.log('Successfully updated i18n JSON files for physics.');
