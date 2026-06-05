const fs = require('fs');

const path = 'src/learnos/i18n/locales/hi.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

if (!data.kidscamp) data.kidscamp = {};
if (!data.kidscamp.ages) data.kidscamp.ages = {};
if (!data.kidscamp.pillars) data.kidscamp.pillars = {};

Object.assign(data.kidscamp.ages, {
  "whos_making_modal": "आज कौन बना रहा है?",
  "clear_selection": "चयन साफ़ करें (सभी आयु दिखाएं)",
  "title1": "लिटिल एक्सप्लोरर्स",
  "desc1": "माता-पिता के मार्गदर्शन के साथ सरल, संवेदी गतिविधियां। जिज्ञासु बच्चों के लिए बिल्कुल सही!",
  "feat1_0": "माता-पिता द्वारा निर्देशित गतिविधियां",
  "feat1_1": "संवेदी अन्वेषण",
  "feat1_2": "बड़े, रंगीन कदम",
  "feat1_3": "अतिरिक्त सुरक्षा सुझाव",
  "title2": "जूनियर क्रिएटर्स",
  "desc2": "स्पष्ट चरण-दर-चरण निर्देशों के साथ मजेदार प्रोजेक्ट। बनाने के माध्यम से आत्मविश्वास का निर्माण!",
  "feat2_0": "अर्ध-स्वतंत्र",
  "feat2_1": "उपलब्धि बैज",
  "feat2_2": "कौशल निर्माण",
  "feat2_3": "रचनात्मक स्वतंत्रता",
  "title3": "एडवेंचर बिल्डर्स",
  "desc3": "स्वतंत्र निर्माताओं के लिए जटिल प्रोजेक्ट जो वास्तविक चुनौतियों के लिए तैयार हैं!",
  "feat3_0": "स्वतंत्र कार्य",
  "feat3_1": "उन्नत तकनीक",
  "feat3_2": "STEM अवधारणाएं",
  "feat3_3": "असली उपकरण",
  "title4": "भविष्य के इनोवेटर्स",
  "desc4": "किशोरों के लिए उन्नत प्रोजेक्ट, कोडिंग और वास्तविक दुनिया के कौशल!",
  "feat4_0": "स्व-निर्देशित सीखना",
  "feat4_1": "उन्नत STEM",
  "feat4_2": "वास्तविक दुनिया के अनुप्रयोग",
  "feat4_3": "सहकर्मी चुनौतियां",
  "title5": "आजीवन शिक्षार्थी",
  "desc5": "गहन ज्ञान, पेशेवर कौशल और उन्नत अवधारणाएं।",
  "feat5_0": "स्व-निर्देशित सीखना",
  "feat5_1": "उन्नत अवधारणाएं",
  "feat5_2": "पेशेवर कौशल",
  "feat5_3": "निपुणता"
});

data.kidscamp.pillars = {
  "toybox": {
    "title": "खिलौना बक्सा",
    "desc": "शून्य से अद्भुत हस्तनिर्मित खिलौने बनाएं"
  },
  "sciencelab": {
    "title": "इंटरएक्टिव लैब्स",
    "desc": "जिज्ञासु लैब्स का अन्वेषण करें: भौतिकी, रसायन विज्ञान, जीव विज्ञान और बहुत कुछ!"
  },
  "artstudio": {
    "title": "कला स्टूडियो",
    "desc": "कला और शिल्प के माध्यम से अपनी रचनात्मकता व्यक्त करें"
  },
  "outdoorquest": {
    "title": "बाहरी गतिविधि",
    "desc": "प्रकृति और बाहरी रोमांच का अन्वेषण करें"
  }
};

data.kidscamp.activity_mode = {
  ...data.kidscamp.activity_mode,
  "step": "चरण",
  "of": "में से",
  "steps_remaining": "चरण शेष",
  "steps": "चरण",
  "estimated_time": "अनुमानित समय:",
  "steps_done": "चरण पूर्ण",
  "check_off": "जब आप उन्हें इकट्ठा करते हैं तो प्रत्येक वस्तु को चेक करें। यदि आपके पास कुछ छूट रहा है तो चिंता न करें - वैसे भी शुरू करने के लिए 'अभी छोड़ें' पर टैप करें!"
};

// Also add a few loose words
data.difficulty_easy = "आसान";
data.difficulty_medium = "मध्यम";
data.difficulty_hard = "कठिन";
data.ages = "आयु";
data.completed = "पूर्ण";
data.in_progress = "प्रगति पर";
data.rebuild = "फिर से बनाएँ";
data.continue = "जारी रखें";
data.start = "शुरू करें";
data.remove_favorite = "पसंदीदा से हटाएँ";
data.save_to_favorites = "पसंदीदा में सहेजें";

fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log('hi.json updated');
