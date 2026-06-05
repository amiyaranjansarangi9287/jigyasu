const fs = require('fs');
const path = require('path');

const enPath = path.join(__dirname, 'src/learnos/i18n/locales/en.json');
const hiPath = path.join(__dirname, 'src/learnos/i18n/locales/hi.json');

const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const hiData = JSON.parse(fs.readFileSync(hiPath, 'utf8'));

enData.math = {
  title_part1: "Welcome to the",
  title_part2: "Math Kingdom!",
  subtitle: "A whimsical world where numbers dance, patterns hide, and every math problem is an adventure waiting to be solved! 🌟",
  footer: "Made with 💜 for math wizards of all levels ✨",
  footer_stats: "50+ activities · 350+ challenges · Ages 5–18+",
  stats: {
    activities: "Activities",
    challenges: "Challenges",
    fun_level: "Fun Level"
  },
  did_you_know: "✨ Did You Know?",
  facts: {
    fact1: "<strong class=\"text-white\">111,111,111 × 111,111,111</strong> = 12,345,678,987,654,321 — a perfect palindrome!",
    fact2: "A pizza that has radius <strong class=\"text-white\">\"z\"</strong> and height <strong class=\"text-white\">\"a\"</strong> has volume = Pi × z × z × a",
    fact3: "The word <strong class=\"text-white\">\"hundred\"</strong> comes from the old Norse word <strong class=\"text-white\">\"hundrath\"</strong> meaning 120!"
  },
  header: {
    title: "Math Kingdom",
    subtitle: "Where numbers come alive! ✨"
  },
  tabs: {
    home: { label: "Home", desc: "Welcome" },
    daily: { label: "Daily", desc: "Daily challenge" },
    explorers: { label: "Explore", desc: "Visual topics" },
    map: { label: "Map", desc: "Explore zones" },
    visualizer: { label: "3D", desc: "See math in 3D" },
    skills: { label: "Skills", desc: "Build foundations" },
    advanced: { label: "Advanced", desc: "Higher level" },
    game: { label: "Game", desc: "Race the clock" },
    pattern: { label: "Patterns", desc: "Find patterns" },
    worksheet: { label: "Print", desc: "Worksheets" }
  },
  features: {
    daily: { title: "Daily Challenge", description: "A fresh challenge every day! Build your streak and sharpen your skills with a new problem each morning!" },
    explorers: { title: "Explorers Guild", description: "20 visual adventures! From counting coins to chess strategy, sports stats, and engineering math." },
    map: { title: "Adventure Map", description: "Explore the Math Kingdom! Travel through Addition Forest, Subtraction Caves, and more. Solve challenges to earn stars!" },
    visualizer: { title: "3D Math Visualizer", description: "See numbers come alive! Watch addition build towers, multiplication create grids, and division split groups — all in 3D!" },
    skills: { title: "Skills Academy", description: "Build core math foundations! Master times tables, grow number bonds, and explore fractions with pizza!" },
    advanced: { title: "Advanced Math", description: "Algebra, trig, vectors, matrices, logs, calculus, complex numbers, statistics, probability — plus SAT/ACT practice and Math Olympiad!" },
    game: { title: "Number Crunch Quest", description: "Race against the clock! Solve math puzzles as fast as you can. Build combos and reach legendary wizard status!" },
    pattern: { title: "Patterns & Memory", description: "Discover hidden patterns in number sequences — each type has a whimsical theme! Also play Memory Match to train your mind!" }
  },
  start_exploring: "Start Exploring →",
  preparing: "Preparing your math adventure..."
};

