const fs = require('fs');
const path = require('path');

const resources = {
  en: {
    "welcome_title": "Welcome to Jigyasu!",
    "welcome_subtitle": "The Universe of Learning",
    "choose_avatar": "Choose your Avatar",
    "enter_name": "What is your name?",
    "lets_go": "Let's Go!",
    "global_xp": "Global XP",
    "where_to_go": "Where do you want to go today, {{name}}?",
    "science_lab": "Science Lab",
    "math_kingdom": "Math Kingdom",
    "bioverse": "BioVerse",
    "chemlab": "ChemLab",
    "cosmoslab": "CosmosLab",
    "toys_games": "Toys & Games",
    "nav_home": "Home",
    "nav_learn": "Learn",
    "nav_create": "Create",
    "nav_profile": "Profile",
    "nav_help": "Help",
    "nav_impact": "Impact"
  },
  hi: {
    "welcome_title": "जिज्ञासु में आपका स्वागत है!",
    "welcome_subtitle": "सीखने का ब्रह्मांड",
    "choose_avatar": "अपना अवतार चुनें",
    "enter_name": "आपका नाम क्या है?",
    "lets_go": "चलिए शुरू करते हैं!",
    "global_xp": "ग्लोबल XP",
    "where_to_go": "आज आप कहाँ जाना चाहते हैं, {{name}}?",
    "science_lab": "विज्ञान प्रयोगशाला",
    "math_kingdom": "गणित साम्राज्य",
    "bioverse": "जीव विज्ञान",
    "chemlab": "रसायन विज्ञान",
    "cosmoslab": "ब्रह्मांड",
    "toys_games": "खिलौने और खेल",
    "learning_paths": "सीखने के रास्ते",
    "learning_paths_desc": "ज्ञान की संरचित दुनिया में गोता लगाएँ। इंटरैक्टिव कहानियों और पाठों के माध्यम से कदम दर कदम अवधारणाओं में महारत हासिल करें।",
    "go_to_learning_paths": "सीखने के रास्तों पर जाएं →",
    "what_youll_discover": "आप क्या खोजेंगे:",
    "tiny_world": "छोटा संसार (उम्र 3-5)",
    "tiny_world_desc": "वर्णमाला, रंग, आकार और प्रारंभिक भावनात्मक कौशल।",
    "adventure_academy": "एडवेंचर अकादमी (उम्र 6-8)",
    "adventure_academy_desc": "गणित की खोज, बुनियादी विज्ञान और पढ़ने की समझ।",
    "lab_zero": "लैब ज़ीरो (उम्र 9-12)",
    "lab_zero_desc": "भौतिकी, उन्नत गणित और कोडिंग मूल बातें।",
    "maker_space": "रचनात्मक स्थान (मेकर स्पेस)",
    "maker_space_desc": "अपनी आस्तीन ऊपर रोल करें! हमारे व्यावहारिक इंटरैक्टिव 3डी लैब्स और आउटडोर अन्वेषणों में बनाएं, सृजन करें और प्रयोग करें।",
    "go_to_maker_space": "मेकर स्पेस पर जाएं →",
    "what_youll_create": "आप क्या बनाएंगे:",
    "interactive_lab": "इंटरएक्टिव लैब",
    "interactive_lab_desc": "भौतिकी सिमुलेशन और रसायन विज्ञान प्रयोग।",
    "art_studio": "कला स्टूडियो",
    "art_studio_desc": "डिजिटल पेंटिंग और रचनात्मक परियोजनाएं।",
    "outdoor_quest": "बाहरी खोज",
    "outdoor_quest_desc": "प्रकृति अन्वेषण और पर्यावरण विज्ञान।",
    "nav_home": "होम",
    "nav_learn": "सीखें",
    "nav_create": "बनाएं",
    "nav_profile": "प्रोफ़ाइल",
    "nav_help": "सहायता",
    "nav_impact": "प्रभाव"
  },
  kn: {
    "welcome_title": "ಜಿಜ್ಞಾಸುಗೆ ಸ್ವಾಗತ!",
    "welcome_subtitle": "ಕಲಿಕೆಯ ಬ್ರಹ್ಮಾಂಡ",
    "choose_avatar": "ನಿಮ್ಮ ಅವತಾರವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    "enter_name": "ನಿಮ್ಮ ಹೆಸರೇನು?",
    "lets_go": "ಹೋಗೋಣ!",
    "global_xp": "ಜಾಗತಿಕ XP",
    "where_to_go": "ಇಂದು ನೀವು ಎಲ್ಲಿಗೆ ಹೋಗಲು ಬಯಸುತ್ತೀರಿ, {{name}}?",
    "science_lab": "ವಿಜ್ಞಾನ ಪ್ರಯೋಗಾಲಯ",
    "math_kingdom": "ಗಣಿತ ಸಾಮ್ರಾಜ್ಯ",
    "bioverse": "ಜೀವಶಾಸ್ತ್ರ",
    "chemlab": "ರಸಾಯನಶಾಸ್ತ್ರ",
    "cosmoslab": "ಬ್ರಹ್ಮಾಂಡ",
    "toys_games": "ಆಟಿಕೆಗಳು ಮತ್ತು ಆಟಗಳು"
  },
  te: {
    "welcome_title": "జిజ్ఞాసు కు స్వాగతం!",
    "welcome_subtitle": "అభ్యాస విశ్వం",
    "choose_avatar": "మీ అవతార్ ఎంచుకోండి",
    "enter_name": "మీ పేరు ఏమిటి?",
    "lets_go": "వెళ్దాం!",
    "global_xp": "గ్లోబల్ XP",
    "where_to_go": "ఈ రోజు మీరు ఎక్కడికి వెళ్లాలనుకుంటున్నారు, {{name}}?",
    "science_lab": "సైన్స్ ల్యాబ్",
    "math_kingdom": "గణిత రాజ్యం",
    "bioverse": "జీవశాస్త్రం",
    "chemlab": "రసాయన శాస్త్రం",
    "cosmoslab": "విశ్వం",
    "toys_games": "బొమ్మలు & ఆటలు"
  },
  ta: {
    "welcome_title": "ஜிக்யாசுவிற்கு வரவேற்கிறோம்!",
    "welcome_subtitle": "கற்றலின் பிரபஞ்சம்",
    "choose_avatar": "உங்கள் அவதாரத்தை தேர்வு செய்யவும்",
    "enter_name": "உங்கள் பெயர் என்ன?",
    "lets_go": "போகலாம்!",
    "global_xp": "உலகளாவிய XP",
    "where_to_go": "இன்று நீங்கள் எங்கே செல்ல விரும்புகிறீர்கள், {{name}}?",
    "science_lab": "அறிவியல் ஆய்வகம்",
    "math_kingdom": "கணித ராஜ்யம்",
    "bioverse": "உயிரியல்",
    "chemlab": "வேதியியல்",
    "cosmoslab": "பிரபஞ்சம்",
    "toys_games": "பொம்மைகள் & விளையாட்டுகள்"
  },
  od: {
    "welcome_title": "ଜିଜ୍ଞାସୁକୁ ସ୍ୱାଗତ!",
    "welcome_subtitle": "ଶିକ୍ଷାର ବ୍ରହ୍ମାଣ୍ଡ",
    "choose_avatar": "ଆପଣଙ୍କର ଅବତାର ବାଛନ୍ତୁ",
    "enter_name": "ଆପଣଙ୍କ ନାମ କଣ?",
    "lets_go": "ଚାଲନ୍ତୁ!",
    "global_xp": "ଗ୍ଲୋବାଲ XP",
    "where_to_go": "ଆଜି ଆପଣ କେଉଁଠାକୁ ଯିବାକୁ ଚାହୁଁଛନ୍ତି, {{name}}?",
    "science_lab": "ବିଜ୍ଞାନ ପରୀକ୍ଷାଗାର",
    "math_kingdom": "ଗଣିତ ରାଜ୍ୟ",
    "bioverse": "ଜୀବ ବିଜ୍ଞାନ",
    "chemlab": "ରସାୟନ ବିଜ୍ଞାନ",
    "cosmoslab": "ବ୍ରହ୍ମାଣ୍ଡ",
    "toys_games": "ଖେଳନା ଏବଂ ଖେଳ"
  },
  es: {
    "welcome_title": "¡Bienvenido a Jigyasu!",
    "welcome_subtitle": "El Universo del Aprendizaje",
    "choose_avatar": "Elige tu Avatar",
    "enter_name": "¿Cuál es tu nombre?",
    "lets_go": "¡Vamos!",
    "global_xp": "XP Global",
    "where_to_go": "¿A dónde quieres ir hoy, {{name}}?",
    "science_lab": "Laboratorio de Ciencias",
    "math_kingdom": "Reino de las Matemáticas",
    "bioverse": "BioVerso",
    "chemlab": "Laboratorio de Química",
    "cosmoslab": "Laboratorio de Cosmos",
    "toys_games": "Juguetes y Juegos"
  },
  fr: {
    "welcome_title": "Bienvenue à Jigyasu!",
    "welcome_subtitle": "L'univers de l'apprentissage",
    "choose_avatar": "Choisis ton Avatar",
    "enter_name": "Comment t'appelles-tu?",
    "lets_go": "C'est parti!",
    "global_xp": "XP Global",
    "where_to_go": "Où veux-tu aller aujourd'hui, {{name}}?",
    "science_lab": "Laboratoire de Sciences",
    "math_kingdom": "Royaume des Mathématiques",
    "bioverse": "BioVers",
    "chemlab": "Laboratoire de Chimie",
    "cosmoslab": "Laboratoire du Cosmos",
    "toys_games": "Jouets et Jeux"
  }
};

const localesDir = 'src/learnos/i18n/locales';

Object.keys(resources).forEach(lang => {
  const filePath = path.join(localesDir, `${lang}.json`);
  let data = {};
  if (fs.existsSync(filePath)) {
    data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  
  // Merge resources[lang] into data safely. Don't overwrite if data[key] is an object (nested translations).
  // These are flat keys in resources[lang].
  Object.keys(resources[lang]).forEach(key => {
    if (typeof data[key] === 'object') {
      // It's a nested object. We don't overwrite it with a flat string!
      console.log(`Skipping key ${key} in ${lang}.json because it is now an object.`);
    } else {
      data[key] = resources[lang][key];
    }
  });

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`Merged resources into ${lang}.json`);
});
