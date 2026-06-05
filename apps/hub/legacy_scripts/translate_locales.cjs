const fs = require('fs');
const { translateText } = require('./translation_service.cjs');

const englishData = {
  kidscamp: {
    ages: {
      whos_making_modal: "Who's making today?",
      clear_selection: "Clear selection (Show all ages)",
      title1: "Little Explorers",
      desc1: "Simple, sensory activities with parental guidance. Perfect for curious toddlers!",
      feat1_0: "Parent-guided activities",
      feat1_1: "Sensory exploration",
      feat1_2: "Big, colorful steps",
      feat1_3: "Extra safety tips",
      title2: "Junior Creators",
      desc2: "Fun projects with clear step-by-step instructions. Building confidence through making!",
      feat2_0: "Semi-independent",
      feat2_1: "Achievement badges",
      feat2_2: "Skill building",
      feat2_3: "Creative freedom",
      title3: "Adventure Builders",
      desc3: "Complex projects for independent makers ready for real challenges!",
      feat3_0: "Independent work",
      feat3_1: "Advanced techniques",
      feat3_2: "STEM concepts",
      feat3_3: "Real tools",
      title4: "Future Innovators",
      desc4: "Advanced projects, coding, and real-world skills for teens!",
      feat4_0: "Self-directed learning",
      feat4_1: "Advanced STEM",
      feat4_2: "Real-world applications",
      feat4_3: "Peer challenges",
      title5: "Lifelong Learners",
      desc5: "Deep knowledge, professional skills, and advanced concepts.",
      feat5_0: "Self-directed learning",
      feat5_1: "Advanced concepts",
      feat5_2: "Professional skills",
      feat5_3: "Mastery"
    },
    pillars: {
      toybox: { title: "Toybox", desc: "Build amazing handmade toys from scratch" },
      sciencelab: { title: "Interactive Labs", desc: "Explore curious labs: physics, chemistry, biology and more!" },
      artstudio: { title: "Art Studio", desc: "Express your creativity through arts and crafts" },
      outdoorquest: { title: "Outdoor Quest", desc: "Explore nature and outdoor adventures" }
    },
    activity_mode: {
      step: "Step",
      of: "of",
      steps_remaining: "steps remaining",
      steps: "Steps",
      estimated_time: "Estimated time:",
      steps_done: "Steps Done",
      check_off: "Check off each item as you gather it. Don't worry if you're missing something - tap 'Skip for now' to start anyway!"
    },
    modal: {
      completed: "Completed",
      in_progress: "In Progress",
      reviews: "reviews",
      ages: "Ages",
      materials_needed: "Materials Needed",
      opt: "(opt)",
      more: "more",
      steps: "Steps",
      more_steps: "more steps...",
      what_you_learn: "What You'll Learn",
      cross_pillar: "Cross-Pillar Connection",
      cross_pillar_desc: "This activity connects with other pillars! Complete related activities to unlock the Connector achievement.",
      build_again: "Build Again",
      continue: "Continue",
      start_activity: "Start Activity"
    }
  },
  difficulty_easy: "Easy",
  difficulty_medium: "Medium",
  difficulty_hard: "Hard",
  ages: "Ages",
  completed: "Completed",
  in_progress: "In Progress",
  rebuild: "Rebuild",
  continue: "Continue",
  start: "Start",
  remove_favorite: "Remove from favorites",
  save_to_favorites: "Save to favorites"
};

async function translateObject(obj, targetLang) {
  const result = {};
  for (const key of Object.keys(obj)) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      result[key] = await translateObject(obj[key], targetLang);
    } else if (typeof obj[key] === 'string') {
      result[key] = await translateText(obj[key], targetLang);
      console.log(`Translated [${obj[key]}] -> [${result[key]}]`);
      await new Promise(r => setTimeout(r, 200));
    } else {
      result[key] = obj[key];
    }
  }
  return result;
}

async function main() {
  const targetLang = 'or'; // Odia
  console.log(`Starting translation for ${targetLang}...`);
  const translatedData = await translateObject(englishData, targetLang);
  
  // Try to load existing od.json if it exists
  const path = 'src/learnos/i18n/locales/od.json';
  let existingData = {};
  if (fs.existsSync(path)) {
    existingData = JSON.parse(fs.readFileSync(path, 'utf8'));
  }
  
  // Merge the translated kidscamp tags
  const finalData = { ...existingData, ...translatedData };
  fs.writeFileSync(path, JSON.stringify(finalData, null, 2));
  console.log(`Created ${path}`);
}

main().catch(console.error);
