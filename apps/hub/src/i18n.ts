import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// RTL languages
const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur'];

// Locale-specific formatters
const formatters = {
  number: new Intl.NumberFormat('en-IN'),
  currency: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }),
  date: new Intl.DateTimeFormat('en-IN'),
  time: new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit' }),
};

/**
 * Check if a language is RTL
 */
export function isRTL(lang: string): boolean {
  return RTL_LANGUAGES.includes(lang);
}

/**
 * Get text direction for a language
 */
export function getTextDirection(lang: string): 'ltr' | 'rtl' {
  return isRTL(lang) ? 'rtl' : 'ltr';
}

/**
 * Update formatters for a specific locale
 */
export function updateFormatters(locale: string) {
  try {
    formatters.number = new Intl.NumberFormat(locale);
    formatters.currency = new Intl.NumberFormat(locale, { 
      style: 'currency', 
      currency: 'INR' 
    });
    formatters.date = new Intl.DateTimeFormat(locale);
    formatters.time = new Intl.DateTimeFormat(locale, { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  } catch (error) {
    console.warn(`Failed to update formatters for locale ${locale}:`, error);
  }
}

/**
 * Format number according to locale
 */
export function formatNumber(value: number, locale?: string): string {
  if (locale) {
    try {
      return new Intl.NumberFormat(locale).format(value);
    } catch {
      return formatters.number.format(value);
    }
  }
  return formatters.number.format(value);
}

/**
 * Format currency according to locale
 */
export function formatCurrency(value: number, locale?: string): string {
  if (locale) {
    try {
      return new Intl.NumberFormat(locale, { 
        style: 'currency', 
        currency: 'INR' 
      }).format(value);
    } catch {
      return formatters.currency.format(value);
    }
  }
  return formatters.currency.format(value);
}

/**
 * Format date according to locale
 */
export function formatDate(date: Date, locale?: string): string {
  if (locale) {
    try {
      return new Intl.DateTimeFormat(locale).format(date);
    } catch {
      return formatters.date.format(date);
    }
  }
  return formatters.date.format(date);
}

/**
 * Format time according to locale
 */
export function formatTime(date: Date, locale?: string): string {
  if (locale) {
    try {
      return new Intl.DateTimeFormat(locale, { 
        hour: '2-digit', 
        minute: '2-digit' 
      }).format(date);
    } catch {
      return formatters.time.format(date);
    }
  }
  return formatters.time.format(date);
}

const resources = {
  en: {
    translation: {
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
      "toys_games": "Toys & Games"
    }
  },
  hi: {
    translation: {
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
      "toys_games": "खिलौने और खेल"
    }
  },
  kn: {
    translation: {
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
    }
  },
  te: {
    translation: {
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
    }
  },
  ta: {
    translation: {
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
    }
  },
  or: {
    translation: {
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
    }
  },
  es: {
    translation: {
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
    }
  },
  fr: {
    translation: {
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
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false 
    },
    // Update formatters when language changes
    react: {
      useSuspense: false,
    },
  });

// Update formatters when language changes
i18n.on('languageChanged', (lng) => {
  updateFormatters(lng);
  // Update document direction for RTL languages
  const direction = getTextDirection(lng);
  document.documentElement.dir = direction;
  document.documentElement.lang = lng;
});

export default i18n;