hiData.math = {
  title_part1: "स्वागत है",
  title_part2: "गणित साम्राज्य में!",
  subtitle: "एक अनोखी दुनिया जहाँ संख्याएँ नाचती हैं, पैटर्न छिपते हैं, और हर गणित की समस्या एक साहसिक कार्य है! 🌟",
  footer: "सभी स्तरों के गणित के जादूगरों के लिए 💜 के साथ बनाया गया ✨",
  footer_stats: "50+ गतिविधियाँ · 350+ चुनौतियाँ · उम्र 5–18+",
  stats: {
    activities: "गतिविधियाँ",
    challenges: "चुनौतियाँ",
    fun_level: "मज़ा स्तर"
  },
  did_you_know: "✨ क्या आप जानते हैं?",
  facts: {
    fact1: "<strong class=\"text-white\">111,111,111 × 111,111,111</strong> = 12,345,678,987,654,321 — एक पूर्ण विलोमपद!",
    fact2: "त्रिज्या <strong class=\"text-white\">\"z\"</strong> और ऊंचाई <strong class=\"text-white\">\"a\"</strong> वाले पिज्जा का आयतन = Pi × z × z × a",
    fact3: "<strong class=\"text-white\">\"हंड्रेड (hundred)\"</strong> शब्द पुराने नॉर्स शब्द <strong class=\"text-white\">\"hundrath\"</strong> से आया है जिसका अर्थ 120 है!"
  },
  header: {
    title: "गणित साम्राज्य (Math Kingdom)",
    subtitle: "जहाँ संख्याएँ जीवंत हो उठती हैं! ✨"
  },
  tabs: {
    home: { label: "होम", desc: "स्वागत है" },
    daily: { label: "दैनिक", desc: "दैनिक चुनौती" },
    explorers: { label: "अन्वेषण", desc: "दृश्य विषय" },
    map: { label: "मैप", desc: "क्षेत्रों का अन्वेषण करें" },
    visualizer: { label: "3D", desc: "गणित को 3D में देखें" },
    skills: { label: "कौशल", desc: "बुनियाद बनाएँ" },
    advanced: { label: "उन्नत", desc: "उच्च स्तर" },
    game: { label: "गेम", desc: "घड़ी से दौड़ें" },
    pattern: { label: "पैटर्न", desc: "पैटर्न खोजें" },
    worksheet: { label: "प्रिंट", desc: "वर्कशीट" }
  },
  features: {
    daily: { title: "दैनिक चुनौती", description: "हर दिन एक नई चुनौती! अपनी लकीर बनाएं और हर सुबह एक नई समस्या के साथ अपने कौशल को तेज करें!" },
    explorers: { title: "एक्सप्लोरर गिल्ड", description: "20 दृश्य रोमांच! सिक्कों की गिनती से लेकर शतरंज की रणनीति, खेल के आँकड़े और इंजीनियरिंग गणित तक।" },
    map: { title: "एडवेंचर मैप", description: "गणित साम्राज्य का अन्वेषण करें! जोड़ वन, घटाव गुफाओं और बहुत कुछ के माध्यम से यात्रा करें। सितारे कमाने के लिए चुनौतियां हल करें!" },
    visualizer: { title: "3D मैथ विज़ुअलाइज़र", description: "संख्याओं को जीवंत होते देखें! जोड़ को टॉवर बनाते हुए, गुणा को ग्रिड बनाते हुए देखें — सब 3D में!" },
    skills: { title: "स्किल्स अकादमी", description: "मूल गणित की नींव बनाएं! पहाड़े याद करें, संख्या बांड बढ़ाएं और पिज्जा के साथ भिन्न का अन्वेषण करें!" },
    advanced: { title: "उन्नत गणित", description: "बीजगणित, त्रिकोणमिति, वैक्टर, मैट्रिक्स, लॉग, कैलकुलस, जटिल संख्याएं, सांख्यिकी, प्रायिकता — साथ ही SAT/ACT अभ्यास और मैथ ओलंपियाड!" },
    game: { title: "नंबर क्रंच क्वेस्ट", description: "घड़ी के खिलाफ दौड़ें! जितनी जल्दी हो सके गणित की पहेलियों को हल करें। दिग्गज जादूगर की स्थिति तक पहुंचें!" },
    pattern: { title: "पैटर्न और मेमोरी", description: "संख्या अनुक्रमों में छिपे पैटर्न खोजें! इसके अलावा अपने दिमाग को प्रशिक्षित करने के लिए मेमोरी मैच खेलें!" }
  },
  start_exploring: "अन्वेषण शुरू करें →",
  preparing: "आपके गणित के रोमांच की तैयारी..."
};

fs.writeFileSync(enPath, JSON.stringify(enData, null, 2) + '\n');
fs.writeFileSync(hiPath, JSON.stringify(hiData, null, 2) + '\n');

console.log('Successfully updated i18n JSON files for math.');
